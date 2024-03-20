import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Earth } from './earth';
import { Iss } from './iss';
import { Lights } from './lights';

export default class Planetarium {

    sceneContainer: HTMLElement;

    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;

    textureLoader: THREE.TextureLoader;

    earth: Earth;
    iss: Iss;

    lights: Lights;

    latitudeValueElement: HTMLElement;
    longitudeValueElement: HTMLElement;
    altitudeValueElement: HTMLElement;

    constructor() {
        this.animate = this.animate.bind(this);
        this.update = this.update.bind(this);

        this.latitudeValueElement = document.querySelector<HTMLElement>(".location-data > #latitude > span")!;
        this.longitudeValueElement = document.querySelector<HTMLElement>(".location-data > #longitude > span")!;
        this.altitudeValueElement = document.querySelector<HTMLElement>(".location-data > #altitude > span")!;

        this.sceneContainer = document.querySelector<HTMLElement>(".planetarium-mask")!;
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 20;
        this.renderer = new THREE.WebGLRenderer();

        // añadir los controles a la máscara para permitir tener html por encima del canvas y no perder controles
        this.controls = new OrbitControls(this.camera, this.sceneContainer); 
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        // The X axis is red. The Y axis is green. The Z axis is blue. (https://threejs.org/docs/?q=axes%20helper#api/en/helpers/AxesHelper)
        // const axesHelper = new THREE.AxesHelper(100);
        // this.scene.add(axesHelper);

        this.textureLoader = new THREE.TextureLoader();

        this.earth = new Earth(this.textureLoader);
        this.scene.add(this.earth.mesh);

        this.iss = new Iss();
        this.iss.setPositionFromCoords(this.iss.initialLat, this.iss.initialLong, this.iss.altitude);
        this.scene.add(this.iss.mesh);

        // establecer valores de lat y long en el DOM
        this.latitudeValueElement.textContent = this.iss.initialLat.toString();
        this.longitudeValueElement.textContent = this.iss.initialLong.toString();

        this.lights = new Lights();
        this.scene.add(this.lights.dayLight, this.lights.nightLight);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.sceneContainer.appendChild(this.renderer.domElement);

        this.animate();

        setInterval(this.update, 2500);
    }

    animate() {
        this.lights.rotate();
        this.controls.update();

        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.animate);
    }

    async update() {
        const { latitude, longitude, altitude } = await this.iss.getIssPosition();
            // console.log(`lat: ${latitude}, long: ${longitude}`);
        this.iss.setPositionFromCoords(latitude, longitude, this.iss.altitude);

        // actualziar valores del dom
        this.latitudeValueElement.textContent = latitude.toFixed(5).toString();
        this.longitudeValueElement.textContent = longitude.toFixed(5).toString();
        this.altitudeValueElement.textContent = altitude.toFixed(5).toString();
    }

}
