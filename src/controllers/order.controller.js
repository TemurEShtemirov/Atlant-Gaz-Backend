import nodemailer from "nodemailer";
import OrderModel from "../model/order.js";

export const Get = async (req, res) => {
  try {
    const order = await OrderModel.findAll();

    res.status(200).json({
      success: true,
      data: order,
      message: "Get All Orders",
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, data: null, message: "Bad Request", error: err });
  }
};

export const GetById = async (req, res) => {
  const id = req.params.id;

  try {
    const order = await OrderModel.findByPk(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, data: null, message: "Order not found" });
    }

    res
      .status(200)
      .json({ success: true, data: order, message: "Get Order By Id" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, data: null, message: "Bad Request", error: err });
  }
};

export const CreateOrder = async (req, res) => {
  try {
    const { name, email } = req.body;
    console.log("Received data:", { name, email });

    // Create the order in the database
    const newOrder = await OrderModel.create(name, email);
    console.log("New order created:", newOrder);

    // Send email using nodemailer
    await sendEmail(name, email, newOrder.id);

    res.status(201).json({
      success: true,
      data: newOrder,
      message: "Order created successfully",
    });
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({
      success: false,
      data: null,
      message: "Bad Request",
      error: err,
    });
  }
};

// Function to send HTML email
const sendEmail = async (name, email, orderId) => {
  // Create a Nodemailer transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "temureshtemirov10@gmail.com",
      pass: "edlxigeiubffzdms",
    },
  });

  // HTML email content
  const htmlMessage = `
    <p>Hello ${name},</p>
    <p>Your order with ID ${orderId} has been created successfully.</p>
    <p>Thank you for choosing our service!</p>
  `;

  // Email options
  const mailOptions = {
    from: "temureshtemirov10@gmail.com",
    to: email,
    subject: "Order Confirmation",
    html: htmlMessage,
  };

  // Send email
  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
