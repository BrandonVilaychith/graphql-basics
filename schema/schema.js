// Module imports
const graphql = require('graphql');
const axios = require('axios');
const { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt } = graphql;

// Model for the GraphQL Company type
const CompanyType = new GraphQLObjectType({
    name: 'Company',
    fields: {
        id: { type: GraphQLString },
        name: { type: GraphQLString },
        description: { type: GraphQLString }
    }
});

// Model for the GraphQL User type
const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLString },
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt },
        company: {
            type: CompanyType,
            resolve(parentValue, args) {
                // prettier-ignore
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                    .then((res) => res.data);
            }
        }
    }
});

// Root Query for GraphQL
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryField',
    fields: {
        user: {
            type: UserType,
            args: { id: { type: GraphQLString } },
            resolve(parentValue, args) {
                return axios
                    .get(`http://localhost:3000/users/${args.id}`)
                    .then((res) => res.data);
            }
        }
    }
});

// GraphQL Schema export
module.exports = new GraphQLSchema({
    query: RootQuery
});
