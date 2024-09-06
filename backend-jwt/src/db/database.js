import { createConnection } from "mysql2/promise.js";
import { DB_HOST, DB_USER, DB_NAME } from "../config/env";

export const newConnection = async () => {
  try {
    const connection = await createConnection({
      host: DB_HOST,
      user: DB_USER,
      database: DB_NAME,
    });
    await connection.connect();
    console.log("conexión exitosa a la base de datos");
    return connection;
  } catch (error) {
    console.log("hubo un error al conectar con la base de datos");
  }
};
