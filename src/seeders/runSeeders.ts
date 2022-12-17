import PostgreSQLRepository from "../repositories/PostgreSQLRepository";
import { Sequelize } from "sequelize-typescript";
// import Continent from "../models/Continent";
// import Country from "../models/Country";
import continentData from "./continentData";
import countryData from "./countryData";

const seedContinents = async (sequelize) => {
  // const continentRepo = sequelize.getRepository(Continent);
  const continentRepo = PostgreSQLRepository(sequelize, "Continent");
  console.log("Running seeding of continents");
  const data = continentData;
  for (let i = 0; i < data.length; i++) {
    let continent = data[i];
    console.log(`Seeding continent: ${continent.continentName}`);
    await continentRepo.upsert(
      { continentId: continent.continentId },
      continent
    );
  }
};

const seedCountries = async (sequelize) => {
  //const countryRepo = sequelize.getRepository(Country);
  const countryRepo = PostgreSQLRepository(sequelize, "Country");
  console.log("Running seeding of countries");
  const data = countryData;
  for (let i = 0; i < data.length; i++) {
    let country = data[i];
    console.log(`Seeding country: ${country.countryName}`);
    await countryRepo.upsert({ countryId: country.countryId }, country);
  }
};

const runSeeders = async (sequelize: Sequelize): Promise<boolean> => {
  try {
    console.log("Running seeders in database");
    await seedContinents(sequelize);
    await seedCountries(sequelize);
    console.log("Completed running seeders in database");
    return Promise.resolve(true);
  } catch (e) {
    console.log("ERROR: could not run seeders in database:");
    console.log(e);
    return Promise.resolve(false);
  }
};

export default runSeeders;
