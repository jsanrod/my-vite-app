import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Satellite } from '../models/satellites';

export default class Planetarium {

    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;

    ambientalLight: THREE.AmbientLight;

    textureLoader: THREE.TextureLoader;

    earthGeometry: THREE.SphereGeometry;
    earthMaterial: THREE.MeshStandardMaterial;
    earthTexture: THREE.Texture;
    earth: THREE.Mesh;

    issGeometry: THREE.SphereGeometry;
    issMaterial: THREE.MeshStandardMaterial;
    iss: THREE.Mesh;

    earthRadius: number = 8; // radio de la Tierra en metros
    issRadius: number = 0.25; // radio del satélite en metros, sobredimensionado

    issAltitude: number = 2;

    dayLight: THREE.DirectionalLight;
    nightLight: THREE.DirectionalLight;

    angle: number = 0;

    constructor(initialLat: number = -2.791, initialLong: number = 101.568) {
        this.startAnimation = this.startAnimation.bind(this);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(120, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 20;
        this.renderer = new THREE.WebGLRenderer();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.ambientalLight = new THREE.AmbientLight(0xffffff);
        // this.scene.add(this.ambientalLight);


        // The X axis is red. The Y axis is green. The Z axis is blue. (https://threejs.org/docs/?q=axes%20helper#api/en/helpers/AxesHelper)
        // const axesHelper = new THREE.AxesHelper(100);
        // this.scene.add(axesHelper);

        this.textureLoader = new THREE.TextureLoader();
        this.earthTexture = this.textureLoader.load("./earth-texture.jpg");

        this.earthGeometry = new THREE.SphereGeometry(this.earthRadius, 150, 150);
        this.earthMaterial = new THREE.MeshStandardMaterial({ map: this.earthTexture });
        this.earth = new THREE.Mesh(this.earthGeometry, this.earthMaterial)
        this.scene.add(this.earth);

        this.issGeometry = new THREE.SphereGeometry(this.issRadius, 32, 32);
        this.issMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        this.iss = new THREE.Mesh(this.issGeometry, this.issMaterial);
        this.scene.add(this.iss);

        this.setIssPosition(initialLat, initialLong, this.issAltitude);

        this.dayLight = new THREE.DirectionalLight(0xffffff, 1);
        this.dayLight.position.set(12, 0, 12);
        this.dayLight.target = this.earth;

        this.nightLight = new THREE.DirectionalLight(0xffffff, 0.1);
        this.nightLight.position.set(-12, 0, -12);

        this.scene.add(this.dayLight, this.nightLight);

        // const helper1 = new THREE.DirectionalLightHelper(this.dayLight, 2);
        // const helper2 = new THREE.DirectionalLightHelper(this.nightLight, 2);
        // this.scene.add(helper1, helper2);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.startAnimation();
    }

    startAnimation() {
        requestAnimationFrame(this.startAnimation);

        // rotar las luces respecto al eje Y de la tierra
        this.dayLight.position.x = 12 * Math.sin(Date.now() / 10_000);
        this.dayLight.position.z = 12 * Math.cos(Date.now() / 10_000);

        this.nightLight.position.x = -12 * Math.sin(Date.now() / 10_000);
        this.nightLight.position.z = -12 * Math.cos(Date.now() / 10_000);

        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }

    setIssPosition(lat: number, long: number, alt: number) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (long + 180) * (Math.PI / 180);
        const radius = this.earthRadius + alt; // radio desde el centro de la tierra hasta iss

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        this.iss.position.set(x, y, z);
    }

    async getIssPosition() {
        const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
        const issData = await response.json() as Satellite;

        const { latitude, longitude } = issData;

        return { latitude, longitude }
    }
}
