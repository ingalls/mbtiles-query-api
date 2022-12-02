<h1 align=center>MBTiles Query</h1>

<p align=center>Query results from an MBTiles layer</p>

## Installation

Ensure you have NodeJS >= v18 installed locally, or use the provided docker environment

```sh
npm install
```

Put any mbtiles files you wish to be queryable in the directory `./data/` relative to the root
of this repo. Once the MBTiles are copied to the directory, start the server.


```sh
npm run dev
```

## Docs

Once the server is started API docs can be found below:

```
http://localhost:5000/docs/

```

### Query Sources

Example of getting a GeoJSON Feature from a source

```
http://localhost:5000/api/query/zipcodes/18/?coord=-108.6043183759879,39.07042003514718
```
