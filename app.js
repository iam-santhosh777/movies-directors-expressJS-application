const express = require("express");
const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const app = express();
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000);
  } catch (err) {
    console.log(`DB Error: ${err.message}`);
    process.exit(1);
  }
};
initializeDBAndServer();

// API - 1: GET Movie's from Database

const convertDbObject = (objectItem) => {
  return {
    movieName: objectItem.movie_name,
  };
};

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `
    SELECT movie_name FROM
        movie;`;
  const moviesList = await db.all(getMoviesQuery);
  response.send(moviesList.map((eachMovie) => convertDbObject(eachMovie)));
});
