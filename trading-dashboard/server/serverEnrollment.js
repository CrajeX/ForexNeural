// import express from 'express';
// import mysql from 'mysql2/promise';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import crypto from 'crypto';
// import helmet from 'helmet';
// import rateLimit from 'express-rate-limit';
// import { body, validationResult } from 'express-validator';

// dotenv.config();

// const app = express();
// const PORT = 3001;
// const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');

// // ============================================================================
// // MIDDLEWARE CONFIGURATION
// // ============================================================================
// app.use(cors({
//     origin: ['http://localhost:5173','https://atecon.netlify.app','http://localhost:5174','https://8con.netlify.app'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
// // Security middleware
// app.use(helmet({
//   contentSecurityPolicy: {
//     directives: {
//       defaultSrc: ["'self'"],
//       styleSrc: ["'self'", "'unsafe-inline'"],
//       scriptSrc: ["'self'"],
//       imgSrc: ["'self'", "data:", "https:"],
//     },
//   },
// }));

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 100,
//   message: 'Too many requests from this IP, please try again later.',
// });

// const authLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 5,
//   message: 'Too many login attempts, please try again later.',
// });

// app.use(limiter);

// // Core middleware
// app.use(cors({
//     origin: ['http://localhost:5173','https://atecon.netlify.app', 'http://localhost:3000','http://localhost:5174'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));
// app.use(express.static('public'));
// app.use('/uploads', express.static('uploads'));

// // Database connection pool
// const pool = mysql.createPool({
//   host: process.env.DB_HOST || 'localhost',
//   user: process.env.DB_USER || 'root',
//   password: process.env.DB_PASSWORD || '',
//   database: process.env.DB_NAME_EDGE,
//   port: process.env.DB_PORT || 3306,
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0,
//   acquireTimeout: 60000,
//   timeout: 60000,
//   reconnect: true
// });

// // ============================================================================
// // FILE UPLOAD CONFIGURATION
// // ============================================================================

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const uploadDir = 'uploads/documents';
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir, { recursive: true });
//     }
//     cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//     const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
//     cb(null, file.fieldname + '-' + uniqueSuffix + '-' + sanitizedFilename);
//   }
// });

// const upload = multer({
//   storage: storage,
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
//     const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//     const mimetype = allowedTypes.test(file.mimetype);

//     if (mimetype && extname) {
//       return cb(null, true);
//     } else {
//       cb(new Error('Only images and documents are allowed'));
//     }
//   },
//   limits: { fileSize: 10 * 1024 * 1024 }
// });

// // ============================================================================
// // MIDDLEWARE UTILITIES
// // ============================================================================

// const validateInput = (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       error: 'Validation failed',
//       details: errors.array()
//     });
//   }
//   next();
// };

// const authenticateToken = async (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ error: 'Access token required' });
//   }

//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);

//     const [userRows] = await pool.execute(`
//       SELECT a.account_id, a.account_status, ar.role_id, r.role_name, r.permissions,
//              p.first_name, p.last_name,
//              COALESCE(s.student_id, st.staff_id) as user_id,
//              CASE WHEN s.student_id IS NOT NULL THEN s.person_id ELSE st.person_id END as person_id
//       FROM accounts a
//       JOIN account_roles ar ON a.account_id = ar.account_id
//       JOIN roles r ON ar.role_id = r.role_id
//       LEFT JOIN staff st ON a.account_id = st.account_id
//       LEFT JOIN students s ON a.account_id = s.account_id
//       LEFT JOIN persons p ON (st.person_id = p.person_id OR s.person_id = p.person_id)
//       WHERE a.account_id = ? AND a.account_status = 'active' AND ar.is_active = TRUE
//     `, [decoded.accountId]);

//     if (userRows.length === 0) {
//       return res.status(401).json({ error: 'Invalid token or inactive account' });
//     }

//     req.user = {
//       accountId: userRows[0].account_id,
//       username: userRows[0].username,
//       role: userRows[0].role_name,
//       permissions: userRows[0].permissions,
//       firstName: userRows[0].first_name,
//       lastName: userRows[0].last_name,
//       personId: userRows[0].person_id,
//       userId: userRows[0].user_id
//     };

//     next();
//   } catch (error) {
//     console.error('Token verification error:', error);
//     return res.status(403).json({ error: 'Invalid or expired token' });
//   }
// };

// const authorize = (allowedRoles) => {
//   return (req, res, next) => {
//     if (!req.user) {
//       return res.status(401).json({ error: 'Authentication required' });
//     }

//     if (allowedRoles.includes(req.user.role)) {
//       next();
//     } else {
//       res.status(403).json({ error: 'Insufficient permissions' });
//     }
//   };
// };

// const authorizeStudentAccess = async (req, res, next) => {
//   if (req.user.role === 'admin') {
//     return next();
//   }

//   if (req.user.role === 'student') {
//     const studentId = req.params.studentId || req.body.student_id;

//     if (!studentId) {
//       return res.status(400).json({ error: 'Student ID required' });
//     }

//     try {
//       const [studentRows] = await pool.execute(`
//         SELECT s.student_id
//         FROM students s
//         WHERE s.student_id = ? AND s.account_id = ?
//       `, [studentId, req.user.accountId]);

//       if (studentRows.length === 0) {
//         return res.status(403).json({ error: 'Access denied to this student record' });
//       }
//     } catch (error) {
//       console.error('Student access control error:', error);
//       return res.status(500).json({ error: 'Authorization check failed' });
//     }
//   }

//   next();
// };

// // ============================================================================
// // AUTHENTICATION ROUTES
// // ============================================================================

// app.post('/api/auth', [
//   body('email').isEmail().normalizeEmail(),
//   body('password').isLength({ min: 6 })
// ], validateInput, async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // // Admin auto-setup and login
//     if (email === 'admin@gmail.com' && password === 'admin123') {
//       const [existingAdmin] = await pool.execute(
//         'SELECT * FROM accounts WHERE username = ?',
//         ['admin']
//       );

//       let adminId;

//       if (existingAdmin.length === 0) {
//         const hash = await bcrypt.hash('admin123', 10);
//         const [insertResult] = await pool.execute(
//           `INSERT INTO accounts (username, password_hash, token, account_status)
//            VALUES (?, ?, '', 'active')`,
//           ['admin', hash]
//         );
//         adminId = insertResult.insertId;

//         await pool.execute(
//           `INSERT INTO account_roles (account_id, role_id, is_active)
//            VALUES (?, ?, TRUE)`,
//           [adminId, 1]
//         );
//       } else {
//         adminId = existingAdmin[0].account_id;
//       }

//       const [[existingTokenRow]] = await pool.execute(
//         `SELECT token FROM accounts WHERE account_id = ?`,
//         [adminId]
//       );

//       let token = existingTokenRow.token;
//       let shouldUpdate = true;

//       if (token) {
//         try {
//           jwt.verify(token, JWT_SECRET);
//           shouldUpdate = false;
//         } catch (err) {
//           shouldUpdate = true;
//         }
//       }

//       if (shouldUpdate) {
//         token = jwt.sign({
//           accountId: adminId,
//           username: 'admin',
//           role: 'admin'
//         }, JWT_SECRET, { expiresIn: '8h' });

//         await pool.execute(
//           `UPDATE accounts SET token = ? WHERE account_id = ?`,
//           [token, adminId]
//         );
//       }

//       return res.json({
//         token,
//         user: {
//           accountId: adminId,
//           username: 'admin',
//           role: 'admin',
//           firstName: 'System',
//           lastName: 'Administrator',
//           permissions: 'all',
//           profile: {}
//         }
//       });
//     }

//     const [userRows] = await pool.execute(`
//       SELECT
//         a.account_id, a.password_hash, a.account_status,
//         a.failed_login_attempts, a.locked_until,
//         ar.role_id, r.role_name, r.permissions,
//         p.first_name, p.last_name
//       FROM accounts a
//       JOIN account_roles ar ON a.account_id = ar.account_id
//       JOIN roles r ON ar.role_id = r.role_id
//       LEFT JOIN staff st ON a.account_id = st.account_id
//       LEFT JOIN students s ON a.account_id = s.account_id
//       LEFT JOIN persons p ON (st.person_id = p.person_id OR s.person_id = p.person_id)
//       WHERE p.email = ? AND ar.is_active = TRUE
//     `, [email]);

//     if (userRows.length === 0) {
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     const user = userRows[0];

//     if (user.locked_until && new Date() < new Date(user.locked_until)) {
//       return res.status(423).json({ error: 'Account is temporarily locked' });
//     }

//     if (user.account_status !== 'active') {
//       return res.status(401).json({ error: 'Account is not active' });
//     }

//     const isValidPassword = await bcrypt.compare(password, user.password_hash);
//     if (!isValidPassword) {
//       await pool.execute(`
//         UPDATE accounts
//         SET failed_login_attempts = failed_login_attempts + 1,
//             locked_until = CASE
//               WHEN failed_login_attempts >= 4 THEN DATE_ADD(NOW(), INTERVAL 15 MINUTE)
//               ELSE NULL
//             END
//         WHERE account_id = ?`,
//         [user.account_id]
//       );
//       return res.status(401).json({ error: 'Invalid credentials' });
//     }

//     // Reset login attempts
//     await pool.execute(`
//       UPDATE accounts
//       SET failed_login_attempts = 0, locked_until = NULL, last_login = NOW()
//       WHERE account_id = ?`,
//       [user.account_id]
//     );

//     // Get or generate token
//     const [[existingTokenRow]] = await pool.execute(
//       `SELECT token FROM accounts WHERE account_id = ?`,
//       [user.account_id]
//     );

//     let token = existingTokenRow.token;
//     let shouldUpdate = true;

//     if (token) {
//       try {
//         jwt.verify(token, JWT_SECRET);
//         shouldUpdate = false;
//       } catch (err) {
//         shouldUpdate = true;
//       }
//     }

//     if (shouldUpdate) {
//       token = jwt.sign({
//         accountId: user.account_id,
//         username: user.username,
//         role: user.role_name
//       }, JWT_SECRET, { expiresIn: '24h' });

//       await pool.execute(
//         `UPDATE accounts SET token = ? WHERE account_id = ?`,
//         [token, user.account_id]
//       );
//     }

//     let profileData = {};
//     if (user.role_name === 'student') {
//       const [studentData] = await pool.execute(`
//         SELECT student_id, graduation_status, academic_standing
//         FROM students WHERE account_id = ?`,
//         [user.account_id]
//       );
//       profileData = studentData[0] || {};
//     } else if (user.role_name === 'staff' || user.role_name === 'admin') {
//       const [staffData] = await pool.execute(`
//         SELECT staff_id, employee_id, employment_status
//         FROM staff WHERE account_id = ?`,
//         [user.account_id]
//       );
//       profileData = staffData[0] || {};
//     }

//     return res.json({
//       token,
//       user: {
//         accountId: user.account_id,
//         username: user.username,
//         role: user.role_name,
//         firstName: user.first_name,
//         lastName: user.last_name,
//         permissions: user.permissions,
//         profile: profileData
//       }
//     });

//   } catch (error) {
//     console.error('Auth error:', error);
//     res.status(500).json({ error: 'Authentication failed' });
//   }
// });

// // SIGNUP
// // POST /api/auth/signup endpoint
// app.post('/api/auth/signup', [
//   body('username').trim().isLength({ min: 3, max: 50 }).escape()
//     .withMessage('Username must be between 3 and 50 characters'),
//   body('password').isLength({ min: 6 })
//     .withMessage('Password must be at least 6 characters'),
//   body('email').isEmail().normalizeEmail()
//     .withMessage('Valid email is required'),
//   body('firstName').trim().isLength({ min: 1, max: 100 }).escape()
//     .withMessage('First name is required'),
//   body('lastName').trim().isLength({ min: 1, max: 100 }).escape()
//     .withMessage('Last name is required'),
//   body('role').optional().isIn(['student', 'staff'])
//     .withMessage('Role must be either student or staff'),
//   body('phoneNumber').optional().isMobilePhone()
//     .withMessage('Valid phone number required'),
//   body('dateOfBirth').optional().isISO8601()
//     .withMessage('Valid date of birth required (YYYY-MM-DD)'),
//   body('birthPlace').optional().trim().isLength({ min: 1, max: 500 })
//     .withMessage('City of birth'),
//   // Additional validations from register endpoint
//   body('address').optional().trim().isLength({ min: 1, max: 500 }),
//   body('city').optional().trim().isLength({ min: 1, max: 100 }),
//   body('province').optional().trim().isLength({ min: 1, max: 100 }),
//   body('gender').optional().isIn(['Male', 'Female', 'Other']),
//   body('education').optional().trim().isLength({ min: 1, max: 100 }),
//   body('tradingLevel').optional().trim().isLength({ min: 1, max: 50 }),
//   body('device').optional(),
//   body('learningStyle').optional()
// ], validateInput, async (req, res) => {
//   const connection = await pool.getConnection();

//   try {
//     await connection.beginTransaction();

//     const {
//       username,
//       password,
//       email,
//       firstName,
//       middleName = null,
//       lastName,
//       dateOfBirth = null,
//       birthDate = dateOfBirth, // Support both field names
//       birthPlace,
//       gender = null,
//       education = null,
//       phoneNumber = null,
//       role = 'student', // Default to student
//       // Additional fields from register endpoint
//       address = null,
//       city = null,
//       province = null,
//       tradingLevel = null,
//       device = null,
//       learningStyle = null
//     } = req.body;

//     // Check if username already exists
//     const [existingUser] = await connection.execute(
//       'SELECT account_id FROM accounts WHERE username = ?',
//       [username]
//     );

//     if (existingUser.length > 0) {
//       await connection.rollback();
//       return res.status(409).json({ error: 'Username already exists' });
//     }

//     // Check if email already exists
//     const [existingEmail] = await connection.execute(
//       'SELECT person_id FROM persons WHERE email = ?',
//       [email]
//     );

//     if (existingEmail.length > 0) {
//       await connection.rollback();
//       return res.status(409).json({ error: 'Email already exists' });
//     }

//     // Hash password
//     const saltRounds = 12;
//     const passwordHash = await bcrypt.hash(password, saltRounds);

//     // Insert into accounts table first
//     const [accountResult] = await connection.execute(`
//       INSERT INTO accounts (username, password_hash, account_status, created_at, updated_at)
//       VALUES (?, ?, 'active', NOW(), NOW())
//     `, [username, passwordHash]);

//     const accountId = accountResult.insertId;

//     // Get role_id for the specified role
//     const [roleData] = await connection.execute(
//       'SELECT role_id FROM roles WHERE role_name = ?',
//       [role]
//     );

//     if (roleData.length === 0) {
//       await connection.rollback();
//       return res.status(400).json({ error: 'Invalid role specified' });
//     }

//     const roleId = roleData[0].role_id;

//     // Insert into account_roles table
//     await connection.execute(`
//       INSERT INTO account_roles (account_id, role_id, is_active)
//       VALUES (?, ?, TRUE)
//     `, [accountId, roleId]);

//     // Insert into persons table
//     const [personResult] = await connection.execute(`
//       INSERT INTO persons (
//         first_name, middle_name, last_name, birth_date, birth_place, gender, email, education, created_at, updated_at
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
//     `, [firstName, middleName, lastName, birthDate, birthPlace, gender, email, education]);

//     const personId = personResult.insertId;

//     let studentId = null;
//     let employeeId = null;

//     // Insert into role-specific table
//       // Insert into role-specific table
// if (role === 'student') {
//   // Generate unique student ID (from register endpoint logic)
//   studentId = `S${Date.now()}_${personId}`;

//   console.log('Inserting student with ID:', studentId, 'Account ID:', accountId, 'Person ID:', personId);

//   const [studentResult] = await connection.execute(`
//     INSERT INTO students (student_id, account_id, person_id, graduation_status, academic_standing, registration_date)
//     VALUES (?, ?, ?, 'enrolled', 'good', CURRENT_DATE)
//   `, [studentId, accountId, personId]);

//   console.log('Student insert result:', studentResult);

//   // Insert contact information if provided
//   if (phoneNumber || address || city || province || email) {
//     const contactInserts = [];
//     const contactValues = [];

//     if (phoneNumber) {
//       contactInserts.push('(?, ?, \'phone\', ?, TRUE)');
//       contactValues.push(personId, studentId, phoneNumber);
//     }

//     if (address && city && province) {
//       const fullAddress = `${address}, ${city}, ${province}`;
//       contactInserts.push('(?, ?, \'address\', ?, TRUE)');
//       contactValues.push(personId, studentId, fullAddress);
//     }

//     // Always add email contact
//     contactInserts.push('(?, ?, \'email\', ?, TRUE)');
//     contactValues.push(personId, studentId, email);

//     if (contactInserts.length > 0) {
//       console.log('Inserting contact info:', contactInserts.join(', '));
//       await connection.execute(`
//         INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary)
//         VALUES ${contactInserts.join(', ')}
//       `, contactValues);
//     }
//   } else {
//     // Always add email contact even if no other contact info
//     console.log('Adding email contact for student:', studentId);
//     await connection.execute(`
//       INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary)
//       VALUES (?, ?, 'email', ?, TRUE)
//     `, [personId, studentId, email]);
//   }

//   // Insert trading level if provided
//   if (tradingLevel) {
//     console.log('Looking for trading level:', tradingLevel);
//     const [levelRows] = await connection.execute(`
//       SELECT level_id FROM trading_levels WHERE level_name = ?
//     `, [tradingLevel]);

//     console.log('Found trading levels:', levelRows);

//     if (levelRows.length > 0) {
//       const levelId = levelRows[0].level_id;
//       await connection.execute(`
//         INSERT INTO student_trading_levels (student_id, level_id, is_current)
//         VALUES (?, ?, TRUE)
//       `, [studentId, levelId]);
//     }
//   }

//   // Insert learning preferences if provided
//   if (device || learningStyle) {
//     console.log('Adding learning preferences - Device:', device, 'Style:', learningStyle);
//     const deviceArray = Array.isArray(device) ? device : (device ? [device] : []);
//     const learningStyleArray = Array.isArray(learningStyle) ? learningStyle : (learningStyle ? [learningStyle] : []);

//     await connection.execute(`
//       INSERT INTO learning_preferences (student_id, device_type, learning_style)
//       VALUES (?, ?, ?)
//     `, [studentId, deviceArray.join(','), learningStyleArray.join(',')]);
//   }

// } else if (role === 'staff') {
//   // Generate employee ID
//   employeeId = `EMP${Date.now()}`;

//   console.log('Inserting staff with employee ID:', employeeId);

//   await connection.execute(`
//     INSERT INTO staff (account_id, person_id, employee_id, employment_status, hire_date)
//     VALUES (?, ?, ?, 'active', NOW())
//   `, [accountId, personId, employeeId]);

//   // Insert contact information for staff if provided
//   if (phoneNumber) {
//     await connection.execute(`
//       INSERT INTO contact_info (person_id, contact_type, contact_value, is_primary)
//       VALUES (?, 'phone', ?, TRUE)
//     `, [personId, phoneNumber]);
//   }

//   // Always add email contact for staff
//   await connection.execute(`
//     INSERT INTO contact_info (person_id, contact_type, contact_value, is_primary)
//     VALUES (?, 'email', ?, TRUE)
//   `, [personId, email]);

//     } else if (role === 'staff') {
//       // Generate employee ID
//       employeeId = `EMP${Date.now()}`;

//       await connection.execute(`
//         INSERT INTO staff (account_id, person_id, employee_id, employment_status, hire_date)
//         VALUES (?, ?, ?, 'active', NOW())
//       `, [accountId, personId, employeeId]);

//       // Insert contact information for staff if provided
//       if (phoneNumber) {
//         await connection.execute(`
//           INSERT INTO contact_info (person_id, contact_type, contact_value, is_primary)
//           VALUES (?, 'phone', ?, TRUE)
//         `, [personId, phoneNumber]);
//       }
//     }

//     // Generate JWT token
//     const token = jwt.sign({
//       accountId: accountId,
//       username: username,
//       role: role
//     }, JWT_SECRET, { expiresIn: '24h' });

//     // Update account with token
//     await connection.execute(
//       'UPDATE accounts SET token = ? WHERE account_id = ?',
//       [token, accountId]
//     );

//     await connection.commit();

//     // Prepare response
//     let profileData = {};
//     if (role === 'student') {
//       profileData = {
//         student_id: studentId,
//         graduation_status: 'enrolled',
//         academic_standing: 'good',
//         trading_level: tradingLevel || null,
//         learning_preferences: {
//           device: device || null,
//           learning_style: learningStyle || null
//         }
//       };
//     } else if (role === 'staff') {
//       profileData = {
//         employee_id: employeeId,
//         employment_status: 'active'
//       };
//     }

//     // Get role permissions
//     const [rolePermissions] = await connection.execute(
//       'SELECT permissions FROM roles WHERE role_id = ?',
//       [roleId]
//     );

//     const permissions = rolePermissions[0]?.permissions || '';

//     res.status(201).json({
//       message: 'Account created successfully',
//       token,
//       user: {
//         accountId: accountId,
//         username: username,
//         role: role,
//         firstName: firstName,
//         middleName: middleName,
//         lastName: lastName,
//         email: email,
//         phoneNumber: phoneNumber,
//         dateOfBirth: birthDate,
//         gender: gender,
//         education: education,
//         address: address && city && province ? `${address}, ${city}, ${province}` : null,
//         permissions: permissions,
//         profile: profileData
//       }
//     });

//   } catch (error) {
//     await connection.rollback();
//     console.error('Signup error:', error);

//     // Handle specific database errors
//     if (error.code === 'ER_DUP_ENTRY') {
//       return res.status(409).json({ error: 'Username or email already exists' });
//     }

//     res.status(500).json({ error: 'Account creation failed' });
//   } finally {
//     connection.release();
//   }
// });

// app.post('/api/auth/login', [
//   body('token').notEmpty().isString()
// ], validateInput, async (req, res) => {
//   try {
//     const { token } = req.body;

//     if (!token) return res.status(400).json({ error: 'Token required' });

//     const payload = jwt.verify(token, JWT_SECRET);

//     const [rows] = await pool.execute(`
//       SELECT
//         a.*,
//         ar.role_id,
//         r.role_name,
//         r.permissions,
//         p.person_id, p.first_name, p.middle_name, p.last_name, p.gender, p.birth_date, p.birth_place, p.email, p.education, p.created_at AS person_created_at, p.updated_at AS person_updated_at,
//         st.staff_id, st.employee_id, st.employment_status, st.hire_date,
//         s.student_id, s.graduation_status, s.academic_standing, s.registration_date
//       FROM accounts a
//       JOIN account_roles ar ON a.account_id = ar.account_id AND ar.is_active = TRUE
//       JOIN roles r ON ar.role_id = r.role_id
//       LEFT JOIN staff st ON a.account_id = st.account_id
//       LEFT JOIN students s ON a.account_id = s.account_id
//       LEFT JOIN persons p ON (st.person_id = p.person_id OR s.person_id = p.person_id)
//       WHERE a.account_id = ? AND a.token = ?
//     `, [payload.accountId, token]);

//     if (rows.length === 0) {
//       return res.status(401).json({ error: 'Invalid or expired token' });
//     }

//     const user = rows[0];

//     // Fetch contact information
//     let contactInfo = [];
//     if (user.person_id) {
//       const [contactRows] = await pool.execute(`
//         SELECT contact_type, contact_value, is_primary
//         FROM contact_info
//         WHERE person_id = ?
//         ORDER BY is_primary DESC, contact_type
//       `, [user.person_id]);
//       contactInfo = contactRows;
//     }

//     // Fetch additional data based on role
//     let additionalData = {};

//     if (user.role_name === 'student' && user.student_id) {
//       // Fetch trading levels
//       const [tradingLevels] = await pool.execute(`
//         SELECT
//           tl.level_name,
//           tl.level_description,
//           stl.is_current,
//           stl.assigned_date
//         FROM student_trading_levels stl
//         JOIN trading_levels tl ON stl.level_id = tl.level_id
//         WHERE stl.student_id = ?
//         ORDER BY stl.assigned_date DESC
//       `, [user.student_id]);

//       // Fetch learning preferences
//       const [learningPrefs] = await pool.execute(`
//         SELECT device_type, learning_style, created_at
//         FROM learning_preferences
//         WHERE student_id = ?
//       `, [user.student_id]);

