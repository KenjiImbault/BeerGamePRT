import mongoose from "mongoose"

import DBGame from "../model/DBGame.js";
import exceljs from "exceljs";

//const socket = io.connect("https://api-beergame.usb-sys.de")

export default function EndGame(io, socket, data) {
  const GameData = mongoose.model("DBGame", DBGame)
  const Current = new GameData(data)
      
  // const exceljs = require('exceljs');
  const workbook = new exceljs.Workbook();
  const worksheetClient = workbook.addWorksheet('Client');
  const worksheetRetailer = workbook.addWorksheet('Retailer');
  const worksheetWholesaler = workbook.addWorksheet('Wholesaler');
  const worksheetDistributor = workbook.addWorksheet('Distributor');
  const worksheetProducer = workbook.addWorksheet('Producer');

  console.log("EndGame.js")

      GameData.find({}, (err, data) => {

        
        // Ajouter l'en-tête du tableau
        worksheetClient.addRow(['tour','demandClient']);
        worksheetRetailer.addRow(['tour','stock','order','delay','next1Week','next2Week']);
        worksheetWholesaler.addRow(['tour','stock','order','delay','next1Week','next2Week']);
        worksheetDistributor.addRow(['tour','stock','order','delay','next1Week','next2Week']);
        worksheetProducer.addRow(['tour','stock','order','delay','next1Week','next2Week']);
      
        let numberOfRounds = 0
        let lastGame = 0
      
        lastGame = data.length
        let roundDataLastGame = data[lastGame-1].roundData
         
        numberOfRounds = data[lastGame-1].roundData.producer.length
        for (let i = 0;i<numberOfRounds;i++){
          
          worksheetClient.addRow([i,roundDataLastGame.demandClientList[i]]);
          worksheetRetailer.addRow([i,roundDataLastGame.retailer[i].stock,roundDataLastGame.retailer[i].order,roundDataLastGame.retailer[i].delay,roundDataLastGame.retailer[i].next1Week,roundDataLastGame.retailer[i].next2Week])
          worksheetWholesaler.addRow([i,roundDataLastGame.wholesaler[i].stock,roundDataLastGame.wholesaler[i].order,roundDataLastGame.wholesaler[i].delay,roundDataLastGame.wholesaler[i].next1Week,roundDataLastGame.wholesaler[i].next2Week])
          worksheetDistributor.addRow([i,roundDataLastGame.distributor[i].stock,roundDataLastGame.distributor[i].order,roundDataLastGame.distributor[i].delay,roundDataLastGame.distributor[i].next1Week,roundDataLastGame.distributor[i].next2Week])
          worksheetProducer.addRow([i,roundDataLastGame.producer[i].stock,roundDataLastGame.producer[i].order,roundDataLastGame.producer[i].delay,roundDataLastGame.producer[i].next1Week,roundDataLastGame.producer[i].next2Week])
        }
      
        // Enregistrer le fichier Excel
        workbook.xlsx.writeFile('export.xlsx')
        .then(() => console.log('Fichier Excel créé avec succès'))
        .catch((err) => console.error('Erreur lors de la création du fichier Excel', err));
      });      
}

 
