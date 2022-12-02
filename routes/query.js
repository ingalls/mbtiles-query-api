import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';
import Err from '@openaddresses/batch-error';
import MBTiles from '@mapbox/mbtiles';
import SphericalMercator from '@mapbox/sphericalmercator';
import vtquery from '@mapbox/vtquery';

const query = promisify(vtquery);

export default async function router(schema, config) {
    const mbtiles = new Map();
    const load = promisify((filename, cb) => new MBTiles(filename, cb));

    const sm = new SphericalMercator({ size: 256, antimeridian: true });

    for (const f of await fs.readdir(new URL('../data/', import.meta.url))) {
        const p = path.parse(f);
        if (p.ext !== '.mbtiles') continue;

        const p_url = new URL('../data' + p.base , import.meta.url);
        const tiles = await load(p_url.pathname);

        mbtiles.set(p.name, tiles);
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

            mbtiles.get(req.params.source).getInfo((err, info) => {
                if (err) throw new Err(500, err, 'Internal Error');
                return res.json(info);
            });
        } catch (err) {
            return Err.respond(err, res);
        }
    });

    await schema.get('/query/:source/query', {
        name: 'Query',
        group: 'Query',
        auth: 'public',
        description: 'Retrieve a feature closest to a given lat/lng',
        ':source': 'string',
        query: 'req.query.Query.json',
        res: 'res.Query.json'
    }, async (req, res) => {
        try {
            if (!mbtiles.has(req.params.source)) throw new Err(400, null, 'Source does not exist!');

            const [x, y, z] = sm.forward(req.query.coord, zoom);
            const getTile = promisify(tileset.getTile).bind(tileset);
            const buffer = await getTile(z, x, y);
            const tiles = [
                {buffer, z, x, y }
            ];
            return await vtquery(tiles, lngLat, options);

            return res.json(true);
        } catch (err) {
            return Err.respond(err, res);
        }
    });
}
