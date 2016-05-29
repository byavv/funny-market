import * as path from 'path';
import * as express from 'express';
var history = require('connect-history-api-fallback');


const host = process.env.HTTP_HOST || "0.0.0.0",
  http_port = process.env.HTTP_PORT || 3000,
  etcd_host = process.env.ETCD_HOST || '192.168.99.100', // etcd in prod
  origin = process.env.ORIGIN_URL || 'http://localhost:3001';

const registry = require('etcd-registry')(`${etcd_host}:4001`);

import 'angular2-universal/polyfills';
import {
  provide,
  enableProdMode,
  expressEngine,
  REQUEST_URL,
  ORIGIN_URL,
  BASE_URL,
  NODE_ROUTER_PROVIDERS,
  NODE_PLATFORM_PIPES,
  NODE_HTTP_PROVIDERS,
  ExpressEngineConfig, BootloaderConfig, queryParamsToBoolean
} from 'angular2-universal';

import {App} from '../client/app/app';
import {Html} from './components/html';

const app = express();
var router = express.Router();
const ROOT = path.join(path.resolve(__dirname, '../build'));

app.use(require("serve-favicon")(path.join(__dirname, "./views/favicon.ico")));
enableProdMode();
app.engine('.html', expressEngine);
app.set("views", path.join(__dirname, "./views"));
app.set('view engine', 'html');

function ngApp(req, res) {
  let queryParams: any = queryParamsToBoolean(req.query);
  console.log(queryParams, req.originalUrl)
  let options: BootloaderConfig = Object.assign(queryParams, {
    directives: [Html],
    platformProviders: [
      provide(ORIGIN_URL, { useValue: origin }),
      provide(BASE_URL, { useValue: '/' }),
    ],
    providers: [
      provide(REQUEST_URL, { useValue: req.originalUrl }),
      NODE_PLATFORM_PIPES,
      NODE_ROUTER_PROVIDERS,
      NODE_HTTP_PROVIDERS
    ],
    data: {},
    precache: true, //<-- unknown
    primeCache: true,//<-- unknown
    async: false, // if set to true, app will be desync
    preboot: queryParams.preboot === false ? null : {
      appRoot: 'app', // we need to manually include the root
      start: true,
      // freeze: 'spinner',     // show spinner w button click & freeze page
      replay: 'rerender',    // rerender replay strategy
      buffer: true,          // client app will write to hidden div until bootstrap complete
      debug: false,
      uglify: true,
      buttonPress: true,
      presets: ['keyPress', 'buttonPress', 'focus']
    },
    ngOnRendered: () => {
      console.log('DONE');
    },
    ngDoCheck: () => {
      console.log("check")
      return true;
    }
  });
  return res.render('index', options);
}

app.use('/build/', express.static(ROOT, { index: false }));
router.route("*").get(ngApp);
router.route("/search*").get(ngApp);
//router.route("/login*").get(ngApp);
//router.route("/account*").get(ngApp);
app.use(history({}))
app.use(router);

app.listen(http_port, host, function () {
  console.log(`WEB server is listening on port: ${http_port} `)
  registry.join('web', { port: http_port });
  setTimeout(() => {
    registry.lookup('web', (err, service) => {
      if (service) {
        console.log(`Web server is registered on ${service.url} `);
      } else {
        console.log(`Web server egistration failed`);
      }
    });
  }, 1000);
});
