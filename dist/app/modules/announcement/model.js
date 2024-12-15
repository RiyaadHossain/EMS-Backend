"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-this-alias */
const mongoose_1 = require("mongoose");
const announcementSchema = new mongoose_1.Schema({
    text: { type: String, required: true },
    announcedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, { timestamps: true });
const Announcement = (0, mongoose_1.model)('Announcement', announcementSchema);
exports.default = Announcement;
