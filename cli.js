const RollCall = require('./rollcall')

const token = process.env.GITHUB_ACCESS_TOKEN

const rc = new RollCall(token)

rc.fetchMembers('GSA')
.then(data => {
  for (let member of data) {
    console.log(member.login + '\t' + member.name + '\t' + member.email)
  }
})
.catch(err => {
  console.error(err)
})
