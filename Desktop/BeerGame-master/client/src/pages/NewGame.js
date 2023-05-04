import { useEffect, useState } from "react"
import { Redirect } from "react-router-dom"

import "../styles/pages/NewGame.css"
import Tile from "../components/Tile"
import Button from "../components/form/Button"
import InputField from "../components/form/InputField"
import checkIfStringIsValid from "../lib/checkIfStringIsValid";

function NewGame(props) {

    const socket = props.socketId

    const [demandClient, ] = useState(0)

    const [selectedGameMode, setSelectedGameMode] = useState(0)
    const [selectedRole, setSelectedRole] = useState(0)
    const [gameCode, setGameCode] = useState("")
    const [rounds, setRounds] = useState(0)
    const [startStock, setStartStock]= useState(0)
    const [selectedDemand, setSelectedDemand]= useState(0)

    const [constDemand, setConstDemand] = useState(0)
    const [minDemand, setMinDemand] = useState(0)
    const [maxDemand, setMaxDemand] = useState(0)
    const [rampCoeff, setRampCoeff] = useState(0)
    const [rampShift, setRampShift] = useState(0)
    const [sinCoeff, setSinCoeff] = useState(0)
    const [sinFreq, setSinFreq] = useState(0)
    const [sinPhase, setSinPhase] = useState(0)
    const [sinShift, setSinShift] = useState(0)

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
                    selectedDemand,
                    constDemand,
                    minDemand,
                    maxDemand,
                    rampCoeff,
                    rampShift,
                    sinCoeff,
                    sinFreq,
                    sinPhase,
                    sinShift
                },
                roundData: {
                    currentRound: 0,
                    demandClient,
                    producer: [],
                    distributor: [],
                    wholesaler: [],
                    retailer: []
                }
            })
        }
    }

    function getSelectedRounds(e) {
        setRounds(e)
    }

    function getSelectedDemand(e){
        console.log("hey")
        console.log(e.target.value)
        setSelectedDemand(e.target.value)
    }


    let options = ""
    let differentDemands = ""
    if(selectedGameMode === 1) {
        differentDemands = (
        <div>
        <span>Choisissez les paramètres de la demande: (ignorer si non concerné)</span>
        <InputField name="Enter value of constant..." getValue={setConstDemand} />
        <br />
        
	    <InputField name="Enter minimum value of Random..." getValue={setMinDemand} />
	    <InputField name="Enter maximum value of Random..." getValue={setMaxDemand} />
        <br />

	    <InputField name="Enter value of the coeff of the ramp..." getValue={setRampCoeff} />
	    <InputField name="Enter value of the shift of the ramp..." getValue={setRampShift} />
        <br />
        <span>Ex: 3.3, 0.18, -0.3, 3.7</span>
    	<InputField name="Enter value of the coeff of the sinus..." getValue={setSinCoeff} />
	    <InputField name="Enter value of the frequence of the sinus..." getValue={setSinFreq} />
      	<InputField name="Enter value of the phase of the sinus..." getValue={setSinPhase} />
	    <InputField name="Enter value of the shift of the sinus..." getValue={setSinShift} />
        </div>
        )

        options = (
            <div className={"options_wrapper"}>
                <span>Entrez le code de jeu:</span>
                <InputField
                    name={"Spielcode"}
                    getValue={setGameCode}
                    description={"Signes autorisés: A-Z, a-z, 0-9"}
                />
                <span>Choisissez le nombre de tours de jeu:</span>
                <div>
                <InputField 
                    name={"Rounds"}
                    getValue={getSelectedRounds}
                    description={"Par exemple: 15"}
                />
                </div>
                
                <span>Choisissez le stock de départ des joueurs:</span>
                <InputField 
                    name={"Anfangsbestand"}
                    getValue={setStartStock}
                    description={"Par exemple: 15"}
                    
                /> 
                <span>Choisissez le type de demande:</span>
                <div className={"select_demand"} onChange={getSelectedDemand}>
                    <div>
                        <input id="{const}" type={"radio"} name={"demand"} value={0} />
                        <label htmlFor={"const"}>Constant</label>
                        <br />
                        <input id="{rnd}" type={"radio"} name={"demand"} value={1} />
                        <label htmlFor={"rnd"}>Random</label>
                        <br />
                        <input id="{ramp}" type={"radio"} name={"demand"} value={2} />
                        <label htmlFor={"ramp"}>Ramp</label>
                        <br />
                        <input id="{sin}" type={"radio"} name={"demand"} value={3} />
                        <label htmlFor={"sin"}>Sinus</label>
                    </div>
                    </div>
                        {differentDemands}
                
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
