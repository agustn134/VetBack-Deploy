const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UsuarioModel = require('../models/usuario.model');

require('dotenv').config();

const AuthController = {
  registrar: async (req, res) => {
    try {
      const { nombre_completo, correo, telefono, rol, password } = req.body;

      if (!nombre_completo || !correo || !rol || !password)
        return res.status(400).json({ msg: 'Faltan campos obligatorios.' });

      const existente = await UsuarioModel.buscarPorCorreo(correo);
      if (existente) return res.status(409).json({ msg: 'El correo ya está registrado.' });

      const password_hash = await bcrypt.hash(password, 10);

      const nuevo = await UsuarioModel.crearUsuario({
        nombre_completo,
        correo,
        telefono,
        rol,
        password_hash
      });

      res.status(201).json({ msg: 'Usuario registrado con éxito.', usuario: nuevo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error en el servidor.' });
    }
  },

  login: async (req, res) => {
    try {
      const { correo, password } = req.body;

      const usuario = await UsuarioModel.buscarPorCorreo(correo);
      if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado.' });

      const valido = await bcrypt.compare(password, usuario.password_hash);
      if (!valido) return res.status(401).json({ msg: 'Contraseña incorrecta.' });

      const token = jwt.sign(
        {
          id: usuario.id,
          rol: usuario.rol,
          correo: usuario.correo
        },
        process.env.JWT_SECRET || 'pethealth_secret',
        { expiresIn: '8h' }
      );

      res.json({
        msg: 'Inicio de sesión exitoso',
        token,
        usuario: {
          id: usuario.id,
          nombre: usuario.nombre_completo,
          rol: usuario.rol,
          correo: usuario.correo
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ msg: 'Error en el servidor.' });
    }
  }
};

module.exports = AuthController;
