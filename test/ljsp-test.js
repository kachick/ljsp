'use strict';

const expect = require("chai").expect
const Ljsp = require("../lib/ljsp")

describe('Ljsp', function() {
  const tokens = ["(", "begin", "(", "define", "r", "3", ")", "(", "*", "3.141592653", "(", "*", "r", "r", ")", ")", ")"]
  const parsedAtoms = ['begin', ['define', 'r', 3], ['*', 3.141592653, ['*', 'r', 'r']]]

  describe('.tokenize()', function() {
    it('', function() {
      expect(Ljsp.tokenize("(begin (define r 3) (* 3.141592653 (* r r)))")).to.eql(tokens)
    })
  })

  describe('.parse()', function() {
    it('', function() {
      expect(Ljsp.parse("(begin (define r 3) (* 3.141592653 (* r r)))")).to.eql(parsedAtoms)
    })
  })

  describe('.evaluate()', function() {
    it('', function() {
      expect(Ljsp.evaluate(parsedAtoms)).to.eql(28.274333877)
    })
  })
})