//       additionalData = {
//         trading_levels: tradingLevels,
//         learning_preferences: learningPrefs,
//       };
//     }

//     // Build response user object
//     const responseUser = {
//       account: {
//         account_id: user.account_id,
//         username: user.username,
//         account_status: user.account_status,
//         last_login: user.last_login,
//         failed_login_attempts: user.failed_login_attempts,
//         locked_until: user.locked_until,
//         created_at: user.created_at,
//         updated_at: user.updated_at
//       },
//       role: {
//         role_id: user.role_id,
//         role_name: user.role_name,
//         permissions: user.permissions
//       },
//       person: {
//         person_id: user.person_id,
//         first_name: user.first_name,
//         middle_name: user.middle_name,
//         last_name: user.last_name,
//         full_name: `${user.first_name} ${user.middle_name ? user.middle_name + ' ' : ''}${user.last_name}`.trim(),
//         gender: user.gender,
//         birth_date: user.birth_date,
//         birth_place: user.birth_place,
//         email: user.email,
//         education: user.education,
//         created_at: user.person_created_at,
//         updated_at: user.person_updated_at
//       },
//       contact_info: contactInfo,
//       profile: {},
//       additional_data: additionalData
//     };

//     // Set role-specific profile data
//     if (user.role_name === 'student') {
//       responseUser.profile = {
//         student_id: user.student_id,
//         graduation_status: user.graduation_status,
//         academic_standing: user.academic_standing,
//         registration_date: user.registration_date,
//         current_trading_level: additionalData.trading_levels?.find(tl => tl.is_current)?.level_name || null,
//         total_enrollments: additionalData.enrollments?.length || 0,
//         active_enrollments: additionalData.enrollments?.filter(e => e.status === 'active').length || 0,
//         completed_courses: additionalData.enrollments?.filter(e => e.status === 'completed').length || 0
//       };
//     } else if (user.role_name === 'staff' || user.role_name === 'admin') {
//       responseUser.profile = {
//         staff_id: user.staff_id,
//         employee_id: user.employee_id,
//         employment_status: user.employment_status,
//         hire_date: user.hire_date
//       };
//     }

//     // Update last login time
//     await pool.execute(`
//       UPDATE accounts
//       SET last_login = NOW()
//       WHERE account_id = ?
//     `, [user.account_id]);

//     return res.status(200).json({
//       success: true,
//       token,
//       user: responseUser
//     });

//   } catch (err) {
//     console.error('Login token validation error:', err);
//     return res.status(401).json({ error: 'Invalid token' });
//   }
// });

// app.post('/api/auth/logout', authenticateToken, async (req, res) => {
//   try {
//     const accountId = req.user.accountId;

//     // Remove token from DB
//     await pool.execute(`UPDATE accounts SET token = NULL WHERE account_id = ?`, [accountId]);

//     res.json({ message: 'Logged out successfully' });
//   } catch (error) {
//     console.error('Logout error:', error);
//     res.status(500).json({ error: 'Logout failed' });
//   }
// });

// // ============================================================================
// // STUDENT ROUTES (Fixed for proper schema)
// // ============================================================================

// app.get('/api/students', authenticateToken, authorize(['admin', 'staff']), async (req, res) => {
//   try {
//     const { name_sort, graduation_status, trading_level, search } = req.query;

//     let query = `
//       SELECT s.student_id, s.graduation_status, s.academic_standing, s.gpa, s.registration_date,
//              p.first_name, p.last_name, p.birth_date, p.birth_place, p.gender,
//              tl.level_name as current_trading_level,
//              COUNT(DISTINCT se.enrollment_id) as total_enrollments
//       FROM students s
//       JOIN persons p ON s.person_id = p.person_id
//       LEFT JOIN student_trading_levels stl ON s.student_id = stl.student_id AND stl.is_current = TRUE
//       LEFT JOIN trading_levels tl ON stl.level_id = tl.level_id
//       LEFT JOIN student_enrollments se ON s.student_id = se.student_id
//       WHERE 1=1
//     `;
//     const params = [];

//     if (graduation_status) {
//       query += ' AND s.graduation_status = ?';
//       params.push(graduation_status);
//     }

//     if (trading_level) {
//       query += ' AND tl.level_name = ?';
//       params.push(trading_level);
//     }

//     if (search) {
//       query += ' AND (p.first_name LIKE ? OR p.last_name LIKE ? OR s.student_id LIKE ?)';
//       const searchParam = `%${search}%`;
//       params.push(searchParam, searchParam, searchParam);
//     }

//     query += ' GROUP BY s.student_id, p.first_name, p.last_name, p.birth_date, p.birth_place, p.gender, s.graduation_status, s.academic_standing, s.gpa, s.registration_date, tl.level_name';

//     if (name_sort) {
//       query += ` ORDER BY p.first_name ${name_sort === 'ascending' ? 'ASC' : 'DESC'}`;
//     } else {
//       query += ' ORDER BY s.registration_date DESC';
//     }

//     const [students] = await pool.execute(query, params);
//     res.json(students);
//   } catch (error) {
//     console.error('Students fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch students' });
//   }
// });

// app.post('/api/students', [
//   authenticateToken,
//   authorize(['admin', 'staff']),
//   body('first_name').trim().isLength({ min: 1, max: 50 }).escape(),
//   body('last_name').trim().isLength({ min: 1, max: 50 }).escape(),
//   body('birth_date').isISO8601(),
//   body('birth_place').trim().isLength({ min: 1, max: 100 }).escape(),
//   body('gender').isIn(['Male', 'Female', 'Other']),
//   body('email').isEmail().normalizeEmail(),
//   body('education').trim().isLength({ min: 1, max: 100 }).escape()
// ], validateInput, async (req, res) => {
//   const connection = await pool.getConnection();

//   try {
//     await connection.beginTransaction();

//     const {
//       first_name, middle_name, last_name, birth_date, birth_place, gender,
//       email, education, phone, address, username, password, trading_level_id
//     } = req.body;

//     // Insert into persons table
//     const [personResult] = await connection.execute(`
//       INSERT INTO persons (first_name, middle_name, last_name, birth_date, birth_place, gender, email, education)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `, [first_name, middle_name || null, last_name, birth_date, birth_place, gender, email, education]);

//     const person_id = personResult.insertId;

//     let account_id = null;
//     if (username && password) {
//       const saltRounds = 12;
//       const hashedPassword = await bcrypt.hash(password, saltRounds);

//       const [accountResult] = await connection.execute(`
//         INSERT INTO accounts (username, password_hash, token, account_status)
//         VALUES (?, ?, '', 'active')
//       `, [username, hashedPassword]);

//       account_id = accountResult.insertId;

//       // Assign student role
//       await connection.execute(`
//         INSERT INTO account_roles (account_id, role_id, is_active)
//         VALUES (?, (SELECT role_id FROM roles WHERE role_name = 'student'), TRUE)
//       `, [account_id]);
//     }

//     // Generate unique student ID
//     const student_id = `S${Date.now()}`;

//     // Insert into students table
//     await connection.execute(`
//       INSERT INTO students (student_id, person_id, account_id, registration_date)
//       VALUES (?, ?, ?, CURRENT_DATE)
//     `, [student_id, person_id, account_id]);

//     // Insert contact information
//     if (phone) {
//       await connection.execute(`
//         INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary)
//         VALUES (?, ?, 'phone', ?, TRUE)
//       `, [person_id, student_id, phone]);
//     }

//     if (address) {
//       await connection.execute(`
//         INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary)
//         VALUES (?, ?, 'address', ?, TRUE)
//       `, [person_id, student_id, address]);
//     }

//     // Add email to contact_info as well
//     await connection.execute(`
//       INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary)
//       VALUES (?, ?, 'email', ?, TRUE)
//     `, [person_id, student_id, email]);

//     // Assign trading level if provided
//     if (trading_level_id) {
//       const [staffRows] = await connection.execute(`
//         SELECT staff_id FROM staff WHERE account_id = ?
//       `, [req.user.accountId]);

//       const assigned_by = staffRows[0]?.staff_id || null;

//       await connection.execute(`
//         INSERT INTO student_trading_levels (student_id, level_id, assigned_by, is_current)
//         VALUES (?, ?, ?, TRUE)
//       `, [student_id, trading_level_id, assigned_by]);
//     }

//     await connection.commit();
//     res.status(201).json({
//       student_id,
//       person_id,
//       account_id,
//       message: 'Student created successfully'
//     });

//   } catch (error) {
//     await connection.rollback();
//     console.error('Student creation error:', error);

//     if (error.code === 'ER_DUP_ENTRY') {
//       res.status(409).json({ error: 'Username already exists' });
//     } else {
//       res.status(500).json({ error: 'Failed to create student' });
//     }
//   } finally {
//     connection.release();
//   }
// });

// app.get('/api/students/:studentId', authenticateToken, authorize(['admin', 'staff', 'student']), authorizeStudentAccess, async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const [students] = await pool.execute(`
//       SELECT s.student_id, s.graduation_status, s.academic_standing, s.gpa, s.registration_date,
//              p.person_id, p.first_name, p.middle_name, p.last_name, p.birth_date, p.birth_place, p.gender, p.email, p.education,
//              tl.level_name as current_trading_level, tl.level_id,
//              a.account_status
//       FROM students s
//       JOIN persons p ON s.person_id = p.person_id
//       LEFT JOIN accounts a ON s.account_id = a.account_id
//       LEFT JOIN student_trading_levels stl ON s.student_id = stl.student_id AND stl.is_current = TRUE
//       LEFT JOIN trading_levels tl ON stl.level_id = tl.level_id
//       WHERE s.student_id = ?
//     `, [studentId]);

//     if (students.length === 0) {
//       return res.status(404).json({ error: 'Student not found' });
//     }

//     const [contacts] = await pool.execute(`
//       SELECT contact_type, contact_value, is_primary
//       FROM contact_info
//       WHERE student_id = ?
//     `, [studentId]);

//     res.json({
//       ...students[0],
//       contacts
//     });

//   } catch (error) {
//     console.error('Student fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch student details' });
//   }
// });

// // ============================================================================
// // DASHBOARD ROUTES (Fixed)
// // ============================================================================

// app.get('/api/dashboard/metrics', authenticateToken, authorize(['admin', 'staff']), async (req, res) => {
//   try {
//     const [enrolledCount] = await pool.execute(
//       `SELECT COUNT(*) as count FROM students WHERE graduation_status = 'enrolled'`
//     );

//     const [graduatedCount] = await pool.execute(
//       `SELECT COUNT(*) as count FROM students WHERE graduation_status = 'graduated'`
//     );

//     const [pendingPayments] = await pool.execute(
//       `SELECT COUNT(*) as count FROM payments WHERE payment_status = 'pending'`
//     );

//     const [totalRevenue] = await pool.execute(
//       `SELECT SUM(payment_amount) as total FROM payments WHERE payment_status = 'confirmed'`
//     );

//     const [monthlyEnrollments] = await pool.execute(`
//       SELECT MONTH(registration_date) as month, COUNT(*) as count
//       FROM students
//       WHERE YEAR(registration_date) = YEAR(CURDATE())
//       GROUP BY MONTH(registration_date)
//       ORDER BY month
//     `);

//     const [competencyBreakdown] = await pool.execute(`
//       SELECT tl.level_name, COUNT(*) as count
//       FROM students s
//       LEFT JOIN student_trading_levels stl ON s.student_id = stl.student_id AND stl.is_current = TRUE
//       LEFT JOIN trading_levels tl ON stl.level_id = tl.level_id
//       GROUP BY tl.level_name
//     `);

//     res.json({
//       enrolled_students: enrolledCount[0].count,
//       graduated_students: graduatedCount[0].count,
//       pending_payments: pendingPayments[0].count,
//       total_revenue: totalRevenue[0].total || 0,
//       monthly_enrollments: monthlyEnrollments,
//       competency_breakdown: competencyBreakdown
//     });
//   } catch (error) {
//     console.error('Dashboard metrics error:', error);
//     res.status(500).json({ error: 'Failed to fetch dashboard metrics' });
//   }
// });

// app.get('/api/dashboard/student/:studentId', authenticateToken, authorize(['student', 'admin', 'staff']), authorizeStudentAccess, async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const [studentInfo] = await pool.execute(`
//       SELECT s.student_id, s.graduation_status, s.academic_standing, s.gpa,
//              p.first_name, p.last_name, p.birth_date,
//              tl.level_name as current_trading_level
//       FROM students s
//       JOIN persons p ON s.person_id = p.person_id
//       LEFT JOIN student_trading_levels stl ON s.student_id = stl.student_id AND stl.is_current = TRUE
//       LEFT JOIN trading_levels tl ON stl.level_id = tl.level_id
//       WHERE s.student_id = ?
//     `, [studentId]);

//     const [enrollments] = await pool.execute(`
//       SELECT se.enrollment_id, se.enrollment_status, se.completion_percentage,
//              c.course_name, co.batch_identifier, co.start_date, co.end_date
//       FROM student_enrollments se
//       JOIN course_offerings co ON se.offering_id = co.offering_id
//       JOIN courses c ON co.course_id = c.course_id
//       WHERE se.student_id = ?
//       ORDER BY co.start_date DESC
//     `, [studentId]);

//     const [financialSummary] = await pool.execute(`
//       SELECT
//         COALESCE(SUM(sa.total_due), 0) as total_due,
//         COALESCE(SUM(sa.amount_paid), 0) as amount_paid,
//         COALESCE(SUM(sa.balance), 0) as balance
//       FROM student_accounts sa
//       WHERE sa.student_id = ?
//     `, [studentId]);

//     const [recentProgress] = await pool.execute(`
//       SELECT sp.score, sp.max_score, sp.percentage_score, sp.passed, sp.attempt_date,
//              comp.competency_name, ct.type_name as competency_type
//       FROM student_progress sp
//       JOIN student_enrollments se ON sp.enrollment_id = se.enrollment_id
//       JOIN competencies comp ON sp.competency_id = comp.competency_id
//       JOIN competency_types ct ON comp.competency_type_id = ct.competency_type_id
//       WHERE se.student_id = ?
//       ORDER BY sp.attempt_date DESC
//       LIMIT 5
//     `, [studentId]);

//     res.json({
//       student: studentInfo[0] || {},
//       enrollments,
//       financial: financialSummary[0] || { total_due: 0, amount_paid: 0, balance: 0 },
//       recent_progress: recentProgress
//     });

//   } catch (error) {
//     console.error('Student dashboard error:', error);
//     res.status(500).json({ error: 'Failed to fetch student dashboard' });
//   }
// });

// // ============================================================================
// // PAYMENT ROUTES (Fixed)
// // ============================================================================

// app.get('/api/payments', authenticateToken, authorize(['admin', 'staff']), async (req, res) => {
//   try {
//     const { name_sort, status, student_search } = req.query;

//     let query = `
//       SELECT p.payment_id, p.payment_amount, p.processing_fee, p.payment_date, p.payment_status,
//              p.reference_number, pm.method_name,
//              sa.total_due, sa.balance,
//              s.student_id, per.first_name, per.last_name,
//              c.course_name, co.batch_identifier
//       FROM payments p
//       JOIN payment_methods pm ON p.method_id = pm.method_id
//       JOIN student_accounts sa ON p.account_id = sa.account_id
//       JOIN students s ON sa.student_id = s.student_id
//       JOIN persons per ON s.person_id = per.person_id
//       JOIN course_offerings co ON sa.offering_id = co.offering_id
//       JOIN courses c ON co.course_id = c.course_id
//       WHERE 1=1
//     `;
//     const params = [];

//     if (status) {
//       query += ' AND p.payment_status = ?';
//       params.push(status);
//     }

//     if (student_search) {
//       query += ' AND (per.first_name LIKE ? OR per.last_name LIKE ? OR s.student_id LIKE ?)';
//       const searchParam = `%${student_search}%`;
//       params.push(searchParam, searchParam, searchParam);
//     }

//     if (name_sort) {
//       query += ` ORDER BY per.first_name ${name_sort === 'ascending' ? 'ASC' : 'DESC'}`;
//     } else {
//       query += ' ORDER BY p.payment_date DESC';
//     }

//     const [payments] = await pool.execute(query, params);
//     res.json(payments);
//   } catch (error) {
//     console.error('Payments fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch payments' });
//   }
// });

// app.post('/api/payments', [
//   authenticateToken,
//   authorize(['admin', 'staff']),
//   body('account_id').isInt(),
//   body('method_id').isInt(),
//   body('payment_amount').isFloat({ min: 0.01 }),
//   body('reference_number').optional().trim().isLength({ max: 50 })
// ], validateInput, async (req, res) => {
//   try {
//     const { account_id, method_id, payment_amount, reference_number, notes } = req.body;

//     // Get staff_id for processed_by
//     const [staffRows] = await pool.execute(
//       'SELECT staff_id FROM staff WHERE account_id = ?',
//       [req.user.accountId]
//     );
//     const staffId = staffRows[0]?.staff_id;

//     const [result] = await pool.execute(`
//       CALL sp_process_payment(?, ?, ?, ?, ?, @result);
//       SELECT @result as result;
//     `, [account_id, method_id, payment_amount, reference_number || null, staffId]);

//     const processingResult = result[1][0].result;

//     if (processingResult.startsWith('SUCCESS')) {
//       res.status(201).json({ message: processingResult });
//     } else {
//       res.status(400).json({ error: processingResult });
//     }

//   } catch (error) {
//     console.error('Payment creation error:', error);
//     res.status(500).json({ error: 'Failed to process payment' });
//   }
// });

// app.get('/api/students/:studentId/payments', authenticateToken, authorize(['admin', 'staff', 'student']), authorizeStudentAccess, async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const [payments] = await pool.execute(`
//       SELECT p.payment_id, p.payment_amount, p.processing_fee, p.payment_date, p.payment_status,
//              p.reference_number, pm.method_name,
//              sa.total_due, sa.balance,
//              c.course_name, co.batch_identifier
//       FROM payments p
//       JOIN payment_methods pm ON p.method_id = pm.method_id
//       JOIN student_accounts sa ON p.account_id = sa.account_id
//       JOIN course_offerings co ON sa.offering_id = co.offering_id
//       JOIN courses c ON co.course_id = c.course_id
//       WHERE sa.student_id = ?
//       ORDER BY p.payment_date DESC
//     `, [studentId]);

//     res.json(payments);
//   } catch (error) {
//     console.error('Student payments fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch student payments' });
//   }
// });

// // ============================================================================
// // DOCUMENT ROUTES (Fixed)
// // ============================================================================

// app.get('/api/documents', authenticateToken, authorize(['admin', 'staff']), async (req, res) => {
//   try {
//     const { verification_status, student_search } = req.query;

//     let query = `
//       SELECT sd.document_id, sd.original_filename, sd.upload_date, sd.verification_status,
//              sd.verified_date, sd.is_current,
//              dt.type_name as document_type, dt.is_required,
//              s.student_id, per.first_name, per.last_name,
//              staff_per.first_name as verified_by_first_name, staff_per.last_name as verified_by_last_name
//       FROM student_documents sd
//       JOIN document_types dt ON sd.document_type_id = dt.document_type_id
//       JOIN students s ON sd.student_id = s.student_id
//       JOIN persons per ON s.person_id = per.person_id
//       LEFT JOIN staff st ON sd.verified_by = st.staff_id
//       LEFT JOIN persons staff_per ON st.person_id = staff_per.person_id
//       WHERE sd.is_current = TRUE
//     `;
//     const params = [];

//     if (verification_status) {
//       query += ' AND sd.verification_status = ?';
//       params.push(verification_status);
//     }

//     if (student_search) {
//       query += ' AND (per.first_name LIKE ? OR per.last_name LIKE ? OR s.student_id LIKE ?)';
//       const searchParam = `%${student_search}%`;
//       params.push(searchParam, searchParam, searchParam);
//     }

//     query += ' ORDER BY sd.upload_date DESC';

//     const [documents] = await pool.execute(query, params);
//     res.json(documents);
//   } catch (error) {
//     console.error('Documents fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch documents' });
//   }
// });

// app.post('/api/documents/upload', [
//   authenticateToken,
//   authorize(['admin', 'staff', 'student']),
//   upload.single('document')
// ], async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     const { student_id, document_type_id } = req.body;

//     if (req.user.role === 'student') {
//       const [studentRows] = await pool.execute(
//         'SELECT student_id FROM students WHERE student_id = ? AND account_id = ?',
//         [student_id, req.user.accountId]
//       );

//       if (studentRows.length === 0) {
//         fs.unlinkSync(req.file.path);
//         return res.status(403).json({ error: 'Access denied to this student record' });
//       }
//     }

//     const fileBuffer = fs.readFileSync(req.file.path);
//     const fileHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

//     // Mark previous documents as not current
//     await pool.execute(`
//       UPDATE student_documents
//       SET is_current = FALSE
//       WHERE student_id = ? AND document_type_id = ?
//     `, [student_id, document_type_id]);

//     let uploadedBy = null;
//     if (req.user.role !== 'student') {
//       const [staffRows] = await pool.execute(
//         'SELECT staff_id FROM staff WHERE account_id = ?',
//         [req.user.accountId]
//       );
//       uploadedBy = staffRows[0]?.staff_id || null;
//     }

//     await pool.execute(`
//       INSERT INTO student_documents (
//         student_id, document_type_id, original_filename, stored_filename,
//         file_path, file_size_bytes, mime_type, file_hash, uploaded_by
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `, [
//       student_id, document_type_id, req.file.originalname, req.file.filename,
//       req.file.path, req.file.size, req.file.mimetype, fileHash, uploadedBy
//     ]);

//     res.status(201).json({ message: 'Document uploaded successfully' });
//   } catch (error) {
//     console.error('Document upload error:', error);
//     if (req.file) {
//       fs.unlinkSync(req.file.path);
//     }
//     res.status(500).json({ error: 'Failed to upload document' });
//   }
// });

// app.put('/api/documents/:documentId/verify', [
//   authenticateToken,
//   authorize(['admin', 'staff']),
//   body('verification_status').isIn(['verified', 'rejected', 'requires_update']),
//   body('verification_notes').optional().trim().isLength({ max: 1000 })
// ], validateInput, async (req, res) => {
//   try {
//     const { documentId } = req.params;
//     const { verification_status, verification_notes } = req.body;

//     const [staffRows] = await pool.execute(
//       'SELECT staff_id FROM staff WHERE account_id = ?',
//       [req.user.accountId]
//     );

//     const staffId = staffRows[0]?.staff_id;

//     await pool.execute(`
//       UPDATE student_documents
//       SET verification_status = ?, verified_by = ?, verified_date = NOW(), verification_notes = ?
//       WHERE document_id = ?
//     `, [verification_status, staffId, verification_notes || null, documentId]);

//     res.json({ message: 'Document verification status updated successfully' });
//   } catch (error) {
//     console.error('Document verification error:', error);
//     res.status(500).json({ error: 'Failed to update document verification' });
//   }
// });

// app.get('/api/students/:studentId/documents', authenticateToken, authorize(['admin', 'staff', 'student']), authorizeStudentAccess, async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const [documents] = await pool.execute(`
//       SELECT sd.document_id, sd.original_filename, sd.upload_date, sd.verification_status,
//              sd.verified_date, sd.verification_notes,
//              dt.type_name as document_type, dt.is_required, dt.category
//       FROM student_documents sd
//       JOIN document_types dt ON sd.document_type_id = dt.document_type_id
//       WHERE sd.student_id = ? AND sd.is_current = TRUE
//       ORDER BY dt.is_required DESC, sd.upload_date DESC
//     `, [studentId]);

//     res.json(documents);
//   } catch (error) {
//     console.error('Student documents fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch student documents' });
//   }
// });

// // ============================================================================
// // COMPETENCY AND PROGRESS ROUTES (Fixed)
// // ============================================================================

// app.get('/api/competency-assessments', authenticateToken, authorize(['admin', 'staff']), async (req, res) => {
//   try {
//     const { competency_type, student_search, passed } = req.query;

