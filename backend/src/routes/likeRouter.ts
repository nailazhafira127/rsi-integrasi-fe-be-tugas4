import { Router } from 'express';
import { LikeController } from '../controllers/likeController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { idParamSchema } from '../schemas/common.ts';
import { createLikeSchema } from '../schemas/likeSchema.ts';

const likeRouter = Router();
const likeController = new LikeController();

likeRouter.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(createLikeSchema, 'body'),
  likeController.create,
);
likeRouter.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(idParamSchema, 'params'),
  likeController.remove,
);

export { likeRouter };