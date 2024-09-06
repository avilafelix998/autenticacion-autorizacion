import { newConnection } from "../db/database.js";

// Ruta para manejar el inicio de sesión
export const login = async (req, res) => {
  const { username, password } = req.body;

  // Buscar usuario
  try {
    const dbconnection = await newConnection();
    const [userLogin] = await dbconnection.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (userLogin.length === 0 || userLogin[0].password !== password) {
      return res.status(401).json({ msg: "Credenciales incorrectas" });
    } else {
      // Guardar información del usuario en la sesión
      req.session.userId = userLogin[0].id;
      req.session.username = userLogin[0].username;
      return res.status(200).json({ msg: "Inicio de sesión exitoso" });
    }
  } catch (error) {
    console.error("se produjo un  error", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
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
