const fs = require('fs').promises
const { v4: uuidV4 } = require('uuid')

const agregarGasto = async (nuevoGasto) => {
    const gastosJSON = await fs.readFile(`./data/gastos.json`, 'utf8')
    const gastosData = JSON.parse(gastosJSON)
    const id = uuidV4().slice(0, 8)
    nuevoGasto.id = id
    gastosData.gastos.push(nuevoGasto)

    await fs.writeFile(`./data/gastos.json`, JSON.stringify(gastosData, null, 2), 'utf8')
}

const editGasto = async (id, body) => {
    const gastosJSON = await fs.readFile('./data/gastos.json', 'utf8')
    const gastosData = JSON.parse(gastosJSON)
    const index = gastosData.gastos.findIndex(gasto => gasto.id == id)
    const target = gastosData.gastos[index]
    target.descripcion = body.descripcion
    target.monto = body.monto

    await fs.writeFile(`./data/gastos.json`, JSON.stringify(gastosData, null, 2), 'utf8')
}

const deleteGasto = async (id) => {
    const gastosJSON = await fs.readFile('./data/gastos.json', 'utf8')
    const gastosData = JSON.parse(gastosJSON)
    const gastosDataDel = gastosData.gastos.filter(gasto => gasto.id != id)
    gastosData.gastos = gastosDataDel

    await fs.writeFile(`./data/gastos.json`, JSON.stringify(gastosData, null, 2), 'utf8')
}

const calcular = async () => {
    //Obtener solo los nombres de los Roommates
    const roommatesJSON = await fs.readFile('./data/roommates.json', 'utf8')
    const roommatesData = JSON.parse(roommatesJSON)
    const roommatesNombres = roommatesData.roommates.map(obj => {
        let roommate = obj.nombre
        return roommate
    })
    //Obtener datos de gastos
    const gastosJSON = await fs.readFile('./data/gastos.json', 'utf8')
    const gastos = JSON.parse(gastosJSON).gastos
    //Obtener el gasto total de c/u de los roommates
    let gastosRoommates = roommatesNombres.map(element => {
        let gastoRoommate = 0;
        gastos.forEach(elem => {
            if (elem.roommate == element) {
                gastoRoommate += elem.monto
            }
        });
        return { "roommate": element, "gastoTotal": gastoRoommate }
    });

    //Calcular el gasto total
    const gastoTotal = () => {
        let montos = gastosRoommates.map(elem => {
            return elem.gastoTotal
        })
        return montos.reduce((acum, val) => {
            return acum+val
        }, 0)
    }
    
    const deudaBruta = gastoTotal()/roommatesData.roommates.length

    let roommatesCalc = roommatesData.roommates.map( elem => {
        elem.recibe = Math.round(gastosRoommates.find( item => item.roommate == elem.nombre ).gastoTotal/roommatesData.roommates.length)
        elem.debe = Math.round(-(deudaBruta-elem.recibe))
        return elem
    })
    roommatesData.roommates = roommatesCalc
    await fs.writeFile(`./data/roommates.json`, JSON.stringify(roommatesData, null, 2), 'utf8')
}
module.exports = { agregarGasto, editGasto, deleteGasto, calcular }