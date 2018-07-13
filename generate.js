const chunk = require('lodash.chunk')
const websites = require('websites.json')
  .filter(v => !/google/.test(v))
const parse = require('compound-word')
const fs = require('fs-extra')
const path = require('path')

let chunks = chunk(websites, 1000)
let prefixes = {}
let suffixes = {}

async function run () {
  let i = 0
  while (i < chunks.length) {
    let chunk = chunks[i]
    chunk.forEach(website => {
      let name = website.split('.')[0]
      let result = parse(name)
      if (!result.length) return

      let [prefix, suffix] = result
      
      if (prefixes[prefix]) {
        prefixes[prefix]++
        console.log(prefix, prefixes[prefix])
      } else {
        prefixes[prefix] = 1
      }
      if (suffixes[suffix]) {
        suffixes[suffix]++
        console.log(suffix, suffixes[suffix])
      } else {
        suffixes[suffix] = 1
      }
    })

    let _prefixes = Object.keys(prefixes).map(p => ([p, prefixes[p]]))
      .sort((a, b) => b[1] - a[1])
    let _suffixes = Object.keys(suffixes).map(p => ([p, suffixes[p]]))
      .sort((a, b) => b[1] - a[1])
    let data = {
      prefixes: _prefixes,
      suffixes: _suffixes
    }
    await fs.writeJson(path.join(__dirname, `data/${i}.json`), data)
    i++
  }
}

run()