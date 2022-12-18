import { Sequelize } from "sequelize";
import { Umzug, SequelizeStorage } from "umzug";

const runMigrations = async (sequelize: Sequelize): Promise<boolean> => {
  try {
    console.log(`Running migrations in folder`);
    const umzug = new Umzug({
      migrations: { glob: "migrations/*.{js,ts}" },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger: console,
    });

    await umzug.up().then(function (migrations) {
      migrations.forEach(function (e: any) {
        console.log(`Run migration ${e.file}`);
      });
    });

    return Promise.resolve(true);
  } catch (e) {
    console.log(e);
    return Promise.resolve(false);
  }
};

export default runMigrations;
