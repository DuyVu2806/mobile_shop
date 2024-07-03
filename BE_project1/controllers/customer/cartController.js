import Cart from "../../models/Carts";
import Product from "../../models/Products";

const index = async (req, res) => {
  try {
    const cartData = await Cart.find({ customer_id: req.cus.id })
      .populate({ path: "product_id" })
      .populate({ path: "variant_id" });
    return res.status(200).json(cartData);
  } catch (error) {
    return res.status(500).json(error);
  }
};
const numCart = async (req, res) => {
  try {
    const data = await Cart.countDocuments({ customer_id: req.cus.id });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error);
  }
};
const addToCart = async (req, res) => {
  try {
    const product = await Product.findById(req.body.product_id).populate({
      path: "variant_id",
    });
    let variantQuantity;
    if (
      product.variant_id &&
      product.variant_id.length > 0 &&
      typeof req.body.variant_id == "undefined"
    ) {
      return res
        .status(400)
        .json({ message: "Please select a variant before adding to cart." });
    }

    if (req.body.variant_id) {
      existingCart = await Cart.findOne({
        customer_id: req.cus.id,
        product_id: req.body.product_id,
        variant_id: req.body.variant_id,
      });
      const variant = product.variant_id.find(
        (v) => v._id.toString() === req.body.variant_id
      );
      variantQuantity = variant.quantity;
    } else {
      existingCart = await Cart.findOne({
        customer_id: req.cus.id,
        product_id: req.body.product_id,
      });
    }
    if (existingCart) {
      if (typeof existingCart.variant_id != "undefined") {
        if (existingCart.variant_id.equals(req.body.variant_id)) {
          const QuantityVariant = existingCart.quantity + req.body.quantity;
          if (QuantityVariant > variantQuantity) {
            return res.status(403).json({
              message: `Only ${
                variantQuantity - existingCart.quantity
              } Product Left`,
            });
          }
          existingCart.quantity += req.body.quantity;
          await existingCart.save();
          return res.status(200).json({ message: "Add To Cart Successfully" });
        } else {
          const newCart = new Cart({
            customer_id: req.cus.id,
            product_id: req.body.product_id,
            variant_id: req.body.variant_id,
            quantity: req.body.quantity,
          });
          await newCart.save();
          return res.status(200).json({ message: "Add To Cart Successfully" });
        }
      } else {
        const tempQuantity = existingCart.quantity + req.body.quantity;
        if (tempQuantity > product.quantity) {
          return res.status(403).json({
            message: `Only ${
              product.quantity - existingCart.quantity
            } Product Left`,
          });
        }
        existingCart.quantity += req.body.quantity;
        await existingCart.save();
        return res.status(200).json({ message: "Add To Cart Successfully" });
      }
    } else {
      if (req.body.quantity > variantQuantity) {
        return res.status(403).json({
          message: `Only ${variantQuantity} Product Left`,
        });
      }
      const newCart = new Cart({
        customer_id: req.cus.id,
        product_id: req.body.product_id,
        variant_id: req.body.variant_id,
        quantity: req.body.quantity,
      });
      await newCart.save();
      return res.status(200).json({ message: "Add To Cart Successfully" });
    }
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const update = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id)
      .populate({
        path: "product_id",
      })
      .populate({ path: "variant_id" });
    if (!cart) {
      return res.status(400).json({ message: "Cart does not exists" });
    }
    if (typeof cart.variant_id === "undefined") {
      if (cart.product_id.quantity < req.body.quantity) {
        return res
          .status(500)
          .json({ message: `Quantity exceeded ${cart.product_id.quantity}` });
      }
    } else {
      if (cart.variant_id.quantity < req.body.quantity) {
        return res
          .status(500)
          .json({ message: `Quantity exceeded ${cart.variant_id.quantity}` });
      }
    }

    cart.quantity = req.body.quantity;
    await cart.save();
    return res.status(200).json(cart);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const destroy = async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res.status(400).json({ message: "Cart does not exists" });
    }
    await cart.deleteOne();
    return res.status(200).json({ message: "Deleted Cart Successfully" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const destroyAll = async (req, res) => {
  try {
    const result = await Cart.deleteMany({ customer_id: req.cus.id });
    if (result.deletedCount > 0) {
      return res.status(200).json({ message: "Deleted all cart items" });
    } else {
      return res.status(402).json({ message: "No cart items to delete" });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
};
export { index, numCart, addToCart, update, destroy, destroyAll };
