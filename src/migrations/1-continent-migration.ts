import { DataType } from "sequelize-typescript";

async function up({ context: queryInterface }) {
  console.log("Creating table continent");
  return await queryInterface.createTable("continent", {
    continentId: {
      field: "continent_id",
      allowNull: false,
      primaryKey: true,
      defaultValue: DataType.UUIDV4,
      type: DataType.UUID,
    },
    continentCode: {
      field: "continent_code",
      type: DataType.STRING(2),
      unique: true,
    },
    continentName: {
      field: "continent_name",
      type: DataType.STRING(50),
      unique: true,
    },
  });
}

async function down({ context: queryInterface }) {
  return await queryInterface.dropTable("continent");
}

export { up, down };
