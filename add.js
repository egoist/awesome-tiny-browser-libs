const fs = require('mz/fs')
const inq = require('inquirer')

inq.prompt([{
  name: 'name',
  message: 'Package name:',
  validate: v => Boolean(v)
}, {
  name: 'repo',
  message: 'URL or slug of GitHub repo:',
  validate: v => Boolean(v)
}, {
  name: 'description',
  message: 'Description:',
  validate: v => Boolean(v)
}, {
  name: 'bundle',
  message: 'URL to minified bundle file:',
  validate: v => /https?:\/\//.test(v)
}]).then(answers => {
  const [user, repo] = answers.repo
    .replace(/^https?:\/\/github.com\//, '')
    .match(/([\w\-\_]+)\/([\w\-\_]+)/)
  const project = `|[${repo}](https://github.com/${user}/${repo})|${answers.description}|![${repo}][${repo}-gzip]|`
  const gzipBadge = `[${repo}-gzip]: http://img.badgesize.io/${answers.bundle}?compression=gzip&label=gzip&style=flat`

  return fs.readFile('./README.md', 'utf8')
    .then(content => {
      content = content
      .replace(/<!-- project holder -->/, `${project}\n<!-- project holder -->`)
      .replace(/<!-- badge holder -->/, `${gzipBadge}\n<!-- badge holder -->`)

      return fs.writeFile('./README.md', content, 'utf8')
    })
}).then(() => {
  console.log('Added!')
}).catch(err => {
  console.error(err)
  process.exit(1)
})
