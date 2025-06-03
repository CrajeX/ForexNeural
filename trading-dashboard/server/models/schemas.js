// models/schemas.js
import mongoose from 'mongoose';

// === User Schema ===
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
    timestamps: true
});

const User = mongoose.model('User', userSchema);

// === SessionData Schema ===
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
    expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) },
    userAgent: String,
    ipAddress: String
}, {
    timestamps: true
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const SessionData = mongoose.model('SessionData', sessionSchema);

// === Exports ===
export {
    User,
    SessionData
};