//     let query = `
//       SELECT sp.progress_id, sp.score, sp.max_score, sp.percentage_score, sp.passed,
//              sp.attempt_number, sp.attempt_date, sp.feedback,
//              comp.competency_name, ct.type_name as competency_type,
//              s.student_id, per.first_name, per.last_name,
//              c.course_name, co.batch_identifier,
//              staff_per.first_name as assessed_by_first_name, staff_per.last_name as assessed_by_last_name
//       FROM student_progress sp
//       JOIN student_enrollments se ON sp.enrollment_id = se.enrollment_id
//       JOIN students s ON se.student_id = s.student_id
//       JOIN persons per ON s.person_id = per.person_id
//       JOIN course_offerings co ON se.offering_id = co.offering_id
//       JOIN courses c ON co.course_id = c.course_id
//       JOIN competencies comp ON sp.competency_id = comp.competency_id
//       JOIN competency_types ct ON comp.competency_type_id = ct.competency_type_id
//       LEFT JOIN staff st ON sp.assessed_by = st.staff_id
//       LEFT JOIN persons staff_per ON st.person_id = staff_per.person_id
//       WHERE 1=1
//     `;
//     const params = [];

//     if (competency_type) {
//       query += ' AND ct.type_name = ?';
//       params.push(competency_type);
//     }

//     if (passed !== undefined) {
//       query += ' AND sp.passed = ?';
//       params.push(passed === 'true');
//     }

//     if (student_search) {
//       query += ' AND (per.first_name LIKE ? OR per.last_name LIKE ? OR s.student_id LIKE ?)';
//       const searchParam = `%${student_search}%`;
//       params.push(searchParam, searchParam, searchParam);
//     }

//     query += ' ORDER BY sp.attempt_date DESC';

//     const [assessments] = await pool.execute(query, params);
//     res.json(assessments);
//   } catch (error) {
//     console.error('Competency assessments fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch competency assessments' });
//   }
// });

// app.post('/api/competency-assessments', [
//   authenticateToken,
//   authorize(['admin', 'staff']),
//   body('enrollment_id').isInt(),
//   body('competency_id').isInt(),
//   body('score').isFloat({ min: 0 }),
//   body('max_score').isFloat({ min: 0.01 }),
//   body('feedback').optional().trim().isLength({ max: 1000 })
// ], validateInput, async (req, res) => {
//   try {
//     const { enrollment_id, competency_id, score, max_score, feedback } = req.body;

//     const [attemptRows] = await pool.execute(`
//       SELECT COALESCE(MAX(attempt_number), 0) + 1 as next_attempt
//       FROM student_progress
//       WHERE enrollment_id = ? AND competency_id = ?
//     `, [enrollment_id, competency_id]);

//     const attempt_number = attemptRows[0].next_attempt;

//     const [staffRows] = await pool.execute(
//       'SELECT staff_id FROM staff WHERE account_id = ?',
//       [req.user.accountId]
//     );

//     const staffId = staffRows[0]?.staff_id;

//     await pool.execute(`
//       INSERT INTO student_progress (enrollment_id, competency_id, attempt_number, score, max_score, assessed_by, feedback)
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//     `, [enrollment_id, competency_id, attempt_number, score, max_score, staffId, feedback || null]);

//     res.status(201).json({ message: 'Assessment recorded successfully' });
//   } catch (error) {
//     console.error('Assessment creation error:', error);
//     res.status(500).json({ error: 'Failed to record assessment' });
//   }
// });

// app.get('/api/students/:studentId/progress', authenticateToken, authorize(['admin', 'staff', 'student']), authorizeStudentAccess, async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const [progress] = await pool.execute(`
//       SELECT sp.progress_id, sp.score, sp.max_score, sp.percentage_score, sp.passed,
//              sp.attempt_number, sp.attempt_date, sp.feedback,
//              comp.competency_name, comp.competency_description,
//              ct.type_name as competency_type, ct.passing_score,
//              c.course_name, co.batch_identifier
//       FROM student_progress sp
//       JOIN student_enrollments se ON sp.enrollment_id = se.enrollment_id
//       JOIN course_offerings co ON se.offering_id = co.offering_id
//       JOIN courses c ON co.course_id = c.course_id
//       JOIN competencies comp ON sp.competency_id = comp.competency_id
//       JOIN competency_types ct ON comp.competency_type_id = ct.competency_type_id
//       WHERE se.student_id = ?
//       ORDER BY sp.attempt_date DESC
//     `, [studentId]);

//     res.json(progress);
//   } catch (error) {
//     console.error('Student progress fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch student progress' });
//   }
// });

// // ============================================================================
// // SCHOLARSHIP ROUTES (Fixed)
// // ============================================================================

// app.get('/api/scholarships', authenticateToken, authorize(['admin', 'staff']), async (req, res) => {
//   try {
//     const [scholarships] = await pool.execute(`
//       SELECT sp.sponsor_id, sp.sponsor_name, sp.contact_person, sp.contact_email,
//              sp.industry, sp.total_commitment, sp.current_commitment, sp.students_sponsored, sp.is_active,
//              st.type_name as sponsor_type
//       FROM sponsors sp
//       JOIN sponsor_types st ON sp.sponsor_type_id = st.sponsor_type_id
//       WHERE sp.is_active = TRUE
//       ORDER BY sp.sponsor_name
//     `);
//     res.json(scholarships);
//   } catch (error) {
//     console.error('Scholarships fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch scholarships' });
//   }
// });

// app.post('/api/scholarships', [
//   authenticateToken,
//   authorize(['admin', 'staff']),
//   body('sponsor_name').trim().isLength({ min: 1, max: 100 }),
//   body('sponsor_type_id').isInt(),
//   body('contact_person').trim().isLength({ min: 1, max: 100 }),
//   body('contact_email').isEmail(),
//   body('total_commitment').isFloat({ min: 0 })
// ], validateInput, async (req, res) => {
//   try {
//     const {
//       sponsor_name, sponsor_type_id, contact_person, contact_email,
//       contact_phone, address, website, industry, total_commitment,
//       agreement_details, agreement_start_date, agreement_end_date
//     } = req.body;

//     const sponsor_code = `SP${Date.now()}`;

//     await pool.execute(`
//       INSERT INTO sponsors (
//         sponsor_type_id, sponsor_name, sponsor_code, contact_person, contact_email,
//         contact_phone, address, website, industry, total_commitment,
//         agreement_details, agreement_start_date, agreement_end_date
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `, [
//       sponsor_type_id, sponsor_name, sponsor_code, contact_person, contact_email,
//       contact_phone || null, address || null, website || null, industry || null, total_commitment,
//       agreement_details || null, agreement_start_date || null, agreement_end_date || null
//     ]);

//     res.status(201).json({ message: 'Scholarship sponsor created successfully', sponsor_code });
//   } catch (error) {
//     console.error('Scholarship creation error:', error);
//     res.status(500).json({ error: 'Failed to create scholarship sponsor' });
//   }
// });

// app.get('/api/students/:studentId/scholarships', authenticateToken, authorize(['admin', 'staff', 'student']), authorizeStudentAccess, async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const [scholarships] = await pool.execute(`
//       SELECT ss.scholarship_id, ss.scholarship_type, ss.coverage_percentage, ss.coverage_amount,
//              ss.scholarship_status, ss.start_date, ss.end_date, ss.gpa_requirement,
//              sp.sponsor_name, st.type_name as sponsor_type
//       FROM student_scholarships ss
//       JOIN sponsors sp ON ss.sponsor_id = sp.sponsor_id
//       JOIN sponsor_types st ON sp.sponsor_type_id = st.sponsor_type_id
//       WHERE ss.student_id = ?
//       ORDER BY ss.start_date DESC
//     `, [studentId]);

//     res.json(scholarships);
//   } catch (error) {
//     console.error('Student scholarships fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch student scholarships' });
//   }
// });

// // ============================================================================
// // COURSE AND ENROLLMENT ROUTES (Fixed)
// // ============================================================================

// app.get('/api/courses', authenticateToken, async (req, res) => {
//   try {
//     const [courses] = await pool.execute(`
//       SELECT c.course_id, c.course_code, c.course_name, c.course_description,
//              c.duration_weeks, c.credits, c.is_active
//       FROM courses c
//       WHERE c.is_active = TRUE
//       ORDER BY c.course_name
//     `);
//     res.json(courses);
//   } catch (error) {
//     console.error('Courses fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch courses' });
//   }
// });

// app.get('/api/course-offerings', authenticateToken, async (req, res) => {
//   try {
//     const { status } = req.query;

//     let query = `
//       SELECT co.offering_id, co.batch_identifier, co.start_date, co.end_date, co.status,
//              co.max_enrollees, co.current_enrollees, co.location,
//              c.course_code, c.course_name,
//              AVG(cp.amount) as average_price
//       FROM course_offerings co
//       JOIN courses c ON co.course_id = c.course_id
//       LEFT JOIN course_pricing cp ON co.offering_id = cp.offering_id AND cp.is_active = TRUE
//       WHERE 1=1
//     `;
//     const params = [];

//     if (status) {
//       query += ' AND co.status = ?';
//       params.push(status);
//     }

//     query += ' GROUP BY co.offering_id ORDER BY co.start_date DESC';

//     const [offerings] = await pool.execute(query, params);
//     res.json(offerings);
//   } catch (error) {
//     console.error('Course offerings fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch course offerings' });
//   }
// });

// app.post('/api/enrollments', [
//   authenticateToken,
//   authorize(['admin', 'staff']),
//   body('student_id').trim().isLength({ min: 1 }),
//   body('offering_id').isInt(),
//   body('pricing_type').isIn(['regular', 'early_bird', 'group', 'scholarship', 'special'])
// ], validateInput, async (req, res) => {
//   try {
//     const { student_id, offering_id, pricing_type } = req.body;

//     const [result] = await pool.execute(`
//       CALL sp_enroll_student(?, ?, ?, @result);
//       SELECT @result as result;
//     `, [student_id, offering_id, pricing_type]);

//     const enrollmentResult = result[1][0].result;

//     if (enrollmentResult.startsWith('SUCCESS')) {
//       res.status(201).json({ message: enrollmentResult });
//     } else {
//       res.status(400).json({ error: enrollmentResult });
//     }

//   } catch (error) {
//     console.error('Enrollment error:', error);
//     res.status(500).json({ error: 'Failed to enroll student' });
//   }
// });

// app.get('/api/students/:studentId/enrollments', authenticateToken, authorize(['admin', 'staff', 'student']), authorizeStudentAccess, async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const [enrollments] = await pool.execute(`
//       SELECT se.enrollment_id, se.enrollment_status, se.enrollment_date, se.completion_date,
//              se.final_grade, se.completion_percentage, se.attendance_percentage,
//              c.course_code, c.course_name, co.batch_identifier, co.start_date, co.end_date,
//              sa.total_due, sa.amount_paid, sa.balance
//       FROM student_enrollments se
//       JOIN course_offerings co ON se.offering_id = co.offering_id
//       JOIN courses c ON co.course_id = c.course_id
//       LEFT JOIN student_accounts sa ON se.student_id = sa.student_id AND se.offering_id = sa.offering_id
//       WHERE se.student_id = ?
//       ORDER BY co.start_date DESC
//     `, [studentId]);

//     res.json(enrollments);
//   } catch (error) {
//     console.error('Student enrollments fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch student enrollments' });
//   }
// });

// // ============================================================================
// // REFERRAL ROUTES (Fixed)
// // ============================================================================

// app.get('/api/referrals', authenticateToken, authorize(['admin', 'staff']), async (req, res) => {
//   try {
//     const { status, referrer_search } = req.query;

//     let query = `
//       SELECT sr.referral_id, sr.referrer_name, sr.referrer_contact, sr.referral_date,
//              sr.referral_reward, sr.reward_type, sr.reward_paid, sr.conversion_date,
//              rs.source_name, rs.source_type,
//              s.student_id, per.first_name, per.last_name
//       FROM student_referrals sr
//       JOIN referral_sources rs ON sr.source_id = rs.source_id
//       JOIN students s ON sr.student_id = s.student_id
//       JOIN persons per ON s.person_id = per.person_id
//       LEFT JOIN students ref_s ON sr.referrer_student_id = ref_s.student_id
//       LEFT JOIN persons ref_per ON ref_s.person_id = ref_per.person_id
//       WHERE 1=1
//     `;
//     const params = [];

//     if (referrer_search) {
//       query += ' AND (sr.referrer_name LIKE ? OR ref_per.first_name LIKE ? OR ref_per.last_name LIKE ?)';
//       const searchParam = `%${referrer_search}%`;
//       params.push(searchParam, searchParam, searchParam);
//     }

//     query += ' ORDER BY sr.referral_date DESC';

//     const [referrals] = await pool.execute(query, params);
//     res.json(referrals);
//   } catch (error) {
//     console.error('Referrals fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch referrals' });
//   }
// });

// app.post('/api/referrals', [
//   authenticateToken,
//   authorize(['admin', 'staff']),
//   body('student_id').trim().isLength({ min: 1 }),
//   body('source_id').isInt(),
//   body('referrer_name').optional().trim().isLength({ max: 100 }),
//   body('referrer_contact').optional().trim().isLength({ max: 100 })
// ], validateInput, async (req, res) => {
//   try {
//     const {
//       student_id, source_id, referrer_name, referrer_contact, referrer_student_id,
//       ib_code, campaign_code, referral_reward, reward_type
//     } = req.body;

//     await pool.execute(`
//       INSERT INTO student_referrals (
//         student_id, source_id, referrer_name, referrer_contact, referrer_student_id,
//         ib_code, campaign_code, referral_reward, reward_type
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `, [
//       student_id, source_id, referrer_name || null, referrer_contact || null, referrer_student_id || null,
//       ib_code || null, campaign_code || null, referral_reward || 0, reward_type || 'cash'
//     ]);

//     res.status(201).json({ message: 'Referral recorded successfully' });
//   } catch (error) {
//     console.error('Referral creation error:', error);
//     res.status(500).json({ error: 'Failed to record referral' });
//   }
// });

// // ============================================================================
// // UTILITY ROUTES (Fixed)
// // ============================================================================

// app.get('/api/trading-levels', authenticateToken, async (req, res) => {
//   try {
//     const [levels] = await pool.execute(`
//       SELECT level_id, level_name, level_description, minimum_score, estimated_duration_weeks
//       FROM trading_levels
//       ORDER BY minimum_score ASC
//     `);
//     res.json(levels);
//   } catch (error) {
//     console.error('Trading levels fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch trading levels' });
//   }
// });

// app.get('/api/payment-methods', authenticateToken, async (req, res) => {
//   try {
//     const [methods] = await pool.execute(`
//       SELECT method_id, method_name, method_type, processing_fee_percentage
//       FROM payment_methods
//       WHERE is_active = TRUE
//       ORDER BY method_name
//     `);
//     res.json(methods);
//   } catch (error) {
//     console.error('Payment methods fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch payment methods' });
//   }
// });

// app.get('/api/document-types', authenticateToken, async (req, res) => {
//   try {
//     const [types] = await pool.execute(`
//       SELECT document_type_id, type_name, category, is_required, required_for
//       FROM document_types
//       WHERE is_active = TRUE
//       ORDER BY is_required DESC, type_name
//     `);
//     res.json(types);
//   } catch (error) {
//     console.error('Document types fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch document types' });
//   }
// });

// app.get('/api/competencies', authenticateToken, async (req, res) => {
//   try {
//     const [competencies] = await pool.execute(`
//       SELECT c.competency_id, c.competency_code, c.competency_name, c.competency_description,
//              ct.type_name as competency_type, ct.passing_score
//       FROM competencies c
//       JOIN competency_types ct ON c.competency_type_id = ct.competency_type_id
//       WHERE c.is_active = TRUE
//       ORDER BY ct.type_name, c.competency_name
//     `);
//     res.json(competencies);
//   } catch (error) {
//     console.error('Competencies fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch competencies' });
//   }
// });

// // ============================================================================
// // USER PROFILE ROUTES (Fixed)
// // ============================================================================

// app.get('/api/profile', authenticateToken, async (req, res) => {
//   try {
//     const [userProfile] = await pool.execute(`
//       SELECT a.account_id, a.account_status,
//              p.first_name, p.middle_name, p.last_name, p.birth_date, p.birth_place, p.gender,
//              r.role_name, r.permissions
//       FROM accounts a
//       JOIN account_roles ar ON a.account_id = ar.account_id
//       JOIN roles r ON ar.role_id = r.role_id
//       LEFT JOIN staff st ON a.account_id = st.account_id
//       LEFT JOIN students s ON a.account_id = s.account_id
//       LEFT JOIN persons p ON (st.person_id = p.person_id OR s.person_id = p.person_id)
//       WHERE a.account_id = ? AND ar.is_active = TRUE
//     `, [req.user.accountId]);

//     if (userProfile.length === 0) {
//       return res.status(404).json({ error: 'User profile not found' });
//     }

//     const [contacts] = await pool.execute(`
//       SELECT contact_type, contact_value, is_primary
//       FROM contact_info
//       WHERE person_id = ?
//     `, [req.user.personId]);

//     res.json({
//       ...userProfile[0],
//       contacts
//     });

//   } catch (error) {
//     console.error('Profile fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch user profile' });
//   }
// });
// // PUT /api/profile/:account_id - Update user profile
// app.put('/api/profile/:account_id', [
//   // Input validation
//   body('name').optional().trim().isLength({ min: 1, max: 100 }),
//   body('email').optional().isEmail(),
//   body('phone_no').optional().trim().isLength({ min: 1, max: 15 }),
//   body('address').optional().trim().isLength({ max: 255 }),
//   body('trading_level').optional().isIn(['Beginner', 'Intermediate', 'Advanced']),
//   body('learning_style').optional().isIn(['In-person', 'Online']),
//   body('gender').optional().isIn(['Male', 'Female', 'Other'])
// ], async (req, res) => {
//   const connection = await pool.getConnection();

//   try {
//     const account_id = req.params.account_id;
//     const {
//       name,
//       email,
//       phone_no,
//       address,
//       trading_level,
//       learning_style,
//       gender,
//       birth_date,
//       birth_place,
//       education
//     } = req.body;

//     await connection.beginTransaction();

//     // First, get the current profile data to find person_id and student_id
//     const [currentProfile] = await connection.execute(`
//       SELECT
//         p.person_id,
//         s.student_id,
//         p.first_name,
//         p.middle_name,
//         p.last_name,
//         p.email as person_email,
//         p.birth_date,
//         p.birth_place,
//         p.gender,
//         p.education
//       FROM accounts a
//       LEFT JOIN students s ON a.account_id = s.account_id
//       LEFT JOIN persons p ON s.person_id = p.person_id
//       WHERE a.account_id = ?
//     `, [account_id]);

//     if (currentProfile.length === 0) {
//       await connection.rollback();
//       return res.status(404).json({
//         success: false,
//         error: 'Profile not found'
//       });
//     }

//     const profile = currentProfile[0];
//     const person_id = profile.person_id;
//     const student_id = profile.student_id;

//     // Update persons table if name or other personal info changed
//     if (name || email || birth_date || birth_place || gender || education) {
//       // Split name into first, middle, last if provided
//       let first_name = profile.first_name;
//       let middle_name = profile.middle_name;
//       let last_name = profile.last_name;

//       if (name) {
//         const nameParts = name.trim().split(' ');
//         first_name = nameParts[0] || '';
//         last_name = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
//         middle_name = nameParts.length > 2 ? nameParts.slice(1, -1).join(' ') : '';
//       }

//       await connection.execute(`
//         UPDATE persons
//         SET
//           first_name = COALESCE(?, first_name),
//           middle_name = COALESCE(?, middle_name),
//           last_name = COALESCE(?, last_name),
//           email = COALESCE(?, email),
//           birth_date = COALESCE(?, birth_date),
//           birth_place = COALESCE(?, birth_place),
//           gender = COALESCE(?, gender),
//           education = COALESCE(?, education),
//           updated_at = CURRENT_TIMESTAMP
//         WHERE person_id = ?
//       `, [first_name, middle_name, last_name, email, birth_date, birth_place, gender, education, person_id]);
//     }

//     // Update contact_info table for phone and address
//     if (phone_no) {
//       await connection.execute(`
//         INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary, is_verified)
//         VALUES (?, ?, 'phone', ?, 1, 0)
//         ON DUPLICATE KEY UPDATE
//           contact_value = VALUES(contact_value),
//           updated_at = CURRENT_TIMESTAMP
//       `, [person_id, student_id, phone_no]);
//     }

//     if (address) {
//       await connection.execute(`
//         INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary, is_verified)
//         VALUES (?, ?, 'address', ?, 1, 0)
//         ON DUPLICATE KEY UPDATE
//           contact_value = VALUES(contact_value),
//           updated_at = CURRENT_TIMESTAMP
//       `, [person_id, student_id, address]);
//     }

//     // Update email in contact_info if provided
//     if (email) {
//       await connection.execute(`
//         INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary, is_verified)
//         VALUES (?, ?, 'email', ?, 1, 0)
//         ON DUPLICATE KEY UPDATE
//           contact_value = VALUES(contact_value),
//           updated_at = CURRENT_TIMESTAMP
//       `, [person_id, student_id, email]);
//     }

//     // Update student trading level if provided
//     if (trading_level && student_id) {
//       // First, get the level_id for the trading level
//       const [levelResult] = await connection.execute(`
//         SELECT level_id FROM trading_levels WHERE level_name = ?
//       `, [trading_level]);

//       if (levelResult.length > 0) {
//         const level_id = levelResult[0].level_id;

//         // Set current level to not current
//         await connection.execute(`
//           UPDATE student_trading_levels
//           SET is_current = 0
//           WHERE student_id = ?
//         `, [student_id]);

//         // Insert new current level
//         await connection.execute(`
//           INSERT INTO student_trading_levels (student_id, level_id, assigned_date, is_current)
//           VALUES (?, ?, CURRENT_TIMESTAMP, 1)
//           ON DUPLICATE KEY UPDATE
//             is_current = 1,
//             assigned_date = CURRENT_TIMESTAMP
//         `, [student_id, level_id]);
//       }
//     }

//     // Update learning preferences if provided
//     if (learning_style && student_id) {
//       const delivery_preference = learning_style === 'In-person' ? 'in-person' :
//                                  learning_style === 'Online' ? 'online' : 'hybrid';

//       await connection.execute(`
//         INSERT INTO learning_preferences (student_id, delivery_preference)
//         VALUES (?, ?)
//         ON DUPLICATE KEY UPDATE
//           delivery_preference = VALUES(delivery_preference),
//           updated_at = CURRENT_TIMESTAMP
//       `, [student_id, delivery_preference]);
//     }

//     // Log the profile update
//     await connection.execute(`
//       INSERT INTO activity_logs (account_id, action, description, created_at)
//       VALUES (?, 'profile_updated', 'User profile was updated', CURRENT_TIMESTAMP)
//     `, [account_id]);

//     await connection.commit();

//     // Fetch the updated profile data to return
//     const [updatedProfile] = await connection.execute(`
//       SELECT
//         a.account_id,
//         s.student_id,
//         CONCAT(p.first_name, ' ', COALESCE(p.middle_name, ''), ' ', p.last_name) as name,
//         p.first_name,
//         p.middle_name,
//         p.last_name,
//         p.email,
//         p.birth_date,
//         p.birth_place,
//         p.gender,
//         p.education,
//         p.created_at,
//         p.updated_at,
//         s.graduation_status as status,
//         tl.level_name as trading_level,
//         lp.delivery_preference as learning_style,
//         phone_contact.contact_value as phone_no,
//         address_contact.contact_value as address,
//         r.role_name as roles
//       FROM accounts a
//       LEFT JOIN students s ON a.account_id = s.account_id
//       LEFT JOIN persons p ON s.person_id = p.person_id
//       LEFT JOIN student_trading_levels stl ON s.student_id = stl.student_id AND stl.is_current = 1
//       LEFT JOIN trading_levels tl ON stl.level_id = tl.level_id
//       LEFT JOIN learning_preferences lp ON s.student_id = lp.student_id
//       LEFT JOIN contact_info phone_contact ON p.person_id = phone_contact.person_id
//         AND phone_contact.contact_type = 'phone' AND phone_contact.is_primary = 1
//       LEFT JOIN contact_info address_contact ON p.person_id = address_contact.person_id
//         AND address_contact.contact_type = 'address' AND address_contact.is_primary = 1
//       LEFT JOIN account_roles ar ON a.account_id = ar.account_id AND ar.is_active = 1
//       LEFT JOIN roles r ON ar.role_id = r.role_id
//       WHERE a.person_id = ?
//     `, [account_id]);

//     if (updatedProfile.length === 0) {
//       return res.status(404).json({
//         success: false,
//         error: 'Updated profile not found'
//       });
//     }

