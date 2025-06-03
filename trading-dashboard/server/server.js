// // api-server.js
// import express from 'express';
// import mysql from 'mysql2/promise';
// import session from 'express-session';
// import bcrypt from 'bcrypt';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001; // Changed to 3001 to avoid conflicts

// // Middleware
// app.use(express.json());
// app.use(cors({
//     origin: ['http://localhost:5173', 'http://localhost:3000'], // Support both Vite and other ports
//     credentials: true,
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Session configuration
// app.use(session({
//     secret: process.env.SESSION_SECRET || '37a8913d07dff5899d62c0841980170e7b21da00cf492d91d19dc634c425e3d5',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false,
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000,
//         sameSite: 'lax'
//     }
// }));

// // Database configuration
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || '8con',
//     charset: 'utf8',
//     connectionLimit: 10
// };

// let pool;

// // Test database connection
// async function initDatabase() {
//     try {
//         pool = mysql.createPool(dbConfig);
//         const connection = await pool.getConnection();
//         console.log('✅ Database connected successfully');
//         connection.release();
//         return true;
//     } catch (error) {
//         console.error('❌ Database connection failed:', error.message);
//         return false;
//     }
// }

// // Basic health check
// app.get('/health', (req, res) => {
//     res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // Check authentication status
// app.get('/api/check-auth', async (req, res) => {
//     try {
//         if (!req.session.user_id) {
//             return res.json({ authenticated: false });
//         }

//         const [rows] = await pool.execute(
//             "SELECT account_id, username FROM accounts WHERE account_id = ?",
//             [req.session.user_id]
//         );

//         if (rows.length === 0) {
//             req.session.destroy(() => {});
//             return res.json({ authenticated: false });
//         }

//         const user = rows[0];
        
//         // Get student info
//         const [studentRows] = await pool.execute(
//             "SELECT email, name, student_id FROM students WHERE account_id = ?",
//             [user.account_id]
//         );

//         const studentInfo = studentRows[0] || {};

//         res.json({
//             authenticated: true,
//             user: {
//                 id: user.account_id,
//                 username: user.username,
//                 email: studentInfo.email || req.session.user_email,
//                 name: studentInfo.name,
//                 student_id: studentInfo.student_id
//             }
//         });
//     } catch (error) {
//         console.error('Check auth error:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// // Login endpoint
// app.post('/api/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({ error: 'Email and password are required' });
//         }

//         const trimmedEmail = email.trim();
//         const trimmedPassword = password.trim();

//         // Get student info
//         const [studentRows] = await pool.execute(
//             "SELECT account_id, name, student_id FROM students WHERE email = ?",
//             [trimmedEmail]
//         );

//         if (studentRows.length === 0) {
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         const student = studentRows[0];

//         // Get account info
//         const [accountRows] = await pool.execute(
//             "SELECT account_id, username, password, roles FROM accounts WHERE account_id = ?",
//             [student.account_id]
//         );
//         // console.log(student.account_id)
//         if (accountRows.length === 0) {
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         const account = accountRows[0];

//         // Verify password
//         let passwordValid = false;
//         try {
//             passwordValid = await bcrypt.compare(trimmedPassword, account.password);
//         } catch {
//             passwordValid = trimmedPassword === account.password;
//         }

//         if (!passwordValid) {
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         // Set session
//         req.session.user_id = account.account_id;
//         req.session.user_email = trimmedEmail;

//         res.json({
//             success: true,
//             user: {
//                 student_id: student.student_id,
//                 name: student.name,
//                 username: account.username,
//                 email: trimmedEmail,
//                 roles: account.roles,
//                 loginTime: new Date().toISOString()
//             }
//         });

//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// // Logout endpoint
// app.post('/api/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.error('Logout error:', err);
//             return res.status(500).json({ error: 'Could not log out' });
//         }
//         res.clearCookie('connect.sid');
//         res.json({ success: true, message: 'Logged out successfully' });
//     });
// });

// // Start server
// async function startServer() {
//     const dbConnected = await initDatabase();
    
//     if (!dbConnected) {
//         console.log('⚠️ Starting server without database connection');
//     }
    
//     app.listen(PORT, () => {
//         console.log(`🚀 Server running on http://localhost:${PORT}`);
//         console.log(`📊 Health check: http://localhost:${PORT}/health`);
//     });
// }

// startServer().catch(console.error);
// api-server.js
// import express from 'express';
// import mysql from 'mysql2/promise';
// import session from 'express-session';
// import bcrypt from 'bcrypt';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001; // Changed to 3001 to avoid conflicts

// // Middleware
// app.use(express.json());
// app.use(cors({
//     origin: ['http://localhost:5173', 'http://localhost:3000'], // Support both Vite and other ports
//     credentials: true,
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Session configuration
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false,
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000,
//         sameSite: 'lax'
//     }
// }));

// // Database configuration
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'your_database_name',
//     charset: 'utf8',
//     connectionLimit: 10
// };

// let pool;

// // Test database connection
// async function initDatabase() {
//     try {
//         pool = mysql.createPool(dbConfig);
//         const connection = await pool.getConnection();
//         console.log('✅ Database connected successfully');
//         connection.release();
//         return true;
//     } catch (error) {
//         console.error('❌ Database connection failed:', error.message);
//         return false;
//     }
// }

// // Basic health check
// app.get('/health', (req, res) => {
//     res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // Check authentication status
// app.get('/api/check-auth', async (req, res) => {
//     try {
//         if (!req.session.user_id) {
//             return res.json({ authenticated: false });
//         }

//         const [rows] = await pool.execute(
//             "SELECT account_id, username FROM accounts WHERE account_id = ?",
//             [req.session.user_id]
//         );

//         if (rows.length === 0) {
//             req.session.destroy(() => {});
//             return res.json({ authenticated: false });
//         }

//         const user = rows[0];
        
//         // Get student info
//         const [studentRows] = await pool.execute(
//             "SELECT email, name, student_id FROM students WHERE account_id = ?",
//             [user.account_id]
//         );

//         const studentInfo = studentRows[0] || {};

