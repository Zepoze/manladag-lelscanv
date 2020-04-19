'use strict'
var chai = require('chai')
var expect = chai.expect
var index = require('../dist/index.js').Source
var os = require('os')
var Path = require('path')

describe('Lelscan interface test', () => {
    it('Should return 26',async () => {
        const result = await index.getNumberPageChapter(index.mangas["one-piece"],975)
        expect(result).to.equal(26)
    })
    it('should return tab of 26 url',async () => {
        const result = await index.getUrlPages(index.mangas["one-piece"],975)
        expect(result).to.be.an('array').lengthOf(26)
    })
    it('Should return true',async () => {
        const result = await index.chapterIsAvailable(index.mangas["one-piece"],975)
        expect(result).to.equal(true)
    })
    it('Should return a last chapter >975',async () => {
        const result = await index.getLastChapter(index.mangas["one-piece"])
        expect(result>975).to.equal(true)
    })
})