"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validations_1 = require("./validations");
const controllers_1 = require("./controllers");
const validateRequest_1 = __importDefault(require("../../../app/middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../../app/middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.MANAGER), controllers_1.EmployeeControllers.get);
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.MANAGER), controllers_1.EmployeeControllers.getDetails);
router.get('/get-select-options/:department', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.MANAGER), controllers_1.EmployeeControllers.getSelectOptions);
router.post('/add', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(validations_1.EmployeeValidations.add), controllers_1.EmployeeControllers.add);
router.patch('/update/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(validations_1.EmployeeValidations.update), controllers_1.EmployeeControllers.update);
exports.EmployeeRoutes = router;
