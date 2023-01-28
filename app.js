const express = require("express");
const { open } = require("sqlite");

const sqlite3 = require("sqlite3");

const app = express();
const path = require("path");
const dbPath = path.join(__dirname, "moviesData.db");
app.use(express.json());

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

// API 1: GET the list of all the movies from movie table.

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

// API 2: POST (or) CREATE a movie in movie table

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const addMovieQuery = `
  INSERT INTO movie(director_id, movie_name, lead_actor)
  VALUES(
      ${directorId},
      '${movieName}',
      '${leadActor}'
  );`;
  await db.run(addMovieQuery);
  response.send("Movie Successfully Added");
});

// API 3: GET the movie details from movie table.

const convertMovieDbObject = (objectItem) => {
  return {
    movieId: objectItem.movie_id,
    directorId: objectItem.director_id,
    movieName: objectItem.movie_name,
    leadActor: objectItem.lead_actor,
  };
};

app.get("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const getMovieDetailsQuery = `SELECT * FROM movie WHERE 
  movie_id = ${movieId};`;
  const moviesArray = await db.get(getMovieDetailsQuery);
  response.send(convertMovieDbObject(moviesArray));
});

// API 4: Update the movie details in movie table.

app.put("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const { directorId, movieName, leadActor } = request.body;
  const updateMovieQuery = `
  UPDATE movie SET director_id = ${directorId},
  movie_name = '${movieName}', lead_actor = '${leadActor}'
  WHERE movie_id = ${movieId};`;
  await db.run(updateMovieQuery);
  response.send("Movie Details Updated");
});

// API 5: DELETE movie from movie table.
app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteQuery = `
    DELETE FROM movie WHERE movie_id = ${movieId};`;
  const deleteRequestQuery = await db.run(deleteQuery);
  response.send("Movie Removed");
});

// API 6: GET all the directors from directors table.

const getDirectorsDBObject = (objectItem) => {
  return {
    directorId: objectItem.director_id,
    directorName: objectItem.director_name,
  };
};

app.get("/directors/", async (request, response) => {
  const getDirectorQuery = `
    SELECT * FROM director`;
  const directorQueryResponse = await db.all(getDirectorQuery);
  response.send(
    directorQueryResponse.map((eachItem) => getDirectorsDBObject(eachItem))
  );
});