//     res.json({
//       success: true,
//       message: 'Profile updated successfully',
//       profile: updatedProfile[0]
//     });

//   } catch (error) {
//     await connection.rollback();
//     console.error('❌ Profile update error:', error);

//     // Send appropriate error message
//     let errorMessage = 'Failed to update profile';
//     if (error.code === 'ER_DUP_ENTRY') {
//       errorMessage = 'Email or phone number already exists';
//     } else if (error.code === 'ER_DATA_TOO_LONG') {
//       errorMessage = 'One or more fields exceed maximum length';
//     } else if (error.code === 'ER_BAD_NULL_ERROR') {
//       errorMessage = 'Required field cannot be empty';
//     }

//     res.status(500).json({
//       success: false,
//       error: errorMessage
//     });
//   } finally {
//     connection.release();
//   }
// });
// // ============================================================================
// // ADMIN ROUTES (Fixed)
// // ============================================================================

// app.get('/api/admin/accounts', authenticateToken, authorize(['admin']), async (req, res) => {
//   try {
//     const [accounts] = await pool.execute(`
//       SELECT a.account_id, a.account_status, a.last_login,
//              p.first_name, p.last_name, r.role_name,
//              COALESCE(s.student_id, st.staff_id) as user_identifier
//       FROM accounts a
//       JOIN account_roles ar ON a.account_id = ar.account_id
//       JOIN roles r ON ar.role_id = r.role_id
//       LEFT JOIN staff st ON a.account_id = st.account_id
//       LEFT JOIN students s ON a.account_id = s.account_id
//       LEFT JOIN persons p ON (st.person_id = p.person_id OR s.person_id = p.person_id)
//       WHERE ar.is_active = TRUE
//       ORDER BY a.username
//     `);

//     res.json(accounts);
//   } catch (error) {
//     console.error('Admin accounts fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch accounts' });
//   }
// });

// app.put('/api/admin/accounts/:accountId/status', [
//   authenticateToken,
//   authorize(['admin']),
//   body('status').isIn(['active', 'inactive', 'suspended'])
// ], validateInput, async (req, res) => {
//   try {
//     const { accountId } = req.params;
//     const { status } = req.body;

//     await pool.execute(`
//       UPDATE accounts
//       SET account_status = ?
//       WHERE account_id = ?
//     `, [status, accountId]);

//     res.json({ message: 'Account status updated successfully' });
//   } catch (error) {
//     console.error('Account status update error:', error);
//     res.status(500).json({ error: 'Failed to update account status' });
//   }
// });

// app.post('/api/admin/staff', [
//   authenticateToken,
//   authorize(['admin']),
//   body('first_name').trim().isLength({ min: 1, max: 50 }).escape(),
//   body('last_name').trim().isLength({ min: 1, max: 50 }).escape(),
//   body('birth_place').trim().isLength({ min: 1, max: 100 }).escape(),
//   body('email').isEmail().normalizeEmail(),
//   body('education').trim().isLength({ min: 1, max: 100 }).escape(),
//   body('username').trim().isLength({ min: 3, max: 50 }).escape(),
//   body('password').isLength({ min: 6 }),
//   body('role').isIn(['staff', 'admin'])
// ], validateInput, async (req, res) => {
//   const connection = await pool.getConnection();

//   try {
//     await connection.beginTransaction();

//     const {
//       first_name, middle_name, last_name, birth_date, birth_place, gender,
//       email, education, phone, username, password, role, employee_id
//     } = req.body;

//     // Insert into persons table
//     const [personResult] = await connection.execute(`
//       INSERT INTO persons (first_name, middle_name, last_name, birth_date, birth_place, gender, email, education)
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `, [first_name, middle_name || null, last_name, birth_date || null, birth_place, gender || 'Other', email, education]);

//     const person_id = personResult.insertId;

//     // Create account
//     const saltRounds = 12;
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     const [accountResult] = await connection.execute(`
//       INSERT INTO accounts (username, password_hash, token, account_status)
//       VALUES (?, ?, '', 'active')
//     `, [username, hashedPassword]);

//     const account_id = accountResult.insertId;

//     // Assign role
//     await connection.execute(`
//       INSERT INTO account_roles (account_id, role_id, is_active)
//       VALUES (?, (SELECT role_id FROM roles WHERE role_name = ?), TRUE)
//     `, [account_id, role]);

//     // Insert into staff table
//     await connection.execute(`
//       INSERT INTO staff (person_id, account_id, employee_id, hire_date)
//       VALUES (?, ?, ?, CURRENT_DATE)
//     `, [person_id, account_id, employee_id || `EMP${Date.now()}`]);

//     // Insert contact information
//     await connection.execute(`
//       INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary)
//       VALUES (?, ?, 'email', ?, TRUE)
//     `, [person_id, `ST${person_id}`, email]);

//     if (phone) {
//       await connection.execute(`
//         INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary)
//         VALUES (?, ?, 'phone', ?, TRUE)
//       `, [person_id, `ST${person_id}`, phone]);
//     }

//     await connection.commit();
//     res.status(201).json({
//       account_id,
//       person_id,
//       message: 'Staff account created successfully'
//     });

//   } catch (error) {
//     await connection.rollback();
//     console.error('Staff creation error:', error);

//     if (error.code === 'ER_DUP_ENTRY') {
//       res.status(409).json({ error: 'Username already exists' });
//     } else {
//       res.status(500).json({ error: 'Failed to create staff account' });
//     }
//   } finally {
//     connection.release();
//   }
// });

// // ============================================================================
// // SYSTEM INFORMATION ROUTES (Fixed)
// // ============================================================================

// app.get('/api/system/stats', authenticateToken, authorize(['admin']), async (req, res) => {
//   try {
//     const [stats] = await pool.execute(`
//       SELECT
//         (SELECT COUNT(*) FROM students) as total_students,
//         (SELECT COUNT(*) FROM staff) as total_staff,
//         (SELECT COUNT(*) FROM courses WHERE is_active = TRUE) as total_courses,
//         (SELECT COUNT(*) FROM course_offerings WHERE status = 'active') as active_offerings,
//         (SELECT COUNT(*) FROM payments WHERE payment_status = 'confirmed') as confirmed_payments,
//         (SELECT SUM(payment_amount) FROM payments WHERE payment_status = 'confirmed') as total_revenue,
//         (SELECT COUNT(*) FROM student_documents WHERE verification_status = 'pending') as pending_documents,
//         (SELECT COUNT(*) FROM student_scholarships WHERE scholarship_status = 'active') as active_scholarships
//     `);

//     res.json(stats[0]);
//   } catch (error) {
//     console.error('System stats error:', error);
//     res.status(500).json({ error: 'Failed to fetch system statistics' });
//   }
// });

// // ============================================================================
// // STUDENT BACKGROUND AND PREFERENCES ROUTES (New)
// // ============================================================================

// app.get('/api/students/:studentId/background', authenticateToken, authorize(['admin', 'staff', 'student']), authorizeStudentAccess, async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const [background] = await pool.execute(`
//       SELECT sb.background_id, sb.education_level, sb.highest_degree, sb.institution, sb.graduation_year,
//              sb.work_experience_years, sb.current_occupation, sb.industry, sb.annual_income_range,
//              sb.financial_experience, sb.prior_trading_experience, sb.investment_portfolio_value,
//              sb.relevant_skills, sb.certifications
//       FROM student_backgrounds sb
//       WHERE sb.student_id = ?
//     `, [studentId]);

//     res.json(background[0] || {});
//   } catch (error) {
//     console.error('Student background fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch student background' });
//   }
// });

// app.post('/api/students/:studentId/background', [
//   authenticateToken,
//   authorize(['admin', 'staff', 'student']),
//   authorizeStudentAccess,
//   body('education_level').optional().isIn(['elementary', 'high_school', 'vocational', 'college', 'graduate', 'post_graduate']),
//   body('work_experience_years').optional().isInt({ min: 0 }),
//   body('annual_income_range').optional().isIn(['below_100k', '100k_300k', '300k_500k', '500k_1m', 'above_1m'])
// ], validateInput, async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     const {
//       education_level, highest_degree, institution, graduation_year, work_experience_years,
//       current_occupation, industry, annual_income_range, financial_experience,
//       prior_trading_experience, investment_portfolio_value, relevant_skills, certifications
//     } = req.body;

//     await pool.execute(`
//       INSERT INTO student_backgrounds (
//         student_id, education_level, highest_degree, institution, graduation_year,
//         work_experience_years, current_occupation, industry, annual_income_range,
//         financial_experience, prior_trading_experience, investment_portfolio_value,
//         relevant_skills, certifications
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       ON DUPLICATE KEY UPDATE
//         education_level = VALUES(education_level),
//         highest_degree = VALUES(highest_degree),
//         institution = VALUES(institution),
//         graduation_year = VALUES(graduation_year),
//         work_experience_years = VALUES(work_experience_years),
//         current_occupation = VALUES(current_occupation),
//         industry = VALUES(industry),
//         annual_income_range = VALUES(annual_income_range),
//         financial_experience = VALUES(financial_experience),
//         prior_trading_experience = VALUES(prior_trading_experience),
//         investment_portfolio_value = VALUES(investment_portfolio_value),
//         relevant_skills = VALUES(relevant_skills),
//         certifications = VALUES(certifications)
//     `, [
//       studentId, education_level, highest_degree, institution, graduation_year,
//       work_experience_years, current_occupation, industry, annual_income_range,
//       financial_experience, prior_trading_experience, investment_portfolio_value,
//       relevant_skills, certifications
//     ]);

//     res.json({ message: 'Student background updated successfully' });
//   } catch (error) {
//     console.error('Student background update error:', error);
//     res.status(500).json({ error: 'Failed to update student background' });
//   }
// });

// app.get('/api/students/:studentId/preferences', authenticateToken, authorize(['admin', 'staff', 'student']), authorizeStudentAccess, async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const [preferences] = await pool.execute(`
//       SELECT lp.preference_id, lp.learning_style, lp.delivery_preference, lp.device_type,
//              lp.internet_speed, lp.preferred_schedule, lp.study_hours_per_week, lp.accessibility_needs
//       FROM learning_preferences lp
//       WHERE lp.student_id = ?
//     `, [studentId]);

//     res.json(preferences[0] || {});
//   } catch (error) {
//     console.error('Student preferences fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch student preferences' });
//   }
// });

// app.post('/api/students/:studentId/preferences', [
//   authenticateToken,
//   authorize(['admin', 'staff', 'student']),
//   authorizeStudentAccess,
//   body('learning_style').optional().isIn(['visual', 'auditory', 'kinesthetic', 'reading_writing', 'mixed']),
//   body('delivery_preference').optional().isIn(['in-person', 'online', 'hybrid', 'self-paced']),
//   body('preferred_schedule').optional().isIn(['morning', 'afternoon', 'evening', 'weekend', 'flexible'])
// ], validateInput, async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     const {
//       learning_style, delivery_preference, device_type, internet_speed,
//       preferred_schedule, study_hours_per_week, accessibility_needs
//     } = req.body;

//     await pool.execute(`
//       INSERT INTO learning_preferences (
//         student_id, learning_style, delivery_preference, device_type, internet_speed,
//         preferred_schedule, study_hours_per_week, accessibility_needs
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//       ON DUPLICATE KEY UPDATE
//         learning_style = VALUES(learning_style),
//         delivery_preference = VALUES(delivery_preference),
//         device_type = VALUES(device_type),
//         internet_speed = VALUES(internet_speed),
//         preferred_schedule = VALUES(preferred_schedule),
//         study_hours_per_week = VALUES(study_hours_per_week),
//         accessibility_needs = VALUES(accessibility_needs)
//     `, [
//       studentId, learning_style, delivery_preference, device_type, internet_speed,
//       preferred_schedule, study_hours_per_week, accessibility_needs
//     ]);

//     res.json({ message: 'Student preferences updated successfully' });
//   } catch (error) {
//     console.error('Student preferences update error:', error);
//     res.status(500).json({ error: 'Failed to update student preferences' });
//   }
// });

// // ============================================================================
// // STUDENT GOALS ROUTES (New)
// // ============================================================================

// app.get('/api/students/:studentId/goals', authenticateToken, authorize(['admin', 'staff', 'student']), authorizeStudentAccess, async (req, res) => {
//   try {
//     const { studentId } = req.params;

//     const [goals] = await pool.execute(`
//       SELECT sg.goal_id, sg.goal_type, sg.goal_title, sg.goal_description, sg.target_date,
//              sg.target_amount, sg.priority_level, sg.status, sg.progress_percentage,
//              sg.created_at, sg.updated_at
//       FROM student_goals sg
//       WHERE sg.student_id = ?
//       ORDER BY sg.priority_level DESC, sg.created_at DESC
//     `, [studentId]);

//     res.json(goals);
//   } catch (error) {
//     console.error('Student goals fetch error:', error);
//     res.status(500).json({ error: 'Failed to fetch student goals' });
//   }
// });

// app.post('/api/students/:studentId/goals', [
//   authenticateToken,
//   authorize(['admin', 'staff', 'student']),
//   authorizeStudentAccess,
//   body('goal_type').isIn(['career', 'financial', 'personal', 'academic', 'skill']),
//   body('goal_title').trim().isLength({ min: 1, max: 100 }),
//   body('goal_description').trim().isLength({ min: 1, max: 1000 }),
//   body('priority_level').optional().isIn(['low', 'medium', 'high', 'critical'])
// ], validateInput, async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     const {
//       goal_type, goal_title, goal_description, target_date,
//       target_amount, priority_level
//     } = req.body;

//     await pool.execute(`
//       INSERT INTO student_goals (
//         student_id, goal_type, goal_title, goal_description, target_date,
//         target_amount, priority_level
//       ) VALUES (?, ?, ?, ?, ?, ?, ?)
//     `, [
//       studentId, goal_type, goal_title, goal_description, target_date || null,
//       target_amount || null, priority_level || 'medium'
//     ]);

//     res.status(201).json({ message: 'Student goal created successfully' });
//   } catch (error) {
//     console.error('Student goal creation error:', error);
//     res.status(500).json({ error: 'Failed to create student goal' });
//   }
// });

// app.put('/api/students/:studentId/goals/:goalId', [
//   authenticateToken,
//   authorize(['admin', 'staff', 'student']),
//   authorizeStudentAccess,
//   body('status').optional().isIn(['active', 'achieved', 'paused', 'cancelled', 'expired']),
//   body('progress_percentage').optional().isFloat({ min: 0, max: 100 })
// ], validateInput, async (req, res) => {
//   try {
//     const { studentId, goalId } = req.params;
//     const { status, progress_percentage, goal_title, goal_description } = req.body;

//     await pool.execute(`
//       UPDATE student_goals
//       SET status = COALESCE(?, status),
//           progress_percentage = COALESCE(?, progress_percentage),
//           goal_title = COALESCE(?, goal_title),
//           goal_description = COALESCE(?, goal_description),
//           updated_at = CURRENT_TIMESTAMP
//       WHERE goal_id = ? AND student_id = ?
//     `, [status, progress_percentage, goal_title, goal_description, goalId, studentId]);

//     res.json({ message: 'Student goal updated successfully' });
//   } catch (error) {
//     console.error('Student goal update error:', error);
//     res.status(500).json({ error: 'Failed to update student goal' });
//   }
// });

// // ============================================================================
// // PASSWORD CHANGE ROUTE (Fixed)
// // ============================================================================

// app.post('/api/auth/change-password', [
//   authenticateToken,
//   body('currentPassword').isLength({ min: 6 }),
//   body('newPassword').isLength({ min: 6 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
// ], validateInput, async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;
//     const accountId = req.user.accountId;

//     const [userRows] = await pool.execute(
//       'SELECT password_hash FROM accounts WHERE account_id = ?',
//       [accountId]
//     );

//     if (userRows.length === 0) {
//       return res.status(404).json({ error: 'Account not found' });
//     }

//     const isValidPassword = await bcrypt.compare(currentPassword, userRows[0].password_hash);
//     if (!isValidPassword) {
//       return res.status(401).json({ error: 'Current password is incorrect' });
//     }

//     const saltRounds = 12;
//     const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

//     await pool.execute(
//       'UPDATE accounts SET password_hash = ? WHERE account_id = ?',
//       [newPasswordHash, accountId]
//     );

//     res.json({ message: 'Password changed successfully' });

//   } catch (error) {
//     console.error('Password change error:', error);
//     res.status(500).json({ error: 'Password change failed' });
//   }
// });

// // ============================================================================
// // STUDENT REGISTRATION ENDPOINT (Public - Fixed)
// // ============================================================================

// app.post('/api/register', [
//   body('firstName').trim().isLength({ min: 1, max: 50 }).escape(),
//   body('lastName').trim().isLength({ min: 1, max: 50 }).escape(),
//   body('email').isEmail().normalizeEmail(),
//   body('phoneNumber').isMobilePhone(),
//   body('dob').isISO8601(),
//   body('address').trim().isLength({ min: 1, max: 500 }),
//   body('city').trim().isLength({ min: 1, max: 100 }),
//   body('province').trim().isLength({ min: 1, max: 100 }),
//   body('gender').isIn(['Male', 'Female', 'Other']),
//   body('education').trim().isLength({ min: 1, max: 100 }),
//   body('tradingLevel').trim().isLength({ min: 1, max: 50 }),
//   body('username').trim().isLength({ min: 3, max: 15 }),
//   body('password').isLength({ min: 6 })
// ], validateInput, async (req, res) => {
//   const connection = await pool.getConnection();

//   try {
//     await connection.beginTransaction();

//     const {
//       firstName, lastName, email, phoneNumber, dob, address, city, province,
//       gender, education, tradingLevel, device, learningStyle, username, password
//     } = req.body;

//     // Hash password
//     const hashedPassword = await bcrypt.hash(password, 12);

//     // 1. Insert into accounts
//     const [accountResult] = await connection.execute(`
//       INSERT INTO accounts (username, password_hash, token, account_status, created_at, updated_at)
//       VALUES (?, ?, '', 'active', NOW(), NOW())
//     `, [username, hashedPassword]);
//     const accountId = accountResult.insertId;

//     // 2. Assign student role
//     await connection.execute(`
//       INSERT INTO account_roles (account_id, role_id, is_active)
//       VALUES (?, (SELECT role_id FROM roles WHERE role_name = 'student'), TRUE)
//     `, [accountId]);

//     // 3. Insert into persons
//     const fullAddress = `${address}, ${city}, ${province}`;
//     const [personResult] = await connection.execute(`
//       INSERT INTO persons (first_name, last_name, birth_date, birth_place, gender, email, education)
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//     `, [firstName, lastName, dob, city, gender, email, education]);
//     const personId = personResult.insertId;

//     // 4. Generate unique student ID and insert into students
//     const studentId = `S${Date.now()}_${personId}`;
//     await connection.execute(`
//       INSERT INTO students (student_id, person_id, account_id, registration_date)
//       VALUES (?, ?, ?, CURRENT_DATE)
//     `, [studentId, personId, accountId]);

//     // 5. Insert contact information
//     await connection.execute(`
//       INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary)
//       VALUES
//         (?, ?, 'phone', ?, TRUE),
//         (?, ?, 'address', ?, TRUE),
//         (?, ?, 'email', ?, TRUE)
//     `, [
//       personId, studentId, phoneNumber,
//       personId, studentId, fullAddress,
//       personId, studentId, email
//     ]);

//     // 6. Insert trading level
//     const [levelRows] = await connection.execute(`
//       SELECT level_id FROM trading_levels WHERE level_name = ?
//     `, [tradingLevel]);

//     if (levelRows.length > 0) {
//       const levelId = levelRows[0].level_id;
//       await connection.execute(`
//         INSERT INTO student_trading_levels (student_id, level_id, is_current)
//         VALUES (?, ?, TRUE)
//       `, [studentId, levelId]);
//     }

//     // 7. Insert learning preferences if provided
//     if (device || learningStyle) {
//       const deviceArray = Array.isArray(device) ? device : [device];
//       const learningStyleArray = Array.isArray(learningStyle) ? learningStyle : [learningStyle];

//       await connection.execute(`
//         INSERT INTO learning_preferences (student_id, device_type, learning_style)
//         VALUES (?, ?, ?)
//       `, [studentId, deviceArray.join(','), learningStyleArray.join(',')]);
//     }

//     await connection.commit();
//     res.status(201).json({
//       message: 'Student successfully registered.',
//       student_id: studentId
//     });

//   } catch (error) {
//     await connection.rollback();
//     console.error('Registration error:', error);

//     if (error.code === 'ER_DUP_ENTRY') {
//       res.status(409).json({ error: 'Username or email already exists' });
//     } else {
//       res.status(500).json({ error: 'Failed to register student' });
//     }
//   } finally {
//     connection.release();
//   }
// });

// // ============================================================================
// // ERROR HANDLING & 404
// // ============================================================================

// app.use((error, req, res, next) => {
//   console.error('Unhandled error:', error);

//   if (error instanceof multer.MulterError) {
//     if (error.code === 'LIMIT_FILE_SIZE') {
//       return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
//     }
//     return res.status(400).json({ error: 'File upload error' });
//   }

//   res.status(500).json({ error: 'Internal server error' });
// });

// // ============================================================================
// // SERVER STARTUP
// // ============================================================================

// async function testDatabaseConnection() {
//   try {
//     const connection = await pool.getConnection();
//     console.log('✅ Database connection successful');
//     connection.release();
//     return true;
//   } catch (error) {
//     console.error('❌ Database connection failed:', error.message);
//     return false;
//   }
// }

// // Graceful shutdown
// process.on('SIGTERM', async () => {
//   console.log('SIGTERM received, shutting down gracefully');
//   await pool.end();
//   process.exit(0);
// });

// process.on('SIGINT', async () => {
//   console.log('SIGINT received, shutting down gracefully');
//   await pool.end();
//   process.exit(0);
// });

// async function startServer() {
//   const dbConnected = await testDatabaseConnection();

//   if (!dbConnected) {
//     console.error('Cannot start server without database connection');
//     process.exit(1);
//   }

//   app.listen(PORT, () => {
//     console.log(`🚀 Server running on port ${PORT}`);
//     console.log(`📊 Database: ${process.env.DB_NAME || 'Not specified'}`);
//     console.log(`🔒 Security: Authentication and authorization enabled`);
//     console.log(`📁 File uploads: ${path.resolve('uploads')}`);
//     console.log(`👤 Default admin: username=admin, password=admin123`);
//     console.log('===============================================');
//   });
// }

// startServer();

// export default app;

import express from "express";
import mysql from "mysql2/promise";
import multer from "multer";
import path from "path";
import fs from "fs";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { body, validationResult } from "express-validator";

dotenv.config();

const app = express();
const PORT = 3001;
const JWT_SECRET =
  process.env.JWT_SECRET || crypto.randomBytes(64).toString("hex");
const BASE_URL = process.env.FRONTEND_URL;
// ============================================================================
// MIDDLEWARE CONFIGURATION
// ============================================================================
app.use(
  cors({
    origin: [
      "http://localhost:5175",
      "https://atecon.netlify.app",
      "http://localhost:5174",
      "https://8con.netlify.app",
      "http://192.168.55.115:5174",
      "http://192.168.55.121:5174",
      BASE_URL,
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts, please try again later.",
});

app.use(limiter);

// Core middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME_EDGE || "8cons",
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
});

// ============================================================================
// DATABASE INITIALIZATION - SYNC IDs AND CREATE PROCEDURES
// ============================================================================

