import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(3, "Username minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
});

export const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

const memberSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(1, "No. telepon wajib diisi"),
  university: z.string().min(1, "Universitas wajib diisi"),
  isLeader: z.boolean().optional(),
});

export const teamSchema = z.object({
  teamName: z.string().min(1, "Nama tim wajib diisi"),
  competition: z.enum(["uiux", "webdev"], {
    errorMap: () => ({ message: "Pilih lomba yang valid" }),
  }),
  githubLink: z.string().url().optional().or(z.literal("")),
  figmaLink: z.string().url().optional().or(z.literal("")),
  driveLink: z.string().url().optional().or(z.literal("")),
  leader: memberSchema,
  members: z.array(memberSchema).optional(),
});

export const adminMessageSchema = z.object({
  message: z.string().min(1, "Pesan tidak boleh kosong"),
});

export const settingsSchema = z.object({
  deadline: z.string().datetime().optional(),
  isOpen: z.boolean().optional(),
});
