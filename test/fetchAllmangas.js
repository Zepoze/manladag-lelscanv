
var chai = require('chai')
var expect = chai.expect
var index = require('../dist/index.js').Source
const fs = require('fs')
const path = require('path')

const jsdom = require('jsdom')
const helperPath = path.join(__dirname,'..','mangas-helper.json')

module.exports = function() {
  let i = 1;
  let li;
  const obj= {}
  before(function mangaAdded() {
    return jsdom.JSDOM.fromURL(index.url).then((dom) => {
      describe('Manga correctly added',function() {
      
        //console.log(dom)
        if(fs.existsSync(helperPath)) fs.unlinkSync(helperPath)
        fs.appendFileSync(helperPath,'{')
        do {
          li = dom.window.document.querySelector(`#main_hot_ul li:nth-child(${i})`);
          if(!li) {
            describe('Mangas installed still available online',function() {
              
              Object.keys(index.mangas).forEach((s,id) => {
                
                it(s,function(){
                  if(id==0) fs.appendFileSync(helperPath,'\n}')
                  expect(obj[s]).to.equal(true,`${index.mangas[s].name?? s} does not seem to be available anymore `)
                })
              })
            })
            
            break
          }
          const a = li.children[0];
          
          
          const keyName = new RegExp(/^https:\/\/lelscans.net\/lecture-en-ligne-(.+)\.php$/,'i').exec(a.getAttribute('href'))[1];
          const title = new RegExp(/^(.+) scan/,'i').exec(a.getAttribute('title'))[1];
          const ins = i
          obj[keyName]=true
          it(title,function() {
            fs.appendFileSync(helperPath,`${ins != 1 ? ',': ''}\n\t"${keyName}": {\n\t\t"name": "${title}",\n\t\t"keyName": "${keyName}"\n\t}`)
            expect(index.mangas[keyName]).to.not.equal(undefined, `${title} not added`)
            expect(index.mangas[keyName]).to.eql({keyName,name:title})
            
          })
          i+=1
        } while(true)
        
      })

    })
  })
  it('checking',function(){})
}