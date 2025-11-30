function checkRole(roles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ msg: 'Usuario no autenticado.' });

    if (!roles.includes(req.user.rol)) {
      return res.status(403).json({ msg: 'No tienes permiso para esta acción.' });
    }

    next();
  };
}

module.exports = checkRole;
