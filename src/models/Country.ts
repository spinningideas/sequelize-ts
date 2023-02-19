import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AllowNull,
  BelongsTo,
  ForeignKey,
} from "sequelize-typescript";
import Continent from "./Continent";

@Table({ tableName: "countries", freezeTableName: true, timestamps: false })
class Country extends Model {
  @PrimaryKey
  @AllowNull(false)
  @Column({
    primaryKey: true,
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    comment: "PK for Country",
    field: "country_id",
  })
  countryId: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(2),
    comment: "Two Character Code for Country",
    field: "country_code",
  })
  countryCode: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(3),
    comment: "Three Character Code for Country",
    field: "country_code3",
  })
  countryCode3: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(100),
    comment: "Name of Country",
    field: "country_name",
    unique: true,
  })
  countryName: string;

  @Column({
    type: DataType.STRING(100),
    comment: "Capital of Country",
    field: "capital",
  })
  capital: string;

  @AllowNull(false)
  @ForeignKey(() => Continent)
  @Column({
    type: DataType.UUID,
    comment: "Identifier for Continent that Country is lo on",
    field: "continent_id",
  })
  continentId: string;

  @BelongsTo(() => Continent)
  continent: Continent;

  @Column({
    type: DataType.INTEGER,
    comment: "Size of Country",
    field: "area",
  })
  area: number;

  @Column({
    type: DataType.INTEGER,
    comment: "Population of Country",
    field: "population",
  })
  population: number;

  @Column({
    type: DataType.DECIMAL(10, 6),
    comment: "Latitude of Country",
    field: "latitude",
  })
  latitude: number;

  @Column({
    type: DataType.DECIMAL(10, 6),
    comment: "Longitude of Country",
    field: "longitude",
  })
  longitude: number;

  @Column({
    type: DataType.STRING(3),
    comment: "Three Character Code for Currency of Country",
    field: "currency_code",
  })
  currencyCode: string;

  @Column({
    type: DataType.STRING(100),
    comment: "Name of Currency of Country",
    field: "currency_name",
  })
  currencyName: string;

  @Column({
    type: DataType.STRING(100),
    comment: "Language codes Spoken in Country",
    field: "languages",
  })
  languages: string;
}

export default Country;
