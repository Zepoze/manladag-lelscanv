'use strict'
var chai = require('chai')
var expect = chai.expect
var index = require('../dist/index.js').Source
const fetch = require('./fetchAllmangas')
var os = require('os')
var Path = require('path')

describe('Lelscan interface test', () => {
    it('Should return 26',async () => {
        const result = await index.getNumberPageChapter(index.mangas["one-piece"],990)
        expect(result).to.equal(17)
    })
    it('should return tab of 26 url',async () => {
        const result = await index.getUrlPages(index.mangas["one-piece"],990)
        expect(result).to.be.an('array').lengthOf(17)
    })
    it('Should return true',async () => {
        const result = await index.chapterIsAvailable(index.mangas["one-piece"],990)
        expect(result).to.equal(true)
    })
    it('Should return a last chapter >990',async () => {
        const result = await index.getLastChapter(index.mangas["one-piece"])
        expect(result).to.be.greaterThan(990)
    })

    it('Chapter available betweesn chap n°1000 - 1035',async function() {
       const tab = await index.getChaptersAvailable(index.mangas["one-piece"],1000,1035);
       expect(tab.length).eq(37)
    })
    describe('check mangas',fetch.bind(this))
})