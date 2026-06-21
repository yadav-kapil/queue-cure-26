import Joi from "joi";

export const loginSchemaValidation = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter a Valid Email",
      "any.required": "Email is required",
    }),

  password: Joi.string()
    .required()
    .messages({
      "string.empty": "Password is required",
      "any.required": "Password is required",
    }),
});

export const signupSchemaValidation = Joi.object({
  fullName: Joi.string()
    .required()
    .messages({
      "string.empty": "Full Name is required",
      "any.required": "Full Name is required",
    }),

  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 3 characters",
      "string.max": "Username cannot exceed 30 characters",
      "any.required": "Username is required",
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.empty": "Email is required",
      "string.email": "Enter a Valid Email",
      "any.required": "Email is required",
    }),

  mobileNumber: Joi.string()
    .required()
    .messages({
      "string.empty": "Mobile Number is required",
      "any.required": "Mobile Number is required",
    }),

  role: Joi.string()
    .valid("doctor", "receptionist")
    .required()
    .messages({
      "any.only": "Role must be either doctor or receptionist",
      "string.empty": "Role is required",
      "any.required": "Role is required",
    }),

  password: Joi.string()
    .min(6)
    .max(50)
    .required()
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 6 characters",
      "string.max": "Password cannot exceed 50 characters",
      "any.required": "Password is required",
    }),

  confirmPassword: Joi.any()
    .equal(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Passwords do not match",
      "any.required": "Confirm Password is required",
    }),

  profileImage: Joi.string()
    .optional()
    .allow(""),

  clinicName: Joi.string()
    .optional()
    .allow(""),
});