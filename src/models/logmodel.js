const mongoose = require('mongoose');

const LogSchema = new mongoose.Schema({
    level: {
        type: String,
        enum: ['INFO', 'WARN', 'ERROR'],
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true
    },
    method: {
        type: String,
        default: null
    },
    url: {
        type: String,
        default: null
    },
    statusCode: {
        type: Number,
        default: null
    },
    responseTime: {
        type: String,
        default: null
    },
    ip: {
        type: String,
        default: null
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    serverHost: {
        type: String,
        default: null
    },
    stack: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Auto-expire logs after 30 days to prevent unbounded growth
LogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

module.exports = mongoose.model('Log', LogSchema);
