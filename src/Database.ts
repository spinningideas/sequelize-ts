import { Sequelize } from "sequelize-typescript";
import Country from "./models/Country";
import Continent from "./models/Continent";
import { Dialect } from "sequelize";

// NOTE: this should come from .env file and NOT be hardcoded here
// this is a POC so credentials are stored here for convenience
export const config = {
  username: "postgres",
  password: "P0stGr3s",
  database: "sequelize_ts_orm_poc",
  host: "localhost",
  dialect: "postgres",
  logging: console.log,
};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect as Dialect,
    repositoryMode: true,
  }
);

sequelize.addModels([Continent]);
sequelize.addModels([Country]);

// NOTE: one can also map entire folders...
//const modelsPath = __dirname + "./models";
//sequelize.addModels([__dirname + modelsPath]);

// NOTE: one can also attempt to manage associations here
// Object.keys(Database).forEach((modelName) => {
//   if (Database[modelName].associate) {
//     Database[modelName].associate(Database);
//   }
// });

export default sequelize;
