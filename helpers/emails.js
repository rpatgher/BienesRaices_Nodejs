import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config({path: '.env'});

const emailRegistro = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { nombre, email, token } = datos;

    // Enviar email
    await transport.sendMail({
        from: 'Bienes Raíces.com',
        to: email,
        subject: 'Confirma tu cuenta en bienesraices.com',
        text: 'Confirma tu cuenta en bienesraices.com',
        html: `
            <p>Hola ${nombre}, compreba tu cuenta en bienesraices.com</p>
            
            <p>
                Tu cuenta ya está lista, sólo debes confirmarla en el siguiente enalce:
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar-cuenta/${token}">Confirmar Cuenta</a>
            </p>

            <p>Si tu no creaste esta cuenta, puedes ignorar el mensaje.
            </p>
        `
    });

}


const emailRecuperacion = async (datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    const { nombre, email, token } = datos;

    // Enviar email
    await transport.sendMail({
        from: 'Bienes Raíces.com',
        to: email,
        subject: 'Recupera el acceso a tu cuenta en bienesraices.com',
        text: 'Recupera el acceso a tu cuenta en bienesraices.com',
        html: `
            <p>Hola ${nombre}, has solicitado reestablecer tu password en bienesraices.com</p>
            
            <p>
                Parece que no recuerdas tu Password, reestablécelo en el siguient enlace:
                <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/olvide-password/${token}">Recuperar Acceso</a>
            </p>

            <p>Si tu no solcitaste el cambio de password, puedes ignorar el mensaje.
            </p>
        `
    });
}

export {
    emailRegistro,
    emailRecuperacion
}