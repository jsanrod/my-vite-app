export default class Satellites {
    
    public entries: Satellite[] = [];

    constructor() {}
    
    public async get() {
        const response = await fetch("https://api.wheretheiss.at/v1/satellites");
        const entries = await response.json() as Satellite[];
        
        this.entries = entries;
    }
}

type Satellite = {
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    altitude: number;
    timestamp: number;
    units: string;
}