import Customer from "../../models/Customer";

const index = async (req, res) => {
  try {
    const data = await Customer.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
};
const store = async (req, res) => {};
const show = async (req, res) => {};
const update = async (req, res) => {};
const destroy = async (req, res) => {};
export { index, store, show, update, destroy };
