const axios = require('axios')
const { v4: uuidV4 } = require('uuid')
// 1. Ocupar el módulo File System para la manipulación de archivos alojados en el servidor.
const fs = require('fs').promises

const url = "https://randomuser.me/api/?inc=gender,name,nat"

const nuevoRoommate = async () => {
    const { data } = await axios.get(url)
    // El objeto correspondiente al usuario que se almacenará debe tener un id generado
    // con el paquete UUID.
    const id = uuidV4().slice(0, 8)
    const newRoommateData = data.results[0]
    const newRoommate = {
        id,
        nombre: `${newRoommateData.name.first} ${newRoommateData.name.last}`
    }
    return newRoommate
}

const guardarRoommate = async (newRoommate) => {
    const roommatesJSON = await fs.readFile(`./data/roommates.json`, 'utf8')
    const roommatesData  = await JSON.parse(roommatesJSON)
    roommatesData.roommates.push(newRoommate)
    await fs.writeFile(`./data/roommates.json`, JSON.stringify(roommatesData, null, 2), 'utf8')
}

const deleteRoommate = async (id) => {
    const roommatesJSON = await fs.readFile('./data/roommates.json', 'utf8')
    const roommatesData = JSON.parse(roommatesJSON)
    console.log(roommatesData)
    const roommatesDataDel = roommatesData.roommates.filter(roommate => roommate.id != id)
    roommatesData.roommates = roommatesDataDel
    console.log(roommatesData)

    await fs.writeFile(`./data/roommates.json`, JSON.stringify(roommatesData, null, 2), 'utf8')
}

module.exports = {nuevoRoommate, guardarRoommate, deleteRoommate}
