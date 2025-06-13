
import express from 'express';
import mysql from 'mysql2/promise';
import session from 'express-session';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// ES6 module __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors({
    origin: ['http://localhost:5173','https://atecon.netlify.app', 'http://localhost:3000','http://localhost:5174'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax'
    }
}));

// MySQL Database configuration
const dbConfig = {
    host: process.env.DB_HOST_EDGE || 'localhost',
    user: process.env.DB_USER_EDGE || 'root',
    password: process.env.DB_PASSWORD_EDGE || '',
    database: process.env.DB_NAME || '8con',
    charset: 'utf8',
    connectionLimit: 10
};

const dbEnrollment = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME_EDGE || '8cons',
    charset: 'utf8',
    connectionLimit: 10
};
let pool;
let pools;

// File upload configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/avatars/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

// Test MySQL database connection
async function initDatabase() {
    try {
        pool = mysql.createPool(dbConfig);
        pools = mysql.createPool(dbEnrollment);
        const connection = await pool.getConnection();
        const connections = await pools.getConnection();
        console.log('✅ MySQL Database connected successfully');
        connection.release();
        return true;
    } catch (error) {
        console.error('❌ MySQL Database connection failed:', error.message);
        return false;
    }
}

// Helper function to save session data to SQL
async function saveSessionToSQL(sessionId, account_id, user_email, userData, req) {
    try {
        // Remove any existing session for this user (optional - for single session per user)
        await pool.execute(
            "DELETE FROM user_sessions WHERE account_id = ?",
            [account_id]
        );
        
        // Create new session record
        const userAgent = req.headers['user-agent'] || '';
        const ipAddress = req.ip || req.connection.remoteAddress || '';
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
        
        await pool.execute(`
            INSERT INTO user_sessions 
            (session_id, account_id, user_email, user_data, is_active, expires_at, user_agent, ip_address, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
            sessionId,
            account_id,
            user_email,
            JSON.stringify(userData),
            1,
            expiresAt,
            userAgent,
            ipAddress
        ]);
        
        console.log('💾 Session saved to SQL for account_id:', account_id);
        return true;
    } catch (error) {
        console.error('❌ Error saving session to SQL:', error);
        throw error;
    }
}

// Helper function to get session data from SQL
async function getSessionFromSQL(account_id) {
    try {
        const [rows] = await pool.execute(`
            SELECT * FROM user_sessions 
            WHERE account_id = ? AND is_active = 1 AND expires_at > NOW()
        `, [account_id]);
        
        if (rows.length > 0) {
            const session = rows[0];
            console.log('📖 Session found in SQL for account_id:', account_id);
            return {
                ...session,
                userData: JSON.parse(session.user_data)
            };
        } else {
            console.log('❌ No active session found in SQL for account_id:', account_id);
            return null;
        }
    } catch (error) {
        console.error('❌ Error retrieving session from SQL:', error);
        return null;
    }
}

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Check authentication status - UPDATED to check SQL sessions
app.get('/api/check-auth', async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.json({ authenticated: false });
        }

        // First check if session exists in SQL
        const sqlSession = await getSessionFromSQL(req.session.user_id);
        
        if (!sqlSession) {
            // Session not found in SQL, destroy Express session
            req.session.destroy(() => {});
            return res.json({ authenticated: false, reason: 'Session not found in database' });
        }

        // Verify the account still exists in MySQL
        const [rows] = await pool.execute(
            "SELECT account_id, username, roles FROM accounts WHERE account_id = ?",
            [req.session.user_id]
        );

        if (rows.length === 0) {
            // Account doesn't exist anymore, cleanup
            await pool.execute("DELETE FROM user_sessions WHERE account_id = ?", [req.session.user_id]);
            req.session.destroy(() => {});
            return res.json({ authenticated: false, reason: 'Account not found' });
        }

        // Return the saved user data from SQL session
        const userData = sqlSession.userData;
        
        res.json({
            authenticated: true,
            user: userData,
            sessionInfo: {
                createdAt: sqlSession.created_at,
                expiresAt: sqlSession.expires_at,
                lastActive: sqlSession.updated_at
            },
            saveToSessionStorage: true
        });
        
    } catch (error) {
        console.error('Check auth error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Login endpoint with SQL session storage
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt for email:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // STEP 1: Get student info from MySQL with person details
    const [studentRows] = await pools.execute(`
      SELECT s.account_id, s.student_id, s.person_id, s.registration_date, 
             s.graduation_status, s.graduation_date, s.gpa, s.academic_standing, s.notes,
             p.first_name, p.last_name, p.email, p.phone, p.address, 
             p.birth_date, p.birth_place, p.gender
      FROM students s
      JOIN persons p ON s.person_id = p.person_id
      WHERE p.email = ?
    `, [trimmedEmail]);

    if (studentRows.length === 0) {
      console.log('❌ No student found with email:', trimmedEmail);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const student = studentRows[0];

    // STEP 2: Get account info (auth details)
    const [accountRows] = await pools.execute(`
      SELECT account_id, username, password_hash, token, account_status, 
             last_login, failed_login_attempts, locked_until, created_at, updated_at
      FROM accounts 
      WHERE account_id = ?
    `, [student.account_id]);

    if (accountRows.length === 0) {
      console.log('❌ No account found for account_id:', student.account_id);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const account = accountRows[0];

    // Check if account is locked
    if (account.locked_until && new Date(account.locked_until) > new Date()) {
      console.log('❌ Account is locked until:', account.locked_until);
      return res.status(423).json({ 
        error: 'Account is temporarily locked. Please try again later.',
        lockedUntil: account.locked_until
      });
    }

    // Check account status
    if (account.account_status !== 'active') {
      console.log('❌ Account is not active:', account.account_status);
      return res.status(401).json({ error: 'Account is not active' });
    }

    // STEP 3: Password check (replace with real bcrypt logic)
    let passwordValid = true;
    // Uncomment below for actual bcrypt verification
    /*
    passwordValid = await bcrypt.compare(trimmedPassword, account.password_hash);
    */

    if (!passwordValid) {
      console.log('❌ Password invalid');
      
      // Increment failed login attempts
      await pools.execute(`
        UPDATE accounts 
        SET failed_login_attempts = failed_login_attempts + 1,
            locked_until = CASE 
              WHEN failed_login_attempts >= 4 THEN DATE_ADD(NOW(), INTERVAL 15 MINUTE)
              ELSE locked_until
            END
        WHERE account_id = ?
      `, [account.account_id]);
      
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // STEP 4: Get account roles and role details
    const [roleRows] = await pools.execute(`
      SELECT ar.role_id, ar.assigned_date, ar.assigned_by, ar.is_active, ar.expiry_date,
             r.role_name, r.permissions, r.description
      FROM account_roles ar
      JOIN roles r ON ar.role_id = r.role_id
      WHERE ar.account_id = ? AND ar.is_active = TRUE
      AND (ar.expiry_date IS NULL OR ar.expiry_date > NOW())
    `, [account.account_id]);

    if (roleRows.length === 0) {
      console.log('❌ No active roles found for account_id:', account.account_id);
      return res.status(401).json({ error: 'No active roles assigned to this account' });
    }

    // Get primary role (first active role)
    const primaryRole = roleRows[0];
    const allRoles = roleRows.map(role => ({
      roleId: role.role_id,
      roleName: role.role_name,
      permissions: role.permissions,
      assignedDate: role.assigned_date,
      isActive: role.is_active,
      expiryDate: role.expiry_date
    }));

    // STEP 5: Get trading level information if applicable
    let tradingLevelInfo = null;
    if (student.trading_level_id) {
      const [tradingLevelRows] = await pools.execute(`
        SELECT level_id, level_name, level_description, minimum_score, 
               prerequisite_level_id, estimated_duration_weeks, 
               recommended_capital, risk_tolerance
        FROM trading_levels 
        WHERE level_id = ?
      `, [student.trading_level_id]);
      
      if (tradingLevelRows.length > 0) {
        tradingLevelInfo = tradingLevelRows[0];
      }
    }

    // STEP 6: Compose session userData
    const userData = {
      account_id: account.account_id,
      student_id: student.student_id,
      person_id: student.person_id,
      username: account.username,
      email: trimmedEmail,
      firstName: student.first_name,
      lastName: student.last_name,
      fullName: `${student.first_name} ${student.last_name}`,
      phone: student.phone,
      address: student.address,
      birthDate: student.birth_date,
      birthPlace: student.birth_place,
      gender: student.gender,
      
      // Student specific data
      registrationDate: student.registration_date,
      graduationStatus: student.graduation_status,
      graduationDate: student.graduation_date,
      gpa: student.gpa,
      academicStanding: student.academic_standing,
      notes: student.notes,
      
      // Role information
      primaryRole: primaryRole.role_name,
      roleId: primaryRole.role_id,
      permissions: primaryRole.permissions,
      roles: allRoles,
      
      // Trading level
      tradingLevel: tradingLevelInfo,
      
      // Session info
      authenticated: true,
      loginTime: new Date().toISOString(),
      lastLogin: account.last_login
    };

    // STEP 7: Reset failed login attempts and update last login
    await pools.execute(`
      UPDATE accounts 
      SET failed_login_attempts = 0, 
          locked_until = NULL, 
          last_login = NOW(),
          updated_at = NOW()
      WHERE account_id = ?
    `, [account.account_id]);

    // STEP 8: Create Express session
    req.session.user_id = account.account_id;
    req.session.user_email = trimmedEmail;
    req.session.role = primaryRole.role_name;

    // STEP 9: Check for existing session in SQL
    const existingSession = await getSessionFromSQL(account.account_id);

    if (existingSession) {
      console.log('🔁 Reusing session');
      await pools.execute(
        "UPDATE user_sessions SET updated_at = NOW(), user_agent = ?, ip_address = ? WHERE account_id = ?",
        [req.headers['user-agent'] || '', req.ip || req.connection.remoteAddress || '', account.account_id]
      );

      return res.json({
        success: true,
        user: existingSession.userData,
        message: 'Login successful - existing session restored',
        sessionInfo: {
          isExistingSession: true,
          createdAt: existingSession.created_at,
          lastActive: existingSession.updated_at
        },
        saveToSessionStorage: true
      });
    } else {
      await saveSessionToSQL(
        req.sessionID,
        account.account_id,
        trimmedEmail,
        userData,
        req
      );
    }

    // STEP 10: Sync to SQL users table (if not already)
    const [userExists] = await pool.execute(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [trimmedEmail, account.username]
    );

    if (userExists.length === 0) {
      await pool.execute(`
        INSERT INTO users 
        (account_id, student_id, name, username, email, roles, address, birth_place, phone_no, trading_level, gender, birth_date, authenticated, login_time, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      `, [
        account.account_id,
        student.student_id,
        userData.fullName,
        account.username,
        trimmedEmail,
        primaryRole.role_name,
        student.address,
        student.birth_place,
        student.phone,
        tradingLevelInfo ? tradingLevelInfo.level_name : null,
        student.gender,
        student.birth_date,
        1,
        new Date()
      ]);
      console.log('✅ SQL user synced');
    }

    // STEP 11: Return success
    res.json({
      success: true,
      user: userData,
      message: 'Login successful - new session created',
      sessionInfo: {
        isExistingSession: false,
        createdAt: new Date().toISOString()
      },
      saveToSessionStorage: true
    });

  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Logout endpoint to cleanup SQL session
app.post('/api/logout', async (req, res) => {
    try {
        if (req.session.user_id) {
            // Remove session from SQL
            await pool.execute("DELETE FROM user_sessions WHERE account_id = ?", [req.session.user_id]);
            console.log('🗑️ Removed SQL session for account_id:', req.session.user_id);
        }
        
        req.session.destroy((err) => {
            if (err) {
                console.error('Logout error:', err);
                return res.status(500).json({ error: 'Could not log out' });
            }
            res.clearCookie('connect.sid');
            res.json({ 
                success: true, 
                message: 'Logged out successfully',
                clearSessionStorage: true
            });
        });
    } catch (error) {
        console.error('❌ Logout error:', error);
        res.status(500).json({ error: 'Server error during logout' });
    }
});

// Get current user data endpoint - UPDATED to use SQL session
app.get('/api/user-data', async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Get session data from SQL
        const sqlSession = await getSessionFromSQL(req.session.user_id);
        
        if (!sqlSession) {
            return res.status(401).json({ error: 'Session not found' });
        }

        const userData = sqlSession.userData;

        res.json({
            success: true,
            user: userData,
            sessionInfo: {
                createdAt: sqlSession.created_at,
                expiresAt: sqlSession.expires_at,
                lastActive: sqlSession.updated_at
            },
            saveToSessionStorage: true
        });

    } catch (error) {
        console.error('❌ Get user data error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Get all sessions for a user (for admin purposes)
app.get('/api/user/sessions/:account_id', async (req, res) => {
    try {
        const { account_id } = req.params;
        
        const [sessions] = await pool.execute(`
            SELECT session_id, created_at, expires_at, updated_at, user_agent, ip_address 
            FROM user_sessions 
            WHERE account_id = ? AND is_active = 1 
            ORDER BY created_at DESC
        `, [account_id]);
        
        res.json({
            success: true,
            sessions: sessions
        });
        
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Cleanup expired sessions manually
app.post('/api/cleanup-sessions', async (req, res) => {
    try {
        const [result] = await pool.execute(`
            DELETE FROM user_sessions 
            WHERE expires_at < NOW() OR is_active = 0
        `);
        
        res.json({
            success: true,
            message: `Cleaned up ${result.affectedRows} expired sessions`
        });
        
    } catch (error) {
        console.error('Cleanup sessions error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// SQL-based Login Route (alternative endpoint)
app.post('/api/login-mongo', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email in SQL users table
        const [users] = await pool.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        const user = users[0];
        
        // Check password (uncomment for real password verification)
        /*
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        */
        
        // Update last login
        await pool.execute(
            "UPDATE users SET last_login = NOW() WHERE id = ?",
            [user.id]
        );
        
        // Remove password from response
        delete user.password;
        
        res.json({
            success: true,
            user: user,
            message: 'Login successful'
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Get User Profile Route (SQL-based)
app.get('/api/user/profile', async (req, res) => {
    try {
        const { account_id } = req.query;

        if (!account_id) {
            return res.status(400).json({ success: false, error: 'Missing account_id' });
        }

        const [users] = await pool.execute(
            "SELECT * FROM profiles WHERE account_id = ?",
            [account_id]
        );
        
        if (users.length === 0) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }

        const user = users[0];
        delete user.password; // Remove password from response

        res.json({ success: true, user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Update User Profile Route (SQL-based)
app.put('/api/user/profile', async (req, res) => {
    try {
        const { userId, ...updateData } = req.body;
        
        // Remove sensitive fields that shouldn't be updated via this route
        delete updateData.password;
        delete updateData.email; // Email changes should be handled separately
        delete updateData.id;
        
        // Filter out undefined values and build dynamic UPDATE query
        const filteredUpdateData = Object.fromEntries(
            Object.entries(updateData).filter(([key, value]) => value !== undefined)
        );
        
        const updateFields = Object.keys(filteredUpdateData);
        const updateValues = Object.values(filteredUpdateData);
        
        if (updateFields.length === 0) {
            return res.status(400).json({ success: false, error: 'No fields to update' });
        }
        
        const setClause = updateFields.map(field => `${field} = ?`).join(', ');
        updateValues.push(userId);
        
        // Start transaction to ensure both tables are updated atomically
        const connection = await pool.getConnection();
        
        try {
            await connection.beginTransaction();
            
            // Update users table
          
            // Update user table with the same data
            await connection.execute(
                `UPDATE user SET ${setClause}, updated_at = NOW() WHERE account_id = ?`,
                updateValues
            );
            
            // Update students table if name is being updated
            if (filteredUpdateData.name) {
                await connection.execute(
                    `UPDATE students SET name = ? WHERE account_id = ?`,
                    [filteredUpdateData.name, userId]
                );
                  await connection.execute(
                `UPDATE students SET name = ? WHERE account_id = ?`,
                updateValues
            );
            
            }
            
            // Commit transaction
            await connection.commit();
            
            // Get updated user data
            const [users] = await pool.execute(
                "SELECT * FROM users WHERE account_id = ?",
                [userId]
            );
            
            if (users.length === 0) {
                return res.status(404).json({ success: false, error: 'User not found' });
            }
            
            const user = users[0];
            delete user.password;
            
            res.json({ success: true, user });
            
        } catch (transactionError) {
            // Rollback transaction on error
            await connection.rollback();
            throw transactionError;
        } finally {
            // Release connection back to pool
            connection.release();
        }
        
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Upload Avatar Route (SQL-based)
app.post('/api/user/avatar', upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        
        const { userId } = req.body;
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        
        await pool.execute(
            "UPDATE users SET avatar = ?, updated_at = NOW() WHERE id = ?",
            [avatarUrl, userId]
        );
        
        // Get updated user
        const [users] = await pool.execute(
            "SELECT * FROM users WHERE id = ?",
            [userId]
        );
        
        const user = users[0];
        delete user.password;
        
        res.json({ 
            success: true, 
            avatarUrl,
            user 
        });
    } catch (error) {
        console.error('Upload avatar error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Create User Route (Registration) - SQL-based
app.post('/api/register', async (req, res) => {
  try {
    const {
      account_id,
      student_id = null,
      email,
      password,
      username,
      name,
      roles = 'student',
      address = '',
      birth_place = '',
      birth_date = '',
      gender = '',
      phone_no = '',
      trading_level = null,
      learning_style = '',
      avatar = null,
      bio = '',
      preferences = '{}',
      authenticated = true,
      login_time = new Date(),
      last_login = null,
      is_verified = true,
      verification_token = null,
      created_at = new Date(),
      updated_at = new Date()
    } = req.body;

    // 1. Validate person/account_id via external DB
    const [personRows] = await pools.execute(
      "SELECT person_id FROM persons WHERE email = ?",
      [email]
    );

    if (personRows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Person not found in external 'persons' database"
      });
    }

    const fetchedPersonId = personRows[0].person_id;
    if (account_id !== fetchedPersonId) {
      return res.status(400).json({
        success: false,
        error: 'Account ID mismatch with external person record'
      });
    }

    // 2. Check for existing user
    const [existingUsers] = await pool.execute(
      "SELECT account_id FROM users WHERE account_id = ?",
      [account_id]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'User with this account ID already exists'
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert into `accounts`
    await pool.execute(`
      INSERT INTO accounts (account_id, username, password, roles)
      VALUES (?, ?, ?, ?)
    `, [
      account_id,
      username,
      hashedPassword,
      roles
    ]);

    // 5. Insert into `users`
    const [userResult] = await pool.execute(`
      INSERT INTO users 
      (account_id, student_id, email, password, username, name, roles, address, birth_place, phone_no, trading_level, gender, birth_date, authenticated, login_time, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      account_id,
      student_id,
      email,
      hashedPassword,
      username,
      name,
      roles,
      address,
      birth_place,
      phone_no,
      trading_level,
      gender,
      birth_date,
      authenticated ? 1 : 0,
      login_time,
      created_at,
      updated_at
    ]);

    // 6. Insert into `profiles`
    await pool.execute(`
      INSERT INTO profiles
      (account_id, student_id, name, username, email, roles, address, birth_place, birth_date, phone_no, trading_level, learning_style, gender, avatar, bio, preferences, authenticated, login_time, last_login, is_verified, verification_token, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      account_id,
      student_id,
      name,
      username,
      email,
      roles,
      address,
      birth_place,
      birth_date,
      phone_no,
      trading_level,
      learning_style,
      gender,
      avatar,
      bio,
      preferences,
      authenticated ? 1 : 0,
      login_time,
      last_login,
      is_verified ? 1 : 0,
      verification_token,
      created_at,
      updated_at
    ]);

    // 7. Respond with user (without password)
    const [users] = await pool.execute("SELECT * FROM users WHERE id = ?", [userResult.insertId]);
    const user = users[0];
    delete user.password;

    res.status(201).json({
      success: true,
      user,
      message: 'User registered successfully in accounts, users, and profiles'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// ====================
// PROFILE API ROUTES
// ====================

// Get user profile by account_id
app.get('/api/profile/:account_id', async (req, res) => {
  try {
    const { account_id } = req.params;
    
    console.log('🔍 Fetching profile for account_id:', account_id);
    
    const [profiles] = await pool.execute(
      "SELECT * FROM profiles WHERE account_id = ?",
      [parseInt(account_id)]
    );
    
    let profile;
    
    if (profiles.length === 0) {
      // If profile doesn't exist, create one from existing user data
      console.log('📝 Profile not found, creating from user data...');

      // Get student data
      const [studentRows] = await pool.execute(
        "SELECT account_id, name, student_id, birth_place, birth_date, address, phone_no, learning_style, trading_level, age, gender, email FROM students WHERE account_id = ?",
         [account_id]
      );

      // Get account data
      if (studentRows.length > 0) {
        const student = studentRows[0];

        const [accountRows] = await pool.execute(
          "SELECT account_id, username, roles FROM accounts WHERE account_id = ?",
          [account_id]
        );

        if (accountRows.length > 0) {
          const account = accountRows[0];

          // Create new profile
          await pool.execute(`
            INSERT INTO profiles 
            (account_id, student_id, name, username, email, roles, address, birth_place, phone_no, trading_level, gender, birth_date, authenticated, login_time, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          `, [
            account.account_id,
            student.student_id,
            student.name,
            account.username,
            student.email,
            account.roles,
            student.address,
            student.birth_place,
            student.phone_no,
            student.trading_level,
            student.gender,
            student.birth_date,
            1,
            new Date()
          ]);

          // Get the newly created profile
          const [newProfiles] = await pool.execute(
            "SELECT * FROM profiles WHERE account_id = ?",
            [parseInt(account_id)]
          );
          profile = newProfiles[0];

          console.log('✅ New profile created');
        } else {
          return res.status(404).json({
            success: false,
            error: 'Account data not found'
          });
        }
      } else {
        return res.status(404).json({
          success: false,
          error: 'Student data not found'
        });
      }
    } else {
      profile = profiles[0];
    }
    
    res.json({
      success: true,
      profile: profile
    });
    
  } catch (error) {
    console.error('❌ Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error fetching profile' 
    });
  }
});

// Update user profile
app.put('/api/profile/:account_id', async (req, res) => {
  try {
    const { account_id } = req.params;
    const updateData = req.body;
    
    console.log('🔄 Updating profile for account_id:', account_id);
    console.log('📝 Update data:', updateData);
    
    // Remove sensitive fields that shouldn't be updated
    delete updateData.id;
    delete updateData.created_at;
    delete updateData.account_id; // Don't allow changing account_id
    delete updateData.password; // Don't allow password updates through this route
    delete updateData.authenticated;
    delete updateData.login_time;
    delete updateData.last_login;
    delete updateData.updated_at;
    
    // Remove fields not in the allowed list
    delete updateData.learning_style;
    delete updateData.bio;
    delete updateData.preferences;
    delete updateData.is_verified;
    delete updateData.verification_token;
    
    // Filter out undefined values and build dynamic UPDATE query
    const filteredUpdateData = Object.fromEntries(
      Object.entries(updateData).filter(([key, value]) => value !== undefined)
    );
    
    const updateFields = Object.keys(filteredUpdateData);
    const updateValues = Object.values(filteredUpdateData);
    
    if (updateFields.length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No fields to update' 
      });
    }
    
    const setClause = updateFields.map(field => `${field} = ?`).join(', ');
    updateValues.push(parseInt(account_id));
    
    // Start transaction to ensure all tables are updated atomically
    const connection = await pool.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // Update profiles table
      await connection.execute(
        `UPDATE profiles SET ${setClause}, updated_at = NOW() WHERE account_id = ?`,
        updateValues
      );
      
      // Update users table with the same data
      await connection.execute(
        `UPDATE users SET ${setClause}, updated_at = NOW() WHERE account_id = ?`,
        updateValues
      );
      
   
    
      
      // Update students table if name is being updated
      if (filteredUpdateData.name) {
        await connection.execute(
          `UPDATE students SET name = ? WHERE account_id = ?`,
          [filteredUpdateData.name, parseInt(account_id)]
        );
      }
      
      // Commit transaction
      await connection.commit();
      
      // Get updated profile
      const [profiles] = await pool.execute(
        "SELECT * FROM profiles WHERE account_id = ?",
        [parseInt(account_id)]
      );
      
      if (profiles.length === 0) {
        return res.status(404).json({ 
          success: false, 
          error: 'Profile not found' 
        });
      }
      
      console.log('✅ Profile updated successfully');
      
      res.json({
        success: true,
        profile: profiles[0],
        message: 'Profile updated successfully'
      });
      
    } catch (transactionError) {
      // Rollback transaction on error
      await connection.rollback();
      throw transactionError;
    } finally {
      // Release connection back to pool
      connection.release();
    }
    
  } catch (error) {
    console.error('❌ Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error updating profile' 
    });
  }
});

// Upload profile avatar
app.post('/api/profile/:account_id/avatar', upload.single('avatar'), async (req, res) => {
  try {
    const { account_id } = req.params;
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded' 
      });
    }
    
    console.log('📷 Uploading avatar for account_id:', account_id);
    
    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    
    await pool.execute(
      "UPDATE profiles SET avatar = ?, updated_at = NOW() WHERE account_id = ?",
      [avatarUrl, parseInt(account_id)]
    );
    
    // Get updated profile
    const [profiles] = await pool.execute(
      "SELECT * FROM profiles WHERE account_id = ?",
      [parseInt(account_id)]
    );
    
    if (profiles.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Profile not found' 
      });
    }
    
    console.log('✅ Avatar updated successfully');
    
    res.json({ 
      success: true, 
      avatarUrl: avatarUrl,
      profile: profiles[0],
      message: 'Avatar updated successfully'
    });
    
  } catch (error) {
    console.error('❌ Upload avatar error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error uploading avatar' 
    });
  }
});

// Get all profiles (admin endpoint)
app.get('/api/profiles', async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const offset = (page - 1) * limit;
    
    let whereClause = '';
    let queryParams = [];
    
    if (search) {
      whereClause = 'WHERE name LIKE ? OR email LIKE ? OR student_id LIKE ?';
      const searchPattern = `%${search}%`;
      queryParams = [searchPattern, searchPattern, searchPattern];
    }
    
    // Get profiles with pagination
    const [profiles] = await pool.execute(`
      SELECT * FROM profiles 
      ${whereClause}
      ORDER BY updated_at DESC 
      LIMIT ? OFFSET ?
    `, [...queryParams, parseInt(limit), parseInt(offset)]);
    
    // Get total count
    const [countResult] = await pool.execute(`
      SELECT COUNT(*) as total FROM profiles ${whereClause}
    `, queryParams);
    
    const total = countResult[0].total;
    
    res.json({
      success: true,
      profiles: profiles,
      pagination: {
        current: parseInt(page),
        pages: Math.ceil(total / limit),
        total: total
      }
    });
    
  } catch (error) {
    console.error('❌ Get profiles error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error fetching profiles' 
    });
  }
});

// Delete profile (admin endpoint) - CONTINUATION
app.delete('/api/profile/:account_id', async (req, res) => {
  try {
    const { account_id } = req.params;
    
    console.log('🗑️ Deleting profile for account_id:', account_id);
    
    // Check if profile exists
    const [profiles] = await pool.execute(
      "SELECT * FROM profiles WHERE account_id = ?",
      [parseInt(account_id)]
    );
    
    if (profiles.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Profile not found' 
      });
    }
    
    // Delete the profile
    await pool.execute(
      "DELETE FROM profiles WHERE account_id = ?",
      [parseInt(account_id)]
    );
    
    // Also cleanup related sessions
    await pool.execute(
      "DELETE FROM user_sessions WHERE account_id = ?",
      [parseInt(account_id)]
    );
    
    console.log('✅ Profile deleted successfully');
    
    res.json({
      success: true,
      message: 'Profile deleted successfully'
    });
    
  } catch (error) {
    console.error('❌ Delete profile error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error deleting profile' 
    });
  }
});

// ====================
// ADDITIONAL UTILITY ROUTES
// ====================

// Get user statistics (admin dashboard)
app.get('/api/stats', async (req, res) => {
  try {
    // Get total users
    const [totalUsers] = await pool.execute("SELECT COUNT(*) as count FROM profiles");
    
    // Get active sessions
    const [activeSessions] = await pool.execute(
      "SELECT COUNT(*) as count FROM user_sessions WHERE is_active = 1 AND expires_at > NOW()"
    );
    
    // Get users by role
    const [roleStats] = await pool.execute(`
      SELECT roles, COUNT(*) as count 
      FROM profiles 
      GROUP BY roles
    `);
    
    // Get recent registrations (last 30 days)
    const [recentUsers] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM profiles 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);
    
    res.json({
      success: true,
      stats: {
        totalUsers: totalUsers[0].count,
        activeSessions: activeSessions[0].count,
        recentRegistrations: recentUsers[0].count,
        roleDistribution: roleStats
      }
    });
    
  } catch (error) {
    console.error('❌ Get stats error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error fetching statistics' 
    });
  }
});

// Search users endpoint
app.get('/api/search/users', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Search query must be at least 2 characters'
      });
    }
    
    const searchPattern = `%${q.trim()}%`;
    
    const [users] = await pool.execute(`
      SELECT account_id, name, username, email, student_id, roles, avatar
      FROM profiles 
      WHERE name LIKE ? 
         OR username LIKE ? 
         OR email LIKE ? 
         OR student_id LIKE ?
      ORDER BY name ASC
      LIMIT ?
    `, [searchPattern, searchPattern, searchPattern, searchPattern, parseInt(limit)]);
    
    res.json({
      success: true,
      users: users,
      count: users.length
    });
    
  } catch (error) {
    console.error('❌ Search users error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error searching users' 
    });
  }
});

// Bulk operations endpoint (admin)
app.post('/api/bulk/users', async (req, res) => {
  try {
    const { action, account_ids } = req.body;
    
    if (!action || !Array.isArray(account_ids) || account_ids.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid action or account_ids'
      });
    }
    
    const placeholders = account_ids.map(() => '?').join(',');
    let result;
    
    switch (action) {
      case 'delete':
        // Delete profiles
        await pool.execute(
          `DELETE FROM profiles WHERE account_id IN (${placeholders})`,
          account_ids
        );
        // Cleanup sessions
        await pool.execute(
          `DELETE FROM user_sessions WHERE account_id IN (${placeholders})`,
          account_ids
        );
        result = { message: `Deleted ${account_ids.length} users` };
        break;
        
      case 'deactivate':
        await pool.execute(
          `UPDATE profiles SET authenticated = 0, updated_at = NOW() WHERE account_id IN (${placeholders})`,
          account_ids
        );
        // Deactivate sessions
        await pool.execute(
          `UPDATE user_sessions SET is_active = 0 WHERE account_id IN (${placeholders})`,
          account_ids
        );
        result = { message: `Deactivated ${account_ids.length} users` };
        break;
        
      case 'activate':
        await pool.execute(
          `UPDATE profiles SET authenticated = 1, updated_at = NOW() WHERE account_id IN (${placeholders})`,
          account_ids
        );
        result = { message: `Activated ${account_ids.length} users` };
        break;
        
      default:
        return res.status(400).json({
          success: false,
          error: 'Invalid action. Supported: delete, deactivate, activate'
        });
    }
    
    res.json({
      success: true,
      ...result
    });
    
  } catch (error) {
    console.error('❌ Bulk operation error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error performing bulk operation' 
    });
  }
});

// Password reset request endpoint
app.post('/api/password-reset/request', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required'
      });
    }
    
    // Check if user exists
    const [users] = await pool.execute(
      "SELECT account_id, name FROM profiles WHERE email = ?",
      [email.trim()]
    );
    
    if (users.length === 0) {
      // Don't reveal if email exists or not
      return res.json({
        success: true,
        message: 'If the email exists, a reset link has been sent'
      });
    }
    
    // Generate reset token (in production, use crypto.randomBytes)
    const resetToken = Math.random().toString(36).substring(2, 15) + 
                      Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    // Store reset token
    await pool.execute(`
      INSERT INTO password_resets (email, token, expires_at, created_at) 
      VALUES (?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE 
      token = VALUES(token), 
      expires_at = VALUES(expires_at), 
      created_at = NOW()
    `, [email.trim(), resetToken, expiresAt]);
    
    // In production, send email here
    console.log(`🔑 Password reset token for ${email}: ${resetToken}`);
    
    res.json({
      success: true,
      message: 'If the email exists, a reset link has been sent',
      // Remove this in production
      resetToken: resetToken
    });
    
  } catch (error) {
    console.error('❌ Password reset request error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error processing password reset request' 
    });
  }
});

// Password reset confirmation endpoint
app.post('/api/password-reset/confirm', async (req, res) => {
  try {
    const { email, token, newPassword } = req.body;
    
    if (!email || !token || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Email, token, and new password are required'
      });
    }
    
    // Validate reset token
    const [resets] = await pool.execute(
      "SELECT * FROM password_resets WHERE email = ? AND token = ? AND expires_at > NOW()",
      [email.trim(), token]
    );
    
    if (resets.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid or expired reset token'
      });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password in accounts table
    const [users] = await pool.execute(
      "SELECT account_id FROM profiles WHERE email = ?",
      [email.trim()]
    );
    
    if (users.length > 0) {
      await pool.execute(
        "UPDATE accounts SET password = ? WHERE account_id = ?",
        [hashedPassword, users[0].account_id]
      );
      
      // Delete used reset token
      await pool.execute(
        "DELETE FROM password_resets WHERE email = ? AND token = ?",
        [email.trim(), token]
      );
      
      // Logout all sessions for this user
      await pool.execute(
        "DELETE FROM user_sessions WHERE account_id = ?",
        [users[0].account_id]
      );
      
      res.json({
        success: true,
        message: 'Password updated successfully'
      });
    } else {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
  } catch (error) {
    console.error('❌ Password reset confirm error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Server error confirming password reset' 
    });
  }
});


// ====================
// ASSETS API ROUTES
// ====================

// Get assets (currencies/commodities) endpoint
app.get("/api/assets", async (req, res) => {
  try {
    const { type } = req.query;

    console.log("🪙 Fetching assets, type filter:", type);

    let query = "SELECT code, name, type, description FROM assets";
    let params = [];

    // Filter by type if provided (Currency or Commodity)
    if (type) {
      query += " WHERE type = ?";
      params.push(type);
    }

    // Order by name for consistent results
    query += " ORDER BY name ASC";

    const [assets] = await pool.execute(query, params);

    console.log(`✅ Found ${assets.length} assets`);
    console.log(
      "📋 Assets:",
      assets.map((a) => `${a.code} (${a.type})`)
    );

    res.json(assets);
  } catch (error) {
    console.error("❌ Get assets error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching assets",
    });
  }
});

// Get single asset by code
app.get("/api/assets/:code", async (req, res) => {
  try {
    const { code } = req.params;

    console.log("🔍 Fetching asset by code:", code);

    const [assets] = await pool.execute(
      "SELECT code, name, type, description, created_at, updated_at FROM assets WHERE code = ?",
      [code.toUpperCase()]
    );

    if (assets.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Asset not found",
      });
    }

    console.log("✅ Asset found:", assets[0]);

    res.json({
      success: true,
      asset: assets[0],
    });
  } catch (error) {
    console.error("❌ Get asset by code error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching asset",
    });
  }
});

// Create new asset (admin endpoint)
app.post("/api/assets", async (req, res) => {
  try {
    const { code, name, type, description } = req.body;

    // Validation
    if (!code || !name || !type) {
      return res.status(400).json({
        success: false,
        error: "Code, name, and type are required",
      });
    }

    if (!["Currency", "Commodity"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Type must be either Currency or Commodity",
      });
    }

    console.log("➕ Creating new asset:", { code, name, type });

    // Check if asset already exists
    const [existing] = await pool.execute(
      "SELECT code FROM assets WHERE code = ?",
      [code.toUpperCase()]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: "Asset with this code already exists",
      });
    }

    // Insert new asset
    await pool.execute(
      "INSERT INTO assets (code, name, type, description) VALUES (?, ?, ?, ?)",
      [code.toUpperCase(), name, type, description || ""]
    );

    // Get the created asset
    const [newAsset] = await pool.execute(
      "SELECT * FROM assets WHERE code = ?",
      [code.toUpperCase()]
    );

    console.log("✅ Asset created successfully");

    res.status(201).json({
      success: true,
      asset: newAsset[0],
      message: "Asset created successfully",
    });
  } catch (error) {
    console.error("❌ Create asset error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating asset",
    });
  }
});

// Update asset (admin endpoint)
app.put("/api/assets/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const { name, type, description } = req.body;

    console.log("🔄 Updating asset:", code);

    // Validation
    if (type && !["Currency", "Commodity"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Type must be either Currency or Commodity",
      });
    }

    // Check if asset exists
    const [existing] = await pool.execute(
      "SELECT code FROM assets WHERE code = ?",
      [code.toUpperCase()]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Asset not found",
      });
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (type) {
      updateFields.push("type = ?");
      updateValues.push(type);
    }
    if (description !== undefined) {
      updateFields.push("description = ?");
      updateValues.push(description);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No fields to update",
      });
    }

    updateValues.push(code.toUpperCase());

    await pool.execute(
      `UPDATE assets SET ${updateFields.join(
        ", "
      )}, updated_at = CURRENT_TIMESTAMP WHERE code = ?`,
      updateValues
    );

    // Get updated asset
    const [updatedAsset] = await pool.execute(
      "SELECT * FROM assets WHERE code = ?",
      [code.toUpperCase()]
    );

    console.log("✅ Asset updated successfully");

    res.json({
      success: true,
      asset: updatedAsset[0],
      message: "Asset updated successfully",
    });
  } catch (error) {
    console.error("❌ Update asset error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating asset",
    });
  }
});

// Delete asset (admin endpoint)
app.delete("/api/assets/:code", async (req, res) => {
  try {
    const { code } = req.params;

    console.log("🗑️ Deleting asset:", code);

    // Check if asset exists
    const [existing] = await pool.execute(
      "SELECT code FROM assets WHERE code = ?",
      [code.toUpperCase()]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Asset not found",
      });
    }

    // Check if asset is being used in other tables
    const [assetPairs] = await pool.execute(
      "SELECT COUNT(*) as count FROM asset_pairs WHERE base_asset = ? OR quote_asset = ?",
      [code.toUpperCase(), code.toUpperCase()]
    );

    if (assetPairs[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete asset: it is being used in asset pairs",
      });
    }

    // Delete the asset
    await pool.execute("DELETE FROM assets WHERE code = ?", [
      code.toUpperCase(),
    ]);

    console.log("✅ Asset deleted successfully");

    res.json({
      success: true,
      message: "Asset deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete asset error:", error);
    res.status(500).json({
      success: false,
      error: "Server error deleting asset",
    });
  }
});

// Get asset statistics
app.get("/api/assets/stats", async (req, res) => {
  try {
    console.log("📊 Fetching asset statistics");

    // Get count by type
    const [typeStats] = await pool.execute(`
      SELECT type, COUNT(*) as count 
      FROM assets 
      GROUP BY type
    `);

    // Get total count
    const [totalCount] = await pool.execute(
      "SELECT COUNT(*) as total FROM assets"
    );

    // Get recent additions (last 30 days)
    const [recentAssets] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM assets 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    const stats = {
      total: totalCount[0].total,
      byType: typeStats,
      recentAdditions: recentAssets[0].count,
    };

    console.log("✅ Asset statistics:", stats);

    res.json({
      success: true,
      stats: stats,
    });
  } catch (error) {
    console.error("❌ Get asset stats error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching asset statistics",
    });
  }
});

// Test endpoint to verify database connection and data
app.get("/api/test/assets", async (req, res) => {
  try {
    console.log("🧪 Testing assets table...");

    // Test basic query
    const [assets] = await pool.execute("SELECT * FROM assets LIMIT 5");

    // Test currency filter
    const [currencies] = await pool.execute(
      "SELECT * FROM assets WHERE type = ? LIMIT 3",
      ["Currency"]
    );

    // Test commodities filter
    const [commodities] = await pool.execute(
      "SELECT * FROM assets WHERE type = ? LIMIT 3",
      ["Commodity"]
    );

    res.json({
      success: true,
      message: "Assets table test successful",
      sample: {
        allAssets: assets,
        currencies: currencies,
        commodities: commodities,
      },
      counts: {
        total: assets.length,
        currencies: currencies.length,
        commodities: commodities.length,
      },
    });
  } catch (error) {
    console.error("❌ Assets test error:", error);
    res.status(500).json({
      success: false,
      error: "Assets table test failed",
      details: error.message,
    });
  }
});

// ====================
// END ASSETS API ROUTES
// ====================// Add this endpoint to your existing api-server.js file
// Insert this code BEFORE the "Start server" section

// ====================
// ASSETS API ROUTES
// ====================

// Get assets (currencies/commodities) endpoint
app.get("/api/assets", async (req, res) => {
  try {
    const { type } = req.query;

    console.log("🪙 Fetching assets, type filter:", type);

    let query = "SELECT code, name, type, description FROM assets";
    let params = [];

    // Filter by type if provided (Currency or Commodity)
    if (type) {
      query += " WHERE type = ?";
      params.push(type);
    }

    // Order by name for consistent results
    query += " ORDER BY name ASC";

    const [assets] = await pool.execute(query, params);

    console.log(`✅ Found ${assets.length} assets`);
    console.log(
      "📋 Assets:",
      assets.map((a) => `${a.code} (${a.type})`)
    );

    res.json(assets);
  } catch (error) {
    console.error("❌ Get assets error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching assets",
    });
  }
});

// Get single asset by code
app.get("/api/assets/:code", async (req, res) => {
  try {
    const { code } = req.params;

    console.log("🔍 Fetching asset by code:", code);

    const [assets] = await pool.execute(
      "SELECT code, name, type, description, created_at, updated_at FROM assets WHERE code = ?",
      [code.toUpperCase()]
    );

    if (assets.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Asset not found",
      });
    }

    console.log("✅ Asset found:", assets[0]);

    res.json({
      success: true,
      asset: assets[0],
    });
  } catch (error) {
    console.error("❌ Get asset by code error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching asset",
    });
  }
});

// Create new asset (admin endpoint)
app.post("/api/assets", async (req, res) => {
  try {
    const { code, name, type, description } = req.body;

    // Validation
    if (!code || !name || !type) {
      return res.status(400).json({
        success: false,
        error: "Code, name, and type are required",
      });
    }

    if (!["Currency", "Commodity"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Type must be either Currency or Commodity",
      });
    }

    console.log("➕ Creating new asset:", { code, name, type });

    // Check if asset already exists
    const [existing] = await pool.execute(
      "SELECT code FROM assets WHERE code = ?",
      [code.toUpperCase()]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: "Asset with this code already exists",
      });
    }

    // Insert new asset
    await pool.execute(
      "INSERT INTO assets (code, name, type, description) VALUES (?, ?, ?, ?)",
      [code.toUpperCase(), name, type, description || ""]
    );

    // Get the created asset
    const [newAsset] = await pool.execute(
      "SELECT * FROM assets WHERE code = ?",
      [code.toUpperCase()]
    );

    console.log("✅ Asset created successfully");

    res.status(201).json({
      success: true,
      asset: newAsset[0],
      message: "Asset created successfully",
    });
  } catch (error) {
    console.error("❌ Create asset error:", error);
    res.status(500).json({
      success: false,
      error: "Server error creating asset",
    });
  }
});

// Update asset (admin endpoint)
app.put("/api/assets/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const { name, type, description } = req.body;

    console.log("🔄 Updating asset:", code);

    // Validation
    if (type && !["Currency", "Commodity"].includes(type)) {
      return res.status(400).json({
        success: false,
        error: "Type must be either Currency or Commodity",
      });
    }

    // Check if asset exists
    const [existing] = await pool.execute(
      "SELECT code FROM assets WHERE code = ?",
      [code.toUpperCase()]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Asset not found",
      });
    }

    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push("name = ?");
      updateValues.push(name);
    }
    if (type) {
      updateFields.push("type = ?");
      updateValues.push(type);
    }
    if (description !== undefined) {
      updateFields.push("description = ?");
      updateValues.push(description);
    }

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No fields to update",
      });
    }

    updateValues.push(code.toUpperCase());

    await pool.execute(
      `UPDATE assets SET ${updateFields.join(
        ", "
      )}, updated_at = CURRENT_TIMESTAMP WHERE code = ?`,
      updateValues
    );

    // Get updated asset
    const [updatedAsset] = await pool.execute(
      "SELECT * FROM assets WHERE code = ?",
      [code.toUpperCase()]
    );

    console.log("✅ Asset updated successfully");

    res.json({
      success: true,
      asset: updatedAsset[0],
      message: "Asset updated successfully",
    });
  } catch (error) {
    console.error("❌ Update asset error:", error);
    res.status(500).json({
      success: false,
      error: "Server error updating asset",
    });
  }
});

// Delete asset (admin endpoint)
app.delete("/api/assets/:code", async (req, res) => {
  try {
    const { code } = req.params;

    console.log("🗑️ Deleting asset:", code);

    // Check if asset exists
    const [existing] = await pool.execute(
      "SELECT code FROM assets WHERE code = ?",
      [code.toUpperCase()]
    );

    if (existing.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Asset not found",
      });
    }

    // Check if asset is being used in other tables
    const [assetPairs] = await pool.execute(
      "SELECT COUNT(*) as count FROM asset_pairs WHERE base_asset = ? OR quote_asset = ?",
      [code.toUpperCase(), code.toUpperCase()]
    );

    if (assetPairs[0].count > 0) {
      return res.status(400).json({
        success: false,
        error: "Cannot delete asset: it is being used in asset pairs",
      });
    }

    // Delete the asset
    await pool.execute("DELETE FROM assets WHERE code = ?", [
      code.toUpperCase(),
    ]);

    console.log("✅ Asset deleted successfully");

    res.json({
      success: true,
      message: "Asset deleted successfully",
    });
  } catch (error) {
    console.error("❌ Delete asset error:", error);
    res.status(500).json({
      success: false,
      error: "Server error deleting asset",
    });
  }
});

// Get asset statistics
app.get("/api/assets/stats", async (req, res) => {
  try {
    console.log("📊 Fetching asset statistics");

    // Get count by type
    const [typeStats] = await pool.execute(`
      SELECT type, COUNT(*) as count 
      FROM assets 
      GROUP BY type
    `);

    // Get total count
    const [totalCount] = await pool.execute(
      "SELECT COUNT(*) as total FROM assets"
    );

    // Get recent additions (last 30 days)
    const [recentAssets] = await pool.execute(`
      SELECT COUNT(*) as count 
      FROM assets 
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    `);

    const stats = {
      total: totalCount[0].total,
      byType: typeStats,
      recentAdditions: recentAssets[0].count,
    };

    console.log("✅ Asset statistics:", stats);

    res.json({
      success: true,
      stats: stats,
    });
  } catch (error) {
    console.error("❌ Get asset stats error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching asset statistics",
    });
  }
});

// Test endpoint to verify database connection and data
app.get("/api/test/assets", async (req, res) => {
  try {
    console.log("🧪 Testing assets table...");

    // Test basic query
    const [assets] = await pool.execute("SELECT * FROM assets LIMIT 5");

    // Test currency filter
    const [currencies] = await pool.execute(
      "SELECT * FROM assets WHERE type = ? LIMIT 3",
      ["Currency"]
    );

    // Test commodities filter
    const [commodities] = await pool.execute(
      "SELECT * FROM assets WHERE type = ? LIMIT 3",
      ["Commodity"]
    );

    res.json({
      success: true,
      message: "Assets table test successful",
      sample: {
        allAssets: assets,
        currencies: currencies,
        commodities: commodities,
      },
      counts: {
        total: assets.length,
        currencies: currencies.length,
        commodities: commodities.length,
      },
    });
  } catch (error) {
    console.error("❌ Assets test error:", error);
    res.status(500).json({
      success: false,
      error: "Assets table test failed",
      details: error.message,
    });
  }
});

// ====================
// COT DATA API ROUTES
// ====================

// Submit COT (Market Sentiments) data
app.post("/api/economic-data/cot", async (req, res) => {
  try {
    const { asset_code, cotLongContracts, cotShortContracts } = req.body;

    console.log("📊 Submitting COT data for asset:", asset_code);

    // Validation
    if (!asset_code || !cotLongContracts || !cotShortContracts) {
      return res.status(400).json({
        success: false,
        error: "Asset code, long contracts, and short contracts are required",
      });
    }

    // Convert to numbers
    const newLongContracts = parseFloat(cotLongContracts);
    const newShortContracts = parseFloat(cotShortContracts);

    if (isNaN(newLongContracts) || isNaN(newShortContracts)) {
      return res.status(400).json({
        success: false,
        error: "Long and short contracts must be valid numbers",
      });
    }

    // Get the most recent COT data for this asset to calculate changes
    const [previousData] = await pool.execute(
      `SELECT long_contracts, short_contracts, long_percent 
       FROM cot_data 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [asset_code.toUpperCase()]
    );

    let changeInLong = 0;
    let changeInShort = 0;
    let netChangePercent = 0;
    let previousLongPercent = 0;

    // Calculate changes if previous data exists
    if (previousData.length > 0) {
      const prev = previousData[0];
      changeInLong = newLongContracts - prev.long_contracts;
      changeInShort = newShortContracts - prev.short_contracts;
      previousLongPercent = prev.long_percent || 0;
    }

    // Calculate percentages
    const totalContracts = newLongContracts + newShortContracts;
    const longPercent =
      totalContracts > 0 ? (newLongContracts / totalContracts) * 100 : 0;
    const shortPercent =
      totalContracts > 0 ? (newShortContracts / totalContracts) * 100 : 0;

    // Calculate net position and net change percent
    const netPosition = newLongContracts - newShortContracts;
    netChangePercent = longPercent - previousLongPercent;

    // Insert new COT data (matching your exact table structure)
    const [result] = await pool.execute(
      `INSERT INTO cot_data 
       (asset_code, long_contracts, short_contracts, change_in_long, change_in_short, 
        long_percent, short_percent, net_position, net_change_percent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        asset_code.toUpperCase(),
        newLongContracts,
        newShortContracts,
        changeInLong,
        changeInShort,
        parseFloat(longPercent.toFixed(2)),
        parseFloat(shortPercent.toFixed(2)),
        netPosition,
        parseFloat(netChangePercent.toFixed(2)),
      ]
    );

    // Get the inserted record to return
    const [insertedData] = await pool.execute(
      "SELECT * FROM cot_data WHERE id = ?",
      [result.insertId]
    );

    console.log("✅ COT data saved successfully");

    res.status(201).json({
      success: true,
      message: "COT data saved successfully",
      data: insertedData[0],
      calculations: {
        changeInLong: changeInLong,
        changeInShort: changeInShort,
        longPercent: parseFloat(longPercent.toFixed(2)),
        shortPercent: parseFloat(shortPercent.toFixed(2)),
        netPosition: netPosition,
        netChangePercent: parseFloat(netChangePercent.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("❌ COT data submission error:", error);
    res.status(500).json({
      success: false,
      error: "Server error saving COT data",
    });
  }
});

// Get COT data for an asset
app.get("/api/economic-data/cot/:asset_code", async (req, res) => {
  try {
    const { asset_code } = req.params;
    const { limit = 10 } = req.query;

    console.log("📈 Fetching COT data for asset:", asset_code);

    const [cotData] = await pool.execute(
      `SELECT * FROM cot_data 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [asset_code.toUpperCase(), parseInt(limit)]
    );

    res.json({
      success: true,
      asset_code: asset_code.toUpperCase(),
      data: cotData,
      count: cotData.length,
    });
  } catch (error) {
    console.error("❌ Get COT data error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching COT data",
    });
  }
});

// Get latest COT data for all assets
app.get("/api/economic-data/cot", async (req, res) => {
  try {
    console.log("📊 Fetching latest COT data for all assets");

    const [cotData] = await pool.execute(
      `SELECT c1.* FROM cot_data c1
       INNER JOIN (
         SELECT asset_code, MAX(created_at) as max_created
         FROM cot_data 
         GROUP BY asset_code
       ) c2 ON c1.asset_code = c2.asset_code 
           AND c1.created_at = c2.max_created
       ORDER BY c1.asset_code`
    );

    res.json({
      success: true,
      data: cotData,
      count: cotData.length,
    });
  } catch (error) {
    console.error("❌ Get all COT data error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching COT data",
    });
  }
});

