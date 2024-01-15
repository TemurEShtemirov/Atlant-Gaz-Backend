import { Sequelize } from "sequelize";

const sequelize = new Sequelize("postgres://postgres:1015@localhost:5432/atlant_gaz");

export default sequelize;
