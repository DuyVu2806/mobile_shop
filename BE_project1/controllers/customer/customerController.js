import Product from "../../models/Products";
import Category from "../../models/Categories";
import FuzzySearch from "fuzzy-search";

const ProductsPage = async (req, res) => {
  const { search } = req.query;
  try {
    const data = await Product.find()
      .populate({ path: "category_id" })
      .populate({ path: "variant_id" });
    const searcher = new FuzzySearch(
      data,
      ["name", "category", "slug", "description", "small_description"],
      {
        caseSensitive: false,
      }
    );
    const results = searcher.search(search);
    return res.status(200).json(results);
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

export { ProductsPage, ProductPage, CategoryPage };
