"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../../app/middlewares/validateRequest"));
const auth_1 = __importDefault(require("../../../app/middlewares/auth"));
const user_1 = require("../../../enums/user");
const validations_1 = require("./validations");
const controllers_1 = require("./controllers");
const router = express_1.default.Router();
router.get('/', (0, auth_1.default)(user_1.ENUM_USER_ROLE.ADMIN, user_1.ENUM_USER_ROLE.MANAGER, user_1.ENUM_USER_ROLE.EMPLOYEE), controllers_1.TaskControllers.get);
router.get('/:projectId', (0, auth_1.default)(user_1.ENUM_USER_ROLE.MANAGER), controllers_1.TaskControllers.getByProject);
router.post('/add', (0, auth_1.default)(user_1.ENUM_USER_ROLE.MANAGER), (0, validateRequest_1.default)(validations_1.TaskValidations.add), controllers_1.TaskControllers.add);
router.patch('/update/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.MANAGER, user_1.ENUM_USER_ROLE.EMPLOYEE), (0, validateRequest_1.default)(validations_1.TaskValidations.update), controllers_1.TaskControllers.update);
router.delete('/remove/:id', (0, auth_1.default)(user_1.ENUM_USER_ROLE.MANAGER), controllers_1.TaskControllers.remove);
exports.TaskRoutes = router;
