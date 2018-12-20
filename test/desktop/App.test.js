const Application = require('spectron').Application
const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
const path = require('path')
const electronPath = path.join(__dirname, '../../node_modules', '.bin', 'electron')
const exec = require('child_process').exec

chai.should()
chai.use(chaiAsPromised)

let app

describe('safeword', function() {
  this.timeout(60000)

  before(() => new Promise((resolve) => {
    // Use electron-compile to activate babel and webpack
    // Following this scheme: https://github.com/electron-userland/electron-compile/issues/178
    exec(`${path.resolve(__dirname, '../../node_modules/.bin/electron-compile')} ${path.join(__dirname, '../..')}`, () => {
      app = new Application({
        path: electronPath,
        args: [path.join(__dirname, '../..')]
      })

      app.start().then(resolve)
    })
  })
  )

  before(function() {
    chaiAsPromised.transferPromiseness = app.transferPromiseness
  })

  after(function() {
    if (app && app.isRunning()) {
      return app.stop()
    }
  })

  describe('ui', function() {
    it('opens a window', function() {
      return app.client.waitUntilWindowLoaded()
        .getWindowCount().should.eventually.have.at.least(1)
        .browserWindow.isMinimized().should.eventually.be.false
        .browserWindow.isVisible().should.eventually.be.true
        .browserWindow.isFocused().should.eventually.be.true
        .browserWindow.getBounds().should.eventually.have.property('width').and.be.above(0)
        .browserWindow.getBounds().should.eventually.have.property('height').and.be.above(0)
    })
  })
})
