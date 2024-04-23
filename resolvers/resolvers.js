import { getUsers, addUser, getUserById, deleteUser, filterUsers} from "../database/database.js";

const resolvers = {
    Query:{
        users: async () => await getUsers(),
        user: async (_, { id }) => await getUserById(id),
        filterUsers: async (_, { name, email }) => await filterUsers({ name, email }),
    },
    Mutation:{
        addUser: async (_, { user }) => await addUser(user),
        deleteUser: async (_, { id }) => await deleteUser(id)
    }
};

export default resolvers;
