import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
} from "sequelize-typescript";

@Table({ tableName: "continents", freezeTableName: true, timestamps: false })
class Continent extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    comment: "PK for Continent",
    field: "continent_id",
  })
  continentId: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(2),
    comment: "Code for Continent",
    field: "continent_code",
  })
  continentCode: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(50),
    comment: "Name for Continent",
    field: "continent_name",
  })
  continentName: string;

}

export default Continent;
