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
        worksheetClient.addRow(['test']);
        worksheetRetailer.addRow(['stock','order','delay','next1Week','next2Week']);
        worksheetWholesaler.addRow(['stock','order','delay','next1Week','next2Week']);
        worksheetDistributor.addRow(['stock','order','delay','next1Week','next2Week']);
        worksheetProducer.addRow(['stock','order','delay','next1Week','next2Week']);
      
        let numberOfRounds = 0
        let lastGame = 0
      
        lastGame = data.length
        let roundDataLastGame = data[lastGame-1].roundData
         
        numberOfRounds = data[lastGame-1].roundData.producer.length
        for (let i = 0;i<numberOfRounds;i++){
          
          worksheetRetailer.addRow([roundDataLastGame.retailer[i].stock,roundDataLastGame.retailer[i].order,roundDataLastGame.retailer[i].delay,0,0])
          worksheetWholesaler.addRow([roundDataLastGame.wholesaler[i].stock,roundDataLastGame.wholesaler[i].order,roundDataLastGame.wholesaler[i].delay,0,0])
          worksheetDistributor.addRow([roundDataLastGame.distributor[i].stock,roundDataLastGame.distributor[i].order,roundDataLastGame.distributor[i].delay,0,0])
          worksheetProducer.addRow([roundDataLastGame.producer[i].stock,roundDataLastGame.producer[i].order,roundDataLastGame.producer[i].delay,0,0])
        }
      
        // Enregistrer le fichier Excel
        workbook.xlsx.writeFile('export.xlsx')
        .then(() => console.log('Fichier Excel créé avec succès'))
        .catch((err) => console.error('Erreur lors de la création du fichier Excel', err));
      });      
}

 
