import Joi from "joi";

const updateCategoryRequest = Joi.object({
  name: Joi.string().min(3).max(255),
  image: Joi.string(),
  description: Joi.string().min(10),
  meta_title: Joi.string().min(5),
});
export { updateCategoryRequest };
