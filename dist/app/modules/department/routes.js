"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validations_1 = require("./validations");
const controllers_1 = require("./controllers");
const validateRequest_1 = __importDefault(require("../../../app/middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../../app/middlewares/auth"));
const user_1 = require("../../../enums/user");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), controllers_1.DepartmentControllers.get);
router.get('/get-select-options', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), controllers_1.DepartmentControllers.getSelectOptions);
router.post('/add', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(validations_1.DepartmentValidations.add), controllers_1.DepartmentControllers.add);
router.patch('/update/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), (0, validateRequest_1.default)(validations_1.DepartmentValidations.update), controllers_1.DepartmentControllers.update);
router.delete('/remove/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), controllers_1.DepartmentControllers.remove);
router.get('/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN), controllers_1.DepartmentControllers.getDetails);
exports.DepartmentRoutes = router;
