import "../styles/index.scss"
import Planetarium from "./lib/planetarium"
import { Satellite } from "./models/satellites";

// const { latitude: initialLat, longitude: initialLong } = await getIssPosition();

const planetarium = new Planetarium();

setInterval(async () => {
    const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
    const issData = await response.json() as Satellite;

    const { latitude, longitude } = issData;
    console.log(`lat: ${latitude}, long: ${longitude}`);

    // se asume una altura constante de 2 unidades en threejs
    planetarium.setIssPosition(latitude, longitude, planetarium.issAltitude);

}, 2500);


// async function getIssPosition() {
//     const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
//     const issData = await response.json() as Satellite;

//     const { latitude, longitude } = issData;

//     return { latitude, longitude }
// }

