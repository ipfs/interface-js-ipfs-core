/* eslint-env mocha */
'use strict'

const { getDescribe, getIt, expect } = require('../utils/mocha')
const { expectIsBitswap } = require('../stats/utils')

module.exports = (createCommon, options) => {
  const describe = getDescribe(options)
  const it = getIt(options)
  const common = createCommon()

  describe('.bitswap.stat', () => {
    let ipfs

    before(async function () {
      // CI takes longer to instantiate the daemon, so we need to increase the
      // timeout for the before step
      this.timeout(60 * 1000)

      ipfs = await common.setup()
    })

    after(() => common.teardown())

    it('should get bitswap stats', async () => {
      const res = await ipfs.bitswap.stat()
      expectIsBitswap(null, res)
    })

    it('should not get bitswap stats when offline', async function () {
      this.timeout(60 * 1000)

      const node = await createCommon().setup()
      await node.stop()

      return expect(node.bitswap.stat()).to.eventually.be.rejected()
    })
  })
}
