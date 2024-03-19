import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Earth } from './earth';
import { Iss } from './iss';
import { Lights } from './lights';

export default class Planetarium {

    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;

    textureLoader: THREE.TextureLoader;

    earth: Earth;
    iss: Iss;

    lights: Lights;

    constructor() {
        this.startAnimation = this.startAnimation.bind(this);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 20;
        this.renderer = new THREE.WebGLRenderer();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
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


        this.lights = new Lights();

        this.scene.add(this.lights.dayLight, this.lights.nightLight);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.startAnimation();

        setInterval(async () => {     
            const { latitude, longitude } = await this.iss.getIssPosition();
            console.log(`lat: ${latitude}, long: ${longitude}`);
        
            // se asume una altura constante de 2 unidades en threejs
            this.iss.setPositionFromCoords(latitude, longitude, this.iss.altitude);
        }, 2500);
    }

    startAnimation() {
        requestAnimationFrame(this.startAnimation);

        // rotar las luces respecto al eje Y de la tierra
        this.lights.rotate();

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }


}
