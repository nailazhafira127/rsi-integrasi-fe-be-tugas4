import { Router } from 'express';
import { UserController } from '../controllers/userController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { createUserSchema, userQuerySchema } from '../schemas/userSchema.ts';

const userRouter = Router();
const userController = new UserController();

userRouter.get('/', authenticate, authorize('admin'), validate(userQuerySchema, 'query'), userController.list);
userRouter.post('/', authenticate, authorize('admin'), validate(createUserSchema, 'body'), userController.create);

export { userRouter };