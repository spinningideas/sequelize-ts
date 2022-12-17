import express, { Express, Request, Response } from "express";
import cors from "cors";
import Database from "./Database";
import runMigrations from "./runMigrations";
import runSeeders from "./seeders/runSeeders";
import PostgreSQLRepository from "./repositories/PostgreSQLRepository";

const app: Express = express();
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || "localhost";

// Setup app
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

const db = Database;

// Setup routes
//==continents=======================
app.get("/continents", async (req: Request, res: Response) => {
  const repo = PostgreSQLRepository(db, "Continent");
  return await repo.findAll().then((continents) => {
    res.json(continents);
  });
});
//==countries==============================
app.get("/countries/:continentCode", async (req: Request, res: Response) => {
  let continentCode = req.params.continentCode;
  const repoCountries = PostgreSQLRepository(db, "Country");
  return await repoCountries
    .findWhere({
      continentCode: continentCode,
    })
    .then((results) => {
      if (!results) {
        res.status(404).json({
          message: "countries not found with continentCode: " + continentCode,
        });
      } else {
        res.json(results);
      }
    });
});

app.get(
  "/countries/:continentCode/:pageNumber/:pageSize/:orderBy/:orderDesc",
  async (req: Request, res: Response) => {
    const { continentCode } = req.params;
    const { pageNumber } = req.params;
    const { pageSize } = req.params;
    const { orderBy } = req.params;
    const { orderDesc } = req.params;

    const repoCountries = PostgreSQLRepository(db, "Country");

    const currentPageNumber = pageNumber as unknown as number;
    const currentPageSize = pageSize as unknown as number;

    return await repoCountries
      .findWherePagedSorted(
        { continentCode: continentCode },
        currentPageNumber,
        currentPageSize,
        orderBy,
        orderDesc
      )
      .then((results) => {
        if (!results) {
          res.status(404).json({
            message: "No countries found with continentCode: " + continentCode,
          });
        } else {
          res.json(results);
        }
      });
  }
);

app.get("/country/:countryCode", async (req: Request, res: Response) => {
  let countryCode = req.params.countryCode;
  const repoCountry = PostgreSQLRepository(db, "Country");
  return await repoCountry
    .findOneWhere({ countryCode: countryCode })
    .then((results) => {
      if (!results) {
        res.status(404).json({
          message: "country not found with countryCode: " + countryCode,
        });
      } else {
        res.json(results);
      }
    });
});

//==app start AFTER DB setup==============================
async function configureDatabase() {
  try {
    console.log(`Running database migrations`);
    await runMigrations(db);

    console.log(`Running database seeding`);
    await runSeeders(db);
    return Promise.resolve(true);
  } catch (err) {
    console.error("Error setting up the database", err);
    return Promise.resolve(false);
  }
}

configureDatabase().then((result) => {
  app.listen(PORT, () => {
    console.log("db setup ok?:", result);

    console.log(`Server running at ${HOST}:${PORT} `);
  });
});
