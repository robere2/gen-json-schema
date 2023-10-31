'use strict'

const chai = require('chai')
const cloneDeep = require('lodash.clonedeep')
const testSchema = require('../helpers/testSchema').tesSchemaWithAndWithoutArrayMerge
const toJsonSchema = require('../../src/index')

chai.should()

// TODO regulars

const stringFormats = {
  'date-time': {
    reverse: true,
    valid: [
      '2012-07-08T16:41:41.532Z',
      '2012-07-08T16:41:41Z',
      '2012-07-08T16:41:41.532+00:00',
      '2012-07-08T16:41:41.532+05:30',
      '2012-07-08T16:41:41.532+04:00',
      '2012-07-08T16:41:41.532z',
      '2012-07-08 16:41:41.532Z',
      '2012-07-08t16:41:41.532Z',
    ],
    invalid: [
      '2012-07-08',
      'TEST2012-07-08T16:41:41.532Z',
      '2012-07-08T16:41:41.532+00:00Z',
      '2012-07-08T16:41:41.532+Z00:00',
    ],
  },
  date: {
    reverse: true,
    valid: '2012-07-08',
    invalid: 'TEST2012-07-08',
  },
  time: {
    reverse: true,
    valid: '16:41:41',
    invalid: '16:41:41.532Z',
  },
  'utc-millisec': {
    reverse: true,
    valid: '-1234567890',
    invalid: '16:41:41.532Z',
  },
  regex: {
    valid: '/a/',
    invalid: '/^(abc]/',
  },
  color: {
    reverse: true,
    valid: [
      'red',
      '#f00',
      '#ff0000',
      'rgb(255,0,0)',
    ],
    invalid: 'json',
  },
  style: {
    reverse: true,
    valid: [
      'color: red;',
      'color: red; position: absolute; background-color: rgb(204, 204, 204); max-width: 150px;',
      'color:red;position:absolute; background-color:     rgb(204, 204, 204); max-width: 150px;',
    ],
    invalid: '0',
  },
  phone: {
    reverse: true,
    valid: '+31 42 123 4567',
    invalid: '31 42 123 4567',
  },
  uri: {
    reverse: true,
    valid: [
      'http://www.google.com/',
      'http://www.google.com/search',
    ],
    invalid: [
      'tdegrunt',
      'The dog jumped',
    ],
  },
  email: {
    reverse: true,
    valid: [
      'obama@whitehouse.gov',
      'barack+obama@whitehouse.gov',
    ],
    invalid: 'obama@',
  },
  'ip-address': {
    reverse: true,
    valid: [
      '192.168.0.1',
      '127.0.0.1',
    ],
    invalid: [
      '192.168.0',
      '256.168.0',
    ],
  },
  ipv6: {
    reverse: true,
    valid: [
      'fe80::1%lo0',
      '::1',
    ],
    invalid: [
      '127.0.0.1',
      'localhost',
    ],
  },
  'host-name': {
    valid: [
      'localhost',
      'www.google.com',
    ],
    invalid: 'www.-hi-.com',
  },
  alpha: {
    valid: [
      'alpha',
      'abracadabra',
    ],
    invalid: 'www.-hi-.com',
  },
  alphanumeric: {
    valid: [
      'alpha',
      '123',
      'abracadabra123',
    ],
    invalid: '1test!',
  },
}
stringFormats.hostname = stringFormats['host-name']
stringFormats.regexp = stringFormats.regex
stringFormats.pattern = stringFormats.regex
stringFormats.ipv4 = cloneDeep(stringFormats['ip-address'])
stringFormats.ipv4.reverse = false

function reverseStringFormatTest() {
  Object.keys(stringFormats).filter(key => stringFormats[key].reverse).forEach(formatName => {
    const format = stringFormats[formatName]

    describe(formatName, () => {

      const valid = Array.isArray(format.valid) ? format.valid : [format.valid]
      valid.forEach(item => {
        it(`should validate ${item}`, () => {
          const schema = toJsonSchema(item, {strings: {detectFormat: true}})
          schema.should.deep.equal({type: 'string', format: formatName})
        })
      })
    })
  })
}

function noDetectionStringFormatTest() {
  Object.keys(stringFormats).forEach(formatName => {
    const format = stringFormats[formatName]

    describe(formatName, () => {

      const valid = Array.isArray(format.valid) ? format.valid : [format.valid]
      valid.forEach(item => {
        it(`should validate ${item}`, () => {
          const schema = toJsonSchema(item, {strings: {detectFormat: false}})
          schema.should.deep.equal({type: 'string'})
        })
      })
    })
  })
}

describe('Strings', () => {

  describe('Normal string', () => {

    it('should get string schema for generic string', () => {
      testSchema('test string', {type: 'string'})
    })

  })

  describe('String format reverse discovery', () => {
    reverseStringFormatTest()
  })

  describe('String format no detection', () => {
    noDetectionStringFormatTest()
  })

  describe('Custom string function', () => {
    const config = {
      strings: {
        detectFormat: true,
        preProcessFnc: (value, defaultFnc) => {
          if (value === 'date') {
            return {type: 'string', format: 'date'}
          }
          return defaultFnc(value)
        },
      },
    }

    it('should get schema for \'test\'', () => {
      const schema = toJsonSchema('test', config)
      schema.should.deep.equal({type: 'string'})
    })

    it('should get schema for \'date\'', () => {
      const schema = toJsonSchema('date', config)
      schema.should.deep.equal({type: 'string', format: 'date'})
    })

    it('should get schema for mixed case of both previous', () => {
      const schema = toJsonSchema({a: 'test', b: 'date'}, config)
      schema.should.deep.equal({type: 'object', properties: {a: {type: 'string'}, b: {type: 'string', format: 'date'}}})
    })
  })

})
