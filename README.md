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

## New Sources

Any MBTiles file can be used as a new datasource. The file just needs to be moved into
`./data/` and the server restarted.

In this example we will convert Census Tract Data into a usable source.

1. Navigate to https://www2.census.gov/geo/tiger/TIGER2022/TRACT/ to view the Tract Data products
2. Download it via `wget` and the Census FTP Server

```sh
wget --recursive --continue --no-parent --cut-dirs=3 --no-host-directories --directory-prefix=$(pwd)/ ftp://ftp2.census.gov/geo/tiger/TIGER2022/TRACT/
```

3. Convert all the Zipped Shapefiles to Line-Delimited GeoJSON

```sh
ogr2ogr TODO!!
```

4. Cat all the files into a single master file
```
cat *.geojson > master-tracts.output
```

5. Convert the data into an MBTiles file using TippeCanoe

```
tippecanoe TODO
```
