import { find } from "../../models/Admin";

const getAll = async (req, res) => {
  const query = req.query.new;
  try {
    const admin = query
      ? await find().sort({ _id: -1 }).limit(5)
      : await find().populate({ path: "role" });
    return res.status(200).json(admin);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export { getAll };
