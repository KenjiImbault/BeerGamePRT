import "../styles/pages/PlayGame.css"
import InputField from "../components/form/InputField"
import {useEffect, useState} from "react";
import Button from "../components/form/Button";
import Countdown from '../lib/Countdown';

function PlayGame(props) {

    const gameCode = JSON.parse(localStorage.getItem("room")) //Code du jeu
    const selectedRole = JSON.parse(localStorage.getItem("role")) //Rôle de jeu choisi
    // ==> 1: Producteur | 2: Distributeur | 3: Grossiste | 4: Détaillant

    const socket = props.socketId
    const hoursMinSecs = {hours:0, minutes: 0, seconds: 60}

    const [orderValue, setOrderValue] = useState("") //Commande
    const [inputActive, setInputActive] = useState(true) //Active ou désactive le champ de saisie de la commande
    const [currentRoomSize, setCurrentRoomSize] = useState(0) //Joueurs actuels dans le jeu
    const [currentRoomRoles, setCurrentRoomRoles] = useState([]) //Rôles déjà occupés

    const [gameRounds, setGameRounds] = useState(0) //Tours de jeu (total)
    const [currentRound, setCurrentRound] = useState(1) //Tour de jeu actuel
    const [stock, setStock] = useState(0) //Inventaire
    const [delay, setDelay] = useState(0) //Retard
    const [next1WeekDelivery, setNext1WeekDelivery] = useState(0) //Livraison la semaine prochaine
    const [next2WeekDelivery, setNext2WeekDelivery] = useState(0) //Livraison la semaine encore d'après
    const [supplyChainOrder, setSupplyChainOrder] = useState(0) //Demande de livraison

    useEffect(() => {
      // Update_Player_Data: Appelé quand tout le monde a passé la commande.
      // Les données sont calculées par le serveur puis transmises aux clients
        socket.on("update_player_data", (data) => {
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
                if(currentRound < data.gameSettings.roundOfRaise) {
                  setSupplyChainOrder(data.gameSettings.startValue)
                }
                else {
                  setSupplyChainOrder(data.gameSettings.raisedValue)
                }
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
        let inputAndButton = <></>
        if(inputActive) {
            inputAndButton = (
                <>
                    <InputField
                        name={"Bestellmenge"}
                        getValue={setOrderValue}
                        setValue={orderValue}
                        description={"Zulässige Zeichen: 0-9"}
                    />
                    <Button onClick={submitOrder}>Commande</Button>
                </>
            )
        }
        else {
            inputAndButton = (
                <>
                    <InputField
                        name={"Bestellmenge"}
                        getValue={setOrderValue}
                        setValue={orderValue}
                        description={"Zulässige Zeichen: 0-9"}
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
            roleName = "Produzent"
        }
        else if(selectedRole === 2) {
            roleIcon = "/icons/box.svg"
            roleName = "Verteiler"
        }
        else if(selectedRole === 3) {
            roleIcon = "/icons/wholesale.svg"
            roleName = "Großhändler"
        }
        else {
            roleIcon = "/icons/shop.svg"
            roleName = "Einzelhändler"
        }


        return (
            <div>
                <div className={"grid_play"}>
                    <div className={"playground"}>
                        <div className={"timer"}>
                            <Countdown hoursMinSecs={hoursMinSecs}/>
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
                            <table>
                                <tr>
                                    <th>Round</th>
                                    <th>Coûts de stockage</th>
                                    <th>coût total</th>
                                    <th>Taux de commande parfait</th>
                                    <th>Inventaire moyen</th>
                                    <th>Hebdomadaire avec résidu de livraison</th>
                                </tr>
                                <tr>
                                    <td>1</td>
                                    <td>20</td>
                                    <td>20</td>
                                    <td>80%</td>
                                    <td>10</td>
                                    <td>0%</td>

                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>20</td>
                                    <td>40</td>
                                    <td>50%</td>
                                    <td>15</td>
                                    <td>50%</td>

                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>10</td>
                                    <td>50</td>
                                    <td>66%</td>
                                    <td>13</td>
                                    <td>33%</td>

                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    

}

export default PlayGame
