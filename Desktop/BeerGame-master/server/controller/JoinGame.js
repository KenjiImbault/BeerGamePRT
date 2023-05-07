import mongoose from "mongoose";

import { checkIfPlayerIsInAnyRoom } from "../functions/lib.js";
import SocketError from "../model/SocketError.js"
import SocketSuccess from "../model/SocketSuccess.js"
import DBGame from "../model/DBGame.js";

export default function JoinGame(io, socket, intData) {
  const room = intData.gameCode
  const role = intData.selectedRole
  console.log("Room = " + room)
  console.log("Rôle = " + role)
  //Si le joueur n'a pas encore de rôle
  if(checkIfPlayerIsInAnyRoom(io, socket.id))
    return socket.emit("join_to_game", new SocketError("Le joueur est déjà connecté à un jeu."))
  //obtenir un enregistrement
  const GameData = mongoose.model("DBGame", DBGame)
  GameData.findOne({ gameCode: room }, (err, data) => {
    if(err) return socket.emit("join_to_game", new SocketError("il y a eu une erreur: " + err.message))
    if(data === null) return socket.emit("join_to_game", new SocketError("Il n'y a pas de jeu avec ce GameCode !"))
    //Si le rôle n'a pas encore été sélectionné par le joueur, la boîte de dialogue de sélection de rôle doit être appelée
    if(role === 0) {
      socket.emit("game_choose_role", data.playerData)
      console.log(data.playerData)
    }
    else {
      if(io.sockets.adapter.rooms.get(room) === undefined) {
        socket.join(room)
        socket.emit("join_to_game", new SocketSuccess(200, "Le jeu a été entré avec succès", {room, role}))
        switch (role) {
          case 1:
            data.playerData.producer = socket.id
            break
          case 2:
            data.playerData.distributor = socket.id
            break
          case 3:
            data.playerData.wholesaler = socket.id
            break
          case 4:
            data.playerData.retailer = socket.id
        }
        data.save()
        let selectedRoles = []
        if(data.playerData.producer !== "NA") selectedRoles.push("Producer")
        if(data.playerData.distributor !== "NA") selectedRoles.push("Distributor")
        if(data.playerData.wholesaler !== "NA") selectedRoles.push("Wholesaler")
        if(data.playerData.retailer !== "NA") selectedRoles.push("Retailer")
        io.to(room).emit("update_room_size", {
          roomSize: io.sockets.adapter.rooms.get(room).size,
          selectedRoles
        })
        console.log("Un joueur vient de rejoindre la partie")
      }
      else {
        if(io.sockets.adapter.rooms.get(room).size >= 4)
          return socket.emit("join_to_game", new SocketError("Le joueur est déjà connecté à un jeu ou le jeu est déjà complet !"))
        else {
          socket.join(room)
          socket.emit("join_to_game", new SocketSuccess(200, "Le jeu a été entré avec succès", {room, role}))
          switch (role) {
            case 1:
              data.playerData.producer = socket.id
              break
            case 2:
              data.playerData.distributor = socket.id
              break
            case 3:
              data.playerData.wholesaler = socket.id
              break
            case 4:
              data.playerData.retailer = socket.id
              break
          }
          data.save()
          let selectedRoles = []
          if(data.playerData.producer !== "NA") selectedRoles.push("Producer")
          if(data.playerData.distributor !== "NA") selectedRoles.push("Distributor")
          if(data.playerData.wholesaler !== "NA") selectedRoles.push("Wholesaler")
          if(data.playerData.retailer !== "NA") selectedRoles.push("Retailer")
          io.to(room).emit("update_room_size", {
            roomSize: io.sockets.adapter.rooms.get(room).size,
            selectedRoles
          })
          //socket.emit("initial_data", data)
          io.to(room).emit("initial_data", data)
        }
      }
    }
  })
}
