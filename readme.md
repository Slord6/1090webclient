# 1090WebClient

A web client for plane spotting

## Install
1) `git clone https://github.com/Slord6/1090webclient.git`
2) Update the url variable in `getNewData` in `map.js` to point at your data source
3) Just host with you favourite web server - If you don't have one, I'm using [Fenix](https://fenixwebserver.com/).

## What is this?

A replacement client for [dump1090](https://github.com/MalcolmRobb/dump1090) .
Super, super simple (plain js/css/html) dump1090 web client using [Leaflet](https://leafletjs.com/) for maps.
Currently setup to use open street maps for map tiles but any leaflet-supported map tile service should work.

Note: This is not 'production-ready' code - it works, but its also, for example, consuming the server's data as HTML in places - don't just throw this on the internet if you don't know what you're doing

## How to use
Once you're serving the website, just navigate to it in a web browser (only tested in Chrome, so that's your best bet) and then wait for planes to appear.
Hover over a plane on the map for more info.

## Screenshot
![Sample screenshot](https://i.imgur.com/qcztJHm.jpg)

## FAQ
### No planes
If you don't see any planes, check the console to see if your question is answered there.

### Change default location
Edit the lat/lon + zoom values passed to `setView` on the first line of `map.js`

### Change data fetch frequency
You want the `dataFetchBreakTime` variable

## Licence
See separate file (but its MIT)