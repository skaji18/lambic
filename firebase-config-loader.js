// eslint-disable-next-line @typescript-eslint/no-var-requires
const firebaseTools = require("firebase-tools");

module.exports = function FirebaseConfigLoader() {
  const callback = this.async();
  firebaseTools
    .use(null, { projectRoot: __dirname })
    .then((projectId) => firebaseTools.apps.list("web", { project: projectId }))
    .then((apps) =>
      firebaseTools.apps.sdkconfig("web", apps[0].appId, {
        project: apps[0].projectId,
      })
    )
    .then((config) => {
      callback(null, JSON.stringify(config.sdkConfig));
    })
    .catch((err) => callback(err));
};