//         res.json({
//             authenticated: true,
//             user: {
//                 id: user.account_id,
//                 username: user.username,
//                 email: studentInfo.email || req.session.user_email,
//                 name: studentInfo.name,
//                 student_id: studentInfo.student_id
//             }
//         });
//     } catch (error) {
//         console.error('Check auth error:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// // Login endpoint
// app.post('/api/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log('🔐 Login attempt for email:', email);

//         if (!email || !password) {
//             return res.status(400).json({ error: 'Email and password are required' });
//         }

//         const trimmedEmail = email.trim();
//         const trimmedPassword = password.trim();

//         // Get student info
//         const [studentRows] = await pool.execute(
//             "SELECT account_id, name, student_id FROM students WHERE email = ?",
//             [trimmedEmail]
//         );

//         console.log('👤 Student found:', studentRows.length > 0 ? 'Yes' : 'No');

//         if (studentRows.length === 0) {
//             console.log('❌ No student found with email:', trimmedEmail);
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         const student = studentRows[0];
//         console.log('👤 Student data:', { account_id: student.account_id, name: student.name });

//         // Get account info
//         const [accountRows] = await pool.execute(
//             "SELECT account_id, username, password, roles FROM accounts WHERE account_id = ?",
//             [student.account_id]
//         );

//         console.log('🔑 Account found:', accountRows.length > 0 ? 'Yes' : 'No');

//         if (accountRows.length === 0) {
//             console.log('❌ No account found with account_id:', student.account_id);
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         const account = accountRows[0];
//         console.log('🔑 Account data:', { 
//             username: account.username, 
//             roles: account.roles,
//             passwordLength: account.password ? account.password.length : 0,
//             passwordStart: account.password ? account.password.substring(0, 10) + '...' : 'null'
//         });

//         // Verify password
//         let passwordValid = true;
//         console.log('🔍 Testing password...');
        
//         // try {
//         //     // Try bcrypt first
//         //     passwordValid = await bcrypt.compare(trimmedPassword, account.password);
//         //     console.log('🔒 Bcrypt result:', passwordValid);
//         // } catch (bcryptError) {
//         //     console.log('⚠️ Bcrypt failed, trying plain text comparison');
//         //     passwordValid = trimmedPassword === account.password;
//         //     console.log('📝 Plain text result:', passwordValid);
//         // }

//         if (!passwordValid) {
//             console.log('❌ Password validation failed');
//             console.log('Input password length:', trimmedPassword.length);
//             console.log('Stored password length:', account.password.length);
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         console.log('✅ Login successful for:', trimmedEmail);

//         // Set session
//         req.session.user_id = account.account_id;
//         req.session.user_email = trimmedEmail;

//         res.json({
//             success: true,
//             user: {
//                 student_id: student.student_id,
//                 name: student.name,
//                 username: account.username,
//                 email: trimmedEmail,
//                 roles: account.roles,
//                 loginTime: new Date().toISOString()
//             }
//         });

//     } catch (error) {
//         console.error('❌ Login error:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// // Logout endpoint
// app.post('/api/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.error('Logout error:', err);
//             return res.status(500).json({ error: 'Could not log out' });
//         }
//         res.clearCookie('connect.sid');
//         res.json({ success: true, message: 'Logged out successfully' });
//     });
// });

// // Start server
// async function startServer() {
//     const dbConnected = await initDatabase();
    
//     if (!dbConnected) {
//         console.log('⚠️ Starting server without database connection');
//     }
    
//     app.listen(PORT, () => {
//         console.log(`🚀 Server running on http://localhost:${PORT}`);
//         console.log(`📊 Health check: http://localhost:${PORT}/health`);
//     });
// }

// startServer().catch(console.error);



// WORKING JUN 6 -----------------------------------------------------------------------------------------------------
// import express from 'express';
// import mysql from 'mysql2/promise';
// import session from 'express-session';
// import bcrypt from 'bcrypt';
// import cors from 'cors';
// import dotenv from 'dotenv';

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(express.json());
// app.use(cors({
//     origin: ['http://localhost:5173','https://atecon.netlify.app', 'http://localhost:3000'],
//     credentials: true,
//     methods: ['GET', 'POST', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Session configuration
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false,
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000,
//         sameSite: 'lax'
//     }
// }));

// // Database configuration
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'your_database_name',
//     charset: 'utf8',
//     connectionLimit: 10
// };

// let pool;

// // Test database connection
// async function initDatabase() {
//     try {
//         pool = mysql.createPool(dbConfig);
//         const connection = await pool.getConnection();
//         console.log('✅ Database connected successfully');
//         connection.release();
//         return true;
//     } catch (error) {
//         console.error('❌ Database connection failed:', error.message);
//         return false;
//     }
// }

// // Basic health check
// app.get('/health', (req, res) => {
//     res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // Check authentication status
// app.get('/api/check-auth', async (req, res) => {
//     try {
//         if (!req.session.user_id) {
//             return res.json({ authenticated: false });
//         }

//         const [rows] = await pool.execute(
//             "SELECT account_id, username FROM accounts WHERE account_id = ?",
//             [req.session.user_id]
//         );

//         if (rows.length === 0) {
//             req.session.destroy(() => {});
//             return res.json({ authenticated: false });
//         }

//         const user = rows[0];
        
//         // Get student info
//         const [studentRows] = await pool.execute(
//             "SELECT email, name, student_id FROM students WHERE account_id = ?",
//             [user.account_id]
//         );

//         const studentInfo = studentRows[0] || {};

//         // Prepare user data in the format your frontend expects
//         const userData = {
//             account_id: user.account_id,
//             username: user.username,
//             email: studentInfo.email || req.session.user_email,
//             name: studentInfo.name,
//             student_id: studentInfo.student_id,
//             authenticated: true,
//             loginTime: new Date().toISOString()
//         };

//         res.json({
//             authenticated: true,
//             user: userData,
//             // Include this so frontend knows to save to sessionStorage
//             saveToSessionStorage: true
//         });
//     } catch (error) {
//         console.error('Check auth error:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// // Login endpoint
// app.post('/api/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log('🔐 Login attempt for email:', email);

