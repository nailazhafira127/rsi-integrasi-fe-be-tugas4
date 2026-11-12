import { Router } from 'express';
import { ReviewController } from '../controllers/reviewController.ts';
import { authenticate } from '../middlewares/auth.ts';
import { authorize } from '../middlewares/authorize.ts';
import { validate } from '../middlewares/validate.ts';
import { idParamSchema } from '../schemas/common.ts';

const reviewRouter = Router();
const reviewController = new ReviewController();

reviewRouter.get('/mine', authenticate, authorize('customer'), reviewController.listMine);
reviewRouter.get('/', authenticate, authorize('admin'), reviewController.list);
reviewRouter.get('/manage', authenticate, authorize('admin', 'owner'), reviewController.listManaged);
reviewRouter.delete('/:id', authenticate, authorize('admin'), validate(idParamSchema, 'params'), reviewController.remove);

export { reviewRouter };