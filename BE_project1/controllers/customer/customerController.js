const Product = require("../../models/Products");
const Category = require("../../models/Categories");

const ProductsPage = async (req, res) => {
  try {
    const data = await Product.find()
      .populate({ path: "category_id" })
      .populate({ path: "variant_id" });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
};
const ProductPage = async (req, res) => {
  try {
    const slug = req.params.slug;
    const data = await Product.findOne({ slug: slug })
      .populate({ path: "category_id" })
      .populate({ path: "variant_id" });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
};
const CategoryPage = async (req, res) => {
  try {
    const data = await Category.find();
  } catch (error) {
    return res.status(500).json(error);
  }
};

module.exports = { ProductsPage, ProductPage, CategoryPage };
