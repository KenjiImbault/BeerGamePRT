// Importation des packages externes
import { Server } from "socket.io";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config()

// Importer ses propres packages et composants
import JoinGame from "./controller/JoinGame.js";
import CreateGame from "./controller/CreateGame.js";
import UpdateGame from "./controller/UpdateGame.js";
import LeaveGame from "./controller/LeaveGame.js";

const io = new Server({
  cors: {
    origin: process.env.SERVER_CORS_ORIGIN
  }
});

mongoose.connect(process.env.MONGOOSE_CONNECTIONSTRING)
  .then(() => {
    io.on("connection", (socket) => {
      socket.on("join_game", (data) => JoinGame(io, socket, data))
      socket.on("game_create", (data) => CreateGame(io, socket, data))
      socket.on("game_update", (data) => UpdateGame(io, socket, data))
      socket.on("disconnect", () => LeaveGame(io, socket))
    });
    console.log("serveur sur le port " + process.env.SERVER_PORT + " commencé. Connexion à la base de données établie.");
  })
  .catch((err) => {
    console.log("Le serveur n'a pas pu démarrer. Message d'erreur:\n" + err.message);
});

io.listen(process.env.SERVER_PORT)