//         if (!email || !password) {
//             return res.status(400).json({ error: 'Email and password are required' });
//         }

//         const trimmedEmail = email.trim();
//         const trimmedPassword = password.trim();

//         // Get student info
//         const [studentRows] = await pool.execute(
//             "SELECT account_id, name, student_id FROM students WHERE email = ?",
//             [trimmedEmail]
//         );

//         console.log('👤 Student found:', studentRows.length > 0 ? 'Yes' : 'No');

//         if (studentRows.length === 0) {
//             console.log('❌ No student found with email:', trimmedEmail);
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         const student = studentRows[0];
//         console.log('👤 Student data:', { account_id: student.account_id, name: student.name });

//         // Get account info
//         const [accountRows] = await pool.execute(
//             "SELECT account_id, username, password, roles FROM accounts WHERE account_id = ?",
//             [student.account_id]
//         );

//         console.log('🔑 Account found:', accountRows.length > 0 ? 'Yes' : 'No');

//         if (accountRows.length === 0) {
//             console.log('❌ No account found with account_id:', student.account_id);
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         const account = accountRows[0];
//         console.log('🔑 Account data:', { 
//             username: account.username, 
//             roles: account.roles,
//             passwordLength: account.password ? account.password.length : 0,
//             passwordStart: account.password ? account.password.substring(0, 10) + '...' : 'null'
//         });

//         // Verify password - UNCOMMENTED AND FIXED
//         let passwordValid = true;
//         console.log('🔍 Testing password...');
        
//         // try {
//         //     // Try bcrypt first
//         //     passwordValid = await bcrypt.compare(trimmedPassword, account.password);
//         //     console.log('🔒 Bcrypt result:', passwordValid);
//         // } catch (bcryptError) {
//         //     console.log('⚠️ Bcrypt failed, trying plain text comparison');
//         //     passwordValid = trimmedPassword === account.password;
//         //     console.log('📝 Plain text result:', passwordValid);
//         // }

//         if (!passwordValid) {
//             console.log('❌ Password validation failed');
//             console.log('Input password length:', trimmedPassword.length);
//             console.log('Stored password length:', account.password.length);
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         console.log('✅ Login successful for:', trimmedEmail);

//         // Set session
//         req.session.user_id = account.account_id;
//         req.session.user_email = trimmedEmail;

//         // Prepare user data in the exact format your frontend expects
//         const userData = {
//             account_id: account.account_id,
//             student_id: student.student_id,
//             name: student.name,
//             username: account.username,
//             email: trimmedEmail,
//             roles: account.roles,
//             authenticated: true,
//             loginTime: new Date().toISOString()
//         };

//         // Log the user data for debugging
//         console.log('📋 User data being sent:', JSON.stringify(userData, null, 2));

//         res.json({
//             success: true,
//             user: userData,
//             // Include this flag so frontend knows to save to sessionStorage
//             saveToSessionStorage: true,
//             // Include a message for the frontend
//             message: 'Login successful - save user data to sessionStorage'
//         });

//     } catch (error) {
//         console.error('❌ Login error:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// // Logout endpoint
// app.post('/api/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.error('Logout error:', err);
//             return res.status(500).json({ error: 'Could not log out' });
//         }
//         res.clearCookie('connect.sid');
//         res.json({ 
//             success: true, 
//             message: 'Logged out successfully',
//             clearSessionStorage: true // Flag for frontend to clear sessionStorage
//         });
//     });
// });

// // New endpoint to get current user data (useful for refreshing sessionStorage)
// app.get('/api/user-data', async (req, res) => {
//     try {
//         if (!req.session.user_id) {
//             return res.status(401).json({ error: 'Not authenticated' });
//         }

//         const [accountRows] = await pool.execute(
//             "SELECT account_id, username, roles FROM accounts WHERE account_id = ?",
//             [req.session.user_id]
//         );

//         if (accountRows.length === 0) {
//             return res.status(401).json({ error: 'User not found' });
//         }

//         const [studentRows] = await pool.execute(
//             "SELECT email, name, student_id FROM students WHERE account_id = ?",
//             [req.session.user_id]
//         );

//         const account = accountRows[0];
//         const student = studentRows[0] || {};

//         const userData = {
//             id: account.account_id,
//             username: account.username,
//             email: student.email || req.session.user_email,
//             name: student.name,
//             student_id: student.student_id,
//             roles: account.roles,
//             authenticated: true,
//             loginTime: new Date().toISOString()
//         };

//         res.json({
//             success: true,
//             user: userData,
//             saveToSessionStorage: true
//         });

//     } catch (error) {
//         console.error('❌ Get user data error:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// // Start server
// async function startServer() {
//     const dbConnected = await initDatabase();
    
//     if (!dbConnected) {
//         console.log('⚠️ Starting server without database connection');
//     }
    
//     app.listen(PORT, () => {
//         console.log(`🚀 Server running on http://localhost:${PORT}`);
//         console.log(`📊 Health check: http://localhost:${PORT}/health`);
//         console.log(`💾 Remember: Frontend should save user data to sessionStorage after login`);
//     });
// }

// startServer().catch(console.error);
// import express from 'express';
// import mysql from 'mysql2/promise';
// import session from 'express-session';
// import bcrypt from 'bcrypt';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import multer from 'multer';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // ES6 module __dirname equivalent
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 3001;

// // Middleware
// app.use(express.json());
// app.use(cors({
//     origin: ['http://localhost:5173','https://atecon.netlify.app', 'http://localhost:3000'],
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization']
// }));

// // Static file serving for uploads
// app.use('/uploads', express.static('uploads'));

// // Session configuration
// app.use(session({
//     secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         secure: false,
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000,
//         sameSite: 'lax'
//     }
// }));

// // MySQL Database configuration
// const dbConfig = {
//     host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_NAME || 'your_database_name',
//     charset: 'utf8',
//     connectionLimit: 10
// };

// let pool;

