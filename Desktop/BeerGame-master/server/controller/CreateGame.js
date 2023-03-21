import mongoose from "mongoose"

import DBGame from "../model/DBGame.js";
import SocketError from "../model/SocketError.js";
import SocketSuccess from "../model/SocketSuccess.js";

export default function CreateGame(io, socket, data) {
  const GameData = mongoose.model("DBGame", DBGame)
  const Current = new GameData(data)
  Current.save(err => {
    if(err) return socket.emit("game_create", new SocketError("Une erreur s'est produite lors de la création du jeu\n\n" +  err))
      socket.emit("game_create", new SocketSuccess(200, "Jeu créé avec succès", {}))
  })
  console.log(data)
}