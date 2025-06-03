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
const PORT = process.env.PORT || 3001;

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
    database: process.env.DB_NAME || 'your_database_name',
    charset: 'utf8',
    connectionLimit: 10
};

let pool;

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/8conedge_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// MongoDB User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, unique: true },
    name: String,
    roles: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
    
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

const User = mongoose.model('User', userSchema);

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

// Basic health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Check authentication status (MySQL-based)
app.get('/api/check-auth', async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.json({ authenticated: false });
        }

        const [rows] = await pool.execute(
            "SELECT account_id, username FROM accounts WHERE account_id = ?",
            [req.session.user_id]
        );

        if (rows.length === 0) {
            req.session.destroy(() => {});
            return res.json({ authenticated: false });
        }

        const user = rows[0];
        
        // Get student info
        const [studentRows] = await pool.execute(
            "SELECT email, name, student_id FROM students WHERE account_id = ?",
            [user.account_id]
        );

        const studentInfo = studentRows[0] || {};

        // Prepare user data in the format your frontend expects
        const userData = {
            account_id: user.account_id,
            username: user.username,
            email: studentInfo.email || req.session.user_email,
            name: studentInfo.name,
            student_id: studentInfo.student_id,
            authenticated: true,
            loginTime: new Date().toISOString()
        };

        res.json({
            authenticated: true,
            user: userData,
            // Include this so frontend knows to save to sessionStorage
            saveToSessionStorage: true
        });
    } catch (error) {
        console.error('Check auth error:', error);
        res.status(500).json({ error: 'Database error' });
    }
});

// MySQL-based Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('🔐 Login attempt for email:', email);

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const trimmedEmail = email.trim();
        const trimmedPassword = password.trim();

        // Get student info
        const [studentRows] = await pool.execute(
            "SELECT account_id, name, student_id FROM students WHERE email = ?",
            [trimmedEmail]
        );

        console.log('👤 Student found:', studentRows.length > 0 ? 'Yes' : 'No');

        if (studentRows.length === 0) {
            console.log('❌ No student found with email:', trimmedEmail);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const student = studentRows[0];
        console.log('👤 Student data:', { account_id: student.account_id, name: student.name });

        // Get account info
        const [accountRows] = await pool.execute(
            "SELECT account_id, username, password, roles FROM accounts WHERE account_id = ?",
            [student.account_id]
        );

        console.log('🔑 Account found:', accountRows.length > 0 ? 'Yes' : 'No');

        if (accountRows.length === 0) {
            console.log('❌ No account found with account_id:', student.account_id);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const account = accountRows[0];
        console.log('🔑 Account data:', { 
            username: account.username, 
            roles: account.roles,
            passwordLength: account.password ? account.password.length : 0,
            passwordStart: account.password ? account.password.substring(0, 10) + '...' : 'null'
        });

        // Verify password - UNCOMMENTED AND FIXED
        let passwordValid = true;
        console.log('🔍 Testing password...');
        
        // try {
        //     // Try bcrypt first
        //     passwordValid = await bcrypt.compare(trimmedPassword, account.password);
        //     console.log('🔒 Bcrypt result:', passwordValid);
        // } catch (bcryptError) {
        //     console.log('⚠️ Bcrypt failed, trying plain text comparison');
        //     passwordValid = trimmedPassword === account.password;
        //     console.log('📝 Plain text result:', passwordValid);
        // }

        if (!passwordValid) {
            console.log('❌ Password validation failed');
            console.log('Input password length:', trimmedPassword.length);
            console.log('Stored password length:', account.password.length);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        console.log('✅ Login successful for:', trimmedEmail);

        // Set session
        req.session.user_id = account.account_id;
        req.session.user_email = trimmedEmail;

        // Prepare user data in the exact format your frontend expects
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

        // Log the user data for debugging
        console.log('📋 User data being sent:', JSON.stringify(userData, null, 2));

        res.json({
            success: true,
            user: userData,
            // Include this flag so frontend knows to save to sessionStorage
            saveToSessionStorage: true,
            // Include a message for the frontend
            message: 'Login successful - save user data to sessionStorage'
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ error: 'Database error' });
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

// Logout endpoint
app.post('/api/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Could not log out' });
        }
        res.clearCookie('connect.sid');
        res.json({ 
            success: true, 
            message: 'Logged out successfully',
            clearSessionStorage: true // Flag for frontend to clear sessionStorage
        });
    });
});

// Get current user data endpoint (MySQL-based)
app.get('/api/user-data', async (req, res) => {
    try {
        if (!req.session.user_id) {
            return res.status(401).json({ error: 'Not authenticated' });
        }

        const [accountRows] = await pool.execute(
            "SELECT account_id, username, roles FROM accounts WHERE account_id = ?",
            [req.session.user_id]
        );

        if (accountRows.length === 0) {
            return res.status(401).json({ error: 'User not found' });
        }

        const [studentRows] = await pool.execute(
            "SELECT email, name, student_id FROM students WHERE account_id = ?",
            [req.session.user_id]
        );

        const account = accountRows[0];
        const student = studentRows[0] || {};

        const userData = {
            id: account.account_id,
            username: account.username,
            email: student.email || req.session.user_email,
            name: student.name,
            student_id: student.student_id,
            roles: account.roles,
            authenticated: true,
            loginTime: new Date().toISOString()
        };

        res.json({
            success: true,
            user: userData,
            saveToSessionStorage: true
        });

    } catch (error) {
        console.error('❌ Get user data error:', error);
        res.status(500).json({ error: 'Database error' });
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
app.post('/api/register', async (req, res) => {
    try {
        const { email, password, username, name, roles = 'student' } = req.body;
        
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
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = new User({
            email,
            password: hashedPassword,
            username,
            name,
            roles
        });
        
        await user.save();
        
        // Remove password from response
        const userResponse = user.toObject();
        delete userResponse.password;
        
        res.status(201).json({
            success: true,
            user: userResponse,
            message: 'User created successfully'
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
        console.log(`💾 Remember: Frontend should save user data to sessionStorage after login`);
        console.log(`🔄 Available endpoints:`);
        console.log(`   - MySQL Login: POST /api/login`);
        console.log(`   - MongoDB Login: POST /api/login-mongo`);
        console.log(`   - Registration: POST /api/register`);
        console.log(`   - User Profile: GET /api/user/profile`);
        console.log(`   - Update Profile: PUT /api/user/profile`);
        console.log(`   - Upload Avatar: POST /api/user/avatar`);
    });
}

startServer().catch(console.error);