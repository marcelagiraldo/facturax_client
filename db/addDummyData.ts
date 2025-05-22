import AsyncStorage from "expo-sqlite/kv-store";
import { ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { notes } from "./schema";

export const addDummyData = async (db: ExpoSQLiteDatabase) => {
  const value = AsyncStorage.getItemSync('dbInitialized');
  if (value) return;

  console.log('Inserting dummy notes');

  await db.insert(notes).values([
    { title: 'Revisión médica anual', date: '2025-05-21' },
    { title: 'Control de presión arterial', date: '2025-06-01' },
    { title: 'Factura cliente A', date: '2025-05-10' },
    { title: 'Enviar factura recurrente', date: '2025-05-15' },
    { title: 'Comprar libros', date: '2025-05-12' },
  ]);

  await AsyncStorage.setItemAsync('dbInitialized', 'true');
};