async function initializeDatabase() {
  const connection = await pool.getConnection();

  try {
    console.log("🔄 Initializing database with ID synchronization...");

    // Check if stored procedure exists, if not create it
    const [procedures] = await connection.execute(`
      SELECT ROUTINE_NAME 
      FROM information_schema.ROUTINES 
      WHERE ROUTINE_SCHEMA = DATABASE() 
      AND ROUTINE_NAME = 'sp_register_user_with_synced_ids'
    `);

    if (procedures.length === 0) {
      console.log("📝 Creating stored procedure for synced registration...");

      await connection.execute(`
        CREATE PROCEDURE sp_register_user_with_synced_ids(
          IN p_username VARCHAR(15),
          IN p_password_hash VARCHAR(255),
          IN p_first_name VARCHAR(50),
          IN p_middle_name VARCHAR(50),
          IN p_last_name VARCHAR(50),
          IN p_birth_date DATE,
          IN p_birth_place VARCHAR(100),
          IN p_gender ENUM('Male','Female','Other'),
          IN p_email VARCHAR(100),
          IN p_education VARCHAR(100),
          IN p_phone_no VARCHAR(15),
          IN p_address TEXT,
          IN p_role_name VARCHAR(50),
          OUT p_account_id INT,
          OUT p_result VARCHAR(100)
        )
        BEGIN
          DECLARE v_role_id INT;
          DECLARE v_student_id VARCHAR(20);
          DECLARE EXIT HANDLER FOR SQLEXCEPTION
          BEGIN
            ROLLBACK;
            SET p_result = 'ERROR: Registration failed';
            SET p_account_id = NULL;
          END;

          START TRANSACTION;

          -- Create account first
          INSERT INTO accounts (username, password_hash, token, account_status)
          VALUES (p_username, p_password_hash, '', 'active');
          
          SET p_account_id = LAST_INSERT_ID();

          -- Create person with matching ID
          INSERT INTO persons (person_id, first_name, middle_name, last_name, birth_date, birth_place, gender, email, education)
          VALUES (p_account_id, p_first_name, p_middle_name, p_last_name, p_birth_date, p_birth_place, p_gender, p_email, p_education);

          -- Get role_id
          SELECT role_id INTO v_role_id FROM roles WHERE role_name = p_role_name;
          
          IF v_role_id IS NULL THEN
            SET p_result = 'ERROR: Invalid role specified';
            ROLLBACK;
          ELSE
            -- Assign role
            INSERT INTO account_roles (account_id, role_id) VALUES (p_account_id, v_role_id);
            
            -- If student role, create student record
            IF p_role_name = 'student' THEN
              SET v_student_id = CONCAT('S', UNIX_TIMESTAMP(NOW()) * 1000, '_', p_account_id);
              
              INSERT INTO students (student_id, person_id, account_id)
              VALUES (v_student_id, p_account_id, p_account_id);
              
              -- Add contact information
              IF p_phone_no IS NOT NULL THEN
                INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary)
                VALUES (p_account_id, v_student_id, 'phone', p_phone_no, 1);
              END IF;
              
              IF p_address IS NOT NULL THEN
                INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary)
                VALUES (p_account_id, v_student_id, 'address', p_address, 1);
              END IF;
              
              INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary)
              VALUES (p_account_id, v_student_id, 'email', p_email, 1);
              
              -- Set default trading level (Beginner = level_id 1)
              INSERT INTO student_trading_levels (student_id, level_id, is_current)
              VALUES (v_student_id, 1, 1);
              
              -- Set default learning preferences
              INSERT INTO learning_preferences (student_id, delivery_preference)
              VALUES (v_student_id, 'hybrid');
            END IF;
            
            -- If staff role, create staff record
            IF p_role_name = 'staff' THEN
              INSERT INTO staff (person_id, account_id, employee_id, hire_date, employment_status)
              VALUES (p_account_id, p_account_id, CONCAT('EMP', UNIX_TIMESTAMP(NOW()) * 1000), CURDATE(), 'active');
            END IF;
            
            SET p_result = 'SUCCESS: User registered successfully';
            COMMIT;
          END IF;
        END
      `);

      console.log("✅ Stored procedure created successfully");
    }

    // Sync existing data if needed
    const [mismatchedRecords] = await connection.execute(`
      SELECT COUNT(*) as count
      FROM accounts a
      LEFT JOIN students s ON a.account_id = s.account_id
      LEFT JOIN persons p ON s.person_id = p.person_id
      WHERE a.account_id != p.person_id AND p.person_id IS NOT NULL
    `);

    if (mismatchedRecords[0].count > 0) {
      console.log(
        `🔧 Found ${mismatchedRecords[0].count} mismatched records. Synchronizing...`
      );

      // Temporarily disable foreign key checks
      await connection.execute("SET FOREIGN_KEY_CHECKS = 0");

      // Update person_id to match account_id
      await connection.execute(`
        UPDATE persons p
        JOIN students s ON p.person_id = s.person_id
        JOIN accounts a ON s.account_id = a.account_id
        SET p.person_id = a.account_id
      `);

      // Update students table
      await connection.execute(`
        UPDATE students s
        JOIN accounts a ON s.account_id = a.account_id
        SET s.person_id = a.account_id
      `);

      // Update contact_info table
      await connection.execute(`
        UPDATE contact_info ci
        JOIN students s ON ci.student_id = s.student_id
        JOIN accounts a ON s.account_id = a.account_id
        SET ci.person_id = a.account_id
      `);

      // Update staff table
      await connection.execute(`
        UPDATE staff st
        JOIN accounts a ON st.account_id = a.account_id
        SET st.person_id = a.account_id
      `);

      // Re-enable foreign key checks
      await connection.execute("SET FOREIGN_KEY_CHECKS = 1");

      console.log("✅ ID synchronization completed");
    }
  } catch (error) {
    console.error("❌ Database initialization error:", error);
    throw error;
  } finally {
    connection.release();
  }
}

// ============================================================================
// FILE UPLOAD CONFIGURATION
// ============================================================================

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/documents";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const sanitizedFilename = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    cb(null, file.fieldname + "-" + uniqueSuffix + "-" + sanitizedFilename);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|xls|xlsx/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only images and documents are allowed"));
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 },
});

// ============================================================================
// MIDDLEWARE UTILITIES
// ============================================================================

const validateInput = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: "Validation failed",
      details: errors.array(),
    });
  }
  next();
};

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    const [userRows] = await pool.execute(
      `
      SELECT a.account_id,a.account_status, ar.role_id, r.role_name, r.permissions,
             p.first_name, p.last_name, 
             COALESCE(s.student_id, st.staff_id) as user_id,
             a.account_id as person_id
      FROM accounts a
      JOIN account_roles ar ON a.account_id = ar.account_id
      JOIN roles r ON ar.role_id = r.role_id
      LEFT JOIN staff st ON a.account_id = st.account_id
      LEFT JOIN students s ON a.account_id = s.account_id
      LEFT JOIN persons p ON a.account_id = p.person_id
      WHERE a.account_id = ? AND a.account_status = 'active' AND ar.is_active = TRUE
    `,
      [decoded.accountId]
    );

    if (userRows.length === 0) {
      return res
        .status(401)
        .json({ error: "Invalid token or inactive account" });
    }

    req.user = {
      accountId: userRows[0].account_id,
      username: userRows[0].username,
      role: userRows[0].role_name,
      permissions: userRows[0].permissions,
      firstName: userRows[0].first_name,
      lastName: userRows[0].last_name,
      personId: userRows[0].person_id,
      userId: userRows[0].user_id,
    };

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
};

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: "Authentication required" });
    }

    if (allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403).json({ error: "Insufficient permissions" });
    }
  };
};

const authorizeStudentAccess = async (req, res, next) => {
  if (req.user.role === "admin") {
    return next();
  }

  if (req.user.role === "student") {
    const studentId = req.params.studentId || req.body.student_id;

    if (!studentId) {
      return res.status(400).json({ error: "Student ID required" });
    }

    try {
      const [studentRows] = await pool.execute(
        `
        SELECT s.student_id 
        FROM students s 
        WHERE s.student_id = ? AND s.account_id = ?
      `,
        [studentId, req.user.accountId]
      );

      if (studentRows.length === 0) {
        return res
          .status(403)
          .json({ error: "Access denied to this student record" });
      }
    } catch (error) {
      console.error("Student access control error:", error);
      return res.status(500).json({ error: "Authorization check failed" });
    }
  }

  next();
};

// ============================================================================
// AUTHENTICATION ROUTES (Updated to use synced IDs)
// ============================================================================

app.post(
  "/api/auth",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
  ],
  validateInput,
  async (req, res) => {
    try {
      const { email, password } = req.body;

      // Admin auto-setup and login
      if (email === "admin@gmail.com" && password === "admin123") {
        const [existingAdmin] = await pool.execute(
          "SELECT * FROM accounts WHERE username = ?",
          ["admin"]
        );

        let adminId;

        if (existingAdmin.length === 0) {
          const hash = await bcrypt.hash("admin123", 10);
          const [insertResult] = await pool.execute(
            `INSERT INTO accounts (username, password_hash, token, account_status)
           VALUES (?, ?, '', 'active')`,
            ["admin", hash]
          );
          adminId = insertResult.insertId;

          // Create person record with matching ID
          await pool.execute(
            `INSERT INTO persons (person_id, first_name, last_name, email, birth_place, gender, education)
           VALUES (?, 'System', 'Administrator', 'admin@gmail.com', 'System', 'Other', 'System Administrator')`,
            [adminId]
          );

          await pool.execute(
            `INSERT INTO account_roles (account_id, role_id, is_active)
           VALUES (?, ?, TRUE)`,
            [adminId, 1]
          );
        } else {
          adminId = existingAdmin[0].account_id;
        }

        const [[existingTokenRow]] = await pool.execute(
          `SELECT token FROM accounts WHERE account_id = ?`,
          [adminId]
        );

        let token = existingTokenRow.token;
        let shouldUpdate = true;

        if (token) {
          try {
            jwt.verify(token, JWT_SECRET);
            shouldUpdate = false;
          } catch (err) {
            shouldUpdate = true;
          }
        }

        if (shouldUpdate) {
          token = jwt.sign(
            {
              accountId: adminId,
              username: "admin",
              role: "admin",
            },
            JWT_SECRET,
            { expiresIn: "8h" }
          );

          await pool.execute(
            `UPDATE accounts SET token = ? WHERE account_id = ?`,
            [token, adminId]
          );
        }

        return res.json({
          token,
          user: {
            accountId: adminId,
            username: "admin",
            role: "admin",
            firstName: "System",
            lastName: "Administrator",
            permissions: "all",
            profile: {},
          },
        });
      }

      const [userRows] = await pool.execute(
        `
      SELECT 
        a.account_id, a.password_hash, a.account_status, 
        a.failed_login_attempts, a.locked_until,
        ar.role_id, r.role_name, r.permissions,
        p.first_name, p.last_name
      FROM accounts a
      JOIN account_roles ar ON a.account_id = ar.account_id
      JOIN roles r ON ar.role_id = r.role_id
      LEFT JOIN persons p ON a.account_id = p.person_id
      WHERE p.email = ? AND ar.is_active = TRUE
    `,
        [email]
      );

      if (userRows.length === 0) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const user = userRows[0];

      if (user.locked_until && new Date() < new Date(user.locked_until)) {
        return res.status(423).json({ error: "Account is temporarily locked" });
      }

      if (user.account_status !== "active") {
        return res.status(401).json({ error: "Account is not active" });
      }

      const isValidPassword = await bcrypt.compare(
        password,
        user.password_hash
      );
      if (!isValidPassword) {
        await pool.execute(
          `
        UPDATE accounts 
        SET failed_login_attempts = failed_login_attempts + 1,
            locked_until = CASE 
              WHEN failed_login_attempts >= 4 THEN DATE_ADD(NOW(), INTERVAL 15 MINUTE)
              ELSE NULL 
            END
        WHERE account_id = ?`,
          [user.account_id]
        );
        return res.status(401).json({ error: "Invalid credentials" });
      }

      // Reset login attempts
      await pool.execute(
        `
      UPDATE accounts 
      SET failed_login_attempts = 0, locked_until = NULL, last_login = NOW()
      WHERE account_id = ?`,
        [user.account_id]
      );

      // Get or generate token
      const [[existingTokenRow]] = await pool.execute(
        `SELECT token FROM accounts WHERE account_id = ?`,
        [user.account_id]
      );

      let token = existingTokenRow.token;
      let shouldUpdate = true;

      if (token) {
        try {
          jwt.verify(token, JWT_SECRET);
          shouldUpdate = false;
        } catch (err) {
          shouldUpdate = true;
        }
      }

      if (shouldUpdate) {
        token = jwt.sign(
          {
            accountId: user.account_id,
            username: user.username,
            role: user.role_name,
          },
          JWT_SECRET,
          { expiresIn: "24h" }
        );

        await pool.execute(
          `UPDATE accounts SET token = ? WHERE account_id = ?`,
          [token, user.account_id]
        );
      }

      let profileData = {};
      if (user.role_name === "student") {
        const [studentData] = await pool.execute(
          `
        SELECT student_id, graduation_status, academic_standing
        FROM students WHERE account_id = ?`,
          [user.account_id]
        );
        profileData = studentData[0] || {};
      } else if (user.role_name === "staff" || user.role_name === "admin") {
        const [staffData] = await pool.execute(
          `
        SELECT staff_id, employee_id, employment_status
        FROM staff WHERE account_id = ?`,
          [user.account_id]
        );
        profileData = staffData[0] || {};
      }

      return res.json({
        token,
        user: {
          accountId: user.account_id,
          username: user.username,
          role: user.role_name,
          firstName: user.first_name,
          lastName: user.last_name,
          permissions: user.permissions,
          profile: profileData,
        },
      });
    } catch (error) {
      console.error("Auth error:", error);
      res.status(500).json({ error: "Authentication failed" });
    }
  }
);

// SIGNUP (Updated to use stored procedure)
app.post(
  "/api/auth/signup",
  [
    body("username")
      .trim()
      .isLength({ min: 3, max: 50 })
      .escape()
      .withMessage("Username must be between 3 and 50 characters"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email is required"),
    body("firstName")
      .trim()
      .isLength({ min: 1, max: 100 })
      .escape()
      .withMessage("First name is required"),
    body("lastName")
      .trim()
      .isLength({ min: 1, max: 100 })
      .escape()
      .withMessage("Last name is required"),
    body("role")
      .optional()
      .isIn(["student", "staff"])
      .withMessage("Role must be either student or staff"),
    body("phoneNumber")
      .optional()
      .isMobilePhone()
      .withMessage("Valid phone number required"),
    body("dateOfBirth")
      .optional()
      .isISO8601()
      .withMessage("Valid date of birth required (YYYY-MM-DD)"),
    body("birthPlace")
      .optional()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage("City of birth"),
    // Additional validations from register endpoint
    body("address").optional().trim().isLength({ min: 1, max: 500 }),
    body("city").optional().trim().isLength({ min: 1, max: 100 }),
    body("province").optional().trim().isLength({ min: 1, max: 100 }),
    body("gender").optional().isIn(["Male", "Female", "Other"]),
    body("education").optional().trim().isLength({ min: 1, max: 100 }),
    body("tradingLevel").optional().trim().isLength({ min: 1, max: 50 }),
    body("device").optional(),
    body("learningStyle").optional(),
  ],
  validateInput,
  async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const {
        username,
        password,
        email,
        firstName,
        middleName = null,
        lastName,
        dateOfBirth = null,
        birthDate = dateOfBirth, // Support both field names
        birthPlace,
        gender = null,
        education = null,
        phoneNumber = null,
        role = "student", // Default to student
        // Additional fields from register endpoint
        address = null,
        city = null,
        province = null,
        tradingLevel = null,
        device = null,
        learningStyle = null,
      } = req.body;

      // Check if username already exists
      const [existingUser] = await connection.execute(
        "SELECT account_id FROM accounts WHERE username = ?",
        [username]
      );

      if (existingUser.length > 0) {
        return res.status(409).json({ error: "Username already exists" });
      }

      // Check if email already exists
      const [existingEmail] = await connection.execute(
        "SELECT person_id FROM persons WHERE email = ?",
        [email]
      );

      if (existingEmail.length > 0) {
        return res.status(409).json({ error: "Email already exists" });
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      // Use stored procedure for synced registration
      const fullAddress =
        address && city && province
          ? `${address}, ${city}, ${province}`
          : address;

      const [result] = await connection.execute(
        `
      CALL sp_register_user_with_synced_ids(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @account_id, @result)
    `,
        [
          username,
          passwordHash,
          firstName,
          middleName,
          lastName,
          birthDate,
          birthPlace,
          gender || "Other",
          email,
          education || "Not specified",
          phoneNumber,
          fullAddress,
          role,
        ]
      );

      const [output] = await connection.execute(
        `SELECT @account_id as account_id, @result as result`
      );
      const { account_id, result: procedureResult } = output[0];

      if (!procedureResult.startsWith("SUCCESS")) {
        return res.status(400).json({ error: procedureResult });
      }

      // Handle additional fields specific to students
      if (role === "student" && (tradingLevel || device || learningStyle)) {
        const [studentData] = await connection.execute(
          `
        SELECT student_id FROM students WHERE account_id = ?
      `,
          [account_id]
        );

        if (studentData.length > 0) {
          const student_id = studentData[0].student_id;

          // Update trading level if provided
          if (tradingLevel) {
            const [levelRows] = await connection.execute(
              `
            SELECT level_id FROM trading_levels WHERE level_name = ?
          `,
              [tradingLevel]
            );

            if (levelRows.length > 0) {
              const level_id = levelRows[0].level_id;

              // Update the default level
              await connection.execute(
                `
              UPDATE student_trading_levels 
              SET level_id = ?, assigned_date = CURRENT_TIMESTAMP
              WHERE student_id = ? AND is_current = 1
            `,
                [level_id, student_id]
              );
            }
          }

          // Update learning preferences if provided
          if (device || learningStyle) {
            const deviceArray = Array.isArray(device)
              ? device
              : device
              ? [device]
              : [];
            const learningStyleArray = Array.isArray(learningStyle)
              ? learningStyle
              : learningStyle
              ? [learningStyle]
              : [];

            await connection.execute(
              `
            UPDATE learning_preferences 
            SET device_type = ?, learning_style = ?, updated_at = CURRENT_TIMESTAMP
            WHERE student_id = ?
          `,
              [deviceArray.join(","), learningStyleArray.join(","), student_id]
            );
          }
        }
      }

      // Generate JWT token
      const token = jwt.sign(
        {
          accountId: account_id,
          username: username,
          role: role,
        },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      // Update account with token
      await connection.execute(
        "UPDATE accounts SET token = ? WHERE account_id = ?",
        [token, account_id]
      );

      // Prepare response
      let profileData = {};
      if (role === "student") {
        const [studentProfile] = await connection.execute(
          `
        SELECT student_id, graduation_status, academic_standing
        FROM students WHERE account_id = ?
      `,
          [account_id]
        );

        profileData = {
          student_id: studentProfile[0]?.student_id,
          graduation_status: "enrolled",
          academic_standing: "good",
          trading_level: tradingLevel || "Beginner",
          learning_preferences: {
            device: device || null,
            learning_style: learningStyle || null,
          },
        };
      } else if (role === "staff") {
        const [staffProfile] = await connection.execute(
          `
        SELECT staff_id, employee_id, employment_status
        FROM staff WHERE account_id = ?
      `,
          [account_id]
        );

        profileData = {
          staff_id: staffProfile[0]?.staff_id,
          employee_id: staffProfile[0]?.employee_id,
          employment_status: "active",
        };
      }

      // Get role permissions
      const [rolePermissions] = await connection.execute(
        "SELECT permissions FROM roles WHERE role_name = ?",
        [role]
      );

      const permissions = rolePermissions[0]?.permissions || "";

      res.status(201).json({
        message: "Account created successfully",
        token,
        user: {
          accountId: account_id,
          username: username,
          role: role,
          firstName: firstName,
          middleName: middleName,
          lastName: lastName,
          email: email,
          phoneNumber: phoneNumber,
          dateOfBirth: birthDate,
          gender: gender,
          education: education,
          address: fullAddress,
          permissions: permissions,
          profile: profileData,
        },
      });
    } catch (error) {
      console.error("Signup error:", error);

      // Handle specific database errors
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(409)
          .json({ error: "Username or email already exists" });
      }

      res.status(500).json({ error: "Account creation failed" });
    } finally {
      connection.release();
    }
  }
);

app.post(
  "/api/auth/login",
  [body("token").notEmpty().isString()],
  validateInput,
  async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) return res.status(400).json({ error: "Token required" });

      const payload = jwt.verify(token, JWT_SECRET);

      const [rows] = await pool.execute(
        `
      SELECT 
        a.*, 
        ar.role_id, 
        r.role_name, 
        r.permissions,
        p.person_id, p.first_name, p.middle_name, p.last_name, p.gender, p.birth_date, p.birth_place, p.email, p.education, p.created_at AS person_created_at, p.updated_at AS person_updated_at,
        st.staff_id, st.employee_id, st.employment_status, st.hire_date,
        s.student_id, s.graduation_status, s.academic_standing, s.registration_date
      FROM accounts a
      JOIN account_roles ar ON a.account_id = ar.account_id AND ar.is_active = TRUE
      JOIN roles r ON ar.role_id = r.role_id
      LEFT JOIN staff st ON a.account_id = st.account_id
      LEFT JOIN students s ON a.account_id = s.account_id
      LEFT JOIN persons p ON a.account_id = p.person_id
      WHERE a.account_id = ? AND a.token = ?
    `,
        [payload.accountId, token]
      );

      if (rows.length === 0) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }

      const user = rows[0];

      // Fetch contact information
      let contactInfo = [];
      if (user.person_id) {
        const [contactRows] = await pool.execute(
          `
        SELECT contact_type, contact_value, is_primary
        FROM contact_info
        WHERE person_id = ?
        ORDER BY is_primary DESC, contact_type
      `,
          [user.person_id]
        );
        contactInfo = contactRows;
      }

      // Fetch additional data based on role
      let additionalData = {};

      if (user.role_name === "student" && user.student_id) {
        // Fetch trading levels
        const [tradingLevels] = await pool.execute(
          `
        SELECT 
          tl.level_name,
          tl.level_description,
          stl.is_current,
          stl.assigned_date
        FROM student_trading_levels stl
        JOIN trading_levels tl ON stl.level_id = tl.level_id
        WHERE stl.student_id = ?
        ORDER BY stl.assigned_date DESC
      `,
          [user.student_id]
        );

        // Fetch learning preferences
        const [learningPrefs] = await pool.execute(
          `
        SELECT device_type, learning_style, created_at
        FROM learning_preferences
        WHERE student_id = ?
      `,
          [user.student_id]
        );

        additionalData = {
          trading_levels: tradingLevels,
          learning_preferences: learningPrefs,
        };
      }

      // Build response user object
      const responseUser = {
        account: {
          account_id: user.account_id,
          username: user.username,
          account_status: user.account_status,
          last_login: user.last_login,
          failed_login_attempts: user.failed_login_attempts,
          locked_until: user.locked_until,
          created_at: user.created_at,
          updated_at: user.updated_at,
        },
        role: {
          role_id: user.role_id,
          role_name: user.role_name,
          permissions: user.permissions,
        },
        person: {
          person_id: user.person_id,
          first_name: user.first_name,
          middle_name: user.middle_name,
          last_name: user.last_name,
          full_name: `${user.first_name} ${
            user.middle_name ? user.middle_name + " " : ""
          }${user.last_name}`.trim(),
          gender: user.gender,
          birth_date: user.birth_date,
          birth_place: user.birth_place,
          email: user.email,
          education: user.education,
          created_at: user.person_created_at,
          updated_at: user.person_updated_at,
        },
        contact_info: contactInfo,
        profile: {},
        additional_data: additionalData,
      };

      // Set role-specific profile data
      if (user.role_name === "student") {
        responseUser.profile = {
          student_id: user.student_id,
          graduation_status: user.graduation_status,
          academic_standing: user.academic_standing,
          registration_date: user.registration_date,
          current_trading_level:
            additionalData.trading_levels?.find((tl) => tl.is_current)
              ?.level_name || null,
          total_enrollments: additionalData.enrollments?.length || 0,
          active_enrollments:
            additionalData.enrollments?.filter((e) => e.status === "active")
              .length || 0,
          completed_courses:
            additionalData.enrollments?.filter((e) => e.status === "completed")
              .length || 0,
        };
      } else if (user.role_name === "staff" || user.role_name === "admin") {
        responseUser.profile = {
          staff_id: user.staff_id,
          employee_id: user.employee_id,
          employment_status: user.employment_status,
          hire_date: user.hire_date,
        };
      }

      // Update last login time
      await pool.execute(
        `
      UPDATE accounts 
      SET last_login = NOW() 
      WHERE account_id = ?
    `,
        [user.account_id]
      );

      return res.status(200).json({
        success: true,
        token,
        user: responseUser,
      });
    } catch (err) {
      console.error("Login token validation error:", err);
      return res.status(401).json({ error: "Invalid token" });
    }
  }
);