// // MongoDB Connection
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/8conedge_db', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// // MongoDB User Schema
// const userSchema = new mongoose.Schema({
//     email: { type: String, required: true, unique: true },
//     password: { type: String, required: true },
//     username: { type: String, unique: true },
//     name: String,
//     roles: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    
//     // Profile Information
//     avatar: String,
//     phone: String,
//     location: String,
//     bio: String,
    
//     // Academic Information
//     studentId: { type: String, unique: true, sparse: true },
//     course: String,
//     yearLevel: String,
//     department: String,
    
//     // Professional Information
//     employeeId: { type: String, unique: true, sparse: true },
//     position: String,
    
//     // Account Information
//     status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
//     isVerified: { type: Boolean, default: false },
//     preferences: {
//         theme: { type: String, default: 'light' },
//         notifications: { type: Boolean, default: true },
//         language: { type: String, default: 'en' }
//     },
//     permissions: [String],
    
//     // Timestamps
//     lastLogin: Date
// }, {
//     timestamps: true // Automatically adds createdAt and updatedAt
// });

// const User = mongoose.model('User', userSchema);

// // File upload configuration
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads/avatars/');
//     },
//     filename: (req, file, cb) => {
//         cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
//     }
// });
// const upload = multer({ storage: storage });

// // Test MySQL database connection
// async function initDatabase() {
//     try {
//         pool = mysql.createPool(dbConfig);
//         const connection = await pool.getConnection();
//         console.log('✅ MySQL Database connected successfully');
//         connection.release();
//         return true;
//     } catch (error) {
//         console.error('❌ MySQL Database connection failed:', error.message);
//         return false;
//     }
// }

// // Basic health check
// app.get('/health', (req, res) => {
//     res.json({ status: 'OK', timestamp: new Date().toISOString() });
// });

// // Check authentication status (MySQL-based)
// app.get('/api/check-auth', async (req, res) => {
//     try {
//         if (!req.session.user_id) {
//             return res.json({ authenticated: false });
//         }

//         const [rows] = await pool.execute(
//             "SELECT account_id, username FROM accounts WHERE account_id = ?",
//             [req.session.user_id]
//         );

//         if (rows.length === 0) {
//             req.session.destroy(() => {});
//             return res.json({ authenticated: false });
//         }

//         const user = rows[0];
        
//         // Get student info
//         const [studentRows] = await pool.execute(
//             "SELECT email, name, student_id FROM students WHERE account_id = ?",
//             [user.account_id]
//         );

//         const studentInfo = studentRows[0] || {};

//         // Prepare user data in the format your frontend expects
//         const userData = {
//             account_id: user.account_id,
//             username: user.username,
//             email: studentInfo.email || req.session.user_email,
//             name: studentInfo.name,
//             student_id: studentInfo.student_id,
//             authenticated: true,
//             loginTime: new Date().toISOString()
//         };

//         res.json({
//             authenticated: true,
//             user: userData,
//             // Include this so frontend knows to save to sessionStorage
//             saveToSessionStorage: true
//         });
//     } catch (error) {
//         console.error('Check auth error:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// // MySQL-based Login endpoint
// app.post('/api/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log('🔐 Login attempt for email:', email);

//         if (!email || !password) {
//             return res.status(400).json({ error: 'Email and password are required' });
//         }

//         const trimmedEmail = email.trim();
//         const trimmedPassword = password.trim();

//         // Get student info
//         const [studentRows] = await pool.execute(
//             "SELECT account_id, name, student_id FROM students WHERE email = ?",
//             [trimmedEmail]
//         );

//         console.log('👤 Student found:', studentRows.length > 0 ? 'Yes' : 'No');

//         if (studentRows.length === 0) {
//             console.log('❌ No student found with email:', trimmedEmail);
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         const student = studentRows[0];
//         console.log('👤 Student data:', { account_id: student.account_id, name: student.name });

//         // Get account info
//         const [accountRows] = await pool.execute(
//             "SELECT account_id, username, password, roles FROM accounts WHERE account_id = ?",
//             [student.account_id]
//         );

//         console.log('🔑 Account found:', accountRows.length > 0 ? 'Yes' : 'No');

//         if (accountRows.length === 0) {
//             console.log('❌ No account found with account_id:', student.account_id);
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         const account = accountRows[0];
//         console.log('🔑 Account data:', { 
//             username: account.username, 
//             roles: account.roles,
//             passwordLength: account.password ? account.password.length : 0,
//             passwordStart: account.password ? account.password.substring(0, 10) + '...' : 'null'
//         });

//         // Verify password - UNCOMMENTED AND FIXED
//         let passwordValid = true;
//         console.log('🔍 Testing password...');
        
//         // try {
//         //     // Try bcrypt first
//         //     passwordValid = await bcrypt.compare(trimmedPassword, account.password);
//         //     console.log('🔒 Bcrypt result:', passwordValid);
//         // } catch (bcryptError) {
//         //     console.log('⚠️ Bcrypt failed, trying plain text comparison');
//         //     passwordValid = trimmedPassword === account.password;
//         //     console.log('📝 Plain text result:', passwordValid);
//         // }

//         if (!passwordValid) {
//             console.log('❌ Password validation failed');
//             console.log('Input password length:', trimmedPassword.length);
//             console.log('Stored password length:', account.password.length);
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         console.log('✅ Login successful for:', trimmedEmail);

//         // Set session
//         req.session.user_id = account.account_id;
//         req.session.user_email = trimmedEmail;

//         // Prepare user data in the exact format your frontend expects
//         const userData = {
//             account_id: account.account_id,
//             student_id: student.student_id,
//             name: student.name,
//             username: account.username,
//             email: trimmedEmail,
//             roles: account.roles,
//             authenticated: true,
//             loginTime: new Date().toISOString()
//         };

//         // Log the user data for debugging
//         console.log('📋 User data being sent:', JSON.stringify(userData, null, 2));

//         res.json({
//             success: true,
//             user: userData,
//             // Include this flag so frontend knows to save to sessionStorage
//             saveToSessionStorage: true,
//             // Include a message for the frontend
//             message: 'Login successful - save user data to sessionStorage'
//         });

