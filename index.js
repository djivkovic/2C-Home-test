import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from "./schema.js";
import { getUsers, addUser, getUserById, deleteUser, filterUsersByName, filterUsersByEmail } from "./databasepg.js";

const resolvers = {
    Query:{
        users: async () => await getUsers(),

        user: async (_, { id }) => await getUserById(id),

        filteredUsersByName: async (_, { name }) => await filterUsersByName({ name }),

        filteredUsersByEmail: async (_, { email }) => await filterUsersByEmail({ email })
    },
    Mutation:{
        addUser: async (_, { user }) => await addUser(user),
        deleteUser: async (_, { id }) => await deleteUser(id)
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers
});

await startStandaloneServer(server, {
    listen: { port: 4000 }
});

console.log("Server ready at port: ", 4000);