app.post("/api/auth/logout", authenticateToken, async (req, res) => {
  try {
    const accountId = req.user.accountId;

    // Remove token from DB
    await pool.execute(
      `UPDATE accounts SET token = NULL WHERE account_id = ?`,
      [accountId]
    );

    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ error: "Logout failed" });
  }
});

// ============================================================================
// PROFILE ROUTES (Updated for synced IDs)
// ============================================================================

// GET profile by account_id
app.get("/api/profile/:account_id", async (req, res) => {
  try {
    const account_id = req.params.account_id;

    console.log("🔍 Fetching profile for account_id:", account_id);

    const [profile] = await pool.execute(
      `
      SELECT 
        a.account_id,
        s.student_id,
        CONCAT(p.first_name, ' ', COALESCE(p.middle_name, ''), ' ', p.last_name) as name,
        p.first_name,
        p.middle_name,
        p.last_name,
        p.email,
        p.birth_date,
        p.birth_place,
        p.gender,
        p.education,
        p.created_at,
        p.updated_at,
        s.graduation_status as status,
        tl.level_name as trading_level,
        lp.delivery_preference as learning_style,
        phone_contact.contact_value as phone_no,
        address_contact.contact_value as address,
        r.role_name as roles
      FROM accounts a
      LEFT JOIN students s ON a.account_id = s.account_id
      LEFT JOIN persons p ON a.account_id = p.person_id
      LEFT JOIN student_trading_levels stl ON s.student_id = stl.student_id AND stl.is_current = 1
      LEFT JOIN trading_levels tl ON stl.level_id = tl.level_id
      LEFT JOIN learning_preferences lp ON s.student_id = lp.student_id
      LEFT JOIN contact_info phone_contact ON a.account_id = phone_contact.person_id 
        AND phone_contact.contact_type = 'phone' AND phone_contact.is_primary = 1
      LEFT JOIN contact_info address_contact ON a.account_id = address_contact.person_id 
        AND address_contact.contact_type = 'address' AND address_contact.is_primary = 1
      LEFT JOIN account_roles ar ON a.account_id = ar.account_id AND ar.is_active = 1
      LEFT JOIN roles r ON ar.role_id = r.role_id
      WHERE a.account_id = ?
    `,
      [account_id]
    );

    if (profile.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      });
    }

    console.log("✅ Profile data retrieved:", profile[0]);

    res.json({
      success: true,
      profile: profile[0],
    });
  } catch (error) {
    console.error("❌ Profile fetch error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch profile data",
    });
  }
});

// Helper function to handle contact info updates (place this BEFORE the route handler)
async function updateContactInfo(
  connection,
  person_id,
  student_id,
  contact_type,
  contact_value
) {
  if (!contact_value || !person_id) return false;

  try {
    console.log(`🔄 Updating ${contact_type} contact:`, contact_value);

    // First, try to update existing record
    const [updateResult] = await connection.execute(
      `
      UPDATE contact_info 
      SET contact_value = ?, updated_at = CURRENT_TIMESTAMP
      WHERE person_id = ? AND contact_type = ? AND is_primary = 1
    `,
      [contact_value, person_id, contact_type]
    );

    // If no rows were updated, insert a new record
    if (updateResult.affectedRows === 0) {
      // Delete any existing records of this type for this person to avoid duplicates
      await connection.execute(
        `
        DELETE FROM contact_info 
        WHERE person_id = ? AND contact_type = ?
      `,
        [person_id, contact_type]
      );

      // Insert a new record
      await connection.execute(
        `
        INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary, is_verified)
        VALUES (?, ?, ?, ?, 1, 0)
      `,
        [person_id, student_id || null, contact_type, contact_value]
      );
    }

    console.log(`✅ ${contact_type} contact updated successfully`);
    return true;
  } catch (error) {
    console.error(`❌ ${contact_type} update error:`, error);

    // Fallback approach - force delete and insert
    try {
      await connection.execute(
        `
        DELETE FROM contact_info 
        WHERE person_id = ? AND contact_type = ?
      `,
        [person_id, contact_type]
      );

      await connection.execute(
        `
        INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary, is_verified)
        VALUES (?, ?, ?, ?, 1, 0)
      `,
        [person_id, student_id || null, contact_type, contact_value]
      );

      console.log(`✅ ${contact_type} contact updated (fallback method)`);
      return true;
    } catch (fallbackError) {
      console.error(
        `❌ ${contact_type} fallback update failed:`,
        fallbackError
      );
      return false;
    }
  }
}

// PUT /api/profile/:account_id - Update user profile (FIXED with enhanced phone/email handling)
app.put(
  "/api/profile/:account_id",
  [
    body("name").optional().trim().isLength({ min: 1, max: 100 }),
    body("email").optional().isEmail(),
    body("phone_no").optional().trim().isLength({ min: 1, max: 15 }),
    body("address").optional().trim().isLength({ max: 500 }),
    body("trading_level")
      .optional()
      .isIn([
        "Beginner",
        "Intermediate",
        "Advanced",
        "beginner",
        "intermediate",
        "advanced",
      ]),
    body("learning_style")
      .optional()
      .isIn(["In-person", "Online", "in-person", "online", ""]),
    body("gender")
      .optional()
      .isIn(["Male", "Female", "Other", "male", "female", "other"]),
  ],
  async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const account_id = req.params.account_id;
      const {
        name,
        email,
        phone_no,
        address,
        trading_level,
        learning_style,
        gender,
        birth_date,
        birth_place,
        education,
      } = req.body;

      console.log("🔄 Updating profile for account_id:", account_id);
      console.log("📝 Data received:", req.body);

      await connection.beginTransaction();

      // Check if email is already used by another account (if email is being changed)
      if (email) {
        const [existingEmail] = await connection.execute(
          `
        SELECT person_id FROM persons 
        WHERE email = ? AND person_id != ?
      `,
          [email, account_id]
        );

        if (existingEmail.length > 0) {
          await connection.rollback();
          return res.status(409).json({
            success: false,
            error: "Email is already in use by another account",
          });
        }
      }

      // Check if phone number is already used by another account (if phone is being changed)
      if (phone_no) {
        const [existingPhone] = await connection.execute(
          `
        SELECT person_id FROM contact_info 
        WHERE contact_type = 'phone' AND contact_value = ? AND person_id != ?
      `,
          [phone_no, account_id]
        );

        if (existingPhone.length > 0) {
          await connection.rollback();
          return res.status(409).json({
            success: false,
            error: "Phone number is already in use by another account",
          });
        }
      }

      // Get current profile data (person_id now equals account_id)
      const [currentProfile] = await connection.execute(
        `
      SELECT 
        a.account_id as person_id,
        s.student_id,
        p.first_name,
        p.middle_name,
        p.last_name,
        p.email as person_email,
        p.birth_date,
        p.birth_place,
        p.gender,
        p.education
      FROM accounts a
      LEFT JOIN students s ON a.account_id = s.account_id
      LEFT JOIN persons p ON a.account_id = p.person_id
      WHERE a.account_id = ?
    `,
        [account_id]
      );

      if (currentProfile.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          error: "Profile not found",
        });
      }

      const profile = currentProfile[0];
      const person_id = profile.person_id; // This now equals account_id
      const student_id = profile.student_id;

      console.log("📋 Current profile:", profile);

      // Update persons table if any personal information has changed
      if (name || email || birth_date || birth_place || gender || education) {
        let first_name = profile.first_name;
        let middle_name = profile.middle_name;
        let last_name = profile.last_name;

        if (name) {
          const nameParts = name.trim().split(" ");
          first_name = nameParts[0] || "";
          if (nameParts.length === 2) {
            // Just first and last name
            middle_name = "";
            last_name = nameParts[1];
          } else if (nameParts.length > 2) {
            // First, middle(s), and last name
            last_name = nameParts[nameParts.length - 1];
            middle_name = nameParts.slice(1, -1).join(" ");
          } else {
            // Only one name provided
            last_name = "";
            middle_name = "";
          }
        }

        // Convert birth_date if it's a string
        let formatted_birth_date = birth_date;
        if (birth_date && typeof birth_date === "string") {
          try {
            formatted_birth_date = new Date(birth_date)
              .toISOString()
              .split("T")[0];
          } catch (e) {
            console.warn("⚠️ Invalid birth_date format:", birth_date);
            formatted_birth_date = null;
          }
        }

        // Normalize gender
        const normalized_gender = gender
          ? gender.charAt(0).toUpperCase() + gender.slice(1).toLowerCase()
          : null;

        // Convert undefined to null for MySQL compatibility
        const safeParams = [
          first_name || null,
          middle_name || null,
          last_name || null,
          email || null,
          formatted_birth_date || null,
          birth_place || null,
          normalized_gender || null,
          education || null,
          person_id,
        ];

        console.log("🔄 Updating persons table with safe parameters:", {
          first_name: safeParams[0],
          middle_name: safeParams[1],
          last_name: safeParams[2],
          email: safeParams[3],
          formatted_birth_date: safeParams[4],
          birth_place: safeParams[5],
          normalized_gender: safeParams[6],
          education: safeParams[7],
        });

        await connection.execute(
          `
        UPDATE persons 
        SET 
          first_name = COALESCE(?, first_name),
          middle_name = COALESCE(?, middle_name),
          last_name = COALESCE(?, last_name),
          email = COALESCE(?, email),
          birth_date = COALESCE(?, birth_date),
          birth_place = COALESCE(?, birth_place),
          gender = COALESCE(?, gender),
          education = COALESCE(?, education),
          updated_at = CURRENT_TIMESTAMP
        WHERE person_id = ?
      `,
          safeParams
        );

        console.log("✅ Persons table updated");
      }

      // Update contact information using helper function
      if (phone_no && student_id) {
        await updateContactInfo(
          connection,
          person_id,
          student_id,
          "phone",
          phone_no
        );
      }

      if (address && student_id) {
        await updateContactInfo(
          connection,
          person_id,
          student_id,
          "address",
          address
        );
      }

      if (email && student_id) {
        // For email, also update the persons table (already done above if email is provided)
        // Then update contact_info
        await updateContactInfo(
          connection,
          person_id,
          student_id,
          "email",
          email
        );
      }

      // Update student trading level if provided
      if (trading_level && student_id) {
        // Normalize trading level name
        const normalized_trading_level =
          trading_level.charAt(0).toUpperCase() +
          trading_level.slice(1).toLowerCase();

        console.log("🔄 Updating trading level:", normalized_trading_level);

        const [levelResult] = await connection.execute(
          `
        SELECT level_id FROM trading_levels WHERE level_name = ?
      `,
          [normalized_trading_level]
        );

        if (levelResult.length > 0) {
          const level_id = levelResult[0].level_id;

          // Set current level to not current
          await connection.execute(
            `
          UPDATE student_trading_levels 
          SET is_current = 0 
          WHERE student_id = ?
        `,
            [student_id || null]
          );

          // Insert new current level
          await connection.execute(
            `
          INSERT INTO student_trading_levels (student_id, level_id, assigned_date, is_current)
          VALUES (?, ?, CURRENT_TIMESTAMP, 1)
          ON DUPLICATE KEY UPDATE 
            is_current = 1,
            assigned_date = CURRENT_TIMESTAMP
        `,
            [student_id || null, level_id]
          );

          console.log("✅ Trading level updated");
        } else {
          console.warn("⚠️ Trading level not found:", normalized_trading_level);
        }
      }

      // Update learning preferences if provided
      if (learning_style !== undefined && student_id) {
        let delivery_preference = "hybrid"; // default

        if (learning_style === "In-person" || learning_style === "in-person") {
          delivery_preference = "in-person";
        } else if (learning_style === "Online" || learning_style === "online") {
          delivery_preference = "online";
        } else if (learning_style === "") {
          delivery_preference = "hybrid"; // default for empty string
        }

        console.log("🔄 Updating learning preferences:", delivery_preference);

        await connection.execute(
          `
        INSERT INTO learning_preferences (student_id, delivery_preference)
        VALUES (?, ?)
        ON DUPLICATE KEY UPDATE 
          delivery_preference = VALUES(delivery_preference),
          updated_at = CURRENT_TIMESTAMP
      `,
          [student_id || null, delivery_preference]
        );

        console.log("✅ Learning preferences updated");
      }

      // Log the profile update
      await connection.execute(
        `
      INSERT INTO activity_logs (account_id, action, description, created_at)
      VALUES (?, 'profile_updated', 'User profile was updated', CURRENT_TIMESTAMP)
    `,
        [account_id]
      );

      await connection.commit();
      console.log("✅ Transaction committed");

      // Fetch the updated profile data to return
      const [updatedProfile] = await connection.execute(
        `
      SELECT 
        a.account_id,
        s.student_id,
        TRIM(CONCAT(p.first_name, ' ', COALESCE(p.middle_name, ''), ' ', p.last_name)) as name,
        p.first_name,
        p.middle_name,
        p.last_name,
        p.email,
        p.birth_date,
        p.birth_place,
        p.gender,
        p.education,
        p.created_at,
        p.updated_at,
        s.graduation_status as status,
        tl.level_name as trading_level,
        lp.delivery_preference as learning_style,
        phone_contact.contact_value as phone_no,
        address_contact.contact_value as address,
        r.role_name as roles
      FROM accounts a
      LEFT JOIN students s ON a.account_id = s.account_id
      LEFT JOIN persons p ON a.account_id = p.person_id
      LEFT JOIN student_trading_levels stl ON s.student_id = stl.student_id AND stl.is_current = 1
      LEFT JOIN trading_levels tl ON stl.level_id = tl.level_id
      LEFT JOIN learning_preferences lp ON s.student_id = lp.student_id
      LEFT JOIN contact_info phone_contact ON a.account_id = phone_contact.person_id 
        AND phone_contact.contact_type = 'phone' AND phone_contact.is_primary = 1
      LEFT JOIN contact_info address_contact ON a.account_id = address_contact.person_id 
        AND address_contact.contact_type = 'address' AND address_contact.is_primary = 1
      LEFT JOIN account_roles ar ON a.account_id = ar.account_id AND ar.is_active = 1
      LEFT JOIN roles r ON ar.role_id = r.role_id
      WHERE a.account_id = ?
    `,
        [account_id]
      );

      if (updatedProfile.length === 0) {
        return res.status(404).json({
          success: false,
          error: "Updated profile not found",
        });
      }

      console.log("✅ Profile update successful:", updatedProfile[0]);

      res.json({
        success: true,
        message: "Profile updated successfully",
        profile: updatedProfile[0],
      });
    } catch (error) {
      await connection.rollback();
      console.error("❌ Profile update error:", error);
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);

      let errorMessage = "Failed to update profile";
      if (error.code === "ER_DUP_ENTRY") {
        errorMessage = "Email or phone number already exists";
      } else if (error.code === "ER_DATA_TOO_LONG") {
        errorMessage = "One or more fields exceed maximum length";
      } else if (error.code === "ER_BAD_NULL_ERROR") {
        errorMessage = "Required field cannot be empty";
      } else if (error.code === "ER_NO_SUCH_TABLE") {
        errorMessage = "Database table not found - please check database setup";
      } else if (error.code === "ER_BAD_FIELD_ERROR") {
        errorMessage = "Database field error - please check database schema";
      }

      res.status(500).json({
        success: false,
        error: errorMessage,
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    } finally {
      connection.release();
    }
  }
);
// ============================================================================
// STUDENT ROUTES (Updated for synced IDs)
// ============================================================================

app.get(
  "/api/students",
  authenticateToken,
  authorize(["admin", "staff"]),
  async (req, res) => {
    try {
      const { name_sort, graduation_status, trading_level, search } = req.query;

      let query = `
      SELECT s.student_id, s.graduation_status, s.academic_standing, s.gpa, s.registration_date,
             p.first_name, p.last_name, p.birth_date, p.birth_place, p.gender,
             tl.level_name as current_trading_level,
             COUNT(DISTINCT se.enrollment_id) as total_enrollments
      FROM students s
      JOIN persons p ON s.person_id = p.person_id
      LEFT JOIN student_trading_levels stl ON s.student_id = stl.student_id AND stl.is_current = TRUE
      LEFT JOIN trading_levels tl ON stl.level_id = tl.level_id
      LEFT JOIN student_enrollments se ON s.student_id = se.student_id
      WHERE 1=1
    `;
      const params = [];

      if (graduation_status) {
        query += " AND s.graduation_status = ?";
        params.push(graduation_status);
      }

      if (trading_level) {
        query += " AND tl.level_name = ?";
        params.push(trading_level);
      }

      if (search) {
        query +=
          " AND (p.first_name LIKE ? OR p.last_name LIKE ? OR s.student_id LIKE ?)";
        const searchParam = `%${search}%`;
        params.push(searchParam, searchParam, searchParam);
      }

      query +=
        " GROUP BY s.student_id, p.first_name, p.last_name, p.birth_date, p.birth_place, p.gender, s.graduation_status, s.academic_standing, s.gpa, s.registration_date, tl.level_name";

      if (name_sort) {
        query += ` ORDER BY p.first_name ${
          name_sort === "ascending" ? "ASC" : "DESC"
        }`;
      } else {
        query += " ORDER BY s.registration_date DESC";
      }

      const [students] = await pool.execute(query, params);
      res.json(students);
    } catch (error) {
      console.error("Students fetch error:", error);
      res.status(500).json({ error: "Failed to fetch students" });
    }
  }
);

