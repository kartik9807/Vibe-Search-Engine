import { GoogleGenAI } from "@google/genai";
import express from "express";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const port = 3000;
app.use(express.static("public"));
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const data = fs.readFileSync("movies.json", "utf-8");

app.post("/search", async (req, res) => {
  if(data.length === 0 || `${data}` === "undefined"){
    return res.status(404).json({ error: "No movies found" });
  }
  const query = req.body.query;
  // console.log("Received query:", req.body);
  const prompt = `Based on the following movies data set ${JSON.stringify(data)} and the query ${query} based on this query give me array of top 3 movies id based on genre, plot, rating
  and other criterias which matches the movie dataset and the query and also give reason for the recommendation of that movies in json format for eg:- like this
  {
    id:1,
    reason: "This movie is recommended because it has a high rating and belongs to the same genre as the query movie."
  }. if the query is not clear or does not match any movie in the dataset then give appropriate message.`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
  });
  // inserting the response into the webpage
  console.log("AI Response:", response.text);
  res.json({ results: response.text , movieData: JSON.parse(data) });
});

const tmdb_keys = process.env.TMDB_API_KEY;
app.get("/movieData", async (req, res) => {
  try {
    const title = req.query.title;
    const year = req.query.year;
    const yearParam = year ? `&year=${year}` : "";
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${tmdb_keys}&query=${encodeURIComponent(title)}${yearParam}`;

    let data;
    // retry system if the api fail to get data
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        const response = await fetch(url);
        data = await response.json();
        break;
      } catch (err) {
        console.log(`Attempt ${attempt} failed for "${title}": ${err.message}`);
        if (attempt === 3) throw err;
        await new Promise(r => setTimeout(r, attempt * 500));
      }
    }
    console.log(`Title searched: "${title}"`);
    console.log(`Results count: ${data.results?.length}`);
    data.results?.forEach((m, i) => {
      console.log(`  [${i}] ${m.title} (${m.release_date}) — poster: ${m.poster_path}`);
    });

    if (!data.results || data.results.length === 0) {
      return res.json({ poster: "default.png", rating: "NA" });
    }

    const movie =
      data.results.find(m => m.poster_path && m.title.toLowerCase() === title.toLowerCase()) ||
      data.results.find(m => m.poster_path) ||
      data.results[0];

    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "default.png";

    res.json({ poster, rating: movie.vote_average ?? "NA" });

  } catch (err) {
    console.error("TMDB error:", err);
    res.json({ poster: "default.png", rating: "NA" });
  }
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
