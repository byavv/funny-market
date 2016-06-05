const express = require('express'),
    compression = require('compression'),
    path = require('path');

const http_port = process.env.HTTP_PORT || 3000
    , etcd_host = process.env.ETCD_HOST || '192.168.99.100'
    , proxy_url = process.env.PROXY_URL || 'http://localhost:3001';

const registry = require('etcd-registry')(`${etcd_host}:4001`);

import 'angular2-universal/polyfills';
import { Http } from '@angular/http';
import { Footer } from './components/footer';
import {
    provide,
    enableProdMode,
    expressEngine,
    REQUEST_URL,
    ORIGIN_URL,
    BASE_URL,
    NODE_ROUTER_PROVIDERS,
    NODE_LOCATION_PROVIDERS,
    NODE_HTTP_PROVIDERS,
    NODE_PRELOAD_CACHE_HTTP_PROVIDERS
} from 'angular2-universal';
import {
    TranslateService,
    TranslateLoader,
    TranslateStaticLoader
} from "ng2-translate/ng2-translate";

// Root app Component
import {App} from '../client/app/app';

// Disable Angular 2's "development mode".
// See: https://angular.io/docs/ts/latest/api/core/enableProdMode-function.html
enableProdMode();
// express app
let app = express();

// Root directory
let root = path.join(path.resolve(__dirname, '..'));

// Compress assets
app.use(compression());

// Definition static resources folder '/build/client' and map to '/static' path
app.use('/static', express.static(path.join(root, 'build', 'client'), { index: false }));
app.use(require("serve-favicon")(path.join(__dirname, "./views/favicon.ico")));
app.engine('.html', expressEngine);
app.set("views", path.join(__dirname, "./views"));
app.set('view engine', 'html');

function ngApp(req, res) {
    let baseUrl = '/';
    let url = req.originalUrl || '/';
    res.render('index', {
        directives: [App, Footer],
        platformProviders: [
            provide(ORIGIN_URL, { useValue: proxy_url }),
            provide(BASE_URL, { useValue: baseUrl }),
        ],
        providers: [
            NODE_ROUTER_PROVIDERS,
            NODE_LOCATION_PROVIDERS,
            NODE_PRELOAD_CACHE_HTTP_PROVIDERS,
            provide(REQUEST_URL, { useValue: url }),
            provide(TranslateLoader, {
                useFactory: (http: Http) => new TranslateStaticLoader(http, 'i18n', '.json'),
                deps: [Http]
            })
        ],
        preboot: {
            appRoot: 'app',          // selector for Angular root element
            replay: 'rerender',      // Angular will re-render the view
            freeze: 'spinner',       // show spinner w button click & freeze page
            focus: true,             // maintain focus after re-rendering
            buffer: true,            // client app will write to hidden div until bootstrap complete
            keyPress: true,          // all keystrokes in text elements recorded
            buttonPress: true        // when button pressed, record and freeze page          
        },
        async: true
    });
};

// Specifies that all server-side paths should be routed to our ngApp function (see above)
app.get('/*', ngApp);

// Binds our express app the the specified port (i.e. starts it up) and logs when it is running
app.listen(http_port, () => {
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
