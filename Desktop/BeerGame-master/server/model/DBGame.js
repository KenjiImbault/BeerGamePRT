import mongoose from "mongoose";
const { Schema } = mongoose;

const DBGame = new Schema({
    gameCode: {
        type: String,
        required: true,
        unique: true
    },
    gameCreated: {
        type: Date,
        required: true
    },
    gameSettings: {
        rounds: {
            type: Number,
            required: true
        },
        startStock: {
            type: Number,
            required: true
        },
        selectedDemand: {
            type: Number,
            required: true,
            default: 0
        },
        constDemand: {
            type: Number,
            required: true,
            default: 3
        },
        minDemand: {
            type: Number,
            required: true,
            default: 1
        },
        maxDemand: {
            type: Number,
            required: true,
            default: 5
        },
        rampCoeff: {
            type: Number,
            required: true,
            default: 1
        },
        rampShift: {
            type: Number,
            required: true,
            default: 0
        },
        sinCoeff: {
            type: Number,
            required: true,
            default: 3.3
        },
        sinFreq: {
            type: Number,
            required: true,
            default: 0.18
        },
        sinPhase: {
            type: Number,
            required: true,
            default: -0.3
        },
        sinShift: {
            type: Number,
            required: true,
            default: 3.7
        },
    },
    playerData: {
        producer: {
            type: String,
            required: true,
            default: "NA"
        },
        distributor: {
            type: String,
            required: true,
            default: "NA"
        },
        wholesaler: {
            type: String,
            required: true,
            default: "NA"
        },
        retailer: {
            type: String,
            required: true,
            default: "NA"
        }
    },
    roundData: {
        currentRound: {
            type: Number,
            required: true,
            default: 0
        },
        demandClient:{
            type: Number,
            required: true,
        },
        producer: {
            type: Array
        },
        distributor: {
            type: Array
        },
        wholesaler: {
            type: Array
        },
        retailer: {
            type: Array
        }
    }
})

export default DBGame;
