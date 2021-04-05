let infoDiv = document.getElementById("infoDiv");

let planeToText = (plane) => {
    const flight = plane.flight.trim();
    let flightLink = `<a href='https://uk.flightaware.com/live/flight/${flight}' target="_blank">${flight}</a>`;
    if(flight === "") flightLink = "No name";
    const validString = plane.validposition ? "valid" : "invalid";
    const positionString = plane.validposition ? `(${plane.lat},${plane.lon}@${plane.altitude})` : `(?,?@${plane.altitude})`;
    const timeString = `Seen ${plane.seen}s ago`
    return `${flightLink},(${plane.hex}): ${validString} - ${positionString}. ${timeString}`
};

let planesToText = (planes) => {
    const values = Object.values(planes);
    if(values.length == 0) return "None tracked";
    let text = "";
    values.forEach(plane => {
        text += planeToText(plane);
        text += "<br>\n";
    });
    return text;
}

let planeUpdate = (planes) => {
    infoDiv.innerHTML = planesToText(planes);
};

window.planeAnnouncements.push(planeUpdate);