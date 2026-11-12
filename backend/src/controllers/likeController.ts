import type { Request, Response } from 'express';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { IdParam } from '../schemas/common.ts';
import type { CreateLikeInput } from '../schemas/likeSchema.ts';
import { LikeService } from '../services/likeService.ts';

export class LikeController {
  private likeService: LikeService;

  constructor(likeService: LikeService = new LikeService()) {
    this.likeService = likeService;
  }

  create = async (req: Request, res: Response): Promise<void> => {
    const user = getUser(req);
    const input = getValidated<CreateLikeInput>(res, 'body');
    const data = await this.likeService.like(input.reviewId, user.id);

    res.status(201).json({ status: 'success', data });
  };

  remove = async (_req: Request, res: Response): Promise<void> => {
    const params = getValidated<IdParam>(res, 'params');
    const data = await this.likeService.removeById(params.id);

    res.status(200).json({ status: 'success', data });
  };
}