"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validations_1 = require("./validations");
const controllers_1 = require("./controllers");
const validateRequest_1 = __importDefault(require("../../../app/middlewares/validateRequest"));
const router = express_1.default.Router();
router.post('/register', (0, validateRequest_1.default)(validations_1.UserValidations.register), controllers_1.UserControllers.register);
exports.UserRoutes = router;
