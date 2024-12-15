"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    from: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    to: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
const Notification = (0, mongoose_1.model)('Notification', notificationSchema);
exports.default = Notification;
