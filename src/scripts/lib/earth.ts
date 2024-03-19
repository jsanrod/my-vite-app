import * as THREE from 'three';
import { CelestialObject } from './celestial-object';

export class Earth extends CelestialObject {

    earthRadius: number = 8;

    constructor(textureLoader: THREE.TextureLoader) {

        const texture = textureLoader.load("./earth-texture.jpg")
        const earthGeometry = new THREE.SphereGeometry(8, 150, 150);
        const earthMaterial = new THREE.MeshStandardMaterial({ map: texture });

        super(earthGeometry, earthMaterial);
    }
}