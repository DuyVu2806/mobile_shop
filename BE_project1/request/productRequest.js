import Joi from "joi";

const productRequest = Joi.object({
  name: Joi.string().required(),
  category_id: Joi.string().required(),
  description: Joi.string().required(),
  small_description: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  price: Joi.number().min(1).required(),
  rating: Joi.number().min(0).default(0),
  variants: Joi.array()
    .items(
      Joi.object({
        // _id: Joi.string(),
        color: Joi.string().required(),
        other: Joi.string().required(),
        price: Joi.number().min(1).required(),
        quantity: Joi.number().integer().min(1).required(),
      })
    )
    .optional(),
});

// Hàm xác thực request
const validateProduct = (data) => {
  return productRequest.validate(data, { abortEarly: false });
};
export { validateProduct };
