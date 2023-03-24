import { useEffect, useState } from "react"
import { Redirect } from "react-router-dom"

import "../styles/pages/NewGame.css"
import Tile from "../components/Tile"
import Button from "../components/form/Button"
import InputField from "../components/form/InputField"
import checkIfStringIsValid from "../lib/checkIfStringIsValid";

function NewGame(props) {

    const socket = props.socketId

    const [selectedGameMode, setSelectedGameMode] = useState(0)
    const [selectedRole, setSelectedRole] = useState(0)
    const [gameCode, setGameCode] = useState("")
    const [rounds, setRounds] = useState(0)
    const [startStock, setStartStock]= useState(0)
    const [startValue, setStartValue]= useState(0)
    const [raisedValue, setRaisedValue]= useState(0)
    const [roundOfRaise, setRoundOfRaise]= useState(0)

    const [selectRoleMenu, setSelectRoleMenu] = useState(false)
    const [disabledRoles, setDisabledRoles] = useState([0,0,0,0])

    const [inputError, setInputError] = useState(false)

    const [redirectComponent, setRedirectComponent] = useState(<></>)

    useEffect(() => {
        //Rejoindre le jeu
        socket.on("join_to_game", (data) => {
            console.log("Socket called")
            if(data.head.err) //S'il y a une erreur lors de son entrée dans le jeu, il sera émis par alerte
                alert(data.head.errMsg)
            else //S'il n'y a pas d'erreur, la page du jeu est appelée
            {
                console.log("Rôle choisi: " + data.body)
                localStorage.setItem("role", JSON.stringify(data.body.role))
                localStorage.setItem("room", JSON.stringify(data.body.room))
                setRedirectComponent(<Redirect to={`/game/play/${data.body.room}`} />)
            }
        })
        //Choisissez le rôle de jeu
        socket.on("game_choose_role", data => {
            console.log(data)
            setSelectRoleMenu(true)
            let tempArray = []
            if(data.producer === "NA")
                tempArray.push(false)
            else tempArray.push(true)
            if(data.distributor === "NA")
                tempArray.push(false)
            else tempArray.push(true)
            if(data.wholesaler === "NA")
                tempArray.push(false)
            else tempArray.push(true)
            if(data.retailer === "NA")
                tempArray.push(false)
            else tempArray.push(true)
            setDisabledRoles(tempArray)
        })
        //créer un jeu
        socket.on("game_create", data => {
            if(data.head.err) {
                alert(data.head.errMsg)
            }
            else {
                setSelectedGameMode(2)
                alert(data.head.message)
            }
        })
        //Fonctions de nettoyage nécessaires car toutes les prises seraient appelées lors de l'achat sur la page
        return function cleanup() {
            socket.off("join_to_game")
            socket.off("game_choose_role")
            socket.off("game_create")
        }
    }, [socket]) //Affirmer le fauteuil

    function onJoinGameClick() {
        if(checkIfStringIsValid(gameCode)) {
            if(selectedRole === 0) {
                console.log("Socket submit")
                socket.emit("join_game", {
                    gameCode,
                    selectedRole
                })
            }
            else {
                console.log("Socket submit")
                socket.emit("join_game", {
                    gameCode,
                    selectedRole
                })
            }
        }
        else {
            alert("Incorrect ")
            setInputError(true)
        }
        //console.log(gameCode)
    }

    function createGame() {
        if(!checkIfStringIsValid(gameCode)) {
            alert("Le code de jeu n'est pas correct!")
            setInputError(true)
        }
        else if(!rounds) {
            alert("Sélectionnez le nombre de tours!")
            setInputError(true)
        }
        else if(!checkIfStringIsValid(startStock, "numeric")) {
            alert("Sélectionnez le nombre de tours!")
        }
        else if(!checkIfStringIsValid(startValue, "numeric")) {
            alert("La quantité de demande doit être une valeur numérique!")
        }
        else if(!checkIfStringIsValid(raisedValue, "numeric")) {
            alert("L'augmentation de la demande doit être une valeur numérique!")
        }
        /*else if(!checkIfStringIsValid(roundOfRaise, "numeric") || roundOfRaise > rounds || roundOfRaise < 1) {
            alert("Le tour dans lequel la quantité demandée est augmentée doit être une valeur numérique et ne peut pas être inférieur à 1 et supérieur au nombre de tours !")
        }*/
        else {
            socket.emit("game_create", {
                gameCode,
                gameCreated: new Date(),
                gameSettings: {
                    rounds,
                    startStock,
                    startValue,
                    raisedValue,
                    roundOfRaise
                },
                roundData: {
                    currentRound: 0,
                    producer: [],
                    distributor: [],
                    wholesaler: [],
                    retailer: []
                }
            })
        }
    }

    function getSelectedRounds(e) {
        setRounds(e.target.value)
    }

    let options = ""
    if(selectedGameMode === 1) {
        options = (
            <div className={"options_wrapper"}>
                <span>Entrez le code de jeu:</span>
                <InputField
                    name={"Spielcode"}
                    getValue={setGameCode}
                    description={"Signes autorisés: A-Z, a-z, 0-9"}
                />
                <span>Choisissez le nombre de tours de jeu:</span>
                <div className={"select_rounds"} onChange={getSelectedRounds}>
                    <div>
                        <input id={"26"} type={"radio"} name={"rounds"} value={26}/>
                        <label htmlFor={"26"}>26 tours</label>
                    </div>
                    <div>
                        <input id={"52"} type={"radio"} name={"rounds"} value={52} />
                        <label htmlFor={"52"}>52 tours</label>
                    </div>
                </div>
                
                <span>Choisissez le stock de départ des joueurs:</span>
                <InputField 
                    name={"Anfangsbestand"}
                    getValue={setStartStock}
                    description={"Par exemple: 15"}
                    
                /> 
                <span>Choisissez la quantité de demande:</span>
                <InputField
                    name={"Nachfragemenge"}
                    getValue={setStartValue}
                    description={"Par exemple: 5"}
                /> 
                <span>Choisissez l'augmentation de la demande:</span>
                <InputField
                    name={"erhöhte Nachfragemenge"}
                    getValue={setRaisedValue}
                    description={"Par exemple: 10"}
                /> 
                <span>Choisissez le tour dans lequel la quantité de demande augmente:</span>
                <InputField
                    name={"Runde der Erhöhung"}
                    getValue={setRoundOfRaise}
                    description={"Selon le nombre de matchs de jeu 17 ou 35"}
                />
                <Button onClick={createGame}>créer un jeu</Button>
            </div>
        )
    }
    else if(selectedGameMode === 2){
        options = (
            <div className={"options_wrapper"}>
                <span>Entrez le code de jeu:</span>
                <InputField
                    name={"Spielcode"}
                    getValue={setGameCode}
                    invalid={inputError}
                    description={"Signes autorisés: A-Z, a-z, 0-9"}
                />
                {selectRoleMenu ?
                    <>
                        <span>Choisissez un rôle:</span>
                        <div className={"select_role"}>
                            <Tile
                                imgSrc={"/icons/factory.svg"}
                                imgAlt={"Neues Spiel"}
                                idKey={1}
                                getValue={setSelectedRole}
                                currentSelected={selectedRole}
                                disabled={disabledRoles[0]}
                            >producteur</Tile>
                            <Tile
                                imgSrc={"/icons/box.svg"}
                                imgAlt={"Neues Spiel"}
                                idKey={2}
                                getValue={setSelectedRole}
                                currentSelected={selectedRole}
                                disabled={disabledRoles[1]}
                            >Distributeur</Tile>
                            <Tile
                                imgSrc={"/icons/wholesale.svg"}
                                imgAlt={"Neues Spiel"}
                                idKey={3}
                                getValue={setSelectedRole}
                                currentSelected={selectedRole}
                                disabled={disabledRoles[2]}
                            >Grossiste</Tile>
                            <Tile
                                imgSrc={"/icons/shop.svg"}
                                imgAlt={"Neues Spiel"}
                                idKey={4}
                                getValue={setSelectedRole}
                                currentSelected={selectedRole}
                                disabled={disabledRoles[3]}
                            >Détaillant</Tile>
                        </div>
                    </>
                :
                    <></>
                }
                {selectRoleMenu ?
                    <Button
                        onClick={onJoinGameClick}
                    >
                        Entrer dans le jeu
                    </Button>
                    :
                    <Button
                        onClick={onJoinGameClick}
                    >
                        Choisissez le rôle de jeu
                    </Button>
                }
            </div>
        )
    }
    else {
        options = ""
    }

    return (
        <div className={"game_select"}>
            { redirectComponent }
            <div className={"tile_wrapper"}>
                <Tile
                    imgSrc={"/icons/new.svg"}
                    imgAlt={"Neues Spiel"}
                    idKey={1}
                    getValue={setSelectedGameMode}
                    currentSelected={selectedGameMode}
                >
                    Créer un nouveau jeu
                </Tile>
                <Tile
                    imgSrc={"/icons/people.svg"}
                    imgAlt={"Spiel beitreten"}
                    idKey={2}
                    getValue={setSelectedGameMode}
                    currentSelected={selectedGameMode}
                >
                    Entrez dans le jeu existant
                </Tile>
            </div>
            { options }
        </div>
    )
}

export default NewGame