//     } catch (error) {
//         console.error('❌ Login error:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// // MongoDB-based Login Route (alternative endpoint)
// app.post('/api/login-mongo', async (req, res) => {
//     try {
//         const { email, password } = req.body;
        
//         // Find user by email
//         const user = await User.findOne({ email });
//         if (!user) {
//             return res.status(401).json({ success: false, error: 'Invalid credentials' });
//         }
        
//         // Check password
//         const isValidPassword = await bcrypt.compare(password, user.password);
//         if (!isValidPassword) {
//             return res.status(401).json({ success: false, error: 'Invalid credentials' });
//         }
        
//         // Update last login
//         user.lastLogin = new Date();
//         await user.save();
        
//         // Remove password from response
//         const userResponse = user.toObject();
//         delete userResponse.password;
        
//         res.json({
//             success: true,
//             user: userResponse,
//             message: 'Login successful'
//         });
        
//     } catch (error) {
//         console.error('Login error:', error);
//         res.status(500).json({ success: false, error: 'Server error' });
//     }
// });

// // Logout endpoint
// app.post('/api/logout', (req, res) => {
//     req.session.destroy((err) => {
//         if (err) {
//             console.error('Logout error:', err);
//             return res.status(500).json({ error: 'Could not log out' });
//         }
//         res.clearCookie('connect.sid');
//         res.json({ 
//             success: true, 
//             message: 'Logged out successfully',
//             clearSessionStorage: true // Flag for frontend to clear sessionStorage
//         });
//     });
// });

// // Get current user data endpoint (MySQL-based)
// app.get('/api/user-data', async (req, res) => {
//     try {
//         if (!req.session.user_id) {
//             return res.status(401).json({ error: 'Not authenticated' });
//         }

//         const [accountRows] = await pool.execute(
//             "SELECT account_id, username, roles FROM accounts WHERE account_id = ?",
//             [req.session.user_id]
//         );

//         if (accountRows.length === 0) {
//             return res.status(401).json({ error: 'User not found' });
//         }

//         const [studentRows] = await pool.execute(
//             "SELECT email, name, student_id FROM students WHERE account_id = ?",
//             [req.session.user_id]
//         );

//         const account = accountRows[0];
//         const student = studentRows[0] || {};

//         const userData = {
//             id: account.account_id,
//             username: account.username,
//             email: student.email || req.session.user_email,
//             name: student.name,
//             student_id: student.student_id,
//             roles: account.roles,
//             authenticated: true,
//             loginTime: new Date().toISOString()
//         };

//         res.json({
//             success: true,
//             user: userData,
//             saveToSessionStorage: true
//         });

//     } catch (error) {
//         console.error('❌ Get user data error:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// });

// // Get User Profile Route (MongoDB-based)
// app.get('/api/user/profile', async (req, res) => {
//     try {
//         // In a real app, you'd get userId from JWT token or session
//         const { userId } = req.query;
        
//         const user = await User.findById(userId).select('-password');
//         if (!user) {
//             return res.status(404).json({ success: false, error: 'User not found' });
//         }
        
//         res.json({ success: true, user });
//     } catch (error) {
//         console.error('Get profile error:', error);
//         res.status(500).json({ success: false, error: 'Server error' });
//     }
// });

// // Update User Profile Route (MongoDB-based)
// app.put('/api/user/profile', async (req, res) => {
//     try {
//         // In a real app, you'd get userId from JWT token or session
//         const { userId, ...updateData } = req.body;
        
//         // Remove sensitive fields that shouldn't be updated via this route
//         delete updateData.password;
//         delete updateData.email; // Email changes should be handled separately
//         delete updateData._id;
        
//         const user = await User.findByIdAndUpdate(
//             userId,
//             { ...updateData, updatedAt: new Date() },
//             { new: true, runValidators: true }
//         ).select('-password');
        
//         if (!user) {
//             return res.status(404).json({ success: false, error: 'User not found' });
//         }
        
//         res.json({ success: true, user });
//     } catch (error) {
//         console.error('Update profile error:', error);
//         res.status(500).json({ success: false, error: 'Server error' });
//     }
// });

// // Upload Avatar Route (MongoDB-based)
// app.post('/api/user/avatar', upload.single('avatar'), async (req, res) => {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ success: false, error: 'No file uploaded' });
//         }
        
//         // In a real app, you'd get userId from JWT token or session
//         const { userId } = req.body;
        
//         const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        
//         const user = await User.findByIdAndUpdate(
//             userId,
//             { avatar: avatarUrl },
//             { new: true }
//         ).select('-password');
        
//         res.json({ 
//             success: true, 
//             avatarUrl,
//             user 
//         });
//     } catch (error) {
//         console.error('Upload avatar error:', error);
//         res.status(500).json({ success: false, error: 'Server error' });
//     }
// });

// // Create User Route (Registration) - MongoDB-based
// app.post('/api/register', async (req, res) => {
//     try {
//         const { email, password, username, name, roles = 'student' } = req.body;
        
//         // Check if user already exists
//         const existingUser = await User.findOne({ 
//             $or: [{ email }, { username }] 
//         });
        
//         if (existingUser) {
//             return res.status(400).json({ 
//                 success: false, 
//                 error: 'User with this email or username already exists' 
//             });
//         }
        
//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);
        
//         // Create user
//         const user = new User({
//             email,
//             password: hashedPassword,
//             username,
//             name,
//             roles
//         });
        
//         await user.save();
        
//         // Remove password from response
//         const userResponse = user.toObject();
//         delete userResponse.password;
        
//         res.status(201).json({
//             success: true,
//             user: userResponse,
//             message: 'User created successfully'
//         });
        
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({ success: false, error: 'Server error' });
//     }
// });

// // Start server
// async function startServer() {
//     const dbConnected = await initDatabase();
    
//     if (!dbConnected) {
//         console.log('⚠️ Starting server without MySQL database connection');
//     }
    
//     // Check MongoDB connection
//     mongoose.connection.on('connected', () => {
//         console.log('✅ MongoDB connected successfully');
//     });
    
