import { z } from 'zod';

export const auditQuerySchema = z.object({
  action: z.string().trim().max(50).optional(),
  targetTable: z.string().trim().max(50).optional(),
});

export const createAuditSchema = z
  .object({
    action: z.string().trim().min(1, 'action wajib diisi').max(50, 'action maksimal 50 karakter'),
    targetTable: z
      .string()
      .trim()
      .min(1, 'targetTable wajib diisi')
      .max(50, 'targetTable maksimal 50 karakter'),
    targetId: z.coerce
      .number({ invalid_type_error: 'targetId harus berupa angka' })
      .int('targetId harus bilangan bulat')
      .positive('targetId harus lebih dari 0'),
    metadata: z.record(z.unknown()).optional(),
  })
  .strict('body hanya boleh berisi action, targetTable, targetId, dan metadata');

export type AuditQuery = z.infer<typeof auditQuerySchema>;
export type CreateAuditInput = z.infer<typeof createAuditSchema>;