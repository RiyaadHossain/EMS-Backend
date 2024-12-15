"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const company_1 = require("../../../enums/company");
const companySchema = new mongoose_1.Schema({
    admin: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    companyName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    status: { type: String, enum: Object.values(company_1.ENUM_COMPANY_STATUS), default: company_1.ENUM_COMPANY_STATUS.IN_ACTIVE },
    phone: { type: String, required: true, unique: true },
    address: { type: String, required: true, unique: true },
}, { timestamps: true });
companySchema.statics.isCompanyExist = function (id) {
    return __awaiter(this, void 0, void 0, function* () {
        const isExist = yield Company.findById(id);
        return isExist;
    });
};
const Company = (0, mongoose_1.model)('Company', companySchema);
exports.default = Company;