app.post(
  "/api/students",
  [
    authenticateToken,
    authorize(["admin", "staff"]),
    body("first_name").trim().isLength({ min: 1, max: 50 }).escape(),
    body("last_name").trim().isLength({ min: 1, max: 50 }).escape(),
    body("birth_date").isISO8601(),
    body("birth_place").trim().isLength({ min: 1, max: 100 }).escape(),
    body("gender").isIn(["Male", "Female", "Other"]),
    body("email").isEmail().normalizeEmail(),
    body("education").trim().isLength({ min: 1, max: 100 }).escape(),
  ],
  validateInput,
  async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const {
        first_name,
        middle_name,
        last_name,
        birth_date,
        birth_place,
        gender,
        email,
        education,
        phone,
        address,
        username,
        password,
        trading_level_id,
      } = req.body;

      let account_id = null;
      if (username && password) {
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Use stored procedure for synced creation
        const [result] = await connection.execute(
          `
        CALL sp_register_user_with_synced_ids(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @account_id, @result)
      `,
          [
            username,
            hashedPassword,
            first_name,
            middle_name,
            last_name,
            birth_date,
            birth_place,
            gender,
            email,
            education,
            phone,
            address,
            "student",
          ]
        );

        const [output] = await connection.execute(
          `SELECT @account_id as account_id, @result as result`
        );
        account_id = output[0].account_id;

        if (!output[0].result.startsWith("SUCCESS")) {
          return res.status(400).json({ error: output[0].result });
        }
      } else {
        // Manual creation without account
        await connection.beginTransaction();

        // Create person first to get an ID
        const [personResult] = await connection.execute(
          `
        INSERT INTO persons (first_name, middle_name, last_name, birth_date, birth_place, gender, email, education)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
          [
            first_name,
            middle_name || null,
            last_name,
            birth_date,
            birth_place,
            gender,
            email,
            education,
          ]
        );

        const person_id = personResult.insertId;
        const student_id = `S${Date.now()}_${person_id}`;

        // Insert into students table
        await connection.execute(
          `
        INSERT INTO students (student_id, person_id, account_id, registration_date)
        VALUES (?, ?, ?, CURRENT_DATE)
      `,
          [student_id, person_id, null]
        );

        // Insert contact information
        if (phone) {
          await connection.execute(
            `
          INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary)
          VALUES (?, ?, 'phone', ?, TRUE)
        `,
            [person_id, student_id, phone]
          );
        }

        if (address) {
          await connection.execute(
            `
          INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary)
          VALUES (?, ?, 'address', ?, TRUE)
        `,
            [person_id, student_id, address]
          );
        }

        await connection.execute(
          `
        INSERT INTO contact_info (person_id, student_id, contact_type, contact_value, is_primary)
        VALUES (?, ?, 'email', ?, TRUE)
      `,
          [person_id, student_id, email]
        );

        await connection.commit();
        account_id = person_id;
      }

      // Assign trading level if provided
      if (trading_level_id && account_id) {
        const [studentData] = await connection.execute(
          `
        SELECT student_id FROM students WHERE account_id = ? OR person_id = ?
      `,
          [account_id, account_id]
        );

        if (studentData.length > 0) {
          const student_id = studentData[0].student_id;

          const [staffRows] = await connection.execute(
            `
          SELECT staff_id FROM staff WHERE account_id = ?
        `,
            [req.user.accountId]
          );

          const assigned_by = staffRows[0]?.staff_id || null;

          await connection.execute(
            `
          INSERT INTO student_trading_levels (student_id, level_id, assigned_by, is_current)
          VALUES (?, ?, ?, TRUE)
        `,
            [student_id, trading_level_id, assigned_by]
          );
        }
      }

      res.status(201).json({
        account_id,
        message: "Student created successfully",
      });
    } catch (error) {
      await connection.rollback();
      console.error("Student creation error:", error);

      if (error.code === "ER_DUP_ENTRY") {
        res.status(409).json({ error: "Username or email already exists" });
      } else {
        res.status(500).json({ error: "Failed to create student" });
      }
    } finally {
      connection.release();
    }
  }
);

app.get(
  "/api/students/:studentId",
  authenticateToken,
  authorize(["admin", "staff", "student"]),
  authorizeStudentAccess,
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const [students] = await pool.execute(
        `
      SELECT s.student_id, s.graduation_status, s.academic_standing, s.gpa, s.registration_date,
             p.person_id, p.first_name, p.middle_name, p.last_name, p.birth_date, p.birth_place, p.gender, p.email, p.education,
             tl.level_name as current_trading_level, tl.level_id,
             a.account_status
      FROM students s
      JOIN persons p ON s.person_id = p.person_id
      LEFT JOIN accounts a ON s.account_id = a.account_id
      LEFT JOIN student_trading_levels stl ON s.student_id = stl.student_id AND stl.is_current = TRUE
      LEFT JOIN trading_levels tl ON stl.level_id = tl.level_id
      WHERE s.student_id = ?
    `,
        [studentId]
      );

      if (students.length === 0) {
        return res.status(404).json({ error: "Student not found" });
      }

      const [contacts] = await pool.execute(
        `
      SELECT contact_type, contact_value, is_primary
      FROM contact_info
      WHERE student_id = ?
    `,
        [studentId]
      );

      res.json({
        ...students[0],
        contacts,
      });
    } catch (error) {
      console.error("Student fetch error:", error);
      res.status(500).json({ error: "Failed to fetch student details" });
    }
  }
);

// ============================================================================
// DASHBOARD ROUTES (Updated for synced IDs)
// ============================================================================

app.get(
  "/api/dashboard/metrics",
  authenticateToken,
  authorize(["admin", "staff"]),
  async (req, res) => {
    try {
      const [enrolledCount] = await pool.execute(
        `SELECT COUNT(*) as count FROM students WHERE graduation_status = 'enrolled'`
      );

      const [graduatedCount] = await pool.execute(
        `SELECT COUNT(*) as count FROM students WHERE graduation_status = 'graduated'`
      );

      const [pendingPayments] = await pool.execute(
        `SELECT COUNT(*) as count FROM payments WHERE payment_status = 'pending'`
      );

      const [totalRevenue] = await pool.execute(
        `SELECT SUM(payment_amount) as total FROM payments WHERE payment_status = 'confirmed'`
      );

      const [monthlyEnrollments] = await pool.execute(`
      SELECT MONTH(registration_date) as month, COUNT(*) as count 
      FROM students 
      WHERE YEAR(registration_date) = YEAR(CURDATE())
      GROUP BY MONTH(registration_date)
      ORDER BY month
    `);

      const [competencyBreakdown] = await pool.execute(`
      SELECT tl.level_name, COUNT(*) as count 
      FROM students s
      LEFT JOIN student_trading_levels stl ON s.student_id = stl.student_id AND stl.is_current = TRUE
      LEFT JOIN trading_levels tl ON stl.level_id = tl.level_id
      GROUP BY tl.level_name
    `);

      res.json({
        enrolled_students: enrolledCount[0].count,
        graduated_students: graduatedCount[0].count,
        pending_payments: pendingPayments[0].count,
        total_revenue: totalRevenue[0].total || 0,
        monthly_enrollments: monthlyEnrollments,
        competency_breakdown: competencyBreakdown,
      });
    } catch (error) {
      console.error("Dashboard metrics error:", error);
      res.status(500).json({ error: "Failed to fetch dashboard metrics" });
    }
  }
);

app.get(
  "/api/dashboard/student/:studentId",
  authenticateToken,
  authorize(["student", "admin", "staff"]),
  authorizeStudentAccess,
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const [studentInfo] = await pool.execute(
        `
      SELECT s.student_id, s.graduation_status, s.academic_standing, s.gpa,
             p.first_name, p.last_name, p.birth_date,
             tl.level_name as current_trading_level
      FROM students s
      JOIN persons p ON s.person_id = p.person_id
      LEFT JOIN student_trading_levels stl ON s.student_id = stl.student_id AND stl.is_current = TRUE
      LEFT JOIN trading_levels tl ON stl.level_id = tl.level_id
      WHERE s.student_id = ?
    `,
        [studentId]
      );

      const [enrollments] = await pool.execute(
        `
      SELECT se.enrollment_id, se.enrollment_status, se.completion_percentage,
             c.course_name, co.batch_identifier, co.start_date, co.end_date
      FROM student_enrollments se
      JOIN course_offerings co ON se.offering_id = co.offering_id
      JOIN courses c ON co.course_id = c.course_id
      WHERE se.student_id = ?
      ORDER BY co.start_date DESC
    `,
        [studentId]
      );

      const [financialSummary] = await pool.execute(
        `
      SELECT 
        COALESCE(SUM(sa.total_due), 0) as total_due,
        COALESCE(SUM(sa.amount_paid), 0) as amount_paid,
        COALESCE(SUM(sa.balance), 0) as balance
      FROM student_accounts sa
      WHERE sa.student_id = ?
    `,
        [studentId]
      );

      const [recentProgress] = await pool.execute(
        `
      SELECT sp.score, sp.max_score, sp.percentage_score, sp.passed, sp.attempt_date,
             comp.competency_name, ct.type_name as competency_type
      FROM student_progress sp
      JOIN student_enrollments se ON sp.enrollment_id = se.enrollment_id
      JOIN competencies comp ON sp.competency_id = comp.competency_id
      JOIN competency_types ct ON comp.competency_type_id = ct.competency_type_id
      WHERE se.student_id = ?
      ORDER BY sp.attempt_date DESC
      LIMIT 5
    `,
        [studentId]
      );

      res.json({
        student: studentInfo[0] || {},
        enrollments,
        financial: financialSummary[0] || {
          total_due: 0,
          amount_paid: 0,
          balance: 0,
        },
        recent_progress: recentProgress,
      });
    } catch (error) {
      console.error("Student dashboard error:", error);
      res.status(500).json({ error: "Failed to fetch student dashboard" });
    }
  }
);

// ============================================================================
// PAYMENT ROUTES (Fixed)
// ============================================================================

app.get(
  "/api/payments",
  authenticateToken,
  authorize(["admin", "staff"]),
  async (req, res) => {
    try {
      const { name_sort, status, student_search } = req.query;

      let query = `
      SELECT p.payment_id, p.payment_amount, p.processing_fee, p.payment_date, p.payment_status,
             p.reference_number, pm.method_name,
             sa.total_due, sa.balance,
             s.student_id, per.first_name, per.last_name,
             c.course_name, co.batch_identifier
      FROM payments p
      JOIN payment_methods pm ON p.method_id = pm.method_id
      JOIN student_accounts sa ON p.account_id = sa.account_id
      JOIN students s ON sa.student_id = s.student_id
      JOIN persons per ON s.person_id = per.person_id
      JOIN course_offerings co ON sa.offering_id = co.offering_id
      JOIN courses c ON co.course_id = c.course_id
      WHERE 1=1
    `;
      const params = [];

      if (status) {
        query += " AND p.payment_status = ?";
        params.push(status);
      }

      if (student_search) {
        query +=
          " AND (per.first_name LIKE ? OR per.last_name LIKE ? OR s.student_id LIKE ?)";
        const searchParam = `%${student_search}%`;
        params.push(searchParam, searchParam, searchParam);
      }

      if (name_sort) {
        query += ` ORDER BY per.first_name ${
          name_sort === "ascending" ? "ASC" : "DESC"
        }`;
      } else {
        query += " ORDER BY p.payment_date DESC";
      }

      const [payments] = await pool.execute(query, params);
      res.json(payments);
    } catch (error) {
      console.error("Payments fetch error:", error);
      res.status(500).json({ error: "Failed to fetch payments" });
    }
  }
);

app.post(
  "/api/payments",
  [
    authenticateToken,
    authorize(["admin", "staff"]),
    body("account_id").isInt(),
    body("method_id").isInt(),
    body("payment_amount").isFloat({ min: 0.01 }),
    body("reference_number").optional().trim().isLength({ max: 50 }),
  ],
  validateInput,
  async (req, res) => {
    try {
      const { account_id, method_id, payment_amount, reference_number, notes } =
        req.body;

      // Get staff_id for processed_by
      const [staffRows] = await pool.execute(
        "SELECT staff_id FROM staff WHERE account_id = ?",
        [req.user.accountId]
      );
      const staffId = staffRows[0]?.staff_id;

      const [result] = await pool.execute(
        `
      CALL sp_process_payment(?, ?, ?, ?, ?, @result);
      SELECT @result as result;
    `,
        [
          account_id,
          method_id,
          payment_amount,
          reference_number || null,
          staffId,
        ]
      );

      const processingResult = result[1][0].result;

      if (processingResult.startsWith("SUCCESS")) {
        res.status(201).json({ message: processingResult });
      } else {
        res.status(400).json({ error: processingResult });
      }
    } catch (error) {
      console.error("Payment creation error:", error);
      res.status(500).json({ error: "Failed to process payment" });
    }
  }
);

app.get(
  "/api/students/:studentId/payments",
  authenticateToken,
  authorize(["admin", "staff", "student"]),
  authorizeStudentAccess,
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const [payments] = await pool.execute(
        `
      SELECT p.payment_id, p.payment_amount, p.processing_fee, p.payment_date, p.payment_status,
             p.reference_number, pm.method_name,
             sa.total_due, sa.balance,
             c.course_name, co.batch_identifier
      FROM payments p
      JOIN payment_methods pm ON p.method_id = pm.method_id
      JOIN student_accounts sa ON p.account_id = sa.account_id
      JOIN course_offerings co ON sa.offering_id = co.offering_id
      JOIN courses c ON co.course_id = c.course_id
      WHERE sa.student_id = ?
      ORDER BY p.payment_date DESC
    `,
        [studentId]
      );

      res.json(payments);
    } catch (error) {
      console.error("Student payments fetch error:", error);
      res.status(500).json({ error: "Failed to fetch student payments" });
    }
  }
);

// ============================================================================
// DOCUMENT ROUTES (Fixed)
// ============================================================================

app.get(
  "/api/documents",
  authenticateToken,
  authorize(["admin", "staff"]),
  async (req, res) => {
    try {
      const { verification_status, student_search } = req.query;

      let query = `
      SELECT sd.document_id, sd.original_filename, sd.upload_date, sd.verification_status,
             sd.verified_date, sd.is_current,
             dt.type_name as document_type, dt.is_required,
             s.student_id, per.first_name, per.last_name,
             staff_per.first_name as verified_by_first_name, staff_per.last_name as verified_by_last_name
      FROM student_documents sd
      JOIN document_types dt ON sd.document_type_id = dt.document_type_id
      JOIN students s ON sd.student_id = s.student_id
      JOIN persons per ON s.person_id = per.person_id
      LEFT JOIN staff st ON sd.verified_by = st.staff_id
      LEFT JOIN persons staff_per ON st.person_id = staff_per.person_id
      WHERE sd.is_current = TRUE
    `;
      const params = [];

      if (verification_status) {
        query += " AND sd.verification_status = ?";
        params.push(verification_status);
      }

      if (student_search) {
        query +=
          " AND (per.first_name LIKE ? OR per.last_name LIKE ? OR s.student_id LIKE ?)";
        const searchParam = `%${student_search}%`;
        params.push(searchParam, searchParam, searchParam);
      }

      query += " ORDER BY sd.upload_date DESC";

      const [documents] = await pool.execute(query, params);
      res.json(documents);
    } catch (error) {
      console.error("Documents fetch error:", error);
      res.status(500).json({ error: "Failed to fetch documents" });
    }
  }
);

app.post(
  "/api/documents/upload",
  [
    authenticateToken,
    authorize(["admin", "staff", "student"]),
    upload.single("document"),
  ],
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const { student_id, document_type_id } = req.body;

      if (req.user.role === "student") {
        const [studentRows] = await pool.execute(
          "SELECT student_id FROM students WHERE student_id = ? AND account_id = ?",
          [student_id, req.user.accountId]
        );

        if (studentRows.length === 0) {
          fs.unlinkSync(req.file.path);
          return res
            .status(403)
            .json({ error: "Access denied to this student record" });
        }
      }

      const fileBuffer = fs.readFileSync(req.file.path);
      const fileHash = crypto
        .createHash("sha256")
        .update(fileBuffer)
        .digest("hex");

      // Mark previous documents as not current
      await pool.execute(
        `
      UPDATE student_documents 
      SET is_current = FALSE 
      WHERE student_id = ? AND document_type_id = ?
    `,
        [student_id, document_type_id]
      );

      let uploadedBy = null;
      if (req.user.role !== "student") {
        const [staffRows] = await pool.execute(
          "SELECT staff_id FROM staff WHERE account_id = ?",
          [req.user.accountId]
        );
        uploadedBy = staffRows[0]?.staff_id || null;
      }

      await pool.execute(
        `
      INSERT INTO student_documents (
        student_id, document_type_id, original_filename, stored_filename, 
        file_path, file_size_bytes, mime_type, file_hash, uploaded_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [
          student_id,
          document_type_id,
          req.file.originalname,
          req.file.filename,
          req.file.path,
          req.file.size,
          req.file.mimetype,
          fileHash,
          uploadedBy,
        ]
      );

      res.status(201).json({ message: "Document uploaded successfully" });
    } catch (error) {
      console.error("Document upload error:", error);
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: "Failed to upload document" });
    }
  }
);

app.put(
  "/api/documents/:documentId/verify",
  [
    authenticateToken,
    authorize(["admin", "staff"]),
    body("verification_status").isIn([
      "verified",
      "rejected",
      "requires_update",
    ]),
    body("verification_notes").optional().trim().isLength({ max: 1000 }),
  ],
  validateInput,
  async (req, res) => {
    try {
      const { documentId } = req.params;
      const { verification_status, verification_notes } = req.body;

      const [staffRows] = await pool.execute(
        "SELECT staff_id FROM staff WHERE account_id = ?",
        [req.user.accountId]
      );

      const staffId = staffRows[0]?.staff_id;

      await pool.execute(
        `
      UPDATE student_documents 
      SET verification_status = ?, verified_by = ?, verified_date = NOW(), verification_notes = ?
      WHERE document_id = ?
    `,
        [verification_status, staffId, verification_notes || null, documentId]
      );

      res.json({
        message: "Document verification status updated successfully",
      });
    } catch (error) {
      console.error("Document verification error:", error);
      res.status(500).json({ error: "Failed to update document verification" });
    }
  }
);

app.get(
  "/api/students/:studentId/documents",
  authenticateToken,
  authorize(["admin", "staff", "student"]),
  authorizeStudentAccess,
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const [documents] = await pool.execute(
        `
      SELECT sd.document_id, sd.original_filename, sd.upload_date, sd.verification_status,
             sd.verified_date, sd.verification_notes,
             dt.type_name as document_type, dt.is_required, dt.category
      FROM student_documents sd
      JOIN document_types dt ON sd.document_type_id = dt.document_type_id
      WHERE sd.student_id = ? AND sd.is_current = TRUE
      ORDER BY dt.is_required DESC, sd.upload_date DESC
    `,
        [studentId]
      );

      res.json(documents);
    } catch (error) {
      console.error("Student documents fetch error:", error);
      res.status(500).json({ error: "Failed to fetch student documents" });
    }
  }
);

// ============================================================================
// COMPETENCY AND PROGRESS ROUTES (Fixed)
// ============================================================================

app.get(
  "/api/competency-assessments",
  authenticateToken,
  authorize(["admin", "staff"]),
  async (req, res) => {
    try {
      const { competency_type, student_search, passed } = req.query;

      let query = `
      SELECT sp.progress_id, sp.score, sp.max_score, sp.percentage_score, sp.passed, 
             sp.attempt_number, sp.attempt_date, sp.feedback,
             comp.competency_name, ct.type_name as competency_type,
             s.student_id, per.first_name, per.last_name,
             c.course_name, co.batch_identifier,
             staff_per.first_name as assessed_by_first_name, staff_per.last_name as assessed_by_last_name
      FROM student_progress sp
      JOIN student_enrollments se ON sp.enrollment_id = se.enrollment_id
      JOIN students s ON se.student_id = s.student_id
      JOIN persons per ON s.person_id = per.person_id
      JOIN course_offerings co ON se.offering_id = co.offering_id
      JOIN courses c ON co.course_id = c.course_id
      JOIN competencies comp ON sp.competency_id = comp.competency_id
      JOIN competency_types ct ON comp.competency_type_id = ct.competency_type_id
      LEFT JOIN staff st ON sp.assessed_by = st.staff_id
      LEFT JOIN persons staff_per ON st.person_id = staff_per.person_id
      WHERE 1=1
    `;
      const params = [];

      if (competency_type) {
        query += " AND ct.type_name = ?";
        params.push(competency_type);
      }

      if (passed !== undefined) {
        query += " AND sp.passed = ?";
        params.push(passed === "true");
      }

      if (student_search) {
        query +=
          " AND (per.first_name LIKE ? OR per.last_name LIKE ? OR s.student_id LIKE ?)";
        const searchParam = `%${student_search}%`;
        params.push(searchParam, searchParam, searchParam);
      }

      query += " ORDER BY sp.attempt_date DESC";

      const [assessments] = await pool.execute(query, params);
      res.json(assessments);
    } catch (error) {
      console.error("Competency assessments fetch error:", error);
      res.status(500).json({ error: "Failed to fetch competency assessments" });
    }
  }
);

app.post(
  "/api/competency-assessments",
  [
    authenticateToken,
    authorize(["admin", "staff"]),
    body("enrollment_id").isInt(),
    body("competency_id").isInt(),
    body("score").isFloat({ min: 0 }),
    body("max_score").isFloat({ min: 0.01 }),
    body("feedback").optional().trim().isLength({ max: 1000 }),
  ],
  validateInput,
  async (req, res) => {
    try {
      const { enrollment_id, competency_id, score, max_score, feedback } =
        req.body;

      const [attemptRows] = await pool.execute(
        `
      SELECT COALESCE(MAX(attempt_number), 0) + 1 as next_attempt
      FROM student_progress
      WHERE enrollment_id = ? AND competency_id = ?
    `,
        [enrollment_id, competency_id]
      );

      const attempt_number = attemptRows[0].next_attempt;

      const [staffRows] = await pool.execute(
        "SELECT staff_id FROM staff WHERE account_id = ?",
        [req.user.accountId]
      );

      const staffId = staffRows[0]?.staff_id;

      await pool.execute(
        `
      INSERT INTO student_progress (enrollment_id, competency_id, attempt_number, score, max_score, assessed_by, feedback)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
        [
          enrollment_id,
          competency_id,
          attempt_number,
          score,
          max_score,
          staffId,
          feedback || null,
        ]
      );

      res.status(201).json({ message: "Assessment recorded successfully" });
    } catch (error) {
      console.error("Assessment creation error:", error);
      res.status(500).json({ error: "Failed to record assessment" });
    }
  }
);

app.get(
  "/api/students/:studentId/progress",
  authenticateToken,
  authorize(["admin", "staff", "student"]),
  authorizeStudentAccess,
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const [progress] = await pool.execute(
        `
      SELECT sp.progress_id, sp.score, sp.max_score, sp.percentage_score, sp.passed, 
             sp.attempt_number, sp.attempt_date, sp.feedback,
             comp.competency_name, comp.competency_description,
             ct.type_name as competency_type, ct.passing_score,
             c.course_name, co.batch_identifier
      FROM student_progress sp
      JOIN student_enrollments se ON sp.enrollment_id = se.enrollment_id
      JOIN course_offerings co ON se.offering_id = co.offering_id
      JOIN courses c ON co.course_id = c.course_id
      JOIN competencies comp ON sp.competency_id = comp.competency_id
      JOIN competency_types ct ON comp.competency_type_id = ct.competency_type_id
      WHERE se.student_id = ?
      ORDER BY sp.attempt_date DESC
    `,
        [studentId]
      );

      res.json(progress);
    } catch (error) {
      console.error("Student progress fetch error:", error);
      res.status(500).json({ error: "Failed to fetch student progress" });
    }
  }
);

// ============================================================================
// SCHOLARSHIP ROUTES (Fixed)
// ============================================================================

app.get(
  "/api/scholarships",
  authenticateToken,
  authorize(["admin", "staff"]),
  async (req, res) => {
    try {
      const [scholarships] = await pool.execute(`
      SELECT sp.sponsor_id, sp.sponsor_name, sp.contact_person, sp.contact_email, 
             sp.industry, sp.total_commitment, sp.current_commitment, sp.students_sponsored, sp.is_active,
             st.type_name as sponsor_type
      FROM sponsors sp
      JOIN sponsor_types st ON sp.sponsor_type_id = st.sponsor_type_id
      WHERE sp.is_active = TRUE
      ORDER BY sp.sponsor_name
    `);
      res.json(scholarships);
    } catch (error) {
      console.error("Scholarships fetch error:", error);
      res.status(500).json({ error: "Failed to fetch scholarships" });
    }
  }
);

app.post(
  "/api/scholarships",
  [
    authenticateToken,
    authorize(["admin", "staff"]),
    body("sponsor_name").trim().isLength({ min: 1, max: 100 }),
    body("sponsor_type_id").isInt(),
    body("contact_person").trim().isLength({ min: 1, max: 100 }),
    body("contact_email").isEmail(),
    body("total_commitment").isFloat({ min: 0 }),
  ],
  validateInput,
  async (req, res) => {
    try {
      const {
        sponsor_name,
        sponsor_type_id,
        contact_person,
        contact_email,
        contact_phone,
        address,
        website,
        industry,
        total_commitment,
        agreement_details,
        agreement_start_date,
        agreement_end_date,
      } = req.body;

      const sponsor_code = `SP${Date.now()}`;

      await pool.execute(
        `
      INSERT INTO sponsors (
        sponsor_type_id, sponsor_name, sponsor_code, contact_person, contact_email,
        contact_phone, address, website, industry, total_commitment,
        agreement_details, agreement_start_date, agreement_end_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [
          sponsor_type_id,
          sponsor_name,
          sponsor_code,
          contact_person,
          contact_email,
          contact_phone || null,
          address || null,
          website || null,
          industry || null,
          total_commitment,
          agreement_details || null,
          agreement_start_date || null,
          agreement_end_date || null,
        ]
      );

      res.status(201).json({
        message: "Scholarship sponsor created successfully",
        sponsor_code,
      });
    } catch (error) {
      console.error("Scholarship creation error:", error);
      res.status(500).json({ error: "Failed to create scholarship sponsor" });
    }
  }
);

app.get(
  "/api/students/:studentId/scholarships",
  authenticateToken,
  authorize(["admin", "staff", "student"]),
  authorizeStudentAccess,
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const [scholarships] = await pool.execute(
        `
      SELECT ss.scholarship_id, ss.scholarship_type, ss.coverage_percentage, ss.coverage_amount,
             ss.scholarship_status, ss.start_date, ss.end_date, ss.gpa_requirement,
             sp.sponsor_name, st.type_name as sponsor_type
      FROM student_scholarships ss
      JOIN sponsors sp ON ss.sponsor_id = sp.sponsor_id
      JOIN sponsor_types st ON sp.sponsor_type_id = st.sponsor_type_id
      WHERE ss.student_id = ?
      ORDER BY ss.start_date DESC
    `,
        [studentId]
      );

      res.json(scholarships);
    } catch (error) {
      console.error("Student scholarships fetch error:", error);
      res.status(500).json({ error: "Failed to fetch student scholarships" });
    }
  }
);

// ============================================================================
// COURSE AND ENROLLMENT ROUTES (Fixed)
// ============================================================================

app.get("/api/courses", authenticateToken, async (req, res) => {
  try {
    const [courses] = await pool.execute(`
      SELECT c.course_id, c.course_code, c.course_name, c.course_description,
             c.duration_weeks, c.credits, c.is_active
      FROM courses c
      WHERE c.is_active = TRUE
      ORDER BY c.course_name
    `);
    res.json(courses);
  } catch (error) {
    console.error("Courses fetch error:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

app.get("/api/course-offerings", authenticateToken, async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT co.offering_id, co.batch_identifier, co.start_date, co.end_date, co.status,
             co.max_enrollees, co.current_enrollees, co.location,
             c.course_code, c.course_name,
             AVG(cp.amount) as average_price
      FROM course_offerings co
      JOIN courses c ON co.course_id = c.course_id
      LEFT JOIN course_pricing cp ON co.offering_id = cp.offering_id AND cp.is_active = TRUE
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += " AND co.status = ?";
      params.push(status);
    }

    query += " GROUP BY co.offering_id ORDER BY co.start_date DESC";

    const [offerings] = await pool.execute(query, params);
    res.json(offerings);
  } catch (error) {
    console.error("Course offerings fetch error:", error);
    res.status(500).json({ error: "Failed to fetch course offerings" });
  }
});

app.post(
  "/api/enrollments",
  [
    authenticateToken,
    authorize(["admin", "staff"]),
    body("student_id").trim().isLength({ min: 1 }),
    body("offering_id").isInt(),
    body("pricing_type").isIn([
      "regular",
      "early_bird",
      "group",
      "scholarship",
      "special",
    ]),
  ],
  validateInput,
  async (req, res) => {
    try {
      const { student_id, offering_id, pricing_type } = req.body;

      const [result] = await pool.execute(
        `
      CALL sp_enroll_student(?, ?, ?, @result);
      SELECT @result as result;
    `,
        [student_id, offering_id, pricing_type]
      );

      const enrollmentResult = result[1][0].result;

      if (enrollmentResult.startsWith("SUCCESS")) {
        res.status(201).json({ message: enrollmentResult });
      } else {
        res.status(400).json({ error: enrollmentResult });
      }
    } catch (error) {
      console.error("Enrollment error:", error);
      res.status(500).json({ error: "Failed to enroll student" });
    }
  }
);

app.get(
  "/api/students/:studentId/enrollments",
  authenticateToken,
  authorize(["admin", "staff", "student"]),
  authorizeStudentAccess,
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const [enrollments] = await pool.execute(
        `
      SELECT se.enrollment_id, se.enrollment_status, se.enrollment_date, se.completion_date,
             se.final_grade, se.completion_percentage, se.attendance_percentage,
             c.course_code, c.course_name, co.batch_identifier, co.start_date, co.end_date,
             sa.total_due, sa.amount_paid, sa.balance
      FROM student_enrollments se
      JOIN course_offerings co ON se.offering_id = co.offering_id
      JOIN courses c ON co.course_id = c.course_id
      LEFT JOIN student_accounts sa ON se.student_id = sa.student_id AND se.offering_id = sa.offering_id
      WHERE se.student_id = ?
      ORDER BY co.start_date DESC
    `,
        [studentId]
      );

      res.json(enrollments);
    } catch (error) {
      console.error("Student enrollments fetch error:", error);
      res.status(500).json({ error: "Failed to fetch student enrollments" });
    }
  }
);

// ============================================================================
// REFERRAL ROUTES (Fixed)
// ============================================================================

