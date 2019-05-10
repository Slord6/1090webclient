# 1090WebClient

A light-weight web client for plane spotting using [dump1090](https://github.com/MalcolmRobb/dump1090).

## Install
1) `git clone https://github.com/Slord6/1090webclient.git`
2) Update the url variable in `getNewData` in `map.js` to point at your data source
3) Either Just open `index.html` or host with you favourite web server - if you don't have one, I'm using [Fenix](https://fenixwebserver.com/).

## What is this?
Super, super simple (plain js/css/html) [dump1090](https://github.com/MalcolmRobb/dump1090) web client using [Leaflet](https://leafletjs.com/) for maps.

Currently set up to use Open Street Maps for map tiles but any leaflet-supported map tile service should work (see the list of [tile servers](https://wiki.openstreetmap.org/wiki/Tile_servers)).

Note: This is not 'production-ready' code - it works, but it's also, for example, consuming the server's data as HTML in places - don't just throw this on the internet if you don't know what you're doing.

## How to use
Once you're serving the website, just navigate to it in a web browser (only tested in Chrome, so that's your best bet) and then wait for planes to appear.

Hover over a plane on the map for more info.

## Screenshot
![Sample screenshot](https://i.imgur.com/qcztJHm.jpg)

## FAQ
### Cross-Origin Errors
Depending on the version of [dump1090](https://github.com/MalcolmRobb/dump1090) you have and your setup, there might be a slight modification you need to make in order not to get cross-origin errors.

I've tried to write the following instructions so someone who's never written code in their life can fix it, but if you have problems feel free to open an issue and I'll try and help you out.

The following instructions assume:
- You have `git clone`d the [dump1090](https://github.com/MalcolmRobb/dump1090) repository as the instructions there explain
- You are running a linux system (in my case [raspbian](https://www.raspberrypi.org/downloads/raspbian/)). However, the instructions should be fairly similar for other setups.
- You are `ssh`-ing into the system or only have a command line (if not and you have a GUI, then you can open the file with any text editor and start at #3)

1) Navigate to the cloned directory on the command line
2) Open the `net_io.c` file - `nano ./net_io.c`
3) Now we need to edit the headers sent in the HTTP responses
    - Find the function with the name `handleHTTPRequest` and the section commented `// Create the header and send the reply` (In nano you can search with `Ctrl-W`)
    - After `"Content-Length: %d\r\n"` add `"Access-Control-Allow-Origin: *\r\n"` on a new line
    - Save the file (in nano this is `Ctrl-X` and then `Y` to save)
4) Run `make` in the same directory to rebuild dump1090
5) Run `./dump1090 --net --interactive` and open or refresh the client - the issue should be resolved (if not, open an issue)

### No planes
If you don't see any planes, check the console to see if your problem reveals itself there. If not, open an issue.

### Change default location
Edit the lat/lon + zoom values passed to `setView` on the first line of `map.js`

### Change data fetch frequency
You want the `dataFetchBreakTime` variable

## Licence
See separate file (but its MIT)
