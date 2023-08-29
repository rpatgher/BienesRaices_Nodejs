import bcrypt from 'bcrypt';

const usuarios = [
    {
        nombre: 'Remy Patgher',
        email: 'remypatgher@gmail.com',
        confirmado: 1,
        password: bcrypt.hashSync('Password', 10)
    }
];


export default usuarios;