// Leaflet map setup
var planeMap = L.map('planeMap').setView([50.27, -3.70], 8);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(planeMap);
var markers = L.layerGroup().addTo(planeMap);

// Heatmap setup
var heat = L.heatLayer([]).addTo(planeMap);
// On/off toggle for heatmap
var heatMapActive = true;

// Time between data fetches in seconds
let dataFetchBreakTime = 1;
// How long to wait until we remove planes from the map (seconds)
let planeTimeout = 60;
// In-mem plane storage
let activePlanes = {};

/**
 * Fetch new data from the server
 * @param {Function} cb Called with state change and XMLHttpRequest
 */
let getNewData = (cb) => {
    const Http = new XMLHttpRequest();
    const url='http://192.168.0.38:8080/dump1090/data.json'; // dump1090 server
    Http.open("GET", url);
    Http.send();
    Http.onreadystatechange=(res) => {
        cb(res, Http)
    };
}

/**
 * Takes server-returned plane object and converts to HTML info text
 * @param {*} plane 
 */
let planeToInfoPanel = (plane) => {
    if (plane.seen > planeTimeout - 10) return 'Lost'; // 10 seconds before removal, flag as being lost
    let infoPanel = '{' + plane.lat.toFixed(4) + ',' + plane.lon.toFixed(4) + '}<br>';
    if(plane.altitude){
        infoPanel += ' Alt: ' + plane.altitude + 'ft<br>';
    }
    if(plane.validtrack) {
        infoPanel += ' Hdg: ' + plane.track + '°<br>';
    }
    if(plane.speed) {
        infoPanel += ' Spd: ' + plane.speed + 'kts<br>';
    }
    infoPanel += 'Last seen ' + plane.seen + 's ago';
    if(plane.flight) {
        infoPanel += '<br>'
        infoPanel += plane.flight.trim();
        infoPanel += ': <a href="https://uk.flightaware.com/live/flight/' + plane.flight.trim() + '" target="_blank">FlightAware</a>';
    }
    return infoPanel;
}

/**
 * Call this once to trigger the map continuous update
 */
let updateMap = () => {
    /**
     * Remove and re-add plane markers and info
     * @param {*} activePlanes Our plane repository
     */
    let drawMarkers = (activePlanes) => {
        // clear map markers
        markers.clearLayers();
        Object.values(activePlanes).forEach(plane => {
            if(plane.new) {
                console.log('New plane!', plane.hex, plane.flight, plane.validposition ? 'with position' : 'no position', plane.firstSeen);
            }
            if(plane.validposition) {       
                let newMarker = new L.Marker([plane.lat, plane.lon], {
                    icon: new L.DivIcon({
                        className: 'infoPanel',
                        html: '<img style="transform: rotate(' + plane.track + 'deg)" src="./media/plane_black.png"/>' +
                              '<div class="infoText">' + planeToInfoPanel(plane) + '</div>'
                    })
                });
                markers.addLayer(newMarker).addTo(planeMap);

                updateHeatmapLayer(plane);
            }
        });
    };
    /**
     * Update the heatmap with the location of a plane
     * Assumes valid coordinates
     * Ignores if plane has not been seen in 
     * @param {*} plane 
     */
    let updateHeatmapLayer = (plane) => {
        // Add heatmap markers for recent positions
        if(heatMapActive && plane.seen < dataFetchBreakTime + 1) {
            heat.addLatLng([plane.lat, plane.lon]);
        }
    }
    /**
     * Used as callback for getNewData
     * Updates our in-mem plane repository including removing old planes
     * @param {*} res 
     * @param {*} http 
     */
    let updatePlanes = (res, http) => {
        if(!http.responseText) return;
        let newPlanes = JSON.parse(http.responseText);
        // Add/update with returned planes
        newPlanes.forEach(newPlane => {
            if(!activePlanes[newPlane.hex]) {
                newPlane.new = true;
                newPlane.firstSeen = Date.now();
            } else {
                newPlane.new = false;
                let storedPlane = activePlanes[newPlane.hex];
                newPlane.firstSeen = storedPlane.firstSeen;
                if(!newPlane.validposition) {
                    newPlane.lat = storedPlane.lat;
                    newPlane.lon = storedPlane.lon;
                    newPlane.validposition = storedPlane.validposition;
                }
                if(!newPlane.validtrack) {
                    newPlane.track = storedPlane.track;
                    newPlane.validtrack = newPlane.validtrack;
                }
                if(!newPlane.altitude) {
                    newPlane.altitude = storedPlane.altitude;
                }
                if(!newPlane.flight) {
                    newPlane.flight = storedPlane.flight;
                }
                if(!newPlane.speed) {
                    newPlane.speed = storedPlane.speed;
                }
            }
            // Add or override
            activePlanes[newPlane.hex] = newPlane;
        });
        // Remove out of date planes
        Object.values(newPlanes).forEach((plane, index) => {
            if(plane.seen > planeTimeout){
                delete activePlanes[plane.hex];
            }
        });
        drawMarkers(activePlanes);
    };

    getNewData(updatePlanes);
    setInterval(getNewData.bind(this, updatePlanes), dataFetchBreakTime * 1000);
};

updateMap();