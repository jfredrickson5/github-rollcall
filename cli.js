#!/usr/bin/env node

const program = require('commander')
const RollCall = require('./rollcall')

function processJSON(data) {
  return JSON.stringify(data)
}

function processTSV(data) {
  let result = ''
  for (let member of data) {
    result += member.login + '\t' + member.name + '\t' + member.email + '\n'
  }
  return result
}

function processCSV(data) {
  let result = ''
  for (let member of data) {
    result += `"${member.login}","${member.name}","${member.email}"\n`
  }
  return result
}

program
  .arguments('<organization>')
  .option('-o --output <json|csv|tsv>', 'format of the member list', /^(json|csv|tsv)$/i, 'json')
  .action((organization) => {
    if (organization === undefined) {
      console.error('You must specify an organization name.')
      process.exit(1)
    } else {
      const token = process.env.GITHUB_ACCESS_TOKEN      
      const rc = new RollCall(token)
      rc
        .fetchMembers('GSA')
        .then(data => {
          data.map(member => {
            // GitHub API returns null for no name and empty string for no email. Normalize all to empty strings.
            member.name = (member.name == null) ? '' : member.name
            return member
          })
          if (program.output === 'json') {
            console.log(processJSON(data))
          } else if (program.output === 'csv') {
            console.log(processCSV(data))
          } else if (program.output === 'tsv') {
            console.log(processTSV(data))
          }
        })
        .catch(err => {
          console.error(err.message)
        })
    }
  })
  .parse(process.argv)
