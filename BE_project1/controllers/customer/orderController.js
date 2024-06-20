const { default: mongoose } = require("mongoose");
const { randomCode } = require("../../hepler/hepler");
const Order = require("../../models/Order");
const OrderItem = require("../../models/OrderItem");

const index = async (req, res) => {
  try {
    const data = await Order.find()
      .populate({ path: "customer_id" })
      .populate({ path: "order_items" });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const store = async (req, res) => {
  const {
    fullname,
    phone,
    district,
    district_code,
    province,
    province_code,
    ward,
    ward_code,
    address,
    total_price,
    shipping_fee,
    payment_mode,
    order_items,
  } = req.body;
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const arrayOrderItem = [];
    await Promise.all(
      order_items.map(async (orderItemData) => {
        const Item = new OrderItem({
          product_id: orderItemData.product_id,
          variant_id: orderItemData.variant_id,
          quantity: orderItemData.quantity,
          price: orderItemData.price,
        });
        await Item.save({ session });
        arrayOrderItem.push(Item._id);
      })
    );
    const order = new Order({
      order_code: randomCode(12),
      customer_id: req.cus.id,
      fullname: fullname,
      phone: phone,
      district: district,
      district_code: district_code,
      province: province,
      province_code: province_code,
      ward: ward,
      ward_code: ward_code,
      address: address,
      total_price: total_price,
      shipping_fee: shipping_fee,
      payment_mode: payment_mode,
      order_items: arrayOrderItem,
    });
    await order.save({ session });
    await session.commitTransaction();
    session.endSession();
    return res.status(200).json({ message: "CheckOut successfully" });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    console.log(error);
    return res.status(500).json(error.message);
  }
};

const show = async (req, res) => {
  try {
    const orderCode = req.params.code;
    const data = Order.find({ code: orderCode })
      .populate({ path: "customer_id" })
      .populate({ path: "order_items" });
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const destroy = async (req, res) => {};
module.exports = { index, store, show, destroy };
