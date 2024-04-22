import pkg from 'pg'
const { Client } = pkg
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
})

client.connect()

export const getUsers = async () => {
    try {
        const res = await client.query('SELECT * FROM users')
        return res.rows
    } catch (err) {
        console.error(err.message)
        throw err
    }
};

const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email);
};

export const addUser = async (user) => {
    const { name, email } = user;
    if (!isValidEmail(email)) {
        throw new Error('Invalid email format!');
    }

    try {
        const emailExists = await client.query('SELECT COUNT(*) FROM users WHERE email = $1', [email]);
        if (emailExists.rows[0].count > 0) {
            throw new Error('User with this email already exists!.');
        }

        const res = await client.query('INSERT INTO users(name, email) VALUES($1, $2) RETURNING *', [name, email]);
        console.log("New user successfully added.")
        return res.rows[0];
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};

export const getUserById = async(id)=>{
    try{
        const res = await client.query('SELECT * FROM users WHERE id=$1', [id])
        if (res.rows.length === 0) {
            throw new Error('User not found!.')
        }else{
            return res.rows[0]
        }
    }catch(err){
        console.log(err.message)
        throw err
    }
}

export const deleteUser = async (id) => {
    try {
        const res = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id])
        if(res.rows.length===0){
            throw new Error("User for deletion not found.")
        }else{
            console.log("User successfully deleted.")
            return res.rows[0];
        }
    } catch (err) {
        console.error(err.message);
        throw err;
    }
};




