import type { Request, Response } from 'express';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { CreateUserInput, UserQuery } from '../schemas/userSchema.ts';
import { UserService } from '../services/userService.ts';

export class UserController {
  private userService: UserService;

  constructor(userService: UserService = new UserService()) {
    this.userService = userService;
  }

  list = async (_req: Request, res: Response): Promise<void> => {
    const query = getValidated<UserQuery>(res, 'query');
    const data = await this.userService.list(query);

    res.status(200).json({ status: 'success', data });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const actor = getUser(req);
    const input = getValidated<CreateUserInput>(res, 'body');
    const data = await this.userService.create(input, actor.id);

    res.status(201).json({ status: 'success', data });
  };
}