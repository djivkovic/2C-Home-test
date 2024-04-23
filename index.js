import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from "./schema/schema.js";
import resolvers from "./resolvers/resolvers.js";

const server = new ApolloServer({
    typeDefs,
    resolvers
});

await startStandaloneServer(server, {
    listen: { port: 4000 }
});

console.log("Server ready at port: ", 4000);
