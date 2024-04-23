export const typeDefs = `#graphql
    type User {
        id: ID!
        name: String!
        email: String!
    }  
        
    type Query{
        users: [User]
        user(id:ID!): User
        filterUsers(name: String, email: String): [User]
    }     

    type Mutation{
        addUser(user: AddUserInput!):User
        deleteUser(id: ID!): User
    }

    input AddUserInput{
        name: String!
        email: String!
    }
`
