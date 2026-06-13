import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config({ path: '.env.local' });
dotenv.config();

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    API_PORT: z.string().transform((val) => Number.parseInt(val, 10)).default('4000'),
    JWT_SECRET: z.string().min(32, "Le JWT_SECRET doit faire au moins 32 caracteres pour etre securise"),
    DATABASE_URL: z.string().min(1, "Le DATABASE_URL est requis"),
})

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Variables d'environnement invalides ou manquantes :");
  console.error(JSON.stringify(_env.error.format(), null, 2));
  process.exit(1);
}

export const env = _env.data;