//     mongoose.connection.on('error', (err) => {
//         console.error('❌ MongoDB connection error:', err);
//     });
    
//     mongoose.connection.on('disconnected', () => {
//         console.log('⚠️ MongoDB disconnected');
//     });
    
//     app.listen(PORT, () => {
//         console.log(`🚀 Server running on http://localhost:${PORT}`);
//         console.log(`📊 Health check: http://localhost:${PORT}/health`);
//         console.log(`💾 Remember: Frontend should save user data to sessionStorage after login`);
//         console.log(`🔄 Available endpoints:`);
//         console.log(`   - MySQL Login: POST /api/login`);
//         console.log(`   - MongoDB Login: POST /api/login-mongo`);
//         console.log(`   - Registration: POST /api/register`);
//         console.log(`   - User Profile: GET /api/user/profile`);
//         console.log(`   - Update Profile: PUT /api/user/profile`);
//         console.log(`   - Upload Avatar: POST /api/user/avatar`);
//     });
// }

// startServer().catch(console.error);

import express from 'express';
import mysql from 'mysql2/promise';
import session from 'express-session';
import bcrypt from 'bcrypt';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
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
    methods: ['GET', 'POST', 'PUT', 'OPTIONS'],
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

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://staff8conacademy:8ConAcademy3rdBatch@8conedge.b4eut9m.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
// SCHEMA START   _____________________________________________________________________________________________________________________________________-
// MongoDB User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true },
    name: String,
    roles: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    account_id: String,
    student_id: String,
    name: String,
    username: String,
    email: String,
    roles: String,
    authenticated: { type: Boolean, default: true },
    loginTime: { type: Date, default: Date.now },
    // Profile Information
    avatar: String,
    phone: String,
    location: String,
    bio: String,
    
    // Academic Information
    studentId: { type: String, unique: true, sparse: true },
    course: String,
    yearLevel: String,
    department: String,
    
    // Professional Information
    employeeId: { type: String, unique: true, sparse: true },
    position: String,
    
    // Account Information
    status: { type: String, enum: ['active', 'inactive', 'suspended'], default: 'active' },
    isVerified: { type: Boolean, default: false },
    preferences: {
        theme: { type: String, default: 'light' },
        notifications: { type: Boolean, default: true },
        language: { type: String, default: 'en' }
    },
    permissions: [String],
    
    // Timestamps
    lastLogin: Date
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

const User = mongoose.model('users', userSchema);

// NEW: MongoDB Session Schema to store session data
const sessionSchema = new mongoose.Schema({
    sessionId: { type: String, required: true, unique: true },
    account_id: { type: String, required: true },
    user_email: { type: String, required: true },
    
    // Complete user data from login
    userData: {
        account_id: String,
        student_id: String,
        name: String,
        username: String,
        email: String,
        roles: String,
        authenticated: { type: Boolean, default: true },
        loginTime: { type: Date, default: Date.now }
    },
    
    // Session metadata
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }, // 24 hours
    userAgent: String,
    ipAddress: String,
    
}, {
    timestamps: true
});

// Index for automatic cleanup of expired sessions
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SessionData = mongoose.model('SessionData', sessionSchema);

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

// Helper function to save session data to MongoDB
async function saveSessionToMongoDB(sessionId, account_id, user_email, userData, req) {
    try {
        // Remove any existing session for this user (optional - for single session per user)
        await SessionData.deleteMany({ account_id });
        
        // Create new session record
        const sessionRecord = new SessionData({
            sessionId,
            account_id,
            user_email,
            userData,
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip || req.connection.remoteAddress
        });
        
        await sessionRecord.save();
        console.log('💾 Session saved to MongoDB for account_id:', account_id);
        return sessionRecord;
    } catch (error) {
        console.error('❌ Error saving session to MongoDB:', error);
        throw error;
    }
}

