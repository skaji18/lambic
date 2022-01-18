const firebaseTools = require('firebase-tools')

module.exports = function FirebaseConfigLoader () {
  const callback = this.async()
  firebaseTools.apps.sdkconfig('web', '', {}).then(config => {
    callback(null, JSON.stringify(config))
  }).catch(err => callback(err))
}
