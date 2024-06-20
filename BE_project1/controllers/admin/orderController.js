const Order = require("../../models/Order");
const OrderItem = require("../../models/OrderItem");
const index = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    // Đơn đã đặt trong tuần
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const ordersThisWeek = await Order.countDocuments({
      createdAt: { $gte: oneWeekAgo },
    });

    // Đơn bị hủy
    const cancelledOrders = await Order.countDocuments({
      status_message: "Cancelled",
    });

    // Đơn đã hoàn thành
    const fulfilledOrders = await Order.countDocuments({
      status_message: "Delivery",
    });
    const data = await Order.find();
    return res
      .status(200)
      .json({
        data,
        totalOrders,
        ordersThisWeek,
        cancelledOrders,
        fulfilledOrders,
      });
  } catch (error) {
    return res.status(500).json(error);
  }
};
const store = async (req, res) => {};
const show = async (req, res) => {
  try {
    const data = await Order.findOne({
      order_code: req.params.order_code,
    }).populate({
      path: "order_items",
      populate: [{ path: "product_id" }, { path: "variant_id" }],
    });
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};
const update = async (req, res) => {
  
};
const destroy = async (req, res) => {};
module.exports = { index, store, show, update, destroy };