// Helper function to get session data from MongoDB
async function getSessionFromMongoDB(account_id) {
    try {
        const sessionRecord = await SessionData.findOne({ 
            account_id,
            isActive: true,
            expiresAt: { $gt: new Date() }
        });
        
        if (sessionRecord) {
            console.log('📖 Session found in MongoDB for account_id:', account_id);
            return sessionRecord;
        } else {
            console.log('❌ No active session found in MongoDB for account_id:', account_id);
            return null;
        }
    } catch (error) {
        console.error('❌ Error retrieving session from MongoDB:', error);
        return null;
    }
}

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Check authentication status - UPDATED to check MongoDB sessions
app.get('/api/check-auth', async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.json({ authenticated: false });
        }

        // First check if session exists in MongoDB
        const mongoSession = await getSessionFromMongoDB(req.session.user_id);
        
        if (!mongoSession) {
            // Session not found in MongoDB, destroy Express session
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
            await SessionData.deleteMany({ account_id: req.session.user_id });
            req.session.destroy(() => {});
            return res.json({ authenticated: false, reason: 'Account not found' });
        }

        // Return the saved user data from MongoDB session
        const userData = mongoSession.userData;
        
        res.json({
            authenticated: true,
            user: userData,
            sessionInfo: {
                createdAt: mongoSession.createdAt,
                expiresAt: mongoSession.expiresAt,
                lastActive: mongoSession.updatedAt
            },
            saveToSessionStorage: true
        });
        
    } catch (error) {
        console.error('Check auth error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// UPDATED MySQL-based Login endpoint with MongoDB session storage
// app.post('/api/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         console.log('🔐 Login attempt for email:', email);

//         if (!email || !password) {
//             return res.status(400).json({ error: 'Email and password are required' });
//         }

//         const trimmedEmail = email.trim();
//         const trimmedPassword = password.trim();

//         // Get student info
//         const [studentRows] = await pool.execute(
//             "SELECT account_id, name, student_id FROM students WHERE email = ?",
//             [trimmedEmail]
//         );

//         console.log('👤 Student found:', studentRows.length > 0 ? 'Yes' : 'No');

//         if (studentRows.length === 0) {
//             console.log('❌ No student found with email:', trimmedEmail);
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         const student = studentRows[0];
//         console.log('👤 Student data:', { account_id: student.account_id, name: student.name });

//         // Check if there's an existing active session for this account_id
//         const existingSession = await getSessionFromMongoDB(student.account_id);
        
//         if (existingSession) {
//             console.log('🔄 Found existing session for account_id:', student.account_id);
            
//             // Set Express session
//             req.session.user_id = student.account_id;
//             req.session.user_email = trimmedEmail;
            
//             // Update the session's last active time
//             await SessionData.findByIdAndUpdate(existingSession._id, {
//                 updatedAt: new Date(),
//                 userAgent: req.headers['user-agent'],
//                 ipAddress: req.ip || req.connection.remoteAddress
//             });
            
//             // Return the saved user data from existing session
//             const userData = existingSession.userData;
            
//             console.log('✅ Returning existing session data for:', trimmedEmail);
//             console.log('📋 User data from session:', JSON.stringify(userData, null, 2));
            
//             return res.json({
//                 success: true,
//                 user: userData,
//                 message: 'Login successful - existing session restored',
//                 sessionInfo: {
//                     isExistingSession: true,
//                     createdAt: existingSession.createdAt,
//                     lastActive: existingSession.updatedAt
//                 },
//                 saveToSessionStorage: true
//             });
//         }

//         // No existing session, proceed with normal login process
//         console.log('🆕 No existing session found, proceeding with password verification');

//         // Get account info
//         const [accountRows] = await pool.execute(
//             "SELECT account_id, username, password, roles FROM accounts WHERE account_id = ?",
//             [student.account_id]
//         );

//         console.log('🔑 Account found:', accountRows.length > 0 ? 'Yes' : 'No');

//         if (accountRows.length === 0) {
//             console.log('❌ No account found with account_id:', student.account_id);
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         const account = accountRows[0];
//         console.log('🔑 Account data:', { 
//             username: account.username, 
//             roles: account.roles,
//             passwordLength: account.password ? account.password.length : 0
//         });

//         // Verify password
//         let passwordValid = true;
//         console.log('🔍 Testing password...');
        
//         // Uncomment this section for password verification
//         /*
//         try {
//             // Try bcrypt first
//             passwordValid = await bcrypt.compare(trimmedPassword, account.password);
//             console.log('🔒 Bcrypt result:', passwordValid);
//         } catch (bcryptError) {
//             console.log('⚠️ Bcrypt failed, trying plain text comparison');
//             passwordValid = trimmedPassword === account.password;
//             console.log('📝 Plain text result:', passwordValid);
//         }
//         */

//         if (!passwordValid) {
//             console.log('❌ Password validation failed');
//             return res.status(401).json({ error: 'Invalid email or password' });
//         }

//         console.log('✅ Password verified, creating new session');

//         // Set Express session
//         req.session.user_id = account.account_id;
//         req.session.user_email = trimmedEmail;

//         // Prepare user data in the exact format your frontend expects
//         const userData = {
//             account_id,
//             student_idd,
//             name,
//             username: account.username,
//             email: trimmedEmail,
//             roles: account.roles,
//             authenticated: true,
//             loginTime: new Date().toISOString()
//         };
        
//         // Save session to MongoDB
//         try {
//             const sessionRecord = await saveSessionToMongoDB(
//                 req.sessionID,
//                 account.account_id,
//                 trimmedEmail,
//                 userData,
//                 req
//             );
            
//             console.log('💾 Session saved with ID:', sessionRecord._id);
//         } catch (sessionError) {
//             console.error('⚠️ Failed to save session to MongoDB:', sessionError);
//             // Continue with login even if session save fails
//         }

//         // Log the user data for debugging
//         console.log('📋 New user data being sent:', JSON.stringify(userData, null, 2));

//         res.json({
//             success: true,
//             user: userData,
//             message: 'Login successful - new session created',
//             sessionInfo: {
//                 isExistingSession: false,
//                 createdAt: new Date().toISOString()
//             },
//             saveToSessionStorage: true
//         });

//     } catch (error) {
//         console.error('❌ Login error:', error);
//         res.status(500).json({ error: 'Database error' });
//     }
// });


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
      "SELECT account_id, name, student_id FROM students WHERE email = ?",
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
      authenticated: true,
      loginTime: new Date().toISOString()
    };

    // STEP 5: Create Express session
    req.session.user_id = account.account_id;
    req.session.user_email = trimmedEmail;

    // STEP 6: Store session in MongoDB
    const existingSession = await getSessionFromMongoDB(account.account_id);

    if (existingSession) {
      console.log('🔁 Reusing session');
      await SessionData.findByIdAndUpdate(existingSession._id, {
        updatedAt: new Date(),
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip || req.connection.remoteAddress
      });

      return res.json({
        success: true,
        user: existingSession.userData,
        message: 'Login successful - existing session restored',
        sessionInfo: {
          isExistingSession: true,
          createdAt: existingSession.createdAt,
          lastActive: existingSession.updatedAt
        },
        saveToSessionStorage: true
      });
    } else {
      await saveSessionToMongoDB(
        req.sessionID,
        account.account_id,
        trimmedEmail,
        userData,
        req
      );
    }

    // STEP 7: Sync to MongoDB Users collection (if not already)
    const mongoUserExists = await User.findOne({
      $or: [
        { email: trimmedEmail },
        { username: account.username }
      ]
    });

    if (!mongoUserExists) {
      const mongoUser = new User({
        account_id: account.account_id,
        student_id: student.student_id,
        name: student.name,
        username: account.username,
        email: trimmedEmail,
        roles: account.roles,
        authenticated: true,
        loginTime: new Date(),
        password: account.password // Optional: hash it here if needed
      });

      await mongoUser.save();
      console.log('✅ MongoDB user synced');
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

// UPDATED Logout endpoint to cleanup MongoDB session
app.post('/api/logout', async (req, res) => {
    try {
        if (req.session.user_id) {
            // Remove session from MongoDB
            await SessionData.deleteMany({ account_id: req.session.user_id });
            console.log('🗑️ Removed MongoDB session for account_id:', req.session.user_id);
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

// Get current user data endpoint - UPDATED to use MongoDB session
app.get('/api/user-data', async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        // Get session data from MongoDB
        const mongoSession = await getSessionFromMongoDB(req.session.user_id);
        
        if (!mongoSession) {
            return res.status(401).json({ error: 'Session not found' });
        }

        const userData = mongoSession.userData;

        res.json({
            success: true,
            user: userData,
            sessionInfo: {
                createdAt: mongoSession.createdAt,
                expiresAt: mongoSession.expiresAt,
                lastActive: mongoSession.updatedAt
            },
            saveToSessionStorage: true
        });

    } catch (error) {
        console.error('❌ Get user data error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// NEW: Get all sessions for a user (for admin purposes)
app.get('/api/user/sessions/:account_id', async (req, res) => {
    try {
        const { account_id } = req.params;
        
        const sessions = await SessionData.find({ 
            account_id,
            isActive: true 
        }).sort({ createdAt: -1 });
        
        res.json({
            success: true,
            sessions: sessions.map(session => ({
                sessionId: session.sessionId,
                createdAt: session.createdAt,
                expiresAt: session.expiresAt,
                lastActive: session.updatedAt,
                userAgent: session.userAgent,
                ipAddress: session.ipAddress
            }))
        });
        
    } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// NEW: Cleanup expired sessions manually
app.post('/api/cleanup-sessions', async (req, res) => {
    try {
        const result = await SessionData.deleteMany({
            $or: [
                { expiresAt: { $lt: new Date() } },
                { isActive: false }
            ]
        });
        
        res.json({
            success: true,
            message: `Cleaned up ${result.deletedCount} expired sessions`
        });
        
    } catch (error) {
        console.error('Cleanup sessions error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// MongoDB-based Login Route (alternative endpoint)
app.post('/api/login-mongo', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        // Update last login
        user.lastLogin = new Date();
        await user.save();
        
        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.json({
            success: true,
            user: userResponse,
            message: 'Login successful'
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Get User Profile Route (MongoDB-based)
app.get('/api/user/profile', async (req, res) => {
    try {
        // In a real app, you'd get userId from JWT token or session
        const { userId } = req.query;
        
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Update User Profile Route (MongoDB-based)
app.put('/api/user/profile', async (req, res) => {
    try {
        // In a real app, you'd get userId from JWT token or session
        const { userId, ...updateData } = req.body;
        
        // Remove sensitive fields that shouldn't be updated via this route
        delete updateData.password;
        delete updateData.email; // Email changes should be handled separately
        delete updateData._id;
        
        const user = await User.findByIdAndUpdate(
            userId,
            { ...updateData, updatedAt: new Date() },
            { new: true, runValidators: true }
        ).select('-password');
        
        if (!user) {
            return res.status(404).json({ success: false, error: 'User not found' });
        }
        
        res.json({ success: true, user });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Upload Avatar Route (MongoDB-based)
app.post('/api/user/avatar', upload.single('avatar'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'No file uploaded' });
        }
        
        // In a real app, you'd get userId from JWT token or session
        const { userId } = req.body;
        
        const avatarUrl = `/uploads/avatars/${req.file.filename}`;
        
        const user = await User.findByIdAndUpdate(
            userId,
            { avatar: avatarUrl },
            { new: true }
        ).select('-password');
        
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

// Create User Route (Registration) - MongoDB-based
// app.post('/api/register', async (req, res) => {
//     try {
//         const { email, password, username, name, roles = 'student' } = req.body;
        
//         // Check if user already exists
//         const existingUser = await User.findOne({ 
//             $or: [{ email }, { username }] 
//         });
        
//         if (existingUser) {
//             return res.status(400).json({ 
//                 success: false, 
//                 error: 'User with this email or username already exists' 
//             });
//         }
        
//         // Hash password
//         const hashedPassword = await bcrypt.hash(password, 10);
        
//         // Create user
//         const user = new User({
//             account_id,
//             student_id,
//             name,
//             username,
//             email,
//             roles,
//             authenticated: { type: Boolean, default: true },
//             loginTime: { type: Date, default: Date.now },
//             password: hashedPassword,
            
//         });
        
//         await user.save();
        
//         // Remove password from response
//         const userResponse = user.toObject();
//         delete userResponse.password;
        
//         res.status(201).json({
//             success: true,
//             user: userResponse,
//             message: 'User created successfully'
//         });
        
//     } catch (error) {
//         console.error('Registration error:', error);
//         res.status(500).json({ success: false, error: 'Server error' });
//     }
// });
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
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email or username already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      account_id,
      student_id,
      email,
      password: hashedPassword,
      username,
      name,
      roles,
      authenticated: true,
      loginTime: new Date()
    });

    await user.save();

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      user: userResponse,
      message: 'User created in MongoDB'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

// Start server
async function startServer() {
    const dbConnected = await initDatabase();
    
    if (!dbConnected) {
        console.log('⚠️ Starting server without MySQL database connection');
    }
    
    // Check MongoDB connection
    mongoose.connection.on('connected', () => {
        console.log('✅ MongoDB connected successfully');
    });
    
    mongoose.connection.on('error', (err) => {
        console.error('❌ MongoDB connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
        console.log('⚠️ MongoDB disconnected');
    });
    
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 Health check: http://localhost:${PORT}/health`);
        console.log(`💾 Sessions now saved to MongoDB automatically`);
        console.log(`🔄 Available endpoints:`);
        console.log(`   - MySQL Login: POST /api/login (with MongoDB session storage)`);
        console.log(`   - MongoDB Login: POST /api/login-mongo`);
        console.log(`   - Registration: POST /api/register`);
        console.log(`   - User Sessions: GET /api/user/sessions/:account_id`);
        console.log(`   - Cleanup Sessions: POST /api/cleanup-sessions`);
        console.log(`   - User Profile: GET /api/user/profile`);
        console.log(`   - Update Profile: PUT /api/user/profile`);
        console.log(`   - Upload Avatar: POST /api/user/avatar`);
    });
}

startServer().catch(console.error);