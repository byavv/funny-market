import * as path from "path";
import * as express from "express";
import * as morgan from "morgan";

import {expressEngine} from "angular2-universal";

export function configureExpress(app) {
    
    app.use(require("serve-favicon")(path.join(__dirname, "../views/favicon.ico")));

    app.engine('.html', expressEngine);
    app.set("views", path.join(__dirname, "../views"));
    app.set('view engine', 'html');   
    
    app.use("/build/", express.static(process.cwd() + "/build/"));
    app.use((err: any, req, res, next: Function) => {
        let code = 500,
            msg = { message: "Internal Server Error" };
        switch (err.name) {
            case "UnauthorizedError":
                code = err.status;
                msg = undefined;
                break;
            case "BadRequestError":
            case "UnauthorizedAccessError":
            case "NotFoundError":
                code = err.status;
                msg = err.inner;
                break;
            default:
                break;
        }
        return res.status(code).json(msg);
    });
};

