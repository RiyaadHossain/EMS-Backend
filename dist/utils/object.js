"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function hasOtherFields(data, excludedFields) {
    return Object.keys(data).some(key => !excludedFields.includes(key));
}
exports.default = hasOtherFields;
