import nodemailer from "nodemailer";
import OrderModel from "../model/order.js";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "temureshtemirov10@gmail.com",
    pass: "edlxigeiubffzdms",
  },
});

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
    const newOrder = await OrderModel.create({
      name,
      email,
      createdAt: new Date(),
    });
    console.log("New order created:", newOrder);

    // Send email using nodemailer
    await sendEmail(name, email, newOrder.id);

    // Schedule the follow-up email after 4 hours
    scheduleFollowUpEmail(newOrder.id, name, email);

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

const scheduleFollowUpEmail = (orderId, name, email) => {
  const delay = 4 * 60 * 60 * 1000; // 4 hours in milliseconds

  setTimeout(async () => {
    try {
      // Fetch the order details from the database
      const order = await OrderModel.findByPk(orderId);

      if (order && !order.isFinished) {
        // Send follow-up email using nodemailer
        await sendFollowUpEmail(name, email, orderId);

        // Update the order status to indicate it is finished
        await updateOrderStatus(orderId);
      }
    } catch (error) {
      console.error("Error scheduling follow-up email:", error);
    }
  }, delay);
};

const updateOrderStatus = async (orderId) => {
  // Update the order status in the database
  await OrderModel.update({ isFinished: true }, { where: { id: orderId } });
};

const sendFollowUpEmail = async (name, email, orderId) => {
  // Update the subject and content for the follow-up email
  const followUpMailOptions = {
    from: "temureshtemirov10@gmail.com",
    to: email,
    subject: "Follow-up: Order Completion",
    html: `
      <p>Hello ${name},</p>
      <p>Your order with ID ${orderId} has been successfully completed.</p>
      <p>Thank you for choosing our service!</p>
    `,
  };

  // Send follow-up email
  try {
    await transporter.sendMail(followUpMailOptions);
    console.log("Follow-up email sent successfully");
  } catch (error) {
    console.error("Error sending follow-up email:", error);
  }
};
