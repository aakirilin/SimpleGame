import {
    GameObject,
    Point,
    CircleCollision,
    alwaysMove
} from "./2DGameEngine.js";

import { resources } from "./GameResources.js";
import { MeteorExplosion_001 } from "./Explosions.js";


function getFuelMeteor(img, speed, scene){
    var GOMeteors1 = new GameObject(img, new Point(50, 50), 0);
    GOMeteors1.collider = new CircleCollision(20, 1, false);
    GOMeteors1.onDrow = (o) => { alwaysMove(o, speed, scene)};
    GOMeteors1.hitPoint = 1;
    GOMeteors1.collider.afterCollision = () => {
        GOMeteors1.hitPoint = 0;
    };
    GOMeteors1.collider.onCollision = (o) => {
        if(o == scene.variables.get("player")){
            scene.variables.set("fuel", scene.variables.get("fuel") + 200);
            if(scene.variables.get("fuel") > scene.variables.get("maxFuel")){
                scene.variables.set("fuel", scene.variables.get("maxFuel"));
            }
        }
    };
    return GOMeteors1;
}

function getFuelMeteor_001(speed, scene){
    return getFuelMeteor(resources.get("FuelMeteor"), speed, scene);
}

function getBigMeteor(img, speed, scene) {
    var GOMeteors1 = new GameObject(img, new Point(50, 50), 0);
    GOMeteors1.collider = new CircleCollision(100, 10, false);
    GOMeteors1.onDrow = (o) => { alwaysMove(o, speed, scene)};
    GOMeteors1.hitPoint = 30;
    GOMeteors1.collider.onCollision = (o) => {
        o.hitPoint -= 10;
    };
    GOMeteors1.onDeleteMethod = () => { 
        var currentF = scene.variables.get("fuel");
        if(currentF <= 0){ currentF = 1;}
        var random = Math.random() * scene.variables.get("maxFuel") / currentF;
        if(random > 0.5){
            var f = getFuelMeteor_001(speed, scene);
            f.pos = GOMeteors1.center().add(new Point(-f.inmage.width / 2, -f.inmage.height / 2));
            scene.addGameObject(f);
        }
        MeteorExplosion_001(GOMeteors1.center(), scene); 
    };
    return GOMeteors1;
}


function getSmallMeteor(img, speed, scene) {
    var GOMeteors1 = new GameObject(img, new Point(50, 50), 0);
    GOMeteors1.collider = new CircleCollision(55, 10, false);
    GOMeteors1.onDrow = (o) => { alwaysMove(o, speed, scene)};
    GOMeteors1.hitPoint = 10;
    GOMeteors1.collider.onCollision = (o) => {
        o.hitPoint -= 5;
    };
    GOMeteors1.onDeleteMethod = () => { 
        MeteorExplosion_001(GOMeteors1.center(), scene); 
    };
    return GOMeteors1;
}


export function getBigMeteor_001(speed, scene) {
    return getBigMeteor(resources.get("Meteors1"), speed, scene);
}

export function getBigMeteor_002(speed, scene) {
    return getBigMeteor(resources.get("Meteors2"), speed, scene);
}

export function getBigMeteor_003(speed, scene) {
    return getBigMeteor(resources.get("Meteors3"), speed, scene);
}

export function getBigMeteor_004(speed, scene) {
    return getBigMeteor(resources.get("Meteors4"), speed, scene);
}

export function getSmallMeteor_001(speed, scene) {
    return getSmallMeteor(resources.get("Meteors5"), speed, scene);
}
export function getSmallMeteor_002(speed, scene) {
    return getSmallMeteor(resources.get("Meteors6"), speed, scene);
}