// ====================
// END COT DATA API ROUTES
// ====================

// ====================
// LABOR MARKET DATA API ROUTES
// ====================

// Submit Unemployment Rate data (UPDATED with forecast and result)
app.post("/api/economic-data/unemployment", async (req, res) => {
  try {
    const { asset_code, unemployment, unemploymentForecast } = req.body;

    console.log("📊 Submitting Unemployment Rate data for asset:", asset_code);

    // Validation
    if (!asset_code || !unemployment || !unemploymentForecast) {
      return res.status(400).json({
        success: false,
        error: "Asset code, unemployment rate, and forecast are required",
      });
    }

    // Convert to numbers
    const newUnemploymentRate = parseFloat(unemployment);
    const forecast = parseFloat(unemploymentForecast);

    if (isNaN(newUnemploymentRate) || isNaN(forecast)) {
      return res.status(400).json({
        success: false,
        error: "Unemployment rate and forecast must be valid numbers",
      });
    }

    // Get the most recent unemployment data for this asset to calculate changes
    const [previousData] = await pool.execute(
      `SELECT unemployment_rate 
       FROM unemployment_rate 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [asset_code.toUpperCase()]
    );

    let netChangePercent = 0;

    // Calculate net change percent if previous data exists
    if (previousData.length > 0) {
      const previousRate = previousData[0].unemployment_rate;
      if (previousRate && previousRate !== 0) {
        // Formula: [(New Rate - Previous Rate) / Previous Rate] * 100
        netChangePercent =
          ((newUnemploymentRate - previousRate) / previousRate) * 100;
      }
    }

    // Determine result based on comparison with forecast (same logic as GDP)
    let result;
    if (newUnemploymentRate > forecast) {
      result = "Missed"; // Higher unemployment is bad
    } else if (newUnemploymentRate < forecast) {
      result = "Beat"; // Lower unemployment is good
    } else {
      result = "As Expected";
    }

    // Insert new unemployment data with forecast and result
    const [insertResult] = await pool.execute(
      `INSERT INTO unemployment_rate 
       (asset_code, unemployment_rate, forecast, net_change_percent, result)
       VALUES (?, ?, ?, ?, ?)`,
      [
        asset_code.toUpperCase(),
        newUnemploymentRate,
        forecast,
        parseFloat(netChangePercent.toFixed(2)),
        result,
      ]
    );

    // Get the inserted record to return
    const [insertedData] = await pool.execute(
      "SELECT * FROM unemployment_rate WHERE id = ?",
      [insertResult.insertId]
    );

    console.log("✅ Unemployment Rate data saved successfully");

    res.status(201).json({
      success: true,
      message: "Unemployment Rate data saved successfully",
      data: insertedData[0],
      calculations: {
        netChangePercent: parseFloat(netChangePercent.toFixed(2)),
        result: result,
      },
    });
  } catch (error) {
    console.error("❌ Unemployment Rate submission error:", error);
    res.status(500).json({
      success: false,
      error: "Server error saving unemployment rate data",
    });
  }
});

// Submit Employment Change data (UPDATED with forecast and result)
app.post("/api/economic-data/employment", async (req, res) => {
  try {
    const { asset_code, employeeChange, employeeChangeForecast } = req.body;

    console.log("📊 Submitting Employment Change data for asset:", asset_code);

    // Validation
    if (!asset_code || !employeeChange || !employeeChangeForecast) {
      return res.status(400).json({
        success: false,
        error: "Asset code, employment change, and forecast are required",
      });
    }

    // Convert to numbers
    const newEmploymentChange = parseFloat(employeeChange);
    const forecast = parseFloat(employeeChangeForecast);

    if (isNaN(newEmploymentChange) || isNaN(forecast)) {
      return res.status(400).json({
        success: false,
        error: "Employment change and forecast must be valid numbers",
      });
    }

    // Get the most recent employment data for this asset to calculate changes
    const [previousData] = await pool.execute(
      `SELECT employment_change 
       FROM employment_change 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [asset_code.toUpperCase()]
    );

    let netChangePercent = 0;

    // Calculate net change percent if previous data exists
    if (previousData.length > 0) {
      const previousChange = previousData[0].employment_change;
      if (previousChange && previousChange !== 0) {
        // Formula: [(New Change - Previous Change) / Previous Change] * 100
        netChangePercent =
          ((newEmploymentChange - previousChange) / previousChange) * 100;
      }
    }

    // Determine result based on comparison with forecast (same logic as GDP)
    let result;
    if (newEmploymentChange > forecast) {
      result = "Beat"; // Higher employment change is good
    } else if (newEmploymentChange < forecast) {
      result = "Missed"; // Lower employment change is bad
    } else {
      result = "As Expected";
    }

    // Insert new employment data with forecast and result
    const [insertResult] = await pool.execute(
      `INSERT INTO employment_change 
       (asset_code, employment_change, forecast, net_change_percent, result)
       VALUES (?, ?, ?, ?, ?)`,
      [
        asset_code.toUpperCase(),
        newEmploymentChange,
        forecast,
        parseFloat(netChangePercent.toFixed(2)),
        result,
      ]
    );

    // Get the inserted record to return
    const [insertedData] = await pool.execute(
      "SELECT * FROM employment_change WHERE id = ?",
      [insertResult.insertId]
    );

    console.log("✅ Employment Change data saved successfully");

    res.status(201).json({
      success: true,
      message: "Employment Change data saved successfully",
      data: insertedData[0],
      calculations: {
        netChangePercent: parseFloat(netChangePercent.toFixed(2)),
        result: result,
      },
    });
  } catch (error) {
    console.error("❌ Employment Change submission error:", error);
    res.status(500).json({
      success: false,
      error: "Server error saving employment change data",
    });
  }
});

