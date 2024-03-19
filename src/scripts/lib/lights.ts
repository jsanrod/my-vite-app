import * as THREE from 'three';

export class Lights {

    dayLight: THREE.DirectionalLight;
    nightLight: THREE.DirectionalLight;

    constructor() {
        this.dayLight = new THREE.DirectionalLight(0xffffff, 1);
        this.dayLight.position.set(12, 0, 12);

        this.nightLight = new THREE.DirectionalLight(0xffffff, 0.1);
        this.nightLight.position.set(-12, 0, -12);

        // const dayLightHelper = new THREE.DirectionalLightHelper(this.dayLight, 2);
        // const nightLightHelper = new THREE.DirectionalLightHelper(this.nightLight, 2);
    }

    rotate() {
        this.dayLight.position.x = 12 * Math.sin(Date.now() / 10_000); // 12: distancia rot. 10_000: veloc. rot.
        this.dayLight.position.z = 12 * Math.cos(Date.now() / 10_000);

        this.nightLight.position.x = -12 * Math.sin(Date.now() / 10_000);
        this.nightLight.position.z = -12 * Math.cos(Date.now() / 10_000);
    }
}