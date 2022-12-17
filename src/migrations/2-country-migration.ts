import { DataType } from "sequelize-typescript";

async function up({ context: queryInterface }) {
  console.log("Creating table country");
  await queryInterface.createTable("country", {
    countryId: {
      field: "country_id",
      allowNull: false,
      primaryKey: true,
      defaultValue: DataType.UUIDV4,
      type: DataType.UUID,
    },
    countryName: {
      field: "country_name",
      type: DataType.STRING(100),
      unique: true,
    },
    countryCode: {
      field: "country_code",
      type: DataType.STRING(2),
    },
    countryCode3: {
      field: "country_code3",
      type: DataType.STRING(3),
    },
    capital: {
      field: "capital",
      type: DataType.STRING(100),
    },
    continentCode: {
      field: "continent_code",
      type: DataType.STRING(2),
    },
    area: {
      field: "area",
      type: DataType.INTEGER,
    },
    population: {
      field: "population",
      type: DataType.INTEGER,
    },
    latitude: {
      field: "latitude",
      type: DataType.DECIMAL(10, 6),
    },
    longitude: {
      field: "longitude",
      type: DataType.DECIMAL(10, 6),
    },
    currencyCode: {
      field: "currency_code",
      type: DataType.STRING(3),
    },
    currencyName: {
      field: "currency_name",
      type: DataType.STRING(50),
    },
    languages: {
      field: "languages",
      type: DataType.STRING(255),
    },
  });
}

async function down({ context: queryInterface }) {
  await queryInterface.dropTable("country");
}

export default { up, down };
