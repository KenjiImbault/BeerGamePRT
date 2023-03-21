import React from "react";

import "../styles/pages/End.css"

class End extends React.Component {
    onClickHandler() {

    }
    render() {
        return (
            <div className={"end"}>
                <h2>Toutes nos félicitations!</h2>
                <h3>Vous avez terminé le jeu</h3>
                
                <h5>Fabricant</h5>

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
                                    <td>66%</td>

                                </tr>
                            </table>    
                            
                                 
                        </div>
                    </div>
                </div>   

                <h5>fournisseur</h5>
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
                                    <td>66%</td>

                                </tr>
                            </table>    
                            
                                 
                        </div>
                    </div>
                </div> 

                <h5>Grossiste</h5>

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
                                    <td>66%</td>

                                </tr>
                            </table>    
                            
                                 
                        </div>
                    </div>
                </div> 

                <h5>Détaillant</h5>

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
                                    <td>66%</td>

                                </tr>
                            </table>    
                            
                                 
                        </div>
                    </div>
                </div>
                <div className={"wrapper_button"}>
                    {/* <Link to={"/game/create"}>
                        <Button linkTo={"/game/create"}>Spiel starten</Button>
                    </Link> */}
                </div>
            </div>
        )
    }
}

export default End