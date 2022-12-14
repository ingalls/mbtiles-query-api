import fs from 'fs';
import path from 'path';
import cors from 'cors';
import express from 'express';
import minify from 'express-minify';
import Schema from '@openaddresses/batch-schema';
import minimist from 'minimist';

import Config from './lib/config.js';

const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url)));

const args = minimist(process.argv, {
    boolean: ['help', 'silent']
});

if (import.meta.url === `file://${process.argv[1]}`) {
    const config = Config.env(args);
    await server(config);
}

/**
 * @apiDefine user User
 *   A user must be logged in to use this endpoint
 */

export default async function server(config) {
    const app = express();

    const schema = new Schema(express.Router(), {
        schemas: new URL('./schema', import.meta.url)
    });

    app.disable('x-powered-by');
    app.use(cors({
        origin: true,
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
    }));

    app.use(minify());

    /**
     * @api {get} /api Get Metadata
     * @apiVersion 1.0.0
     * @apiName Server
     * @apiGroup Server
     * @apiPermission public
     *
     * @apiDescription
     *     Return basic metadata about server configuration
     *
     * @apiSchema {jsonschema=./schema/res.Server.json} apiSuccess
     */
    app.get('/api', (req, res) => {
        return res.json({
            version: pkg.version
        });
    });

    app.use('/api', schema.router);
    app.use('/docs', express.static('./doc'));

    await schema.api();

    await schema.load(
        new URL('./routes/', import.meta.url),
        config,
        {
            silent: !!config.silent
        }
    );

    schema.not_found();
    schema.error();

    fs.writeFileSync(new URL('./doc/api.js', import.meta.url), schema.docs.join('\n'));

    return new Promise((resolve, reject) => {
        const srv = app.listen(5000, (err) => {
            if (err) return reject(err);

            if (!config.silent) console.log('ok - http://localhost:5000');
            return resolve(srv);
        });
    });
}
