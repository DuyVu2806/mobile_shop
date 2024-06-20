const { isPhoneNumber } = require("../../hepler/hepler");
const AddressCustomer = require("../../models/AddressCustomer");
const index = async (req, res) => {
  try {
    const addCus = await AddressCustomer.find();
    return res.status(200).json(addCus);
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const store = async (req, res) => {
  try {
    if (!isPhoneNumber(req.body.phone)) {
      return res.status(400).json({ message: "Phone Number Invalid " });
    }
    const address = AddressCustomer({
      customer_id: req.cus.id,
      fullname: req.body.fullname,
      phone: req.body.phone,
      district: req.body.district,
      district_code: req.body.district_code,
      province: req.body.province,
      province_code: req.body.province_code,
      ward: req.body.ward,
      ward_code: req.body.ward_code,
      address: req.body.address,
      selected: req.body.selected,
    });
    if (req.body.selected) {
      await AddressCustomer.updateMany(
        { customer_id: req.cus.id, selected: true },
        { $set: { selected: false } }
      );
    }
    await address.save();
    return res.status(200).json({ message: "Add to Address Successfully" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const show = async (req, res) => {
  try {
    const address = await AddressCustomer.findById(req.params.id);
    if (!address) {
      return res.status(404).json({ message: "Address does not exists" });
    }
    return res.status(200).json(address);
  } catch (error) {
    return res.status(500).json(error);
  }
};

const update = async (req, res) => {
  try {
    const addressId = req.params.id;
    const address = await AddressCustomer.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address does not exists" });
    }
    if (req.body.selected) {
      await AddressCustomer.updateMany(
        { customer_id: req.cus.id, selected: true },
        { $set: { selected: false } }
      );
    }
    await AddressCustomer.findByIdAndUpdate(
      addressId,
      {
        district: req.body.district,
        district_code: req.body.district_code,
        province: req.body.province,
        province_code: req.body.province_code,
        ward: req.body.ward,
        ward_code: req.body.ward_code,
        address: req.body.address,
        selected: req.body.selected,
      },
      { new: true }
    );
    return res.status(200).json({ message: "Address Updated Successfully" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
const destroy = async (req, res) => {
  try {
    const addressId = req.params.id;
    const address = await AddressCustomer.findById(addressId);
    if (!address) {
      return res.status(404).json({ message: "Address does not exists" });
    }
    await address.deleteOne();
    return res.status(200).json({ message: "Address Deleted Successfully" });
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
module.exports = { index, store, show, update, destroy };
