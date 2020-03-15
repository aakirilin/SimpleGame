import {
    GameObject,
    Point,
    CircleCollision,
    alwaysMove
} from "./2DGameEngine.js";

import { resources } from "./GameResources.js";
import { ExplosionBig_001 } from "./Explosions.js";

export class Rocket extends GameObject {
    constructor(img, master, spavnPoint, radius, damage) {
        var pos = null;
        var r = 0;
        if(master == null){
            pos = spavnPoint;
        }
        else{
            pos = spavnPoint.add(master.center()).add(new Point(-img.width / 2, -img.height / 2));
            r = master.rotation;
        }
        //new GameObject
        super(
            img,
            pos,
            r);
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

export function spavnEnemyRocket_litle_001(rotation, scene, speedY) {
    var rocket = new Rocket(resources.get("Rocket2"), null, new Point(0, 0), 7, 50);
    rocket.rotation = rotation;
    rocket.velocity = new Point(0, speedY);
    rocket.onDeleteMethod = () => { ExplosionBig_001(rocket.center(), scene); };
    //scene.addGameObjectWithLiveTime(rocket, timeLive);
    return rocket;
}

export function spavnRocket_litle_001(master, spavnPoint, timeLive, scene) {
    var rocket = new Rocket(resources.get("Rocket1"), master, spavnPoint, 5, 10);
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

export function getMine(speed, scene, player) {
    var Mine = new GameObject(resources.get("Mine1"), new Point(0, 0), 0);
    Mine.collider = new CircleCollision(50, 5, false);
    Mine.onDrow = (o) => { 
        alwaysMove(o, speed, scene)
        var d = player.center().distance(o.center());
        if( d < 300){
            var vel = o.pos.sub(player.pos).mulReal(0.005);
            o.velocity = o.velocity.sub(vel);
        }
    };
    Mine.hitPoint = 1;
    Mine.collider.onCollision = (o) => {
        o.hitPoint -= 100;
    };
    Mine.onDeleteMethod = () => { ExplosionBig_001(Mine.center(), scene); };
    return Mine;
}
