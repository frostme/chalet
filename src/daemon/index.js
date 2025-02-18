const exitHook = require("exit-hook");
const httpProxy = require("http-proxy");
const conf = require("../conf");
const pidFile = require("../pid-file");
const pem = require("./pem");
const log = require("./log");
const Group = require("./group");
const Loader = require("./loader");
const App = require("./app");

const group = Group();
const app = App(group);

// Load and watch files
Loader(group);

// Create pid file
pidFile.create();

// Clean exit
exitHook(() => {
  console.log("Exiting");
  console.log("Stop daemon");
  proxy.close();
  app.close();
  group.stopAll();

  console.log("Remove pid file");
  pidFile.remove();
});

// HTTPS proxy
const proxy = httpProxy.createServer({
  target: {
    host: "127.0.0.1",
    port: conf.port
  },
  ssl: pem.generate(),
  ws: true,
  xfwd: true
});

// `http-proxy` requires that at least 1 listener exists to not raise
// an exception. See https://github.com/http-party/node-http-proxy/blob/9b96cd725127a024dabebec6c7ea8c807272223d/lib/http-proxy/index.js#L119
proxy.on("error", err => console.error(err));

// Start HTTPS proxy and HTTP server
proxy.listen(conf.port + 1);

app.listen(conf.port, conf.host, function() {
  log(`Server listening on port ${conf.host}:${conf.port}`);
});
