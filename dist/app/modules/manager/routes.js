"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManagerRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../../app/middlewares/auth"));
const user_1 = require("../../../enums/user");
const controllers_1 = require("./controllers");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), controllers_1.ManagerControllers.get);
router.get('/get-select-options', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), controllers_1.ManagerControllers.getSelectOptions);
router.get('/my-manager', (0, auth_1.default)(user_1.ENUM_USER_ROLE.EMPLOYEE), controllers_1.ManagerControllers.getMyManager);
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), controllers_1.ManagerControllers.getDetails);
exports.ManagerRoutes = router;
