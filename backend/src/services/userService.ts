import bcrypt from 'bcryptjs';
import type { UserDto } from '../dtos/userDto.ts';
import { env } from '../config/env.ts';
import { ConflictError } from '../errors/ConflictError.ts';
import { UserRepository, type UserRow } from '../repositories/userRepository.ts';
import type { CreateUserInput, UserQuery } from '../schemas/userSchema.ts';
import { AuditLogService } from './auditLogService.ts';

export class UserService {
  private userRepository: UserRepository;
  private auditLogService: AuditLogService;

  constructor(
    userRepository: UserRepository = new UserRepository(),
    auditLogService: AuditLogService = new AuditLogService(),
  ) {
    this.userRepository = userRepository;
    this.auditLogService = auditLogService;
  }

  private toDto(row: UserRow): UserDto {
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      role: row.role,
      createdAt: row.createdAt ? row.createdAt.toISOString() : null,
    };
  }

  async list(params: UserQuery): Promise<UserDto[]> {
    const rows = await this.userRepository.findAll(params);
    return rows.map((row) => this.toDto(row));
  }

  async create(input: CreateUserInput, actorId: number): Promise<UserDto> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing) throw new ConflictError('Email sudah terdaftar');

    const passwordHash = await bcrypt.hash(input.password, env.bcryptSaltRounds);
    const row = await this.userRepository.create({
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role,
    });

    if (!row) throw new ConflictError('User gagal dibuat');

    await this.auditLogService.record({
      userId: actorId,
      action: 'CREATE_USER',
      targetTable: 'USERS',
      targetId: row.id,
      metadata: { email: row.email, role: row.role },
    });

    return this.toDto(row);
  }
}