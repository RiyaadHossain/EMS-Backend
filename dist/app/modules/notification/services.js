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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationServices = void 0;
const model_1 = __importDefault(require("./model"));
const model_2 = __importDefault(require("../user/model"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const get = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = user;
    const userDetails = yield model_2.default.findOne({ userId });
    if (!userDetails)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Uesr account not found!');
    const notifications = yield model_1.default.find({
        to: userDetails._id,
        isRead: false,
    });
    return notifications;
});
const add = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield model_1.default.create(payload);
});
const readAll = (user) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = user;
    const userDetails = yield model_2.default.findOne({ userId });
    if (!userDetails)
        throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Uesr account not found!');
    const notifications = yield model_1.default.updateMany({ to: userDetails._id, isRead: false }, { isRead: true }, { new: true });
    return notifications;
});
exports.NotificationServices = {
    get,
    add,
    readAll,
};
