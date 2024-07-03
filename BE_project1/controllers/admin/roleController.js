import Role from "../../models/RoleAdmin";
import mongoose from "mongoose";
import permissions from "../../models/PermissionAdmin";

const findAll = async (req, res) => {
  try {
    const data = await Role.find().populate({ path: "permissions" });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

const addRole = async (req, res) => {
  const { name, description, permissions } = req.body;
  if (!name || !description || !permissions || !Array.isArray(permissions)) {
    return res.status(400).json({
      message: "Missing required fields or permissions must be an array",
    });
  }

  const invalidPermissionIds = permissions.filter(
    (permissionId) => !mongoose.Types.ObjectId.isValid(permissionId)
  );
  if (invalidPermissionIds.length > 0) {
    return res.status(400).json({
      message: `Invalid permission ID(s): ${invalidPermissionIds.join(", ")}`,
    });
  }

  try {
    const newRole = new Role({
      name,
      description,
      permissions,
    });

    const savedRole = await newRole.save();
    return res.status(200).json(savedRole);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error creating role" });
  }
};

export { findAll, addRole };
