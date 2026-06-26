import Joi from "joi";

export const addPatientSchemaValidation = Joi.object({
  name: Joi.string()
    .required()
    .messages({
      "string.empty": "Patient name is required.",
      "any.required": "Patient name is required.",
    }),
  mobile: Joi.string()
    .pattern(/^\d{10}$/)
    .required()
    .messages({
      "string.empty": "Mobile number is required.",
      "string.pattern.base": "Mobile number must be a valid 10-digit number.",
      "any.required": "Mobile number is required.",
    }),
  email: Joi.string()
    .email()
    .optional()
    .allow("")
    .messages({
      "string.email": "Enter a Valid Email",
    }),
  age: Joi.number()
    .integer()
    .min(0)
    .max(120)
    .optional()
    .allow(""),
  gender: Joi.string()
    .valid("male", "female", "other")
    .optional()
    .messages({
      "any.only": "Gender must be either male, female or other",
    }),
  initialAvgTime: Joi.number()
    .integer()
    .min(1)
    .optional()
    .allow(""),
});