// GET endpoints remain the same, but now return the new forecast and result fields
// Get unemployment rate data for an asset
app.get("/api/economic-data/unemployment/:asset_code", async (req, res) => {
  try {
    const { asset_code } = req.params;
    const { limit = 10 } = req.query;

    console.log("📈 Fetching unemployment data for asset:", asset_code);

    const [unemploymentData] = await pool.execute(
      `SELECT * FROM unemployment_rate 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [asset_code.toUpperCase(), parseInt(limit)]
    );

    res.json({
      success: true,
      asset_code: asset_code.toUpperCase(),
      data: unemploymentData,
      count: unemploymentData.length,
    });
  } catch (error) {
    console.error("❌ Get unemployment data error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching unemployment data",
    });
  }
});

// Get employment change data for an asset
app.get("/api/economic-data/employment/:asset_code", async (req, res) => {
  try {
    const { asset_code } = req.params;
    const { limit = 10 } = req.query;

    console.log("📈 Fetching employment data for asset:", asset_code);

    const [employmentData] = await pool.execute(
      `SELECT * FROM employment_change 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [asset_code.toUpperCase(), parseInt(limit)]
    );

    res.json({
      success: true,
      asset_code: asset_code.toUpperCase(),
      data: employmentData,
      count: employmentData.length,
    });
  } catch (error) {
    console.error("❌ Get employment data error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching employment data",
    });
  }
});

