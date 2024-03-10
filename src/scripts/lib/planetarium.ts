import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default class Planetarium {

    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;

    textureLoader: THREE.TextureLoader;

    sphereGeometry: THREE.SphereGeometry;
    sphereMaterial: THREE.MeshBasicMaterial;
    sphereTexture: THREE.Texture;
    sphere: THREE.Mesh;

    satelliteGeometry: THREE.SphereGeometry;
    satelliteMaterial: THREE.MeshBasicMaterial;
    satellite: THREE.Mesh;

    scale: number = 1 / 1000
    earthRadius: number = 6371000 * this.scale; // Radio de la Tierra en metros
    satelliteRadius: number = 50000 * this.scale; // Radio del satélite en metros

    earthSatelliteDistance: number = 700000 * this.scale;

    constructor() {
        this.setControlAnimation = this.setControlAnimation.bind(this);

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1000, 100000);
        this.camera.position.z = 15000;
        this.renderer = new THREE.WebGLRenderer();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;

        this.textureLoader = new THREE.TextureLoader();
        this.sphereTexture = this.textureLoader.load("./earth-texture.jpg", () => {
            this.renderer.render(this.scene, this.camera);
        });

        this.sphereGeometry = new THREE.SphereGeometry(this.earthRadius, 150, 150);
        this.sphereMaterial = new THREE.MeshBasicMaterial({ map: this.sphereTexture });
        this.sphere = new THREE.Mesh(this.sphereGeometry, this.sphereMaterial)

        this.scene.add(this.sphere);

        // Creamos el modelo del satélite
        this.satelliteGeometry = new THREE.SphereGeometry(this.satelliteRadius, 32, 32);
        this.satelliteMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
        this.satellite = new THREE.Mesh(this.satelliteGeometry, this.satelliteMaterial);
        this.scene.add(this.satellite);

        // Posición del satélite (latitud, longitud, altitud)
        const lat = 40; // Ejemplo de latitud
        const lon = -75; // Ejemplo de longitud
        const alt = this.earthSatelliteDistance; // Ejemplo de altitud

        // Convertimos las coordenadas a cartesianas
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const radius = this.earthRadius + alt; // Sumamos la altitud a la distancia del centro de la Tierra

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);


        // Trasladamos el satélite a las coordenadas calculadas
        this.satellite.position.set(x, y, z);

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);

        this.setControlAnimation();
    }

    setControlAnimation() {
        requestAnimationFrame(this.setControlAnimation);
        this.controls.update();
        this.renderer.render(this.scene, this.camera)
    }
}
