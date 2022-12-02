import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import Err from '@openaddresses/batch-error';
import MBTiles from '@mapbox/mbtiles';
import tb from '@mapbox/tilebelt';
import vtquery from '@mapbox/vtquery';

const query = promisify(vtquery);

export default async function router(schema, config) {
    const mbtiles = new Map();
    const infos = new Map();
    const load = promisify((filename, cb) => new MBTiles(filename, cb));

    for (const f of await fs.readdir(new URL('../data/', import.meta.url))) {
        const p = path.parse(f);
        if (p.ext !== '.mbtiles') continue;

        const p_url = new URL('../data/' + p.base , import.meta.url);
        const tiles = await load(p_url.pathname + '?mode=ro');

        mbtiles.set(p.name, tiles);
        tiles.getInfo((err, info) => { infos.set(p.name, info); });
    }

    await schema.get('/query', {
        name: 'Sources',
        group: 'Query',
        auth: 'public',
        description: 'Return available data sources',
        res: 'res.Object.json'
    }, async (req, res) => {
        try {
            return res.json({
                sources: Array.from(mbtiles.keys())
            });
        } catch (err) {
            return Err.respond(err, res);
        }
    });

    await schema.get('/query/:source', {
        name: 'Query',
        group: 'Query',
        auth: 'public',
        description: 'Retrieve a feature closest to a given lat/lng',
        ':source': 'string',
        res: 'res.Object.json'
    }, async (req, res) => {
        try {
            if (!mbtiles.has(req.params.source)) throw new Err(400, null, 'Source does not exist!');

            return res.json(infos.get(req.params.source));
        } catch (err) {
            return Err.respond(err, res);
        }
    });

    await schema.get('/query/:source/:zoom/query', {
        name: 'Query',
        group: 'Query',
        auth: 'public',
        description: 'Retrieve a feature closest to a given lat/lng',
        ':source': 'string',
        ':zoom': 'integer',
        query: 'req.query.Query.json',
        res: 'res.Query.json'
    }, async (req, res) => {
        let tiles, x, y;
        try {
            if (!mbtiles.has(req.params.source)) throw new Err(400, null, 'Source does not exist!');

            const info = infos.get(req.params.source);

            if (req.params.minzoom > info.maxzoom) throw new Err(400, null, 'Over MaxZoom');
            if (req.params.minzoom < info.maxzoom) throw new Err(400, null, 'Under MinZoom');

            const xy = tb.pointToTile(req.query.coord[0], req.query.coord[1], req.params.zoom);
            x = xy[0];
            y = xy[1];

            tiles = mbtiles.get(req.params.source);

        } catch (err) {
            return Err.respond(err, res);
        }

        console.error(req.params.zoom, x, y)
        tiles.getTile(req.params.zoom, x, y, (err, buffer) => {
            if (err) return Err.respond(err, res);

            vtquery([{
                buffer,
                z: req.params.zoom,
                x,
                y
            }], req.query.coord, {
                radius: 0,
                limit: 1
            }, (err, res) => {
                if (err) return Err.respond(err, res);

                console.error(res);
            });
        })
    });
}
