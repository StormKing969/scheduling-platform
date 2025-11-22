import { AppDataSource } from "../config/database.config";

export const initializeDatabase = async () => {
  try {
    await AppDataSource.initialize();
    console.log("Database initialized");
  } catch (error) {
    console.error("Database initialisation failed", error);
    process.exit(1);
  }
};