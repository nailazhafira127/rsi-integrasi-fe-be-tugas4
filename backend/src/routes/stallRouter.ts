import { Router } from 'express';
import { MenuController } from '../controllers/menuController.ts';
import { ReviewController } from '../controllers/reviewController.ts';
import { StallController } from '../controllers/stallController.ts';
import { authenticate, optionalAuthenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { idParamSchema } from '../schemas/common.ts';
import { createReviewSchema } from '../schemas/reviewSchema.ts';
import { createStallSchema, stallQuerySchema, updateStallSchema } from '../schemas/stallSchema.ts';

const stallRouter = Router();
const stallController = new StallController();
const menuController = new MenuController();
const reviewController = new ReviewController();

stallRouter.get('/', validate(stallQuerySchema, 'query'), stallController.list);
stallRouter.get('/:id/reviews', optionalAuthenticate, validate(idParamSchema, 'params'), reviewController.listByStall);
stallRouter.get('/:id', validate(idParamSchema, 'params'), stallController.get);
stallRouter.post('/', authenticate, authorize('admin', 'owner'), validate(createStallSchema, 'body'), stallController.create);
stallRouter.put('/:id', authenticate, authorize('admin', 'owner'), validate(idParamSchema, 'params'), validate(updateStallSchema, 'body'), stallController.update);
stallRouter.delete('/:id', authenticate, authorize('admin'), validate(idParamSchema, 'params'), stallController.remove);
stallRouter.get('/:id/menus', authenticate, authorize('admin', 'owner'), validate(idParamSchema, 'params'), menuController.listByStall);
stallRouter.post('/:id/reviews', authenticate, validate(idParamSchema, 'params'), validate(createReviewSchema, 'body'), reviewController.create);

export { stallRouter };