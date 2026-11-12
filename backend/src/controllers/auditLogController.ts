import type { Request, Response } from 'express';
import { getUser } from '../middlewares/auth.ts';
import { getValidated } from '../middlewares/validate.ts';
import type { AuditQuery, CreateAuditInput } from '../schemas/auditSchema.ts';
import { AuditLogService } from '../services/auditLogService.ts';

export class AuditLogController {
  private auditLogService: AuditLogService;

  constructor(auditLogService: AuditLogService = new AuditLogService()) {
    this.auditLogService = auditLogService;
  }

  list = async (_req: Request, res: Response): Promise<void> => {
    const query = getValidated<AuditQuery>(res, 'query');
    const data = await this.auditLogService.list(query);

    res.status(200).json({ status: 'success', data });
  };

  create = async (req: Request, res: Response): Promise<void> => {
    const user = getUser(req);
    const input = getValidated<CreateAuditInput>(res, 'body');

    await this.auditLogService.record({
      userId: user.id,
      action: input.action,
      targetTable: input.targetTable,
      targetId: input.targetId,
      metadata: input.metadata,
    });

    res.status(201).json({ status: 'success', message: 'Audit log berhasil dicatat' });
  };
}