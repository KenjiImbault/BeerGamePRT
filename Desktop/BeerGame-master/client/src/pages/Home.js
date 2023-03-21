import React from "react";

import Button from "../components/form/Button"
import "../styles/pages/Home.css"
import { Link } from "react-router-dom";

class Home extends React.Component {
  render() {
    return (
      <div className={"home"}>
        <h2>Bienvenue sur la page d'accueil du Beergame ! Un projet commun de la Welfen Academy et de la LeibnizFH.</h2>
        <div className={"wrapper_logos"}>
          <a href="https://leibniz-fh.de/" id="logo">
            <div className={"logo leibniz"} />
          </a>
          <div className={"logo Beergame"} />
          <a href="https://www.welfenakademie.de/" id="logo">
            <div className={"logo welfen"} />
          </a>
        </div>
        <h4>Le but du jeu est d'éviter les goulots d'étranglement d'approvisionnement et de pouvoir servir les commandes au sein de la chaîne d'approvisionnement à tout moment, malgré les fluctuations de la demande.</h4>
        <div className={"wrapper_button"}>
          <Link to={"/game/create"}>
            <Button linkTo={"/game/create"}>démarrer jeu</Button>
          </Link>
        </div>
      </div>
    )
  }
}

export default Home