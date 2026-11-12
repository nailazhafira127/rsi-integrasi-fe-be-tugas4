import { z } from 'zod';

export const createLikeSchema = z
  .object({
    reviewId: z.coerce
      .number({ invalid_type_error: 'reviewId harus berupa angka' })
      .int('reviewId harus bilangan bulat')
      .positive('reviewId harus lebih dari 0'),
  })
  .strict('body hanya boleh berisi reviewId');

export type CreateLikeInput = z.infer<typeof createLikeSchema>;