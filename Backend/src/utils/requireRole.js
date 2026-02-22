// by Rayyan 2.0


const ROLE_PREFIXES = {
  admin: "ADM",
  thana: "THN",
  officer: "OFC",
  user: "USR",
  jail: "JAL",
};

const getRoleFromId = (id) => {
  if (!id) return null;
  const prefix = id.substring(0, 3);
  for (const [role, rolePrefix] of Object.entries(ROLE_PREFIXES)) {
    if (prefix === rolePrefix) return role;
  }
  return null;
};

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      const userRole = getRoleFromId(req.id);

      if (!userRole) {
        return res.status(403).json({
          success: false,
          message: "Access denied — could not determine role",
        });
      }

      if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({
          success: false,
          message: `Access denied — requires ${allowedRoles.join(" or ")} role`,
        });
      }

      req.role = userRole;
      next();
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
};

export default requireRole;