// ====================
// END LABOR MARKET DATA API ROUTES
// ====================
// ====================
// ECONOMIC GROWTH DATA API ROUTES
// ====================

// Submit GDP Growth data
app.post("/api/economic-data/gdp", async (req, res) => {
  try {
    const { asset_code, gdp, gdpForecast } = req.body;

    console.log("📊 Submitting GDP Growth data for asset:", asset_code);

    // Validation
    if (!asset_code || !gdp || !gdpForecast) {
      return res.status(400).json({
        success: false,
        error: "Asset code, GDP growth, and GDP forecast are required",
      });
    }

    // Convert to numbers
    const newGdpGrowth = parseFloat(gdp);
    const forecast = parseFloat(gdpForecast);

    if (isNaN(newGdpGrowth) || isNaN(forecast)) {
      return res.status(400).json({
        success: false,
        error: "GDP growth and forecast must be valid numbers",
      });
    }

    // Get the most recent GDP data for this asset to calculate changes
    const [previousData] = await pool.execute(
      `SELECT gdp_growth 
       FROM gdp_growth 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [asset_code.toUpperCase()]
    );

    let changeInGdp = 0;

    // Calculate change in GDP if previous data exists
    if (previousData.length > 0) {
      const previousGdp = previousData[0].gdp_growth;
      changeInGdp = newGdpGrowth - previousGdp;
    }

    // Determine result based on comparison with forecast
    let result;
    if (newGdpGrowth > forecast) {
      result = "Beat";
    } else if (newGdpGrowth < forecast) {
      result = "Missed";
    } else {
      result = "As Expected";
    }

    // Insert new GDP data
    const [insertResult] = await pool.execute(
      `INSERT INTO gdp_growth 
       (asset_code, gdp_growth, forecast, change_in_gdp, result)
       VALUES (?, ?, ?, ?, ?)`,
      [
        asset_code.toUpperCase(),
        newGdpGrowth,
        forecast,
        parseFloat(changeInGdp.toFixed(2)),
        result,
      ]
    );

    // Get the inserted record to return
    const [insertedData] = await pool.execute(
      "SELECT * FROM gdp_growth WHERE id = ?",
      [insertResult.insertId]
    );

    console.log("✅ GDP Growth data saved successfully");

    res.status(201).json({
      success: true,
      message: "GDP Growth data saved successfully",
      data: insertedData[0],
      calculations: {
        changeInGdp: parseFloat(changeInGdp.toFixed(2)),
        result: result,
      },
    });
  } catch (error) {
    console.error("❌ GDP Growth submission error:", error);
    res.status(500).json({
      success: false,
      error: "Server error saving GDP growth data",
    });
  }
});

// Submit Manufacturing PMI data
app.post("/api/economic-data/mpmi", async (req, res) => {
  try {
    const { asset_code, mPMI, mPMIForecast } = req.body;

    console.log("📊 Submitting Manufacturing PMI data for asset:", asset_code);

    // Validation
    if (!asset_code || !mPMI || !mPMIForecast) {
      return res.status(400).json({
        success: false,
        error: "Asset code, Manufacturing PMI, and forecast are required",
      });
    }

    // Convert to numbers
    const newMPMI = parseFloat(mPMI);
    const forecast = parseFloat(mPMIForecast);

    if (isNaN(newMPMI) || isNaN(forecast)) {
      return res.status(400).json({
        success: false,
        error: "Manufacturing PMI and forecast must be valid numbers",
      });
    }

    // Determine result based on comparison with forecast
    let result;
    if (newMPMI > forecast) {
      result = "Beat";
    } else if (newMPMI < forecast) {
      result = "Miss";
    } else {
      result = "Met";
    }

    // Insert new Manufacturing PMI data
    const [insertResult] = await pool.execute(
      `INSERT INTO mpmi 
       (asset_code, service_pmi, forecast, result)
       VALUES (?, ?, ?, ?)`,
      [asset_code.toUpperCase(), newMPMI, forecast, result]
    );

    // Get the inserted record to return
    const [insertedData] = await pool.execute(
      "SELECT * FROM mpmi WHERE id = ?",
      [insertResult.insertId]
    );

    console.log("✅ Manufacturing PMI data saved successfully");

    res.status(201).json({
      success: true,
      message: "Manufacturing PMI data saved successfully",
      data: insertedData[0],
      calculations: {
        result: result,
      },
    });
  } catch (error) {
    console.error("❌ Manufacturing PMI submission error:", error);
    res.status(500).json({
      success: false,
      error: "Server error saving Manufacturing PMI data",
    });
  }
});

// Submit Services PMI data
app.post("/api/economic-data/spmi", async (req, res) => {
  try {
    const { asset_code, sPMI, sPMIForecast } = req.body;

    console.log("📊 Submitting Services PMI data for asset:", asset_code);

    // Validation
    if (!asset_code || !sPMI || !sPMIForecast) {
      return res.status(400).json({
        success: false,
        error: "Asset code, Services PMI, and forecast are required",
      });
    }

    // Convert to numbers
    const newSPMI = parseFloat(sPMI);
    const forecast = parseFloat(sPMIForecast);

    if (isNaN(newSPMI) || isNaN(forecast)) {
      return res.status(400).json({
        success: false,
        error: "Services PMI and forecast must be valid numbers",
      });
    }

    // Determine result based on comparison with forecast
    let result;
    if (newSPMI > forecast) {
      result = "Beat";
    } else if (newSPMI < forecast) {
      result = "Miss";
    } else {
      result = "Met";
    }

    // Insert new Services PMI data
    const [insertResult] = await pool.execute(
      `INSERT INTO spmi 
       (asset_code, service_pmi, forecast, result)
       VALUES (?, ?, ?, ?)`,
      [asset_code.toUpperCase(), newSPMI, forecast, result]
    );

    // Get the inserted record to return
    const [insertedData] = await pool.execute(
      "SELECT * FROM spmi WHERE id = ?",
      [insertResult.insertId]
    );

    console.log("✅ Services PMI data saved successfully");

    res.status(201).json({
      success: true,
      message: "Services PMI data saved successfully",
      data: insertedData[0],
      calculations: {
        result: result,
      },
    });
  } catch (error) {
    console.error("❌ Services PMI submission error:", error);
    res.status(500).json({
      success: false,
      error: "Server error saving Services PMI data",
    });
  }
});

// Submit Retail Sales data
app.post("/api/economic-data/retail", async (req, res) => {
  try {
    const { asset_code, retailSales, retailSalesForecast } = req.body;

    console.log("📊 Submitting Retail Sales data for asset:", asset_code);

    // Validation
    if (!asset_code || !retailSales || !retailSalesForecast) {
      return res.status(400).json({
        success: false,
        error: "Asset code, Retail Sales, and forecast are required",
      });
    }

    // Convert to numbers
    const newRetailSales = parseFloat(retailSales);
    const forecast = parseFloat(retailSalesForecast);

    if (isNaN(newRetailSales) || isNaN(forecast)) {
      return res.status(400).json({
        success: false,
        error: "Retail Sales and forecast must be valid numbers",
      });
    }

    // Get the most recent retail sales data for this asset to calculate net change percent
    const [previousData] = await pool.execute(
      `SELECT retail_sales 
       FROM retail_sales 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [asset_code.toUpperCase()]
    );

    let netChangePercent = 0;

    // Calculate net change percent if previous data exists
    if (previousData.length > 0) {
      const previousSales = previousData[0].retail_sales;
      if (previousSales && previousSales !== 0) {
        // Formula: [(New Sales - Previous Sales) / Previous Sales] * 100
        netChangePercent =
          ((newRetailSales - previousSales) / previousSales) * 100;
      }
    }

    // Determine result based on comparison with forecast
    let result;
    if (newRetailSales > forecast) {
      result = "Beat";
    } else if (newRetailSales < forecast) {
      result = "Miss";
    } else {
      result = "Met";
    }

    // Insert new Retail Sales data
    const [insertResult] = await pool.execute(
      `INSERT INTO retail_sales 
       (asset_code, retail_sales, forecast, net_change_percent, result)
       VALUES (?, ?, ?, ?, ?)`,
      [
        asset_code.toUpperCase(),
        newRetailSales,
        forecast,
        parseFloat(netChangePercent.toFixed(2)),
        result,
      ]
    );

    // Get the inserted record to return
    const [insertedData] = await pool.execute(
      "SELECT * FROM retail_sales WHERE id = ?",
      [insertResult.insertId]
    );

    console.log("✅ Retail Sales data saved successfully");

    res.status(201).json({
      success: true,
      message: "Retail Sales data saved successfully",
      data: insertedData[0],
      calculations: {
        netChangePercent: parseFloat(netChangePercent.toFixed(2)),
        result: result,
      },
    });
  } catch (error) {
    console.error("❌ Retail Sales submission error:", error);
    res.status(500).json({
      success: false,
      error: "Server error saving Retail Sales data",
    });
  }
});

