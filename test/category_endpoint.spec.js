const knex = require("knex");
const app = require("../src/app");
const {CategoryArray} = require("./category")

describe("Stable Software Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE category, scripts RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE category, scripts RESTART IDENTITY CASCADE")
  );

  describe("GET /category", () => {
    context("Given an empty category", () => {
      it("responds with an empty array", () => {
        return supertest(app).get("/category").expect(200, []);
      });
    });

    context("Given there is category in the table", () => {
      const testCategory = CategoryArray();

      beforeEach("insert category", () => {
        return db.into("category").insert(testCategory);
      });

      it("responds with category", () => {
        return supertest(app).get("/category").expect(200, testCategory);
      });
    });
  });

  describe.only("GET /scripts", () => {
    context("Given there are no scripts", () => {
      it("responds with an empty array", () => {
        return supertest(app).get("/scripts").expect(200, []);
      });
    });
  });
});