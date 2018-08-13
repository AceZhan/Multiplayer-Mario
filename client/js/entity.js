import {Vector} from './math.js';

export default class Entity {
	constructor() {
		this.pos = new Vector(0, 0);
		this.vel = new Vector(0, 0);
	}
}