// GET endpoints for each economic indicator

// Get GDP Growth data for an asset
app.get("/api/economic-data/gdp/:asset_code", async (req, res) => {
  try {
    const { asset_code } = req.params;
    const { limit = 10 } = req.query;

    const [gdpData] = await pool.execute(
      `SELECT * FROM gdp_growth 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [asset_code.toUpperCase(), parseInt(limit)]
    );

    res.json({
      success: true,
      asset_code: asset_code.toUpperCase(),
      data: gdpData,
      count: gdpData.length,
    });
  } catch (error) {
    console.error("❌ Get GDP data error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching GDP data",
    });
  }
});

// Get Manufacturing PMI data for an asset
app.get("/api/economic-data/mpmi/:asset_code", async (req, res) => {
  try {
    const { asset_code } = req.params;
    const { limit = 10 } = req.query;

    const [mpmiData] = await pool.execute(
      `SELECT * FROM mpmi 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [asset_code.toUpperCase(), parseInt(limit)]
    );

    res.json({
      success: true,
      asset_code: asset_code.toUpperCase(),
      data: mpmiData,
      count: mpmiData.length,
    });
  } catch (error) {
    console.error("❌ Get Manufacturing PMI data error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching Manufacturing PMI data",
    });
  }
});

// Get Services PMI data for an asset
app.get("/api/economic-data/spmi/:asset_code", async (req, res) => {
  try {
    const { asset_code } = req.params;
    const { limit = 10 } = req.query;

    const [spmiData] = await pool.execute(
      `SELECT * FROM spmi 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [asset_code.toUpperCase(), parseInt(limit)]
    );

    res.json({
      success: true,
      asset_code: asset_code.toUpperCase(),
      data: spmiData,
      count: spmiData.length,
    });
  } catch (error) {
    console.error("❌ Get Services PMI data error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching Services PMI data",
    });
  }
});

// Get Retail Sales data for an asset
app.get("/api/economic-data/retail/:asset_code", async (req, res) => {
  try {
    const { asset_code } = req.params;
    const { limit = 10 } = req.query;

    const [retailData] = await pool.execute(
      `SELECT * FROM retail_sales 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [asset_code.toUpperCase(), parseInt(limit)]
    );

    res.json({
      success: true,
      asset_code: asset_code.toUpperCase(),
      data: retailData,
      count: retailData.length,
    });
  } catch (error) {
    console.error("❌ Get Retail Sales data error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching Retail Sales data",
    });
  }
});

