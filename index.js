const express = require('express')
const app = express()
const { nuevoRoommate, guardarRoommate } = require('./assets/js/roommates.js')
const { agregarGasto, editGasto, deleteGasto, calcular } = require('./assets/js/gastos.js')
const enviarCorreo = require("./assets/js/correo.js")

app.listen(3000, () => console.log("Servidor activo en http://localhost:3000"))

app.use(express.json())

app.get('/', (req,res) => {
    res.sendFile(`${__dirname}/index.html`)
})

// 3. Preparar una ruta POST /roommate en el servidor que ejecute una función asíncrona importada 
// de un archivo externo al del servidor (la función debe ser un módulo), para obtener la data de un 
// nuevo usuario y la acumule en un JSON (roommates.json).

app.post('/roommate', async (req,res) => {
    // 2. Capturar los errores para condicionar el código a través del manejo de excepciones.
    try {
        const newRoommate = await nuevoRoommate()
        await guardarRoommate(newRoommate)
        await calcular()
        res.status(201).send({"mensaje" : `Se ha agregado nuevo Roommate: ${newRoommate.nombre}`})
    } catch (error) {
            res.status(500).send({"error": error})
    }
})

// 4. Crear una API REST que contenga las siguientes rutas:
// a. GET /gastos: Devuelve todos los gastos almacenados en el archivo gastos.json.
app.get('/gastos', (req, res) => {
        res.status(200).sendFile(`${__dirname}/data/gastos.json`)
})

// b. POST /gasto: Recibe el payload con los datos del gasto y los almacena en un archivo JSON (gastos.json).
app.post('/gasto', async (req, res) => {
    try {
        res.setHeader('content-type','application/json')
        const nuevoGasto = req.body
        //await enviarCorreo(nuevoGasto)
        //(La funcion fue probada con un correo personal y deshabilitada debido a que no funciona con el correo
        // proporcionado en el curso.)
        await agregarGasto(nuevoGasto)
        await calcular()
        res.status(201).send({"mensaje":"Se ha agregado un nuevo gasto."})
    } catch (error) {
        res.status(500).send({"error":error})
    }
})

// c. PUT /gasto: Recibe el payload de la consulta y modifica los datos almacenados en el servidor (gastos.json).
app.put("/gasto", async (req,res) => {
    try {
        res.setHeader('content-type','application/json')
        const {id} = req.query
        const body = req.body
        await editGasto(id, body)
        await calcular()
        res.status(201).send({"mensaje":"Se ha actualizado el registro"})
    } catch (error) {
        res.status(500).send({"error":error})
    }
})

// d. DELETE /gasto: Recibe el id del gasto usando las Query Strings y la elimine del historial de gastos (gastos.json).
app.delete("/gasto", async (req, res) => {
    try {
        res.setHeader('content-type','application/json')
        const {id} = req.query
        deleteGasto(id)
        await calcular()
        res.status(200).send({"mensaje":"Registro eliminado con éxito"})
    } catch (error) {
        res.status(500).send({"error":error})
    }
})

// e. GET /roommates: Devuelve todos los roommates almacenados en el servidor (roommates.json)
app.get("/roommates", (req,res) => {
    res.status(200).sendFile(`${__dirname}/data/roommates.json`)
})

//    Se debe considerar recalcular y actualizar las cuentas de los roommates luego de este proceso.

// 5. Devolver los códigos de estado HTTP correspondientes a cada situación.
//    (OK)
// 6. Enviar un correo electrónico a todos los roommates cuando se registre un nuevo gasto. Se recomienda agregar 
//    a la lista de correos su correo personal para verificar esta funcionalidad. (Opcional)