import { z } from 'zod';

/**
 * User schema validation
 */
export const UserSchema = z.object({
  id: z.string().cuid(),
  email: z.string().email(),
  name: z.string().nullable(),
  phone: z.string().nullable(),
  birthDate: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

/**
 * User registration schema
 */
export const RegisterSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  password: z
    .string()
    .min(8, '비밀번호는 최소 8자 이상이어야 합니다')
    .regex(/[A-Z]/, '비밀번호는 최소 1개의 대문자를 포함해야 합니다')
    .regex(/[a-z]/, '비밀번호는 최소 1개의 소문자를 포함해야 합니다')
    .regex(/[0-9]/, '비밀번호는 최소 1개의 숫자를 포함해야 합니다'),
  name: z.string().min(2, '이름은 최소 2자 이상이어야 합니다'),
  phone: z.string().optional(),
  birthDate: z.string().optional(),
});

export type RegisterInput = z.infer<typeof RegisterSchema>;

/**
 * User login schema
 */
export const LoginSchema = z.object({
  email: z.string().email('유효한 이메일 주소를 입력해주세요'),
  password: z.string().min(1, '비밀번호를 입력해주세요'),
});

export type LoginInput = z.infer<typeof LoginSchema>;
