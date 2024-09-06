import { newConnection } from "../db/database.js";
import generarJwt from "../helpers/generar-jwt.js";

// Ruta para manejar el inicio de sesión
export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Crear una nueva conexión a la base de datos
    const connection = await newConnection();

    // Consultar el usuario en la base de datos
    const [user] = await connection.query(
      "SELECT * FROM users WHERE username = ? AND password = ? LIMIT 1",
      [username, password]
    );

    // Validación de usuario
    if (user.length === 0) {
      connection.end(); // Cerrar la conexión si no se encuentra el usuario
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    // Generar token JWT
    const token = await generarJwt(user[0].id);

    // Almacenar el token en la sesión del servidor
    req.session.token = token;

    // Almacenar el token en una cookie segura
    res.cookie("authToken", token, {
      httpOnly: true, // La cookie no es accesible desde JavaScript
      secure: false, // Cambiar a true en producción con HTTPS
      maxAge: 3600000, // Expiración en milisegundos (1 hora)
    });

    connection.end(); // Cerrar la conexión después de la operación
    return res.json({ message: "Inicio de sesión exitoso" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error Inesperado" });
  }
};

// Ruta para obtener los datos de la sesión
export const session = (req, res) => {
  if (req.session.userId) {
    return res.json({
      loggedIn: true,
      user: { id: req.session.userId, username: req.session.username },
    });
  } else {
    return res
      .status(401)
      .json({ loggedIn: false, message: "No hay sesión activa" });
  }
};

// Ruta para cerrar la sesión
export const logout = (req, res) => {
  console.log(req.session);
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: "Error al cerrar la sesión" });
    }
    res.clearCookie("connect.sid"); // Nombre de cookie por defecto para express-session
    return res.json({ message: "Sesión cerrada exitosamente" });
  });
};

//Ruta para registrar al usuario
export const register = async (req, res) => {
  const { username, password } = req.body;
  try {
    const dbconnection = await newConnection();

    const [resul] = await dbconnection.query(
      "INSERT INTO users (username, password) values (?,?)",
      [username, password],

      res.status(201).json({
        msg: "Usuario registrado correctamente",
      })
    );
  } catch (error) {
    console.error("se produjo un  error", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
