# 🎬 Vibe Search – AI Movie Recommendation Engine

Vibe Search is an AI-powered movie recommendation web application that understands natural language movie queries. Instead of filtering movies by rigid categories, users can describe the vibe of the movie they want, and the system intelligently recommends the best matches.

Example queries:

“A mind-bending sci-fi movie”

“A funny movie to watch with friends”

“An 80s adventure movie involving treasure hunting”

“A scary horror movie with suspense”

The app uses Google Gemini AI to interpret user intent and recommend the top movies from a curated dataset.

## 🚀 Features

-✅ Natural language movie search
-✅ AI-powered recommendation using Gemini API
-✅ Intelligent movie matching based on plot, genre, and year
-✅ Dynamic movie cards with poster and details
-✅ Movie posters and ratings fetched from TMDB API
-✅ Interactive UI with loading states and suggestions
-✅ Error-tolerant poster fetching using Promise.allSettled()
-✅ Clean responsive layout with flexbox

## 🧠 How It Works

User types a movie vibe in the search box.

The query is sent to the Node.js server.

The server sends the query and movie dataset to Gemini API.

Gemini analyzes the request and returns the top 3 movie IDs with reasons.

The server matches those IDs with the dataset.

The app fetches posters and ratings from TMDB API.

The frontend dynamically renders movie cards.

## 🛠️ Tech Stack

- Frontend

*HTML*

*CSS*

*Vanilla JavaScript*

*Backend*

*Node.js*

*Express.js*

*APIs*

*Google Gemini API (AI recommendations)*

*TMDB API (posters and ratings)*