// ====================
// END ECONOMIC GROWTH DATA API ROUTES
// ====================
// ====================
// INFLATION DATA API ROUTES
// ====================

// Submit Core Inflation data
app.post("/api/economic-data/inflation", async (req, res) => {
  try {
    const { asset_code, cpi, cpiForecast } = req.body;

    console.log("📊 Submitting Core Inflation data for asset:", asset_code);

    // Validation
    if (!asset_code || !cpi || !cpiForecast) {
      return res.status(400).json({
        success: false,
        error: "Asset code, core inflation, and forecast are required",
      });
    }

    // Convert to numbers
    const newCoreInflation = parseFloat(cpi);
    const forecast = parseFloat(cpiForecast);

    if (isNaN(newCoreInflation) || isNaN(forecast)) {
      return res.status(400).json({
        success: false,
        error: "Core inflation and forecast must be valid numbers",
      });
    }

    // Get the most recent inflation data for this asset to calculate net change percent
    const [previousData] = await pool.execute(
      `SELECT core_inflation 
       FROM core_inflation 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [asset_code.toUpperCase()]
    );

    let netChangePercent = 0;

    // Calculate net change percent if previous data exists
    if (previousData.length > 0) {
      const previousInflation = previousData[0].core_inflation;
      if (previousInflation && previousInflation !== 0) {
        // Formula: [(New Core Inflation - Previous Core Inflation) / Previous Core Inflation] * 100
        netChangePercent =
          ((newCoreInflation - previousInflation) / previousInflation) * 100;
      }
    }

    // Determine result based on comparison with forecast
    let result;
    if (newCoreInflation > forecast) {
      result = "Lower than expected";
    } else if (newCoreInflation < forecast) {
      result = "Higher than expected";
    } else {
      result = "As Expected";
    }

    // Insert new inflation data
    const [insertResult] = await pool.execute(
      `INSERT INTO core_inflation 
       (asset_code, core_inflation, forecast, net_change_percent, result)
       VALUES (?, ?, ?, ?, ?)`,
      [
        asset_code.toUpperCase(),
        newCoreInflation,
        forecast,
        parseFloat(netChangePercent.toFixed(2)),
        result,
      ]
    );

    // Get the inserted record to return
    const [insertedData] = await pool.execute(
      "SELECT * FROM core_inflation WHERE id = ?",
      [insertResult.insertId]
    );

    console.log("✅ Core Inflation data saved successfully");

    res.status(201).json({
      success: true,
      message: "Core Inflation data saved successfully",
      data: insertedData[0],
      calculations: {
        netChangePercent: parseFloat(netChangePercent.toFixed(2)),
        result: result,
      },
    });
  } catch (error) {
    console.error("❌ Core Inflation submission error:", error);
    res.status(500).json({
      success: false,
      error: "Server error saving core inflation data",
    });
  }
});

// Get Core Inflation data for an asset
app.get("/api/economic-data/inflation/:asset_code", async (req, res) => {
  try {
    const { asset_code } = req.params;
    const { limit = 10 } = req.query;

    console.log("📈 Fetching inflation data for asset:", asset_code);

    const [inflationData] = await pool.execute(
      `SELECT * FROM core_inflation 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [asset_code.toUpperCase(), parseInt(limit)]
    );

    res.json({
      success: true,
      asset_code: asset_code.toUpperCase(),
      data: inflationData,
      count: inflationData.length,
    });
  } catch (error) {
    console.error("❌ Get inflation data error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching inflation data",
    });
  }
});

// ====================
// END INFLATION DATA API ROUTES
// ====================

// ====================
// INTEREST RATE DATA API ROUTES
// ====================

// Submit Interest Rate data
app.post("/api/economic-data/interest", async (req, res) => {
  try {
    const { asset_code, interestRate } = req.body;

    console.log("📊 Submitting Interest Rate data for asset:", asset_code);

    // Validation
    if (!asset_code || !interestRate) {
      return res.status(400).json({
        success: false,
        error: "Asset code and interest rate are required",
      });
    }

    // Convert to number
    const newInterestRate = parseFloat(interestRate);

    if (isNaN(newInterestRate)) {
      return res.status(400).json({
        success: false,
        error: "Interest rate must be a valid number",
      });
    }

    // Get the most recent interest rate data for this asset to calculate change
    const [previousData] = await pool.execute(
      `SELECT interest_rate 
       FROM interest_rate 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT 1`,
      [asset_code.toUpperCase()]
    );

    let changeInInterest = 0;

    // Calculate change in interest if previous data exists
    if (previousData.length > 0) {
      const previousRate = previousData[0].interest_rate;
      if (previousRate !== null && previousRate !== undefined) {
        // Formula: new_interest_rate - previous_interest_rate
        changeInInterest = newInterestRate - previousRate;
      }
    }

    // Insert new interest rate data
    const [insertResult] = await pool.execute(
      `INSERT INTO interest_rate 
       (asset_code, interest_rate, change_in_interest)
       VALUES (?, ?, ?)`,
      [
        asset_code.toUpperCase(),
        newInterestRate,
        parseFloat(changeInInterest.toFixed(4)),
      ]
    );

    // Get the inserted record to return
    const [insertedData] = await pool.execute(
      "SELECT * FROM interest_rate WHERE id = ?",
      [insertResult.insertId]
    );

    console.log("✅ Interest Rate data saved successfully");

    res.status(201).json({
      success: true,
      message: "Interest Rate data saved successfully",
      data: insertedData[0],
      calculations: {
        changeInInterest: parseFloat(changeInInterest.toFixed(4)),
      },
    });
  } catch (error) {
    console.error("❌ Interest Rate submission error:", error);
    res.status(500).json({
      success: false,
      error: "Server error saving interest rate data",
    });
  }
});

// Get Interest Rate data for an asset
app.get("/api/economic-data/interest/:asset_code", async (req, res) => {
  try {
    const { asset_code } = req.params;
    const { limit = 10 } = req.query;

    console.log("📈 Fetching interest rate data for asset:", asset_code);

    const [interestData] = await pool.execute(
      `SELECT * FROM interest_rate 
       WHERE asset_code = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [asset_code.toUpperCase(), parseInt(limit)]
    );

    res.json({
      success: true,
      asset_code: asset_code.toUpperCase(),
      data: interestData,
      count: interestData.length,
    });
  } catch (error) {
    console.error("❌ Get interest rate data error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching interest rate data",
    });
  }
});

// ====================
// END INTEREST RATE DATA API ROUTES
// ====================

// ====================
// NFP DATA API ROUTES (USD ONLY)
// ====================

// Submit NFP (Non-Farm Payrolls) data - USD ONLY
app.post("/api/economic-data/nfp", async (req, res) => {
  try {
    const { asset_code, actualNfp, nfpForecast } = req.body;

    console.log("📊 Submitting NFP data for asset:", asset_code);

    // Validation - Only allow USD
    if (!asset_code) {
      return res.status(400).json({
        success: false,
        error: "Asset code is required",
      });
    }

    if (asset_code.toUpperCase() !== "USD") {
      return res.status(400).json({
        success: false,
        error: "NFP data is only available for USD currency",
      });
    }

    if (!actualNfp || !nfpForecast) {
      return res.status(400).json({
        success: false,
        error: "Actual NFP and forecast are required",
      });
    }

    // Convert to numbers
    const newActualNfp = parseFloat(actualNfp);
    const forecast = parseFloat(nfpForecast);

    if (isNaN(newActualNfp) || isNaN(forecast)) {
      return res.status(400).json({
        success: false,
        error: "Actual NFP and forecast must be valid numbers",
      });
    }

    // Get the most recent NFP data for USD to calculate net change percent
    const [previousData] = await pool.execute(
      `SELECT actual_nfp 
       FROM nfp 
       WHERE asset_code = 'USD' 
       ORDER BY created_at DESC 
       LIMIT 1`
    );

    let netChangePercent = 0;

    // Calculate net change percent if previous data exists
    if (previousData.length > 0) {
      const previousNfp = previousData[0].actual_nfp;
      if (previousNfp && previousNfp !== 0) {
        // Formula: [(New NFP - Previous NFP) / Previous NFP] * 100
        netChangePercent = ((newActualNfp - previousNfp) / previousNfp) * 100;
      }
    }

    // Insert new NFP data
    const [insertResult] = await pool.execute(
      `INSERT INTO nfp 
       (asset_code, actual_nfp, forecast, net_change_percent)
       VALUES (?, ?, ?, ?)`,
      [
        "USD", // Always USD
        newActualNfp,
        forecast,
        parseFloat(netChangePercent.toFixed(2)),
      ]
    );

    // Get the inserted record to return
    const [insertedData] = await pool.execute(
      "SELECT * FROM nfp WHERE id = ?",
      [insertResult.insertId]
    );

    console.log("✅ NFP data saved successfully for USD");

    res.status(201).json({
      success: true,
      message: "NFP data saved successfully",
      data: insertedData[0],
      calculations: {
        netChangePercent: parseFloat(netChangePercent.toFixed(2)),
      },
    });
  } catch (error) {
    console.error("❌ NFP submission error:", error);
    res.status(500).json({
      success: false,
      error: "Server error saving NFP data",
    });
  }
});

// Get NFP data (USD only)
app.get("/api/economic-data/nfp", async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    console.log("📈 Fetching NFP data for USD");

    const [nfpData] = await pool.execute(
      `SELECT * FROM nfp 
       WHERE asset_code = 'USD' 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [parseInt(limit)]
    );

    res.json({
      success: true,
      asset_code: "USD",
      data: nfpData,
      count: nfpData.length,
    });
  } catch (error) {
    console.error("❌ Get NFP data error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching NFP data",
    });
  }
});

