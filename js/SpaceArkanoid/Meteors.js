import {
    GameObject,
    Point,
    CircleCollision,
    alwaysMove
} from "/js/2DGameEngine.js";

import { resources } from "/js/SpaceArkanoid/GameResources.js";
import { ExplosionBig_001 } from "/js/SpaceArkanoid/Explosions.js";


function getBigMeteor(img) {
    var GOMeteors1 = new GameObject(img, new Point(50, 50), 0);
    GOMeteors1.collider = new CircleCollision(100, 10, false);
    GOMeteors1.onDrow = alwaysMove;
    GOMeteors1.hitPoint = 100;
    GOMeteors1.collider.onCollision = (o) => {
        o.hitPoint -= 10;
    };
    return GOMeteors1;
}


function getSmallMeteor(img) {
    var GOMeteors1 = new GameObject(img, new Point(50, 50), 0);
    GOMeteors1.collider = new CircleCollision(55, 10, false);
    GOMeteors1.onDrow = alwaysMove;
    GOMeteors1.hitPoint = 30;
    GOMeteors1.collider.onCollision = (o) => {
        o.hitPoint -= 5;
    };
    return GOMeteors1;
}


export function getBigMeteor_001() {
    return getBigMeteor(resources.get("Meteors1"));
}

export function getBigMeteor_002() {
    return getBigMeteor(resources.get("Meteors2"));
}

export function getBigMeteor_003() {
    return getBigMeteor(resources.get("Meteors3"));
}

export function getBigMeteor_004() {
    return getBigMeteor(resources.get("Meteors4"));
}

export function getSmallMeteor_001() {
    return getSmallMeteor(resources.get("Meteors5"));
}
export function getSmallMeteor_002() {
    return getSmallMeteor(resources.get("Meteors6"));
}