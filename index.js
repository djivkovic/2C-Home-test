import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from '@apollo/server/standalone'

import { typeDefs } from "./schema.js"
import { getUsers, addUser, getUserById, deleteUser } from "./databasepg.js"

const resolvers = {
    Query:{
        users: async () => {
            try {
                const users = await getUsers();
                return users;
            } catch (err) {
                throw err;
            }
        },
        user: async (_, { id }) =>{
            try {
                const user = await getUserById(id);
                return user                                           
            } catch(err){
                throw err
            }
        },
        filteredUsers: async (_, { name, email }) => {
            try {
                let users = await getUsers();

                if (name) {
                    users = users.filter(user => user.name.includes(name));
                }

                if (email) {
                    users = users.filter(user => user.email.includes(email));
                }

                return users;
            } catch (err) {
                throw err;
            }
        }
    },
    Mutation:{
        addUser: async(_, { user })=>{
            try{
                const newUser = await addUser(user)
                return newUser
            }catch(err){
                console.log(err)
                throw err
            }
        },
        deleteUser: async(_, { id })=>{
            try{
                const deletedUser = await deleteUser(id);
                return deletedUser;
            }catch(err){
                console.log(err)
                throw err
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers
})

const { url } = await startStandaloneServer(server,{
    listen: { port:4000 }
})

console.log("Server ready at port: ", 4000)