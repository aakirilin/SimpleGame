import {
    GameObject,
    Point,
    CircleCollision,
    alwaysMove
} from "/SimpleGame/js/2DGameEngine.js";

import { resources } from "/SimpleGame/js/SpaceArkanoid/GameResources.js";
import { ExplosionBig_001 } from "/SimpleGame/js/SpaceArkanoid/Explosions.js";

export class Rocket extends GameObject {
    constructor(img, master, spavnPoint, radius, damage) {
        new GameObject
        super(
            img,
            spavnPoint.add(master.center()).add(new Point(-img.width / 2, -img.height / 2)),
            master.rotation);
        this.collider = new CircleCollision(radius, 1, false);
        this.collider.ignoreCollision.push(master);
        this.collider.afterCollision = () => {
            this.hitPoint = 0;
        };
        this.collider.onCollision = (o) => {
            o.hitPoint -= damage;
        };
        this.localVelocity = new Point(0, 5);
        this.inertness = 1;
        this.layer = -1;
    }
}

export function spavnRocket_litle_001(master, spavnPoint, timeLive, scene) {
    var rocket = new Rocket(resources.get("Rocket1"), master, spavnPoint, 3, 10);
    rocket.onDeleteMethod = () => { ExplosionBig_001(rocket.center(), scene); };
    scene.addGameObjectWithLiveTime(rocket, timeLive);
}

export function spavnRocketAmmunition(onCollision, speed) {
    var rocket = new GameObject(resources.get("RocketAmmunition"), new Point(0,0));
    rocket.collider = new CircleCollision(30, 1, false);
    rocket.onDrow = (o) => { alwaysMove(o, speed)};
    rocket.collider.onCollision = (e) => { onCollision(e); };
    rocket.collider.afterCollision = () => {
        rocket.hitPoint = 0; 
    };
    return rocket;
}