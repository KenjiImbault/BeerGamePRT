# Beergame - Documentation générale
## WebApp (Frontend)
### Technologie utilisées
- ReactJS [[Documentation]](https://reactjs.org/docs/getting-started.html)
- Socket.IO [[Documentation]](https://socket.io/docs/v4/)

# Comment lancer l'application ?
- Ouvrir le dossier dans Visual Studio Code
- Ouvrir deux terminals dans VSCode
- Dans un des terminal, faire la commande ipcofnig, et prendre note de l'adresse IPv4
- Dans le dossier client>src, ouvrir App.js, et editer l'adresse IP dans le const socket = io.connect() pour qu'elle correponde a l'adresse IPv4 précédente
- Dans un des terminal, faire les commandes suivantes:
    cd client
    npm install
    npm audit fix --force
    npm start
- Dans l'autre terminal, faire les commandes suivantes:
    cd server
    npm install
    npm start
- Sur les machines des joueurs, lancer le navigateur, et taper dans la barre d'url l'adresse IPv4 précédente, en concatenant :3000 après l'IP

# Comment changer de Base de Données?
- Dans server, ouvrir .env, et changer le contenu de la variable MONGOOSE_CONNECTIONSTRING pour qu'elle correponde au lien de la nouvelle BDD MongoDB

