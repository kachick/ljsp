 'use strict';

const expect = require("chai").expect
const Ljsp = require("../lib/ljsp")

describe('Ljsp', function() {
  describe('.tokenize()', function() {
    it('', function() {
      expect(Ljsp.tokenize("(begin (define r 3) (* 3.141592653 (* r r)))")).to.eql(["(", "begin", "(", "define", "r", "3", ")", "(", "*", "3.141592653", "(", "*", "r", "r", ")", ")", ")"])
    })
  })

  describe('.parse()', function() {
    it('', function() {
      expect(Ljsp.parse("(begin (define r 3) (* 3.141592653 (* r r)))")).to.eql(['begin', ['define', 'r', 3], ['*', 3.141592653, ['*', 'r', 'r']]])
    })
  })
})
