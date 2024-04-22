import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Client } = pkg;

const client = new Client({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

client.connect();   

const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const handleError = (error) => {
    console.error(error.message);
    throw error;
};

export const getUsers = async () => {
    try {
        const res = await client.query('SELECT * FROM users');

        return res.rows;
    } catch (err) {
        handleError(err);
    }
};

export const addUser = async (user) => {
    const { name, email } = user;

    if (!isEmailValid(email)) {
        throw new Error('Invalid email format!');
    }

    try {
        const emailExists = await client.query('SELECT COUNT(*) FROM users WHERE email = $1', [email]);
        
        if (emailExists.rows[0].count > 0) {
            throw new Error('User with this email already exists!');
        }

        const res = await client.query('INSERT INTO users(name, email) VALUES($1, $2) RETURNING *', [name, email]);
       
        console.log("New user successfully added.");
        
        return res.rows[0];
    } catch (err) {
        handleError(err);
    }
};

export const getUserById = async (id) => {
    try {
        const res = await client.query('SELECT * FROM users WHERE id=$1', [id]);

        if (res.rows.length === 0) {
            throw new Error('User not found!.');
        }

        return res.rows[0];
    } catch (err) {
        handleError(err);
    }
};

export const deleteUser = async (id) => {
    try {
        const res = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);

        if (res.rows.length === 0) {
            throw new Error("User for deletion not found.");
        }

        console.log("User successfully deleted.");
        
        return res.rows[0];
    } catch (err) {
        handleError(err);
    }
};

export const filterUsersByEmail = async (email) => {
    try {
        const query = 'SELECT * FROM users WHERE email ILIKE $1';
        const res = await client.query(query, [`%${email['email']}%`]);
        return res.rows;
    } catch (err) {
        handleError(err);
    }
};

export const filterUsersByName = async (name) => {
    try {
        const query = 'SELECT * FROM users WHERE name ILIKE $1';
        const res = await client.query(query, [`%${name['name']}%`]);
        return res.rows;
    } catch (err) {
        handleError(err);
    }
};
