import * as THREE from 'three';
import { CelestialObject } from './celestial-object';
import { Satellite } from '../models/satellites';

export class Iss extends CelestialObject {

    issRadius: number = 0.25;
    altitude: number = 2;

    earthRadius: number = 8;

    initialLat: number = -2.791;
    initialLong: number = 101.568;

    constructor() {
        const issGeometry = new THREE.SphereGeometry(0.25, 32, 32);
        const issMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        super(issGeometry, issMaterial);
    }

    setPositionFromCoords(lat: number, long: number, alt: number) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (long + 180) * (Math.PI / 180);
        const radius = this.earthRadius + alt; // radio desde el centro de la tierra hasta iss

        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const y = radius * Math.cos(phi);
        const z = radius * Math.sin(phi) * Math.sin(theta);

        this.setPosition(x, y, z);
    }

    async getIssPosition() {
        const response = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
        const issData = await response.json() as Satellite;

        const { latitude, longitude, altitude } = issData;

        return { latitude, longitude, altitude }
    }
}