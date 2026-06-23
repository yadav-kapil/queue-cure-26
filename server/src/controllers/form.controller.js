import Form from "../models/form.model.js";
import wrapAsync from "../utils/wrapAsync.js";
import ExpressError from "../utils/ExpressError.js";

export const postForm = wrapAsync(async (req, res, next) => {
  const { name, email, phone, message } = req.body;

  if (!name || !name.trim()) {
    throw new ExpressError(400, "Name is required.");
  }
  if (!email || !email.trim()) {
    throw new ExpressError(400, "Email is required.");
  }
  if (!phone || !phone.trim()) {
    throw new ExpressError(400, "Phone number is required.");
  }
  if (!message || !message.trim()) {
    throw new ExpressError(400, "Message is required.");
  }

  const newForm = new Form({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    message: message.trim(),
  });

  await newForm.save();

  res.status(201).json({
    success: true,
    message: "Thanks for reaching out! We will contact you shortly.",
    data: newForm,
  });
});