app.get(
  "/api/referrals",
  authenticateToken,
  authorize(["admin", "staff"]),
  async (req, res) => {
    try {
      const { status, referrer_search } = req.query;

      let query = `
      SELECT sr.referral_id, sr.referrer_name, sr.referrer_contact, sr.referral_date,
             sr.referral_reward, sr.reward_type, sr.reward_paid, sr.conversion_date,
             rs.source_name, rs.source_type,
             s.student_id, per.first_name, per.last_name
      FROM student_referrals sr
      JOIN referral_sources rs ON sr.source_id = rs.source_id
      JOIN students s ON sr.student_id = s.student_id
      JOIN persons per ON s.person_id = per.person_id
      LEFT JOIN students ref_s ON sr.referrer_student_id = ref_s.student_id
      LEFT JOIN persons ref_per ON ref_s.person_id = ref_per.person_id
      WHERE 1=1
    `;
      const params = [];

      if (referrer_search) {
        query +=
          " AND (sr.referrer_name LIKE ? OR ref_per.first_name LIKE ? OR ref_per.last_name LIKE ?)";
        const searchParam = `%${referrer_search}%`;
        params.push(searchParam, searchParam, searchParam);
      }

      query += " ORDER BY sr.referral_date DESC";

      const [referrals] = await pool.execute(query, params);
      res.json(referrals);
    } catch (error) {
      console.error("Referrals fetch error:", error);
      res.status(500).json({ error: "Failed to fetch referrals" });
    }
  }
);

app.post(
  "/api/referrals",
  [
    authenticateToken,
    authorize(["admin", "staff"]),
    body("student_id").trim().isLength({ min: 1 }),
    body("source_id").isInt(),
    body("referrer_name").optional().trim().isLength({ max: 100 }),
    body("referrer_contact").optional().trim().isLength({ max: 100 }),
  ],
  validateInput,
  async (req, res) => {
    try {
      const {
        student_id,
        source_id,
        referrer_name,
        referrer_contact,
        referrer_student_id,
        ib_code,
        campaign_code,
        referral_reward,
        reward_type,
      } = req.body;

      await pool.execute(
        `
      INSERT INTO student_referrals (
        student_id, source_id, referrer_name, referrer_contact, referrer_student_id,
        ib_code, campaign_code, referral_reward, reward_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
        [
          student_id,
          source_id,
          referrer_name || null,
          referrer_contact || null,
          referrer_student_id || null,
          ib_code || null,
          campaign_code || null,
          referral_reward || 0,
          reward_type || "cash",
        ]
      );

      res.status(201).json({ message: "Referral recorded successfully" });
    } catch (error) {
      console.error("Referral creation error:", error);
      res.status(500).json({ error: "Failed to record referral" });
    }
  }
);

// ============================================================================
// UTILITY ROUTES
// ============================================================================

app.get("/api/trading-levels", authenticateToken, async (req, res) => {
  try {
    const [levels] = await pool.execute(`
      SELECT level_id, level_name, level_description, minimum_score, estimated_duration_weeks
      FROM trading_levels
      ORDER BY minimum_score ASC
    `);
    res.json(levels);
  } catch (error) {
    console.error("Trading levels fetch error:", error);
    res.status(500).json({ error: "Failed to fetch trading levels" });
  }
});

app.get("/api/payment-methods", authenticateToken, async (req, res) => {
  try {
    const [methods] = await pool.execute(`
      SELECT method_id, method_name, method_type, processing_fee_percentage
      FROM payment_methods
      WHERE is_active = TRUE
      ORDER BY method_name
    `);
    res.json(methods);
  } catch (error) {
    console.error("Payment methods fetch error:", error);
    res.status(500).json({ error: "Failed to fetch payment methods" });
  }
});

app.get("/api/document-types", authenticateToken, async (req, res) => {
  try {
    const [types] = await pool.execute(`
      SELECT document_type_id, type_name, category, is_required, required_for
      FROM document_types
      WHERE is_active = TRUE
      ORDER BY is_required DESC, type_name
    `);
    res.json(types);
  } catch (error) {
    console.error("Document types fetch error:", error);
    res.status(500).json({ error: "Failed to fetch document types" });
  }
});

app.get("/api/competencies", authenticateToken, async (req, res) => {
  try {
    const [competencies] = await pool.execute(`
      SELECT c.competency_id, c.competency_code, c.competency_name, c.competency_description,
             ct.type_name as competency_type, ct.passing_score
      FROM competencies c
      JOIN competency_types ct ON c.competency_type_id = ct.competency_type_id
      WHERE c.is_active = TRUE
      ORDER BY ct.type_name, c.competency_name
    `);
    res.json(competencies);
  } catch (error) {
    console.error("Competencies fetch error:", error);
    res.status(500).json({ error: "Failed to fetch competencies" });
  }
});

// ============================================================================
// USER PROFILE ROUTES (Fixed)
// ============================================================================

app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const [userProfile] = await pool.execute(
      `
      SELECT a.account_id, a.account_status,
             p.first_name, p.middle_name, p.last_name, p.birth_date, p.birth_place, p.gender,
             r.role_name, r.permissions
      FROM accounts a
      JOIN account_roles ar ON a.account_id = ar.account_id
      JOIN roles r ON ar.role_id = r.role_id
      LEFT JOIN persons p ON a.account_id = p.person_id
      WHERE a.account_id = ? AND ar.is_active = TRUE
    `,
      [req.user.accountId]
    );

    if (userProfile.length === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }

    const [contacts] = await pool.execute(
      `
      SELECT contact_type, contact_value, is_primary
      FROM contact_info
      WHERE person_id = ?
    `,
      [req.user.personId]
    );

    res.json({
      ...userProfile[0],
      contacts,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// ============================================================================
// ADMIN ROUTES (Fixed)
// ============================================================================

app.get(
  "/api/admin/accounts",
  authenticateToken,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const [accounts] = await pool.execute(`
      SELECT a.account_id, a.account_status, a.last_login,
             p.first_name, p.last_name, r.role_name,
             COALESCE(s.student_id, st.staff_id) as user_identifier
      FROM accounts a
      JOIN account_roles ar ON a.account_id = ar.account_id
      JOIN roles r ON ar.role_id = r.role_id
      LEFT JOIN staff st ON a.account_id = st.account_id
      LEFT JOIN students s ON a.account_id = s.account_id
      LEFT JOIN persons p ON a.account_id = p.person_id
      WHERE ar.is_active = TRUE
      ORDER BY a.username
    `);

      res.json(accounts);
    } catch (error) {
      console.error("Admin accounts fetch error:", error);
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  }
);

app.put(
  "/api/admin/accounts/:accountId/status",
  [
    authenticateToken,
    authorize(["admin"]),
    body("status").isIn(["active", "inactive", "suspended"]),
  ],
  validateInput,
  async (req, res) => {
    try {
      const { accountId } = req.params;
      const { status } = req.body;

      await pool.execute(
        `
      UPDATE accounts 
      SET account_status = ?
      WHERE account_id = ?
    `,
        [status, accountId]
      );

      res.json({ message: "Account status updated successfully" });
    } catch (error) {
      console.error("Account status update error:", error);
      res.status(500).json({ error: "Failed to update account status" });
    }
  }
);

app.post(
  "/api/admin/staff",
  [
    authenticateToken,
    authorize(["admin"]),
    body("first_name").trim().isLength({ min: 1, max: 50 }).escape(),
    body("last_name").trim().isLength({ min: 1, max: 50 }).escape(),
    body("birth_place").trim().isLength({ min: 1, max: 100 }).escape(),
    body("email").isEmail().normalizeEmail(),
    body("education").trim().isLength({ min: 1, max: 100 }).escape(),
    body("username").trim().isLength({ min: 3, max: 50 }).escape(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["staff", "admin"]),
  ],
  validateInput,
  async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const {
        first_name,
        middle_name,
        last_name,
        birth_date,
        birth_place,
        gender,
        email,
        education,
        phone,
        username,
        password,
        role,
        employee_id,
      } = req.body;

      // Use stored procedure for synced creation
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const [result] = await connection.execute(
        `
      CALL sp_register_user_with_synced_ids(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @account_id, @result)
    `,
        [
          username,
          hashedPassword,
          first_name,
          middle_name,
          last_name,
          birth_date,
          birth_place,
          gender || "Other",
          email,
          education,
          phone,
          null,
          role,
        ]
      );

      const [output] = await connection.execute(
        `SELECT @account_id as account_id, @result as result`
      );
      const { account_id, result: procedureResult } = output[0];

      if (!procedureResult.startsWith("SUCCESS")) {
        return res.status(400).json({ error: procedureResult });
      }

      // Update employee_id if provided
      if (employee_id) {
        await connection.execute(
          `
        UPDATE staff 
        SET employee_id = ?
        WHERE account_id = ?
      `,
          [employee_id, account_id]
        );
      }

      res.status(201).json({
        account_id,
        message: "Staff account created successfully",
      });
    } catch (error) {
      console.error("Staff creation error:", error);

      if (error.code === "ER_DUP_ENTRY") {
        res.status(409).json({ error: "Username already exists" });
      } else {
        res.status(500).json({ error: "Failed to create staff account" });
      }
    } finally {
      connection.release();
    }
  }
);

// ============================================================================
// SYSTEM INFORMATION ROUTES (Fixed)
// ============================================================================

app.get(
  "/api/system/stats",
  authenticateToken,
  authorize(["admin"]),
  async (req, res) => {
    try {
      const [stats] = await pool.execute(`
      SELECT 
        (SELECT COUNT(*) FROM students) as total_students,
        (SELECT COUNT(*) FROM staff) as total_staff,
        (SELECT COUNT(*) FROM courses WHERE is_active = TRUE) as total_courses,
        (SELECT COUNT(*) FROM course_offerings WHERE status = 'active') as active_offerings,
        (SELECT COUNT(*) FROM payments WHERE payment_status = 'confirmed') as confirmed_payments,
        (SELECT SUM(payment_amount) FROM payments WHERE payment_status = 'confirmed') as total_revenue,
        (SELECT COUNT(*) FROM student_documents WHERE verification_status = 'pending') as pending_documents,
        (SELECT COUNT(*) FROM student_scholarships WHERE scholarship_status = 'active') as active_scholarships
    `);

      res.json(stats[0]);
    } catch (error) {
      console.error("System stats error:", error);
      res.status(500).json({ error: "Failed to fetch system statistics" });
    }
  }
);

// ============================================================================
// STUDENT BACKGROUND AND PREFERENCES ROUTES (New)
// ============================================================================

app.get(
  "/api/students/:studentId/background",
  authenticateToken,
  authorize(["admin", "staff", "student"]),
  authorizeStudentAccess,
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const [background] = await pool.execute(
        `
      SELECT sb.background_id, sb.education_level, sb.highest_degree, sb.institution, sb.graduation_year,
             sb.work_experience_years, sb.current_occupation, sb.industry, sb.annual_income_range,
             sb.financial_experience, sb.prior_trading_experience, sb.investment_portfolio_value,
             sb.relevant_skills, sb.certifications
      FROM student_backgrounds sb
      WHERE sb.student_id = ?
    `,
        [studentId]
      );

      res.json(background[0] || {});
    } catch (error) {
      console.error("Student background fetch error:", error);
      res.status(500).json({ error: "Failed to fetch student background" });
    }
  }
);

app.post(
  "/api/students/:studentId/background",
  [
    authenticateToken,
    authorize(["admin", "staff", "student"]),
    authorizeStudentAccess,
    body("education_level")
      .optional()
      .isIn([
        "elementary",
        "high_school",
        "vocational",
        "college",
        "graduate",
        "post_graduate",
      ]),
    body("work_experience_years").optional().isInt({ min: 0 }),
    body("annual_income_range")
      .optional()
      .isIn(["below_100k", "100k_300k", "300k_500k", "500k_1m", "above_1m"]),
  ],
  validateInput,
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const {
        education_level,
        highest_degree,
        institution,
        graduation_year,
        work_experience_years,
        current_occupation,
        industry,
        annual_income_range,
        financial_experience,
        prior_trading_experience,
        investment_portfolio_value,
        relevant_skills,
        certifications,
      } = req.body;

      await pool.execute(
        `
      INSERT INTO student_backgrounds (
        student_id, education_level, highest_degree, institution, graduation_year,
        work_experience_years, current_occupation, industry, annual_income_range,
        financial_experience, prior_trading_experience, investment_portfolio_value,
        relevant_skills, certifications
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        education_level = VALUES(education_level),
        highest_degree = VALUES(highest_degree),
        institution = VALUES(institution),
        graduation_year = VALUES(graduation_year),
        work_experience_years = VALUES(work_experience_years),
        current_occupation = VALUES(current_occupation),
        industry = VALUES(industry),
        annual_income_range = VALUES(annual_income_range),
        financial_experience = VALUES(financial_experience),
        prior_trading_experience = VALUES(prior_trading_experience),
        investment_portfolio_value = VALUES(investment_portfolio_value),
        relevant_skills = VALUES(relevant_skills),
        certifications = VALUES(certifications)
    `,
        [
          studentId,
          education_level,
          highest_degree,
          institution,
          graduation_year,
          work_experience_years,
          current_occupation,
          industry,
          annual_income_range,
          financial_experience,
          prior_trading_experience,
          investment_portfolio_value,
          relevant_skills,
          certifications,
        ]
      );

      res.json({ message: "Student background updated successfully" });
    } catch (error) {
      console.error("Student background update error:", error);
      res.status(500).json({ error: "Failed to update student background" });
    }
  }
);

app.get(
  "/api/students/:studentId/preferences",
  authenticateToken,
  authorize(["admin", "staff", "student"]),
  authorizeStudentAccess,
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const [preferences] = await pool.execute(
        `
      SELECT lp.preference_id, lp.learning_style, lp.delivery_preference, lp.device_type,
             lp.internet_speed, lp.preferred_schedule, lp.study_hours_per_week, lp.accessibility_needs
      FROM learning_preferences lp
      WHERE lp.student_id = ?
    `,
        [studentId]
      );

      res.json(preferences[0] || {});
    } catch (error) {
      console.error("Student preferences fetch error:", error);
      res.status(500).json({ error: "Failed to fetch student preferences" });
    }
  }
);

app.post(
  "/api/students/:studentId/preferences",
  [
    authenticateToken,
    authorize(["admin", "staff", "student"]),
    authorizeStudentAccess,
    body("learning_style")
      .optional()
      .isIn(["visual", "auditory", "kinesthetic", "reading_writing", "mixed"]),
    body("delivery_preference")
      .optional()
      .isIn(["in-person", "online", "hybrid", "self-paced"]),
    body("preferred_schedule")
      .optional()
      .isIn(["morning", "afternoon", "evening", "weekend", "flexible"]),
  ],
  validateInput,
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const {
        learning_style,
        delivery_preference,
        device_type,
        internet_speed,
        preferred_schedule,
        study_hours_per_week,
        accessibility_needs,
      } = req.body;

      await pool.execute(
        `
      INSERT INTO learning_preferences (
        student_id, learning_style, delivery_preference, device_type, internet_speed,
        preferred_schedule, study_hours_per_week, accessibility_needs
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        learning_style = VALUES(learning_style),
        delivery_preference = VALUES(delivery_preference),
        device_type = VALUES(device_type),
        internet_speed = VALUES(internet_speed),
        preferred_schedule = VALUES(preferred_schedule),
        study_hours_per_week = VALUES(study_hours_per_week),
        accessibility_needs = VALUES(accessibility_needs)
    `,
        [
          studentId,
          learning_style,
          delivery_preference,
          device_type,
          internet_speed,
          preferred_schedule,
          study_hours_per_week,
          accessibility_needs,
        ]
      );

      res.json({ message: "Student preferences updated successfully" });
    } catch (error) {
      console.error("Student preferences update error:", error);
      res.status(500).json({ error: "Failed to update student preferences" });
    }
  }
);

// ============================================================================
// STUDENT GOALS ROUTES (New)
// ============================================================================

app.get(
  "/api/students/:studentId/goals",
  authenticateToken,
  authorize(["admin", "staff", "student"]),
  authorizeStudentAccess,
  async (req, res) => {
    try {
      const { studentId } = req.params;

      const [goals] = await pool.execute(
        `
      SELECT sg.goal_id, sg.goal_type, sg.goal_title, sg.goal_description, sg.target_date,
             sg.target_amount, sg.priority_level, sg.status, sg.progress_percentage,
             sg.created_at, sg.updated_at
      FROM student_goals sg
      WHERE sg.student_id = ?
      ORDER BY sg.priority_level DESC, sg.created_at DESC
    `,
        [studentId]
      );

      res.json(goals);
    } catch (error) {
      console.error("Student goals fetch error:", error);
      res.status(500).json({ error: "Failed to fetch student goals" });
    }
  }
);

app.post(
  "/api/students/:studentId/goals",
  [
    authenticateToken,
    authorize(["admin", "staff", "student"]),
    authorizeStudentAccess,
    body("goal_type").isIn([
      "career",
      "financial",
      "personal",
      "academic",
      "skill",
    ]),
    body("goal_title").trim().isLength({ min: 1, max: 100 }),
    body("goal_description").trim().isLength({ min: 1, max: 1000 }),
    body("priority_level")
      .optional()
      .isIn(["low", "medium", "high", "critical"]),
  ],
  validateInput,
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const {
        goal_type,
        goal_title,
        goal_description,
        target_date,
        target_amount,
        priority_level,
      } = req.body;

      await pool.execute(
        `
      INSERT INTO student_goals (
        student_id, goal_type, goal_title, goal_description, target_date,
        target_amount, priority_level
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
        [
          studentId,
          goal_type,
          goal_title,
          goal_description,
          target_date || null,
          target_amount || null,
          priority_level || "medium",
        ]
      );

      res.status(201).json({ message: "Student goal created successfully" });
    } catch (error) {
      console.error("Student goal creation error:", error);
      res.status(500).json({ error: "Failed to create student goal" });
    }
  }
);

app.put(
  "/api/students/:studentId/goals/:goalId",
  [
    authenticateToken,
    authorize(["admin", "staff", "student"]),
    authorizeStudentAccess,
    body("status")
      .optional()
      .isIn(["active", "achieved", "paused", "cancelled", "expired"]),
    body("progress_percentage").optional().isFloat({ min: 0, max: 100 }),
  ],
  validateInput,
  async (req, res) => {
    try {
      const { studentId, goalId } = req.params;
      const { status, progress_percentage, goal_title, goal_description } =
        req.body;

      await pool.execute(
        `
      UPDATE student_goals 
      SET status = COALESCE(?, status),
          progress_percentage = COALESCE(?, progress_percentage),
          goal_title = COALESCE(?, goal_title),
          goal_description = COALESCE(?, goal_description),
          updated_at = CURRENT_TIMESTAMP
      WHERE goal_id = ? AND student_id = ?
    `,
        [
          status,
          progress_percentage,
          goal_title,
          goal_description,
          goalId,
          studentId,
        ]
      );

      res.json({ message: "Student goal updated successfully" });
    } catch (error) {
      console.error("Student goal update error:", error);
      res.status(500).json({ error: "Failed to update student goal" });
    }
  }
);

// ============================================================================
// PASSWORD CHANGE ROUTE (Fixed)
// ============================================================================

app.post(
  "/api/auth/change-password",
  [
    authenticateToken,
    body("currentPassword").isLength({ min: 6 }),
    body("newPassword")
      .isLength({ min: 6 })
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  ],
  validateInput,
  async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const accountId = req.user.accountId;

      const [userRows] = await pool.execute(
        "SELECT password_hash FROM accounts WHERE account_id = ?",
        [accountId]
      );

      if (userRows.length === 0) {
        return res.status(404).json({ error: "Account not found" });
      }

      const isValidPassword = await bcrypt.compare(
        currentPassword,
        userRows[0].password_hash
      );
      if (!isValidPassword) {
        return res.status(401).json({ error: "Current password is incorrect" });
      }

      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

      await pool.execute(
        "UPDATE accounts SET password_hash = ? WHERE account_id = ?",
        [newPasswordHash, accountId]
      );

      res.json({ message: "Password changed successfully" });
    } catch (error) {
      console.error("Password change error:", error);
      res.status(500).json({ error: "Password change failed" });
    }
  }
);

// ============================================================================
// STUDENT REGISTRATION ENDPOINT (Public - Updated to use stored procedure)
// ============================================================================

app.post(
  "/api/register",
  [
    body("firstName").trim().isLength({ min: 1, max: 50 }).escape(),
    body("lastName").trim().isLength({ min: 1, max: 50 }).escape(),
    body("email").isEmail().normalizeEmail(),
    body("phoneNumber").isMobilePhone(),
    body("dob").isISO8601(),
    body("address").trim().isLength({ min: 1, max: 500 }),
    body("city").trim().isLength({ min: 1, max: 100 }),
    body("province").trim().isLength({ min: 1, max: 100 }),
    body("gender").isIn(["Male", "Female", "Other"]),
    body("education").trim().isLength({ min: 1, max: 100 }),
    body("tradingLevel").trim().isLength({ min: 1, max: 50 }),
    body("username").trim().isLength({ min: 3, max: 15 }),
    body("password").isLength({ min: 6 }),
  ],
  validateInput,
  async (req, res) => {
    const connection = await pool.getConnection();

    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        dob,
        address,
        city,
        province,
        gender,
        education,
        tradingLevel,
        device,
        learningStyle,
        username,
        password,
      } = req.body;

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);
      const fullAddress = `${address}, ${city}, ${province}`;

      // Use stored procedure for synced registration
      const [result] = await connection.execute(
        `
      CALL sp_register_user_with_synced_ids(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @account_id, @result)
    `,
        [
          username,
          hashedPassword,
          firstName,
          null,
          lastName,
          dob,
          city,
          gender,
          email,
          education,
          phoneNumber,
          fullAddress,
          "student",
        ]
      );

      const [output] = await connection.execute(
        `SELECT @account_id as account_id, @result as result`
      );
      const { account_id, result: procedureResult } = output[0];

      if (!procedureResult.startsWith("SUCCESS")) {
        return res.status(400).json({ error: procedureResult });
      }

      // Handle additional fields specific to students
      if (tradingLevel || device || learningStyle) {
        const [studentData] = await connection.execute(
          `
        SELECT student_id FROM students WHERE account_id = ?
      `,
          [account_id]
        );

        if (studentData.length > 0) {
          const student_id = studentData[0].student_id;

          // Update trading level if provided
          if (tradingLevel) {
            const [levelRows] = await connection.execute(
              `
            SELECT level_id FROM trading_levels WHERE level_name = ?
          `,
              [tradingLevel]
            );

            if (levelRows.length > 0) {
              const level_id = levelRows[0].level_id;

              // Update the default level
              await connection.execute(
                `
              UPDATE student_trading_levels 
              SET level_id = ?, assigned_date = CURRENT_TIMESTAMP
              WHERE student_id = ? AND is_current = 1
            `,
                [level_id, student_id]
              );
            }
          }

          // Update learning preferences if provided
          if (device || learningStyle) {
            const deviceArray = Array.isArray(device)
              ? device
              : device
              ? [device]
              : [];
            const learningStyleArray = Array.isArray(learningStyle)
              ? learningStyle
              : learningStyle
              ? [learningStyle]
              : [];

            await connection.execute(
              `
            UPDATE learning_preferences 
            SET device_type = ?, learning_style = ?, updated_at = CURRENT_TIMESTAMP
            WHERE student_id = ?
          `,
              [deviceArray.join(","), learningStyleArray.join(","), student_id]
            );
          }
        }
      }

      res.status(201).json({
        message: "Student successfully registered.",
        account_id: account_id,
        student_id: `S${Date.now()}_${account_id}`,
      });
    } catch (error) {
      console.error("Registration error:", error);

      if (error.code === "ER_DUP_ENTRY") {
        res.status(409).json({ error: "Username or email already exists" });
      } else {
        res.status(500).json({ error: "Failed to register student" });
      }
    } finally {
      connection.release();
    }
  }
);

// ============================================================================
// ERROR HANDLING & 404
// ============================================================================

app.use((error, req, res, next) => {
  console.error("Unhandled error:", error);

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File too large. Maximum size is 10MB." });
    }
    return res.status(400).json({ error: "File upload error" });
  }

  res.status(500).json({ error: "Internal server error" });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

async function testDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connection successful");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down gracefully");
  await pool.end();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, shutting down gracefully");
  await pool.end();
  process.exit(0);
});

async function startServer() {
  const dbConnected = await testDatabaseConnection();

  if (!dbConnected) {
    console.error("Cannot start server without database connection");
    process.exit(1);
  }

  // Initialize database with ID synchronization
  try {
    await initializeDatabase();
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Database: ${process.env.DB_NAME_EDGE || "8cons"}`);
    console.log(`🔒 Security: Authentication and authorization enabled`);
    console.log(`🆔 ID Sync: account_id and person_id synchronized`);
    console.log(`📁 File uploads: ${path.resolve("uploads")}`);
    console.log(`👤 Default admin: username=admin, password=admin123`);
    console.log("===============================================");
  });
}

startServer();

export default app;
