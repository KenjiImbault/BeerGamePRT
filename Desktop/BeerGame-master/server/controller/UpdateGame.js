import mongoose from "mongoose";

import DBGame from "../model/DBGame.js";
import CalculateNewValues from "../functions/CalculateNewValues.js";

export default function UpdateGame(io, socket, intData) {
    const room = intData.gameCode
    const role = intData.selectedRole
    const orderValue = intData.orderValue
    const GameData = mongoose.model("DBGame", DBGame)

    GameData.findOne({ gameCode: room }, (err, data) => {
        if(err) return console.log("Erreur: " + err)

        if(data === null) return console.log("Aucun enregistrement trouvé")

        let producer = data.roundData.producer
        let distributor = data.roundData.distributor
        let wholesaler = data.roundData.wholesaler
        let retailer = data.roundData.retailer
        const currentRound = data.roundData.currentRound

        if(data.roundData.currentRound === 0) {
            switch (role) {
                case 1:
                    producer.push({
                        stock: data.gameSettings.startStock,
                        order: parseInt(orderValue),
                        delay: 0,
                        next1Week: 0,
                        next2Week: 0
                    })
                    break
                case 2:
                    distributor.push({
                        stock: data.gameSettings.startStock,
                        order: parseInt(orderValue),
                        delay: 0,
                        next1Week: 0,
                        next2Week: 0
                    })
                    break
                case 3:
                    wholesaler.push({
                        stock: data.gameSettings.startStock,
                        order: parseInt(orderValue),
                        delay: 0,
                        next1Week: 0,
                        next2Week: 0
                    })
                    break
                case 4:
                    retailer.push({
                        stock: data.gameSettings.startStock,
                        order: parseInt(orderValue),
                        delay: 0,
                        next1Week: 0,
                        next2Week: 0
                    })
                    break
            }
        }
        else {
            switch (role) {
                case 1:
                    producer.push({
                        stock: producer[currentRound-1].stock,
                        order: parseInt(orderValue),
                        delay: producer[currentRound-1].delay,
                        next1Week: producer[currentRound-1].next1Week,
                        next2Week: producer[currentRound-1].next2Week
                    })
                    break
                case 2:
                    distributor.push({
                        stock: distributor[currentRound-1].stock,
                        order: parseInt(orderValue),
                        delay: distributor[currentRound-1].delay,
                        next1Week: distributor[currentRound-1].next1Week,
                        next2Week: distributor[currentRound-1].next2Week
                    })
                    break
                case 3:
                    wholesaler.push({
                        stock: wholesaler[currentRound-1].stock,
                        order: parseInt(orderValue),
                        delay: wholesaler[currentRound-1].delay,
                        next1Week: wholesaler[currentRound-1].next1Week,
                        next2Week: wholesaler[currentRound-1].next2Week
                    })
                    break
                case 4:
                    retailer.push({
                        stock: retailer[currentRound-1].stock,
                        order: parseInt(orderValue),
                        delay: retailer[currentRound-1].delay,
                        next1Week: retailer[currentRound-1].next1Week,
                        next2Week: retailer[currentRound-1].next2Week
                    })
                    break
            }
        }
        let rounds = [producer.length, distributor.length, wholesaler.length, retailer.length]
        let checkIfDataCanBeCommitted = true
        rounds.map(element => {
            if(element !== data.roundData.currentRound+1 || element === []) checkIfDataCanBeCommitted = false
        })
        //Les données peuvent être distribuées une fois que tous les joueurs ont passé des commandes pour le tour en cours
        if(checkIfDataCanBeCommitted) {
            console.log("Push déclenché")

            const selectedDemandB = data.gameSettings.selectedDemand
            const constDemandB = data.gameSettings.constDemand
            const minDemandB = data.gameSettings.minDemand
            const maxDemandB = data.gameSettings.maxDemand
            const rampCoeffB = data.gameSettings.rampCoeff
            const rampShiftB = data.gameSettings.rampShift
            const sinCoeffB = data.gameSettings.sinCoeff
            const sinFreqB = data.gameSettings.sinFreq
            const sinPhaseB = data.gameSettings.sinPhase
            const sinShiftB = data.gameSettings.sinShift

            let values = [], delivery = 0, demandClient=0

            console.log("PRODUCER:")
            console.log(producer)
            values = CalculateNewValues(1, producer, distributor[currentRound].order, 0, currentRound)
            producer = values[0]
            delivery = values[1]

            console.log("PRODUCER AFTER:")
            console.log(producer)
            console.log(delivery)

            values = CalculateNewValues(2, distributor, wholesaler[currentRound].order, delivery, currentRound)
            distributor = values[0]
            delivery = values[1]

            values = CalculateNewValues(3, wholesaler, retailer[currentRound].order, delivery, currentRound)
            wholesaler = values[0]
            delivery = values[1]

        if(selectedDemandB===0){
            //Constant demand
            demandClient = constDemandB
        }
        else if(selectedDemandB===1){
            //Random demand between min and max values
            demandClient = Math.floor(Math.random() * (maxDemandB - minDemandB) ) + minDemandB
        }
        else if(selectedDemandB===2){
            //Ramp value of equation y=a*t+b
            //Todo: If calculated demand is negative, put the demand at 0
            demandClient = rampCoeffB*currentRound+rampShiftB
        }
        else if(selectedDemandB===3){
            //Sinus value of equation y=a*sin(2*pi*f*t+p)+b
            //Todo: If calculated demand is negative, put the demand at 0
            demandClient = Math.round(sinCoeffB*Math.sin(2*3.14*sinFreqB*currentRound+sinPhaseB)+sinShiftB)
        }
        values=CalculateNewValues(4, retailer, demandClient, delivery, currentRound)
        retailer = values[0]
        delivery = values[1]

            data.roundData.currentRound++
            data.roundData.producer = producer
            data.roundData.distributor = distributor
            data.roundData.wholesaler = wholesaler
            data.roundData.retailer = retailer
            data.roundData.demandClient = demandClient
            data.markModified("roundData")
            data.save()
            io.to(room).emit("update_player_data", data)
        }
        else {
            data.roundData.producer = producer
            data.roundData.distributor = distributor
            data.roundData.wholesaler = wholesaler
            data.roundData.retailer = retailer
            data.save()
        }
    })
}
