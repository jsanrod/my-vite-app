// import "./components/header"

// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import "../styles/index.scss"
import Planetarium from "./lib/planetarium"
import { Satellite } from "./models/satellites";

const planetarium = new Planetarium();

setInterval(async () => {
    const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
    const issData = await response.json() as Satellite;

    const { latitude, longitude, altitude } = issData;
    console.log(latitude, longitude, altitude);

    planetarium.setIssPosition(latitude * 10, longitude * 10, altitude);

}, 1000)


