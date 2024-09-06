import { createConnection } from "mysql2/promise.js";

export const newConnection = async () => {
  try {
    const connection = await createConnection({
      host: "localhost",
      user: "root",
      database: "db_system",
    });
    await connection.connect();
    console.log("conexión exitosa a la base de datos");
    return connection;
  } catch (error) {
    console.log("hubo un error al conectar con la base de datos");
  }
};
