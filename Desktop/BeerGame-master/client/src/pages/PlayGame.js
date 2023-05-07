import "../styles/pages/PlayGame.css"
import InputField from "../components/form/InputField"
import {useEffect, useState} from "react";
import Button from "../components/form/Button";

function PlayGame(props) {

    const gameCode = JSON.parse(localStorage.getItem("room")) //Code du jeu
    const selectedRole = JSON.parse(localStorage.getItem("role")) //Rôle de jeu choisi
    // ==> 1: Producteur | 2: Distributeur | 3: Grossiste | 4: Détaillant

    const socket = props.socketId

    const [orderValue, setOrderValue] = useState("") //Commande
    const [inputActive, setInputActive] = useState(true) //Active ou désactive le champ de saisie de la commande
    const [currentRoomSize, setCurrentRoomSize] = useState(0) //Joueurs actuels dans le jeu
    const [currentRoomRoles, setCurrentRoomRoles] = useState([]) //Rôles déjà occupés

    const [gameRounds, setGameRounds] = useState(0) //Tours de jeu (total)
    const [currentRound, setCurrentRound] = useState(0) //Tour de jeu actuel
    const [stock, setStock] = useState(0) //Inventaire
    const [delay, setDelay] = useState(0) //Retard
    const [next1WeekDelivery, setNext1WeekDelivery] = useState(0) //Livraison la semaine prochaine
    const [next2WeekDelivery, setNext2WeekDelivery] = useState(0) //Livraison la semaine encore d'après
    const [supplyChainOrder, setSupplyChainOrder] = useState(0) //Demande de livraison

    const[dataV, setDataV] = useState(0)    

    useEffect(() => {
      // Update_Player_Data: Appelé quand tout le monde a passé la commande.
      // Les données sont calculées par le serveur puis transmises aux clients
        socket.on("update_player_data", (data) => {
            setDataV(data)
            console.log("Appele UpdatePlayer")
            console.log(data)
            setCurrentRound(data.roundData.currentRound)
            console.log(data.roundData.currentRound)
            setInputActive(true)
            if(selectedRole === 1) {
                setStock(data.roundData.producer[data.roundData.currentRound-1].stock)
                setDelay(data.roundData.producer[data.roundData.currentRound-1].delay)
                setNext1WeekDelivery(data.roundData.producer[data.roundData.currentRound-1].next1Week)
                setNext2WeekDelivery(data.roundData.producer[data.roundData.currentRound-1].next2Week)
                setSupplyChainOrder(data.roundData.distributor[data.roundData.currentRound-1].order)
            }
            else if(selectedRole === 2) {
                setStock(data.roundData.distributor[data.roundData.currentRound-1].stock)
                setDelay(data.roundData.distributor[data.roundData.currentRound-1].delay)
                setNext1WeekDelivery(data.roundData.distributor[data.roundData.currentRound-1].next1Week)
                setNext2WeekDelivery(data.roundData.distributor[data.roundData.currentRound-1].next2Week)
                setSupplyChainOrder(data.roundData.wholesaler[data.roundData.currentRound-1].order)
            }
            else if(selectedRole === 3) {
                setStock(data.roundData.wholesaler[data.roundData.currentRound-1].stock)
                setDelay(data.roundData.wholesaler[data.roundData.currentRound-1].delay)
                setNext1WeekDelivery(data.roundData.wholesaler[data.roundData.currentRound-1].next1Week)
                setNext2WeekDelivery(data.roundData.wholesaler[data.roundData.currentRound-1].next2Week)
                setSupplyChainOrder(data.roundData.retailer[data.roundData.currentRound-1].order)
            }
            else {
                setStock(data.roundData.retailer[data.roundData.currentRound-1].stock)
                setDelay(data.roundData.retailer[data.roundData.currentRound-1].delay)
                setNext1WeekDelivery(data.roundData.retailer[data.roundData.currentRound-1].next1Week)
                setNext2WeekDelivery(data.roundData.retailer[data.roundData.currentRound-1].next2Week)
                
                setSupplyChainOrder(data.roundData.demandClient)
                }

            
        })
        socket.on("initial_data", (data) => {
            console.log(data)
            setGameRounds(data.gameSettings.rounds)
            setStock(data.gameSettings.startStock)
        })
        socket.on("update_room_size", (data) => {
            setCurrentRoomSize(data.roomSize)
            setCurrentRoomRoles(data.selectedRoles)
        })
    })

    function submitOrder() {
        setInputActive(false)
        socket.emit("game_update", {
            gameCode,
            selectedRole,
            orderValue
        })
        setOrderValue("")
    }
    if(currentRoomSize < 4) {
        return (
            <div>
                <div className={"grid_play"}>
                    <div className={"playground"}>
                        <h2>En attente de coéquipiers</h2>
                        <p>Sont en ce moment <b>{ currentRoomSize }</b> depuis <b>4</b> Joueurs dans le hall.</p>
                        <p>======================== Les rôles suivants sont occupés ========================</p>
                        { currentRoomRoles.map(element => {
                            return <p key={element}>{element}</p>
                        }) }
                    </div>
                </div>
            </div>
        )
    }
    else {
        if(currentRound<=gameRounds){
        let inputAndButton = <></>
        if(inputActive) {
            inputAndButton = (
                <>
                    <InputField
                        name={"OrderQuantity"}
                        getValue={setOrderValue}
                        setValue={orderValue}
                        description={"Allowed Characters: 0-9"}
                    />
                    <Button onClick={submitOrder}>Commande</Button>
                </>
            )
        }
        else {
            inputAndButton = (
                <>
                    <InputField
                        name={"OrderQuantity"}
                        getValue={setOrderValue}
                        setValue={orderValue}
                        description={"Allowed Characters: 0-9"}
                        disabled={true}
                    />
                    <Button onClick={submitOrder}>Commande</Button>
                </>
            )
        }

        let roleIcon = <></>
        let roleName = ""
        if(selectedRole === 1) {
            roleIcon = "/icons/factory.svg"
            roleName = "Producer"
        }
        else if(selectedRole === 2) {
            roleIcon = "/icons/box.svg"
            roleName = "Distributor"
        }
        else if(selectedRole === 3) {
            roleIcon = "/icons/wholesale.svg"
            roleName = "Wholesaler"
        }
        else {
            roleIcon = "/icons/shop.svg"
            roleName = "Retailer"
        }

        function endGameBtn()
        {
            console.log("End Game")
            setCurrentRound(gameRounds+1)
        }
        return (
            <div>
                <div className={"grid_play"}>
                    <div className={"playground"}>
                        <div className={"timer"}>
                            <p>Round {currentRound}/{gameRounds}</p>
                        </div>
                        <div className={"wrapper_img"}>
                            <img src={roleIcon} alt={"Icon"} />
                            <span>{roleName}</span>
                        </div>
                        <div className={"line"} />
                        <div className={"wrapper_1"}>
                            <span>Stock: { stock }</span>
                            <span>Delay: { delay }</span>
                        </div>
                        <div className={"line"} />
                        <div className={"new_order"}>
                            <span>Nouvel ordre :</span>
                            { inputAndButton }
                        </div>
                        <div className={"line"} />
                        <>
                            <span>Livraison à la commission :</span>
                            <div className={"next_products"}>
                                <span>La semaine prochaine: {next1WeekDelivery}</span>
                                <span>La semaine après: {next2WeekDelivery}</span>
                            </div>
                        </>
                        <div className={"line"} />
                        <div className={"delivery"}>
                            <span>Demande de demande: {supplyChainOrder}</span>
                        </div>
                    </div>
                </div>

                <div>&nbsp;</div>

                <div className={"grid_play2"}>
                    <div className={"playground2"}>
                        <div className={"KPItable"}>
                        <Button onClick={endGameBtn}>End the game</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
    else{
        function exportData(){
            console.log("Exporting data")
            socket.emit("endGame",{dataV})
        }
        return (
        <div>
        <span>The game is over!</span>
        <br />
        <Button onClick={exportData}>Export data</Button>
        </div>
        )
    }
    
}

}

export default PlayGame
