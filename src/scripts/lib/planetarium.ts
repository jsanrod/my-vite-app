import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Planetarium {

    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;

    textureLoader: THREE.TextureLoader;

    earthGeometry: THREE.SphereGeometry;
    earthMaterial: THREE.MeshBasicMaterial;
    sphereTexture: THREE.Texture;
    earth: THREE.Mesh;

    issGeometry: THREE.SphereGeometry;
    issMaterial: THREE.MeshBasicMaterial;
    iss: THREE.Mesh;

    scale: number = 1 / 1_000;
    earthRadius: number = 6_371_000 * this.scale; // radio de la Tierra en metros
    satelliteRadius: number = 50_000 * this.scale; // radio del satélite en metros, sobredimensionado

    constructor() {
        this.startAnimation = this.startAnimation.bind(this);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1_000, 1_00_000);
        this.camera.position.z = 15000;
        this.renderer = new THREE.WebGLRenderer();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.textureLoader = new THREE.TextureLoader();
        this.sphereTexture = this.textureLoader.load("./earth-texture.jpg", () => {

            // renderizar cuando se ha cargado la textura de la tierra
            this.renderer.render(this.scene, this.camera);
        });

        this.earthGeometry = new THREE.SphereGeometry(this.earthRadius, 150, 150);
        this.earthMaterial = new THREE.MeshBasicMaterial({ map: this.sphereTexture });
        this.earth = new THREE.Mesh(this.earthGeometry, this.earthMaterial)
        this.scene.add(this.earth);

        this.issGeometry = new THREE.SphereGeometry(this.satelliteRadius, 32, 32);
        this.issMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.iss = new THREE.Mesh(this.issGeometry, this.issMaterial);
        this.scene.add(this.iss);

        const lat = 40;
        const long = -75;
        const alt = 1_000_000 * this.scale;

        this.setIssPosition(lat, long, alt);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.startAnimation();
    }


    startAnimation() {
        requestAnimationFrame(this.startAnimation);

        this.controls.update();
        this.renderer.render(this.scene, this.camera)
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
}
