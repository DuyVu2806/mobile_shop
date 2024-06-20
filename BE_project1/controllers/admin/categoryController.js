const Category = require("../../models/Categories");
const { createSlug } = require("../../hepler/hepler");
const fs = require("fs");
const { updateCategoryRequest } = require("../../request/categoryRequest");

const index = async (req, res) => {
  try {
    const data = await Category.find();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
};
const store = async (req, res) => {
  let imageSaved = false;
  const file = req.file;
  if (!file) {
    return res.status(400).send("No image in the request");
  }
  const fileName = req.file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
  try {
    const category = Category({
      name: req.body.name,
      slug: createSlug(req.body.name),
      image: `${basePath}${fileName}`,
      description: req.body.description,
      meta_title: req.body.meta_title,
    });
    await category.save();
    imageSaved = true;
    return res.status(200).json({ message: "Add category successfully" });
  } catch (error) {
    return res.status(500).json(error);
  } finally {
    if (!imageSaved) {
      fs.unlinkSync(req.file.path);
    }
  }
};
const show = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (category) {
      return res.status(200).json(category);
    } else {
      return res.status(404).json({ message: "Category does not exist" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
const update = async (req, res) => {
  let imageSaved = false;
  try {
    const { error } = updateCategoryRequest.validate(req.body);
    if (error) {
      return res.status(422).json({
        errors: error.details.map((e) => ({ [e.path[0]]: e.message })),
      });
    }
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Cateogry does not exist" });
    }
    let imagePath = category.image;
    const file = req.file;
    if (file) {
      const fileName = req.file.filename;
      const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
      imagePath = `${basePath}${fileName}`;
      console.log(fileName);
      // Delete old image if it exists
      const filePath = category.image.substring(
        category.image.lastIndexOf("/") + 1
      );
      if (fs.existsSync(`public/uploads/${filePath}`)) {
        fs.unlinkSync(`public/uploads/${filePath}`);
      }
    }
    category = await Category.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        slug: createSlug(req.body.name),
        image: imagePath,
        description: req.body.description,
        meta_title: req.body.meta_title,
      },
      { new: true }
    );
    imageSaved = true;
    return res.status(200).json(category);
  } catch (error) {
    return res.status(500).json(error);
  } finally {
    // if (!imageSaved) {
    //   fs.unlinkSync(req.file.path);
    // }
  }
};
const destroy = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category does not exist" });
    }
    await category.deleteOne();
    return res.status(200).json("Category deleted successfully");
  } catch (error) {
    return res.status(500).json(error);
  }
};
module.exports = { index, store, show, update, destroy };