// ====================
// END NFP DATA API ROUTES
// ====================

// ====================
// RETAIL SENTIMENT API ROUTES
// ====================

// Submit Retail Sentiment data
app.post("/api/retail-sentiment", async (req, res) => {
  try {
    const { asset_pair_code, retailLong, retailShort } = req.body;

    console.log(
      "📊 Submitting Retail Sentiment data for asset pair:",
      asset_pair_code
    );

    // Validation
    if (!asset_pair_code || !retailLong || !retailShort) {
      return res.status(400).json({
        success: false,
        error: "Asset pair code, retail long%, and retail short% are required",
      });
    }

    // Convert to numbers and validate percentages
    const newRetailLong = parseFloat(retailLong);
    const newRetailShort = parseFloat(retailShort);

    if (isNaN(newRetailLong) || isNaN(newRetailShort)) {
      return res.status(400).json({
        success: false,
        error: "Retail long% and retail short% must be valid numbers",
      });
    }

    // Validate percentages (should add up to 100% or be individual percentages)
    if (newRetailLong < 0 || newRetailShort < 0) {
      return res.status(400).json({
        success: false,
        error: "Percentages cannot be negative",
      });
    }

    if (newRetailLong > 100 || newRetailShort > 100) {
      return res.status(400).json({
        success: false,
        error: "Percentages cannot exceed 100%",
      });
    }

    // Optional: Check if percentages add up to 100% (you can remove this if not required)
    const totalPercentage = newRetailLong + newRetailShort;
    if (Math.abs(totalPercentage - 100) > 0.01) {
      // Allow small rounding differences
      return res.status(400).json({
        success: false,
        error: "Retail long% and retail short% should add up to 100%",
      });
    }

    // Check if asset pair exists
    const [assetPairExists] = await pool.execute(
      "SELECT asset_pair_code FROM asset_pairs WHERE asset_pair_code = ?",
      [asset_pair_code]
    );

    if (assetPairExists.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Invalid asset pair code",
      });
    }

    // Insert new retail sentiment data
    const [insertResult] = await pool.execute(
      `INSERT INTO retail_sentiment 
       (asset_pair_code, retail_long, retail_short)
       VALUES (?, ?, ?)`,
      [asset_pair_code, newRetailLong, newRetailShort]
    );

    // Get the inserted record to return
    const [insertedData] = await pool.execute(
      "SELECT * FROM retail_sentiment WHERE id = ?",
      [insertResult.insertId]
    );

    console.log("✅ Retail Sentiment data saved successfully");

    res.status(201).json({
      success: true,
      message: "Retail sentiment data saved successfully",
      data: insertedData[0],
    });
  } catch (error) {
    console.error("❌ Retail Sentiment submission error:", error);
    res.status(500).json({
      success: false,
      error: "Server error saving retail sentiment data",
    });
  }
});

