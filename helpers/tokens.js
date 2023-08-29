import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({path: '.env'});


const generarId =  () => Math.random().toString(32).substring(2) + Date.now().toString(32);

const generarJWT = datos => jwt.sign( datos, process.env.JWT_SECRET, { expiresIn: '1d' });

export {
    generarId,
    generarJWT
}