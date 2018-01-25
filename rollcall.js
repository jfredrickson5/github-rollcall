const GraphQLClient = require('graphql-request').GraphQLClient

module.exports = function (github_access_token = undefined) {
  this.options = {
    headers: {}
  }

  if (github_access_token !== undefined) {
    this.options.headers.Authorization = 'Bearer ' + github_access_token
  }

  this.client = new GraphQLClient('https://api.github.com/graphql', this.options)

  this.query = `
    query ListMembers($org: String!, $cursor: String) {
      organization(login: $org) {
        members(first: 100, after: $cursor) {
          edges {
            node {
              login
              name
              email
            }
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
      }
    }
  `

  this.fetchMembers = function (orgName, cursor = undefined, members = []) {
    return new Promise((resolve, reject) => {
      const variables = {
        org: orgName,
        cursor: cursor
      }

      this.client
        .request(this.query, variables)
        .then(data => {
          const pageInfo = data.organization.members.pageInfo

          for (let memberEdge of data.organization.members.edges) {
            members.push(memberEdge.node)
          }

          if (pageInfo.hasNextPage) {
            resolve(this.fetchMembers(orgName, pageInfo.endCursor, members))
          }

          resolve(members)
        })
        .catch(err => {
          reject(err.response)
        })
    })
  }
}
