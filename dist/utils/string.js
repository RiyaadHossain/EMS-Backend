"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatString = void 0;
const formatString = (str) => {
    if (!str)
        return "";
    // Replace hyphens with spaces and capitalize each word
    return str
        .replace(/-/g, " ") // Replace hyphens with spaces
        .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
};
exports.formatString = formatString;
