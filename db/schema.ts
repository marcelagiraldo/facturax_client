import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Tabla de notas (sin categorías)
export const notes = sqliteTable('notes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  date: text('date').notNull() // Puedes usar ISO (ej: "2025-05-21")
});

// Tipos TypeScript inferidos
export type Note = typeof notes.$inferSelect;
export type NewNote = typeof notes.$inferInsert;

export const schema = { notes } as const;