import mongoose from "mongoose"

import DBGame from "../model/DBGame.js";
import SocketError from "../model/SocketError.js";
import SocketSuccess from "../model/SocketSuccess.js";
import exceljs from "exceljs";

const socket = io.connect(process.env.IP)
  //const socket = io.connect("https://api-beergame.usb-sys.de")
  useEffect(() => {


socket.on("endGame", () => {

    function EndGame(io, socket, data) {
    
        const GameData = mongoose.model("DBGame", DBGame)
        const Current = new GameData(data)
      
        // const exceljs = require('exceljs');
       const workbook = new exceljs.Workbook();
       const worksheetClient = workbook.addWorksheet('Client');
       const worksheetRetailer = workbook.addWorksheet('Retailer');
       const worksheetWholesaler = workbook.addWorksheet('Wholesaler');
       const worksheetDistributor = workbook.addWorksheet('Distributor');
       const worksheetProducer = workbook.addWorksheet('Producer');
      
       GameData.find({}, (err, data) => {
         if (err) throw err;
       
         // Ajouter l'en-tête du tableau
         worksheetClient.addRow(['test']);
         worksheetRetailer.addRow(['stock','order','delay','next1Week','next2Week']);
         worksheetWholesaler.addRow(['stock','order','delay','next1Week','next2Week']);
         worksheetDistributor.addRow(['stock','order','delay','next1Week','next2Week']);
         worksheetProducer.addRow(['stock','order','delay','next1Week','next2Week']);
      
      
      
         let numberOfRounds = 0
         let lastGame = 0
      
         lastGame = data.length
        
         
         numberOfRounds = data[0].roundData.producer.length
         for (let i = 0;i<numberOfRounds;i++){
          worksheetRetailer.addRow([data[lastGame].roundData.retailer[i].stock,data[lastGame].roundData.retailer[i].order,data[lastGame].roundData.retailer[i].delay,0,0])
          worksheetWholesaler.addRow([data[lastGame].roundData.wholesaler[i].stock,data[lastGame].roundData.wholesaler[i].order,data[lastGame].roundData.wholesaler[i].delay,0,0])
          worksheetDistributor.addRow([data[lastGame].roundData.distributor[i].stock,data[lastGame].roundData.distributor[i].order,data[lastGame].roundData.distributor[i].delay,0,0])
          worksheetProducer.addRow([data[lastGame].roundData.producer[i].stock,data[lastGame].roundData.producer[i].order,data[lastGame].roundData.producer[i].delay,0,0])
         }
      
       
         // Enregistrer le fichier Excel
         workbook.xlsx.writeFile('export.xlsx')
           .then(() => console.log('Fichier Excel créé avec succès'))
           .catch((err) => console.error('Erreur lors de la création du fichier Excel', err));
       });
      
        
      }

}) })
