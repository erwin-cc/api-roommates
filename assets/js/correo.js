const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth: {
        user: "tucorreo@gmail.com", //Para probar esta funcionalidad ingresar un correo de gmail
        pass: "contraseñaDeTuCorreo"        //y su contraseña
    }
})
    
const send = async (bodyGasto) => {
    const mailOptions = {
        from: "tucorreo@gmail.com", //El correo que ingresaste antes
        to: ["tucorreo@gmail.com","otrocorreo@correo.com"], //Lista de correos al que se enviará el mail de aviso.
        subject: `${bodyGasto.roommate} ha ingresado un nuevo gasto.`,
        html: `${bodyGasto.roommate} ha ingresado el siguiente gasto: <br>
              Descripcion: ${bodyGasto.descripcion} &nbsp;&nbsp;&nbsp;Monto: $${bodyGasto.monto}`
    }
    await transporter.sendMail(mailOptions)
}

module.exports = send