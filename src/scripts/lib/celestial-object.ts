import * as THREE from 'three';

export class CelestialObject {
    geometry: THREE.BufferGeometry;
    material: THREE.Material;
    mesh: THREE.Mesh;

    constructor(geometry: THREE.BufferGeometry, material: THREE.Material) {
        this.geometry = geometry;
        this.material = material;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    setPosition(x: number, y: number, z: number) {
        this.mesh.position.set(x, y, z);
    }
}