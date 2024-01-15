import express from "express";
import sequelize from "./config/db.js";
import cors from "cors";
import router from "./routes/order.router.js";
import "dotenv/config.js";

async function boostrap() {
  const app = express();

  const port = process.env.PORT || 4854;

  app.use(express.json());
  app.use(cors());
  app.use(router);

  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }

  app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
  });
}

boostrap();
