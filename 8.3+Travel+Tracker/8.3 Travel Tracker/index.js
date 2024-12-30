import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "World",
  password: "11qq@@aj",
  port: 5432,
});
db.connect();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const result=await db.query("SELECT country_code FROM visited_coountries");
  let countries=[];
  result.rows.forEach((country)=>{
    countries.push(country.country_code);
  });
  res.render("index.ejs",{countries: countries, total: countries.length});
  // db.end();
});

app.post("/add", async (req, res) => {
  const input = req.body["country"];

  const result = await db.query(
    "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
    [input.toLowerCase()]
  );

  if (result.rows.length !== 0) {
    const data = result.rows[0];
    const countryCode = data.country_code;

    await db.query("INSERT INTO visited_coountries (country_code) VALUES ($1)", [
      countryCode,
    ]);
    res.redirect("/");
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
