import Err from '@openaddresses/batch-error';

export default async function router(schema, config) {
    await schema.get('/query/:source/:layer', {
        name: 'Query',
        group: 'Query',
        auth: 'public',
        description: 'Retrieve a feature closest to a given lat/lng',
        ':source': 'string',
        ':layer': 'string',
        query: 'req.query.Query.json',
        res: 'res.Query.json'
    }, async (req, res) => {
        try {
            return res.json(true);
        } catch (err) {
            return Err.respond(err, res);
        }
    });
}
