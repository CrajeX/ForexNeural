
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
    origin: ['http://localhost:5173','https://atecon.netlify.app', 'http://localhost:3000'],
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
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || '8con',
    charset: 'utf8',
    connectionLimit: 10
};

let pool;

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
        const connection = await pool.getConnection();
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
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔐 Login attempt for email:', email);

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    // STEP 1: Get student info from MySQL
    const [studentRows] = await pool.execute(
      "SELECT account_id, name, student_id, birth_place, birth_date, address, phone_no, learning_style, trading_level, age, gender FROM students WHERE email = ?",
      [trimmedEmail]
    );

    if (studentRows.length === 0) {
      console.log('❌ No student found with email:', trimmedEmail);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const student = studentRows[0];

    // STEP 2: Get account info (auth details)
    const [accountRows] = await pool.execute(
      "SELECT account_id, username, password, roles FROM accounts WHERE account_id = ?",
      [student.account_id]
    );

    if (accountRows.length === 0) {
      console.log('❌ No account found for account_id:', student.account_id);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const account = accountRows[0];

    // STEP 3: Password check (replace with real bcrypt logic)
    let passwordValid = true;
    // Uncomment below for actual bcrypt verification
    /*
    passwordValid = await bcrypt.compare(trimmedPassword, account.password);
    */

    if (!passwordValid) {
      console.log('❌ Password invalid');
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // STEP 4: Compose session userData
    const userData = {
      account_id: account.account_id,
      student_id: student.student_id,
      name: student.name,
      username: account.username,
      email: trimmedEmail,
      roles: account.roles,
      address: student.address,
      birth_place: student.birth_place,
      phone_no: student.phone_no,
      trading_level: student.trading_level,
      gender: student.gender,
      birth_date: student.birth_date,
      authenticated: true,
      loginTime: new Date().toISOString()
    };

    // STEP 5: Create Express session
    req.session.user_id = account.account_id;
    req.session.user_email = trimmedEmail;

    // STEP 6: Check for existing session in SQL
    const existingSession = await getSessionFromSQL(account.account_id);

    if (existingSession) {
      console.log('🔁 Reusing session');
      await pool.execute(
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

    // STEP 7: Sync to SQL users table (if not already)
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
        student.name,
        account.username,
        trimmedEmail,
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
      console.log('✅ SQL user synced');
    }

    // STEP 8: Return success
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
      student_id,
      email,
      password,
      username,
      name,
      roles = 'student'
    } = req.body;

    // Check if user already exists
    const [existingUsers] = await pool.execute(
      "SELECT id FROM users WHERE email = ? OR username = ?",
      [email, username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or username already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.execute(`
      INSERT INTO users 
      (account_id, student_id, email, password, username, name, roles, authenticated, login_time, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `, [
      account_id,
      student_id,
      email,
      hashedPassword,
      username,
      name,
      roles,
      1,
      new Date()
    ]);

    // Get the created user
    const [users] = await pool.execute(
      "SELECT * FROM users WHERE id = ?",
      [result.insertId]
    );

    const user = users[0];
    delete user.password;

    res.status(201).json({
      success: true,
      user: user,
      message: 'User created in SQL'
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