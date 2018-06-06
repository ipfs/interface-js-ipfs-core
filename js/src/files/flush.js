/* eslint-env mocha */
/* eslint max-nested-callbacks: ["error", 8] */

'use strict'

const chai = require('chai')
const series = require('async/series')
const hat = require('hat')
const dirtyChai = require('dirty-chai')
const expect = chai.expect
chai.use(dirtyChai)
const { getDescribe, getIt } = require('../utils/mocha')

module.exports = (createCommon, options) => {
  const describe = getDescribe(options)
  const it = getIt(options)
  const common = createCommon()

  describe('.files.flush', function () {
    this.timeout(40 * 1000)

    let ipfs

    before(function (done) {
      // CI takes longer to instantiate the daemon, so we need to increase the
      // timeout for the before step
      this.timeout(60 * 1000)

      common.setup((err, factory) => {
        expect(err).to.not.exist()
        factory.spawnNode((err, node) => {
          expect(err).to.not.exist()
          ipfs = node
          done()
        })
      })
    })

    after((done) => common.teardown(done))

    it('should not flush not found file/dir, expect error', (done) => {
      const testDir = `/test-${hat()}`

      ipfs.files.flush(`${testDir}/404`, (err) => {
        expect(err).to.exist()
        done()
      })
    })

    it('should flush root', (done) => {
      ipfs.files.flush((err) => {
        expect(err).to.not.exist()
        done()
      })
    })

    it('should flush specific dir', (done) => {
      const testDir = `/test-${hat()}`

      series([
        (cb) => ipfs.files.mkdir(testDir, { p: true }, cb),
        (cb) => ipfs.files.flush(testDir, cb)
      ], (err) => {
        expect(err).to.not.exist()
        done()
      })
    })
  })
}
