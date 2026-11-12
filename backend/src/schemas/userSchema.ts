import { z } from 'zod';

const roleSchema = z.enum(['admin', 'owner', 'customer'], {
  invalid_type_error: 'role tidak valid',
});

export const createUserSchema = z
  .object({
    name: z
      .string({ required_error: 'name wajib diisi' })
      .trim()
      .min(3, 'name minimal 3 karakter')
      .max(100, 'name maksimal 100 karakter'),
    email: z
      .string({ required_error: 'email wajib diisi' })
      .trim()
      .toLowerCase()
      .email('format email tidak valid')
      .max(150, 'email maksimal 150 karakter'),
    password: z
      .string({ required_error: 'password wajib diisi' })
      .min(8, 'password minimal 8 karakter')
      .max(72, 'password maksimal 72 karakter'),
    role: roleSchema.default('customer'),
  })
  .strict('body hanya boleh berisi name, email, password, dan role');

export const userQuerySchema = z.object({
  role: roleSchema.optional(),
  search: z.string().trim().max(100).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;