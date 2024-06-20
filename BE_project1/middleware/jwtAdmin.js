const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { permissionMap } = require("../hepler/permissionMap");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, admin) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.admin = admin;
      next();
    });
  } else {
    return res.status(401).json("You are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.admin.id === req.params.id) {
      next();
    } else {
      return res.status(403).json("You are not alowed to do that!");
    }
  });
};

const verifyRole = (req, res, next) => {
  verifyToken(req, res, async () => {
    try {
      const adminId = req.admin.id;
      const admin = await Admin.findById(adminId).populate({
        path: "role",
        populate: { path: "permissions" },
      });
      if (!admin) {
        return res
          .status(401)
          .json({ message: "Unauthorized: User not found" });
      }
      const requiredPermission = permissionMap[req.url];
      const hasPermission = admin.role.permissions.some(
        (permission) => permission.name === requiredPermission
      );

      if (!hasPermission) {
        return res.status(403).json({ message: "Unauthorized: Access denied" });
      }
      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyRole,
  // verifyTokenAndAdmin,
};
