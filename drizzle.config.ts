import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'postgresql',
  out: './lib/db',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