// Get Retail Sentiment data for an asset pair
app.get("/api/retail-sentiment/:asset_pair_code", async (req, res) => {
  try {
    const { asset_pair_code } = req.params;
    const { limit = 10 } = req.query;

    console.log(
      "📈 Fetching retail sentiment data for asset pair:",
      asset_pair_code
    );

    const [sentimentData] = await pool.execute(
      `SELECT * FROM retail_sentiment 
       WHERE asset_pair_code = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [asset_pair_code, parseInt(limit)]
    );

    res.json({
      success: true,
      asset_pair_code: asset_pair_code,
      data: sentimentData,
      count: sentimentData.length,
    });
  } catch (error) {
    console.error("❌ Get retail sentiment data error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching retail sentiment data",
    });
  }
});

// Get latest Retail Sentiment data for all asset pairs
app.get("/api/retail-sentiment", async (req, res) => {
  try {
    console.log("📊 Fetching latest retail sentiment data for all asset pairs");

    const [sentimentData] = await pool.execute(
      `SELECT rs1.* FROM retail_sentiment rs1
       INNER JOIN (
         SELECT asset_pair_code, MAX(created_at) as max_created
         FROM retail_sentiment 
         GROUP BY asset_pair_code
       ) rs2 ON rs1.asset_pair_code = rs2.asset_pair_code 
           AND rs1.created_at = rs2.max_created
       ORDER BY rs1.asset_pair_code`
    );

    res.json({
      success: true,
      data: sentimentData,
      count: sentimentData.length,
    });
  } catch (error) {
    console.error("❌ Get all retail sentiment data error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching retail sentiment data",
    });
  }
});

// Get Asset Pairs for dropdown
app.get("/api/asset-pairs", async (req, res) => {
  try {
    console.log("🔗 Fetching asset pairs for dropdown");

    const [assetPairs] = await pool.execute(
      `SELECT asset_pair_code, base_asset, quote_asset 
       FROM asset_pairs 
       ORDER BY asset_pair_code ASC`
    );

    // Format for dropdown
    const assetPairOptions = assetPairs.map((pair) => ({
      value: pair.asset_pair_code,
      label: `${pair.base_asset}/${pair.quote_asset} (${pair.asset_pair_code})`,
      baseAsset: pair.base_asset,
      quoteAsset: pair.quote_asset,
    }));

    res.json({
      success: true,
      data: assetPairOptions,
      count: assetPairOptions.length,
    });
  } catch (error) {
    console.error("❌ Get asset pairs error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching asset pairs",
    });
  }
});

// ====================
// END RETAIL SENTIMENT API ROUTES
// ====================
// ====================
// ASSET PAIRS API ROUTE
// ====================

app.get("/api/asset-pairs", async (req, res) => {
  try {
    console.log("🔗 Fetching all asset pairs");

    const [assetPairs] = await pool.execute(
      `SELECT asset_pair_code, base_asset, quote_asset, description, created_at, updated_at
       FROM asset_pairs 
       ORDER BY asset_pair_code ASC`
    );

    // Format the response to match what your React component expects
    const assetPairOptions = assetPairs.map((pair) => ({
      value: pair.asset_pair_code,
      label: `${pair.base_asset}/${pair.quote_asset} (${pair.asset_pair_code})`,
      baseAsset: pair.base_asset,
      quoteAsset: pair.quote_asset,
      description: pair.description,
      created_at: pair.created_at,
      updated_at: pair.updated_at,
    }));

    console.log(`✅ Found ${assetPairs.length} asset pairs`);

    // Log the first few pairs to verify structure
    if (assetPairOptions.length > 0) {
      console.log("📋 Sample asset pairs:", assetPairOptions.slice(0, 3));
    }

    res.json({
      success: true,
      data: assetPairOptions,
      count: assetPairs.length,
    });
  } catch (error) {
    console.error("❌ Get asset pairs error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching asset pairs",
      details: error.message,
    });
  }
});

// ====================
// CURRENCY PROFILE API ROUTE - COMPLETE VERSION
// ====================
// Add this to your server.js file, before the "Start server" section

// Get detailed currency profile for an asset pair
app.get("/api/currency-profile/:asset_pair_code", async (req, res) => {
  try {
    const { asset_pair_code } = req.params;

    console.log("🔍 Fetching currency profile for:", asset_pair_code);

    // First, get the asset pair information
    const [assetPairInfo] = await pool.execute(
      `SELECT asset_pair_code, base_asset, quote_asset, description, created_at, updated_at
       FROM asset_pairs 
       WHERE asset_pair_code = ?`,
      [asset_pair_code]
    );

    if (assetPairInfo.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Asset pair not found",
      });
    }

    const assetPair = assetPairInfo[0];
    const baseAsset = assetPair.base_asset;
    const quoteAsset = assetPair.quote_asset;

    // Function to fetch latest economic data with error handling
    const fetchLatestData = async (table, assetCode) => {
      try {
        const [data] = await pool.execute(
          `SELECT * FROM ${table} WHERE asset_code = ? ORDER BY created_at DESC LIMIT 1`,
          [assetCode]
        );
        return data.length > 0 ? data[0] : null;
      } catch (error) {
        console.warn(
          `Failed to fetch ${table} data for ${assetCode}:`,
          error.message
        );
        return null;
      }
    };

    // Fetch all economic data for both assets
    const [
      cotBase,
      cotQuote,
      gdpBase,
      gdpQuote,
      mpmiBase,
      mpmiQuote,
      spmiBase,
      spmiQuote,
      retailBase,
      retailQuote,
      unemploymentBase,
      unemploymentQuote,
      employmentBase,
      employmentQuote,
      inflationBase,
      inflationQuote,
      interestBase,
      interestQuote,
      retailSentiment,
    ] = await Promise.all([
      // COT Data
      fetchLatestData("cot_data", baseAsset),
      fetchLatestData("cot_data", quoteAsset),

      // GDP Data
      fetchLatestData("gdp_growth", baseAsset),
      fetchLatestData("gdp_growth", quoteAsset),

      // Manufacturing PMI
      fetchLatestData("mpmi", baseAsset),
      fetchLatestData("mpmi", quoteAsset),

      // Services PMI
      fetchLatestData("spmi", baseAsset),
      fetchLatestData("spmi", quoteAsset),

      // Retail Sales
      fetchLatestData("retail_sales", baseAsset),
      fetchLatestData("retail_sales", quoteAsset),

      // Unemployment Rate
      fetchLatestData("unemployment_rate", baseAsset),
      fetchLatestData("unemployment_rate", quoteAsset),

      // Employment Change
      fetchLatestData("employment_change", baseAsset),
      fetchLatestData("employment_change", quoteAsset),

      // Inflation
      fetchLatestData("core_inflation", baseAsset),
      fetchLatestData("core_inflation", quoteAsset),

      // Interest Rate
      fetchLatestData("interest_rate", baseAsset),
      fetchLatestData("interest_rate", quoteAsset),

      // Retail Sentiment for the pair
      (async () => {
        try {
          const [data] = await pool.execute(
            `SELECT * FROM retail_sentiment WHERE asset_pair_code = ? ORDER BY created_at DESC LIMIT 1`,
            [asset_pair_code]
          );
          return data.length > 0 ? data[0] : null;
        } catch (error) {
          console.warn(
            `Failed to fetch retail sentiment for ${asset_pair_code}:`,
            error.message
          );
          return null;
        }
      })(),
    ]);

    // Calculate individual indicator scores (same logic as TopSetups)
    const calculateIndicatorScore = (baseData, quoteData, indicator) => {
      let baseScore = 0;
      let quoteScore = 0;
      let calculation = "";

      switch (indicator) {
        case "cot":
          if (baseData?.net_change_percent > 0) baseScore = 1;
          else if (baseData?.net_change_percent < 0) baseScore = -1;

          if (quoteData?.net_change_percent > 0) quoteScore = -1;
          else if (quoteData?.net_change_percent < 0) quoteScore = 1;

          calculation = `Base net change: ${
            baseData?.net_change_percent || 0
          }% (${
            baseScore > 0 ? "+1" : baseScore < 0 ? "-1" : "0"
          }), Quote net change: ${quoteData?.net_change_percent || 0}% (${
            quoteScore > 0 ? "+1" : quoteScore < 0 ? "-1" : "0"
          })`;
          break;

        case "employment":
          if (baseData && baseData.employment_change > baseData.forecast)
            baseScore = 1;
          else if (baseData && baseData.employment_change < baseData.forecast)
            baseScore = -1;

          if (quoteData && quoteData.employment_change > quoteData.forecast)
            quoteScore = -1;
          else if (
            quoteData &&
            quoteData.employment_change < quoteData.forecast
          )
            quoteScore = 1;

          calculation = `${baseAsset}: ${
            baseData?.employment_change || "N/A"
          } vs forecast ${baseData?.forecast || "N/A"} (${
            baseScore > 0 ? "Beat" : baseScore < 0 ? "Miss" : "Neutral"
          }), ${quoteAsset}: ${
            quoteData?.employment_change || "N/A"
          } vs forecast ${quoteData?.forecast || "N/A"} (${
            quoteScore > 0
              ? "Favor Base"
              : quoteScore < 0
              ? "Favor Quote"
              : "Neutral"
          })`;
          break;

        case "unemployment":
          if (baseData && baseData.unemployment_rate > baseData.forecast)
            baseScore = -1;
          else if (baseData && baseData.unemployment_rate < baseData.forecast)
            baseScore = 1;

          if (quoteData && quoteData.unemployment_rate > quoteData.forecast)
            quoteScore = 1;
          else if (
            quoteData &&
            quoteData.unemployment_rate < quoteData.forecast
          )
            quoteScore = -1;

          calculation = `${baseAsset}: ${
            baseData?.unemployment_rate || "N/A"
          }% vs forecast ${baseData?.forecast || "N/A"}% (${
            baseScore > 0 ? "Better" : baseScore < 0 ? "Worse" : "As Expected"
          }), ${quoteAsset}: ${
            quoteData?.unemployment_rate || "N/A"
          }% vs forecast ${quoteData?.forecast || "N/A"}% (${
            quoteScore > 0
              ? "Favor Base"
              : quoteScore < 0
              ? "Favor Quote"
              : "Neutral"
          })`;
          break;

        case "gdp":
        case "mpmi":
        case "spmi":
        case "retail":
          if (baseData?.result === "Beat") baseScore = 1;
          else if (baseData?.result === "Miss" || baseData?.result === "Missed")
            baseScore = -1;

          if (quoteData?.result === "Beat") quoteScore = -1;
          else if (
            quoteData?.result === "Miss" ||
            quoteData?.result === "Missed"
          )
            quoteScore = 1;

          calculation = `${baseAsset}: ${baseData?.result || "N/A"} (${
            baseScore > 0 ? "+1" : baseScore < 0 ? "-1" : "0"
          }), ${quoteAsset}: ${quoteData?.result || "N/A"} (${
            quoteScore > 0 ? "+1" : quoteScore < 0 ? "-1" : "0"
          })`;
          break;

        case "inflation":
          if (baseData && baseData.core_inflation > baseData.forecast)
            baseScore = 1;
          else if (baseData && baseData.core_inflation < baseData.forecast)
            baseScore = -1;

          if (quoteData && quoteData.core_inflation > quoteData.forecast)
            quoteScore = -1;
          else if (quoteData && quoteData.core_inflation < quoteData.forecast)
            quoteScore = 1;

          calculation = `${baseAsset}: ${
            baseData?.core_inflation || "N/A"
          }% vs forecast ${baseData?.forecast || "N/A"}% (${
            baseScore > 0 ? "Higher" : baseScore < 0 ? "Lower" : "As Expected"
          }), ${quoteAsset}: ${
            quoteData?.core_inflation || "N/A"
          }% vs forecast ${quoteData?.forecast || "N/A"}% (${
            quoteScore > 0
              ? "Favor Base"
              : quoteScore < 0
              ? "Favor Quote"
              : "Neutral"
          })`;
          break;

        case "interestRate":
          if (baseData?.change_in_interest > 0) baseScore = 1;
          else if (baseData?.change_in_interest < 0) baseScore = -1;

          if (quoteData?.change_in_interest > 0) quoteScore = -1;
          else if (quoteData?.change_in_interest < 0) quoteScore = 1;

          calculation = `${baseAsset}: ${
            baseData?.change_in_interest || 0
          } change (${
            baseScore > 0
              ? "Positive"
              : baseScore < 0
              ? "Negative"
              : "No Change"
          }), ${quoteAsset}: ${quoteData?.change_in_interest || 0} change (${
            quoteScore > 0
              ? "Favor Base"
              : quoteScore < 0
              ? "Favor Quote"
              : "Neutral"
          })`;
          break;

        default:
          calculation = "No calculation available";
      }

      return {
        score: Math.max(-2, Math.min(2, baseScore + quoteScore)),
        baseScore,
        quoteScore,
        calculation,
      };
    };

    // Retail position score calculation
    const retailScore =
      retailSentiment?.retail_long > retailSentiment?.retail_short ? -1 : 1;
    const retailCalculation = `Long: ${
      retailSentiment?.retail_long || 0
    }%, Short: ${retailSentiment?.retail_short || 0}% (${
      retailScore > 0 ? "Favors contrarian position" : "Crowd is long"
    })`;

    // Build the detailed breakdown
    const breakdown = [
      {
        name: "COT (Commitment of Traders)",
        ...calculateIndicatorScore(cotBase, cotQuote, "cot"),
        baseData: cotBase
          ? {
              "Long Contracts": cotBase.long_contracts,
              "Short Contracts": cotBase.short_contracts,
              "Long %": cotBase.long_percent,
              "Short %": cotBase.short_percent,
              "Net Change %": cotBase.net_change_percent,
            }
          : null,
        quoteData: cotQuote
          ? {
              "Long Contracts": cotQuote.long_contracts,
              "Short Contracts": cotQuote.short_contracts,
              "Long %": cotQuote.long_percent,
              "Short %": cotQuote.short_percent,
              "Net Change %": cotQuote.net_change_percent,
            }
          : null,
      },
      {
        name: "Retail Position",
        score: retailScore,
        calculation: retailCalculation,
        baseData: retailSentiment
          ? {
              "Retail Long %": retailSentiment.retail_long,
              "Retail Short %": retailSentiment.retail_short,
            }
          : null,
        quoteData: { Note: "Sentiment applies to pair" },
      },
      {
        name: "Employment Change",
        ...calculateIndicatorScore(
          employmentBase,
          employmentQuote,
          "employment"
        ),
        baseData: employmentBase
          ? {
              "Employment Change": employmentBase.employment_change,
              Forecast: employmentBase.forecast,
              Result: employmentBase.result,
              "Net Change %": employmentBase.net_change_percent,
            }
          : null,
        quoteData: employmentQuote
          ? {
              "Employment Change": employmentQuote.employment_change,
              Forecast: employmentQuote.forecast,
              Result: employmentQuote.result,
              "Net Change %": employmentQuote.net_change_percent,
            }
          : null,
      },
      {
        name: "Unemployment Rate",
        ...calculateIndicatorScore(
          unemploymentBase,
          unemploymentQuote,
          "unemployment"
        ),
        baseData: unemploymentBase
          ? {
              "Unemployment Rate": unemploymentBase.unemployment_rate,
              Forecast: unemploymentBase.forecast,
              Result: unemploymentBase.result,
              "Net Change %": unemploymentBase.net_change_percent,
            }
          : null,
        quoteData: unemploymentQuote
          ? {
              "Unemployment Rate": unemploymentQuote.unemployment_rate,
              Forecast: unemploymentQuote.forecast,
              Result: unemploymentQuote.result,
              "Net Change %": unemploymentQuote.net_change_percent,
            }
          : null,
      },
      {
        name: "GDP Growth",
        ...calculateIndicatorScore(gdpBase, gdpQuote, "gdp"),
        baseData: gdpBase
          ? {
              "GDP Growth": gdpBase.gdp_growth,
              Forecast: gdpBase.forecast,
              Result: gdpBase.result,
              "Change in GDP": gdpBase.change_in_gdp,
            }
          : null,
        quoteData: gdpQuote
          ? {
              "GDP Growth": gdpQuote.gdp_growth,
              Forecast: gdpQuote.forecast,
              Result: gdpQuote.result,
              "Change in GDP": gdpQuote.change_in_gdp,
            }
          : null,
      },
      {
        name: "Manufacturing PMI",
        ...calculateIndicatorScore(mpmiBase, mpmiQuote, "mpmi"),
        baseData: mpmiBase
          ? {
              "Service PMI": mpmiBase.service_pmi,
              Forecast: mpmiBase.forecast,
              Result: mpmiBase.result,
            }
          : null,
        quoteData: mpmiQuote
          ? {
              "Service PMI": mpmiQuote.service_pmi,
              Forecast: mpmiQuote.forecast,
              Result: mpmiQuote.result,
            }
          : null,
      },
      {
        name: "Services PMI",
        ...calculateIndicatorScore(spmiBase, spmiQuote, "spmi"),
        baseData: spmiBase
          ? {
              "Service PMI": spmiBase.service_pmi,
              Forecast: spmiBase.forecast,
              Result: spmiBase.result,
            }
          : null,
        quoteData: spmiQuote
          ? {
              "Service PMI": spmiQuote.service_pmi,
              Forecast: spmiQuote.forecast,
              Result: spmiQuote.result,
            }
          : null,
      },
      {
        name: "Retail Sales",
        ...calculateIndicatorScore(retailBase, retailQuote, "retail"),
        baseData: retailBase
          ? {
              "Retail Sales": retailBase.retail_sales,
              Forecast: retailBase.forecast,
              Result: retailBase.result,
              "Net Change %": retailBase.net_change_percent,
            }
          : null,
        quoteData: retailQuote
          ? {
              "Retail Sales": retailQuote.retail_sales,
              Forecast: retailQuote.forecast,
              Result: retailQuote.result,
              "Net Change %": retailQuote.net_change_percent,
            }
          : null,
      },
      {
        name: "Inflation",
        ...calculateIndicatorScore(inflationBase, inflationQuote, "inflation"),
        baseData: inflationBase
          ? {
              "Core Inflation": inflationBase.core_inflation,
              Forecast: inflationBase.forecast,
              Result: inflationBase.result,
              "Net Change %": inflationBase.net_change_percent,
            }
          : null,
        quoteData: inflationQuote
          ? {
              "Core Inflation": inflationQuote.core_inflation,
              Forecast: inflationQuote.forecast,
              Result: inflationQuote.result,
              "Net Change %": inflationQuote.net_change_percent,
            }
          : null,
      },
      {
        name: "Interest Rates",
        ...calculateIndicatorScore(interestBase, interestQuote, "interestRate"),
        baseData: interestBase
          ? {
              "Interest Rate": interestBase.interest_rate,
              "Change in Interest": interestBase.change_in_interest,
            }
          : null,
        quoteData: interestQuote
          ? {
              "Interest Rate": interestQuote.interest_rate,
              "Change in Interest": interestQuote.change_in_interest,
            }
          : null,
      },
    ];

    // Calculate total score
    const totalScore = breakdown.reduce(
      (sum, indicator) => sum + indicator.score,
      0
    );

    // Determine bias based on total score
    let bias;
    if (totalScore >= 12) bias = "Very Bullish";
    else if (totalScore >= 5) bias = "Bullish";
    else if (totalScore >= -4) bias = "Neutral";
    else if (totalScore >= -11) bias = "Bearish";
    else bias = "Very Bearish";

    // Prepare response data
    const profileData = {
      assetPair: {
        code: asset_pair_code,
        baseAsset,
        quoteAsset,
        description: assetPair.description || `${baseAsset} / ${quoteAsset}`,
      },
      totalScore,
      bias,
      breakdown: breakdown.filter(
        (indicator) => indicator.baseData || indicator.quoteData
      ), // Only include indicators with data
      lastUpdated: new Date().toISOString(),
      dataTimestamps: {
        cot: cotBase?.created_at || cotQuote?.created_at,
        employment: employmentBase?.created_at || employmentQuote?.created_at,
        unemployment:
          unemploymentBase?.created_at || unemploymentQuote?.created_at,
        gdp: gdpBase?.created_at || gdpQuote?.created_at,
        mpmi: mpmiBase?.created_at || mpmiQuote?.created_at,
        spmi: spmiBase?.created_at || spmiQuote?.created_at,
        retail: retailBase?.created_at || retailQuote?.created_at,
        inflation: inflationBase?.created_at || inflationQuote?.created_at,
        interestRate: interestBase?.created_at || interestQuote?.created_at,
        retailSentiment: retailSentiment?.created_at,
      },
    };

    console.log("✅ Currency profile generated successfully");
    console.log("📊 Total Score:", totalScore, "| Bias:", bias);

    res.json({
      success: true,
      data: profileData,
    });
  } catch (error) {
    console.error("❌ Currency profile error:", error);
    res.status(500).json({
      success: false,
      error: "Server error fetching currency profile",
      details: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found in this API'
  });
});



// Graceful shutdown handling
process.on('SIGTERM', async () => {
  console.log('🛑 SIGTERM received, shutting down gracefully...');
  
  if (pool) {
    await pool.end();
    console.log('✅ Database connection pool closed');
  }
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('🛑 SIGINT received, shutting down gracefully...');
  
  if (pool) {
    await pool.end();
    console.log('✅ Database connection pool closed');
  }
  
  process.exit(0);
});

// Start server
async function startServer() {
  const dbConnected = await initDatabase();
  
  if (!dbConnected) {
    console.error('❌ Failed to connect to database. Exiting...');
    process.exit(1);
  }
  
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🔒 CORS enabled for: http://localhost:5173, https://atecon.netlify.app`);
  });
}

// Start the application
startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
startServer().catch(console.error);