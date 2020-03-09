import {
    GameObject,
    Point,
    CircleCollision
} from "/SimpleGame/js/2DGameEngine.js";

import { resources } from "/SimpleGame/js/SpaceArkanoid/GameResources.js";

export function ExplosionBig_001(pos, scene) {
    var e = new GameObject(resources.get("SBigExplosion"), pos, 0);
    e.pos = pos.sub(new Point(e.inmage.width / 2, e.inmage.height / 2));
    scene.addGameObjectWithLiveTime(e, 300);
}

export function MeteorExplosion_001(pos, scene) {
    var e = new GameObject(resources.get("SMeteorExplosion"), pos, 0);
    e.pos = pos.sub(new Point(e.inmage.width / 2, e.inmage.height / 2));
    scene.addGameObjectWithLiveTime(e, 500);
}
