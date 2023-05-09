import React from "react";

import Button from "../components/form/Button"
import "../styles/pages/Home.css"
import { Link } from "react-router-dom";

class Home extends React.Component {
  render() {
    return (
      <>
        <div className={"container"}>
          <div className={"pic"}>
            {/*<img src="../res/images/beerGameProcess.png" alt="beer game" />*/}
          </div>
        </div>
        <div className={"home"}>
          
          <div className={"wrapper_button"}>
            <Link to={"/game/create"}>
              <Button linkTo={"/game/create"}>Démarrer le jeu</Button>
            </Link>
          </div>
        </div>
      </>
      
    )
  }
}

export default Home
