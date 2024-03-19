import "../styles/index.scss"
import Planetarium from "./lib/planetarium"
import { Satellite } from "./models/satellites";

const planetarium = new Planetarium();

setInterval(async () => {
    const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
    const issData = await response.json() as Satellite;

    const { latitude, longitude } = issData;
    console.log(`lat: ${latitude}, long: ${longitude}`);

    // se asume una altura constante de 2 unidades en threejs
    planetarium.iss.setIssPosition(latitude, longitude, planetarium.iss.altitude);

}, 2500);