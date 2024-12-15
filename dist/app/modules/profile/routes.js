"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../app/middlewares/auth"));
const user_1 = require("../../../enums/user");
const controllers_1 = require("./controllers");
const validateRequest_1 = __importDefault(require("../../../app/middlewares/validateRequest"));
const validations_1 = require("./validations");
const router = express_1.default.Router();
router.get('/me', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.MANAGER, user_1.ENUM_USER_ROLE.EMPLOYEE), controllers_1.ProfileControllers.me);
router.patch('/update', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.MANAGER, user_1.ENUM_USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(validations_1.ProfileValidations.update), controllers_1.ProfileControllers.update);
exports.ProfileRoutes = router;
