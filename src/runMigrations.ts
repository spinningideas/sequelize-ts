import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";

const runMigrations = async (sequelize: Sequelize): Promise<boolean> => {
  try {
    const migrationsPath = "./migrations/*.ts";
    const umzug = new Umzug({
      migrations: { glob: migrationsPath },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    });

    await umzug.up();
    return Promise.resolve(true);
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  }
};

export default runMigrations;
