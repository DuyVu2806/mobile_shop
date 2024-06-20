const Product = require("../../models/Products");
const Variant = require("../../models/Variant");
const { createSlug } = require("../../hepler/hepler");
const fs = require("fs");
const { validateProduct } = require("../../request/productRequest");
const mongoose  = require("mongoose");

const index = async (req, res) => {
  try {
    const product = await Product.find()
      .populate({ path: "category_id" })
      .populate({ path: "variant_id" });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ product });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
const store = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const { error } = validateProduct(req.body);
    if (error) {
      const errorMessages = error.details.map((detail) => ({
        [detail.path[0]]: detail.message,
      }));
      return res.status(400).json({ errors: errorMessages });
    }
    let { variants } = req.body;
    const newVariantIds = [];
    if (variants) {
      await Promise.all(
        variants.map(async (variantData) => {
          const newVariant = new Variant({
            color: variantData.color,
            other: variantData.other,
            price: variantData.price,
            quantity: variantData.quantity,
          });
          await newVariant.save({ session });
          newVariantIds.push(newVariant._id);
        })
      );
    }
    // Create a new Product
    const product = new Product({
      name: req.body.name,
      slug: createSlug(req.body.name),
      images: req.files.map((file) => `${basePath}${file.filename}`),
      category_id: req.body.category_id,
      variant_id: newVariantIds,
      description: req.body.description,
      small_description: req.body.small_description,
      quantity: req.body.quantity,
      price: req.body.price,
      rating: req.body.rating,
    });

    // Save the product
    await product.save({ session });
    await session.commitTransaction();
    session.endSession();
    return res.status(201).send({ message: "Product created successfully!" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    req.files.forEach((file) => {
      fs.unlinkSync(file.filename);
    });
    return res
      .status(500)
      .send({ message: "Internal server error", error: error });
  }
};
const show = async (req, res) => {
  try {
    const data = await Product.findById(req.params.id)
      .populate({ path: "category_id" })
      .populate({ path: "variant_id" });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
};
const update = async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    const basePath = `${req.protocol}://${req.get("host")}/public/uploads/`;
    const productId = req.params.id;
    const product = await Product.findById(productId).populate({
      path: "variant_id",
    });
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let { variants } = req.body;
    let updatedVariantIds = [];
    if (typeof variants !== "undefined") {
      await Promise.all(
        variants.map(async (variantData) => {
          let variant;
          if (variantData._id) {
            variant = await Variant.findByIdAndUpdate(
              variantData._id,
              variantData,
              { new: true }
            );
            updatedVariantIds.push(variant._id);
          } else {
            const newVariant = new Variant({
              color: variantData.color,
              other: variantData.other,
              price: variantData.price,
              quantity: variantData.quantity,
            });
            variant = await newVariant.save({ session });
            updatedVariantIds.push(variant._id);
          }
        })
      );
    } else {
      await Variant.deleteMany({ _id: { $in: product.variant_id } });
      updatedVariantIds = [];
    }

    const oldImages = product.images;
    const newImages = req.files.map((file) => `${basePath}${file.filename}`);
    let currentImages = req.body.images;
    if (!Array.isArray(currentImages)) {
      currentImages = currentImages ? [currentImages] : [];
    }
    const updatedImages = currentImages.concat(newImages);
    const imagesToDelete = oldImages.filter(
      (image) => !req.body.images.includes(image) && typeof image === "string"
    );
    product.name = req.body.name;
    product.slug = createSlug(req.body.name);
    product.images = updatedImages;
    product.category_id = req.body.category_id;
    product.variant_id = updatedVariantIds;
    product.description = req.body.description;
    product.small_description = req.body.small_description;
    product.quantity = req.body.quantity;
    product.price = req.body.price;
    // product.rating = req.body.rating;

    await product.save({ session });
    imagesToDelete.forEach((deletedImage) => {
      const deletedImagePath = deletedImage.split("/").pop();
      fs.unlinkSync(`public/uploads/${deletedImagePath}`);
    });
    await session.commitTransaction();
    session.endSession();
    return res.status(200).send({ message: "Product updated successfully!" });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    req.files.forEach((file) => {
      fs.unlinkSync(file.filename);
    });
    return res
      .status(500)
      .send({ message: "Internal server error", error: error });
  }
};
const destroy = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404).json({ message: "Product does not exist" });
    }
    const associatedVariants = await Variant.find({
      _id: { $in: product.variant_id },
    });
    for (const variant of associatedVariants) {
      await Variant.findByIdAndDelete(variant._id);
    }
    const imagesToDelete = product.images;
    for (const image of imagesToDelete) {
      const relativePath = image.substring(
        image.indexOf("public") + "public".length
      );
      const filePath = `public${relativePath}`;
      try {
        fs.unlinkSync(filePath);
        console.log(`Image deleted: ${image}`);
      } catch (error) {
        console.error(`Error deleting image: ${image}`, error);
      }
    }
    await Product.findByIdAndDelete(product._id);
    return res.status(200).json("Product deleted successfully");
  } catch (error) {
    return res.status(500).json(error);
  }
};
module.exports = { index, store, show, update, destroy };
