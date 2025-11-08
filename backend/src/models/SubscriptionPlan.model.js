const mongoose = require('mongoose');

const SubscriptionPlanSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['Free', 'Basic', 'Premium'],
        required: true,
        unique: true
    },
    priceUZS: {
        type: Number,
        required: true,
    },
    clientLimit: {
        type: Number,
        default: 50,
    },
    employeeLimit: {
        type: Number,
        default: 1,
    },
    features: [String],
    priority: {
        type: Number,
        default: 10
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('SubscriptionPlan', SubscriptionPlanSchema);