export const keyUp = 38;
export const keyDown = 40;
export const keyLeft = 37;
export const keyRigth = 39;

export const keyA = 65;
export const keyD = 68;

export const onlu = "onlu";
export const alwes = "alwes";

export const isMobile = {
    Android: function () {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function () {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function () {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function () {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function () {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function () {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

export class KeyEvent {
    constructor(keyCode, action, onState = alwes) {
        this.keyCode = keyCode;
        this.action = action;
        this.isPress = false;
        this.onState = onState;
    }
    onKeyDown(keyCode) {
        if (keyCode == this.keyCode) {
            this.isPress = true;
        }
    }
    onKeyUp(keyCode) {
        if (keyCode == this.keyCode) {
            this.isPress = false;
        }
    }
    exeAction() {
        if (this.isPress) {
            this.action();
            if (this.onState == onlu) {
                this.isPress = false;
            }
        }
    }
}

export class KeyEvents {
    constructor() {
        this.keyEvent = [];
    }
    addKeyEvent(keyEvent) {
        this.keyEvent.push(keyEvent);
    }
    onKeyDown(keyCode) {
        this.keyEvent.forEach((ke) => { ke.onKeyDown(keyCode); });
    }
    onKeyUp(keyCode) {
        this.keyEvent.forEach((ke) => { ke.onKeyUp(keyCode); });
    }
    exeAction() {
        this.keyEvent.forEach((ke) => { ke.exeAction(); });
    }
}

export class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distance(target) {
        return Math.sqrt(
            (Math.pow(this.x - target.x, 2) +
                Math.pow(this.y - target.y, 2)), 2);
    }
    add(point) {
        return new Point(this.x + point.x, this.y + point.y);
    }
    sub(point) {
        return new Point(this.x - point.x, this.y - point.y);
    }
    mul(point) {
        return new Point(this.x * point.x - this.y * point.y, this.x * point.y + this.y * point.x);
    }
    mulReal(real) {
        return new Point(this.x * real, this.y * real);
    }

    equal(othet) {
        if (othet == null) {
            return false;
        }
        return this.x == othet.x && this.y == othet.y;
    }
    noEqual(othet) {
        if (othet == null) {
            return true;
        }
        return this.x != othet.x || this.y != othet.y;
    }
    rotation(angle, center) {
        if (this.x == center.x) {
            var a = this.y > center.y ? Math.PI / 2 : Math.PI / 2 * 3;
        }
        else {
            var a = Math.atan((this.y - center.y) / (this.x - center.x));
            if (this.x < center.x) {
                a += Math.PI;
            }
        }
        a += angle * Math.PI / 180;
        var l = this.distance(center);
        return new Point(
            center.x + (Math.cos(a) * l),
            center.y + (Math.sin(a) * l));
    }
}

export class Collision {
    constructor(mass, noMove) {
        this.mass = mass;
        this.noMove = noMove;
        this.onCollision = null;
        this.afterCollision = null;
        this._isCollision = false;
        this.ignoreCollision = [];
    }
    onPhysics(gravity, rigidBodys, o) {
        var g = new Point(0, 0);
        rigidBodys.filter((r) => { return o.collider.ignoreCollision.includes(r) == false; })
            .forEach((r) => {
                var p = r.collider.nearestPoint(r.center(), o.center());
                var eject = this.ejection(o.center(), p);
                if (this.onCollision != null && eject.noEqual(new Point(0, 0))) {
                    o.collider.onCollision(r);
                }
                g = g.add(eject.mulReal(r.collider.mass / o.collider.mass));
            });
        if (g.noEqual(new Point(0, 0))) {
            o.collider._isCollision = true;
        }
        return new Point(o.velocity.x + g.x, gravity + o.velocity.y + g.y);
    }

}

export class CircleCollision extends Collision {
    constructor(radius, mass, noMove) {
        super(mass, noMove);
        this.radius = radius;
    }

    drow(canvas, center) {
        canvas.moveTo(center.x, center.y);
        canvas.arc(center.x, center.y, this.radius, 0, Math.PI * 2, true);
    }

    touch(center, target) {
        return center.distance(target);
    }

    nearestPoint(center, target) {
        if (target.y == center.y) {
            var a = target.x < center.x ? 0 : Math.PI;
        }
        else if (target.x == center.x) {
            var a = target.y < center.y ? Math.PI / 2 : Math.PI / 2 * 3;
        }
        else {
            var a = Math.atan((center.y - target.y) / (center.x - target.x));
            if (center.x > target.x) {
                a += Math.PI;
            }
        }
        return new Point(
            center.x + (Math.cos(a) * this.radius),
            center.y + (Math.sin(a) * this.radius));
    }

    ejection(center, target) {
        var distance = center.distance(target);
        if (distance > this.radius) {
            return new Point(0, 0);
        }
        return new Point((center.x - target.x) / distance, (center.y - target.y) / distance);
    }
}

export class GameObject {
    constructor(inmage = new Image(), pos = new Point(0, 0), rotation = 0) {
        this.inmage = inmage;
        this.rotation = rotation;
        this.pos = pos;
        this.velocity = new Point(0, 0);
        this.localVelocity = new Point(0, 0);
        this.inertness = 0.8;
        this.collider = null;
        this.childs = [];
        this.methods = new Map();
        this.onDeleteMethod = null;
        this.hitPoint = Infinity;
        this.onDrow = null;
        this.layer = 0;
    }

    onDelete() {
        if (this.onDeleteMethod != null) {
            this.onDeleteMethod();
        }
    }
    loadFromUrlImage(url, startPos, rotation = 0) {
        this.inmage.src = url;
        this.pos = startPos;
        this.rotation = rotation;
    }
    move() {
        var vel = this.velocity.add(this.localVelocity.rotation(this.rotation + 180, new Point(0, 0)));
        this.pos = this.pos.add(vel);
        this.velocity.x *= this.inertness;
        this.velocity.y *= this.inertness;
        this.localVelocity.x *= this.inertness;
        this.localVelocity.y *= this.inertness;
    }

    drow(_canvas) {
        if (this.hitPoint <= 0) {
            this.onDelete();
            return;
        }
        if (this.onDrow != null) {
            this.onDrow(this);
        }
        if (this.rotation != 0) {
            var c = this.center();
            _canvas.save();
            _canvas.translate(c.x, c.y);
            _canvas.rotate(Math.PI * this.rotation / 180);
            _canvas.drawImage(this.inmage.nextFrame(), -(this.inmage.width / 2), -(this.inmage.height / 2));
            _canvas.restore();
        }
        else {
            _canvas.drawImage(this.inmage.nextFrame(), this.pos.x, this.pos.y);
        }
        this._drowChilds(_canvas);
    }
    center() {
        return new Point(
            this.inmage.width / 2 + this.pos.x,
            this.inmage.height / 2 + this.pos.y);
    }
    _drowChilds(_canvas) {
        var masterCenter = this.center();
        this.childs.forEach((c) => {
            if (this.rotation != 0 || c.rotation != 0) {
                var chaildCenter = c.center().add(masterCenter).rotation(this.rotation, masterCenter);
                _canvas.save();
                _canvas.translate(chaildCenter.x, chaildCenter.y);
                _canvas.rotate(Math.PI * (c.rotation + this.rotation) / 180);
                _canvas.drawImage(c.inmage.nextFrame(), -(c.inmage.width / 2), -(c.inmage.height / 2));
                _canvas.restore();
            }
            else {
                _canvas.drawImage(c.inmage.nextFrame(), c.pos.x + masterCenter.x, c.pos.y + masterCenter.y);
            }
        });
    }
    execute(name, arg) {
        if (this.methods.has(name)) {
            this.methods.get(name)(this, arg);
        }
    }
}


export class Scene {
    constructor(_canvas) {
        this.canvas = _canvas;
        this.gameObjects = [];
        this.rigidBodys = [];
        this.gravity = 0.0;
        this.debug = false;
        this.time = new Date();
        this.timers = new Timers();
    }
    onPhysics() {
        var moveble = this.rigidBodys.filter((o) => { return !o.collider.noMove; });
        moveble.forEach((o) => {
            o.velocity = o.collider.onPhysics(this.gravity, this.rigidBodys.filter((r) => { return r != o && r.collider.ignoreCollision.includes(o) == false; }), o);
        });
        moveble.forEach((o) => {
            o.move();
        });
        this.rigidBodys
            .filter((o) => { return o.collider._isCollision && o.collider.afterCollision != null; })
            .forEach((o) => {
                o.collider._isCollision = false;
                o.collider.afterCollision();
            });
    }

    drowLayer(i) {
        this.gameObjects
            .filter((o) => { return o.layer == i; })
            .forEach((o) => {
                o.drow(this.canvas);
            });
    }

    drow() {
        this.gameObjects
            .filter((o) => { return o.hitPoint <= 0;})
            .forEach((o) => {
                this.removeGameObject(o);
        });
        this.drowLayer(-1);
        this.drowLayer(0);
        if (this.debug) {
            this.canvas.beginPath();
            this.rigidBodys.forEach((o) => { o.collider.drow(this.canvas, o.center()); });
            this.canvas.stroke();
            var t = new Date();
            this.canvas.font = "48px serif";
            this.canvas.fillStyle = "#ffffff";
            this.canvas.fillText(Math.round(1000 / (t - this.time)), canvas.width / 2, canvas.height / 2);
            this.time = t;
        }
    }
    addGameObject(go) {
        this.gameObjects.push(go);
        if (go.collider != null) {
            this.rigidBodys.push(go);
        }
    }
    addGameObjectWithLiveTime(go, liveTime) {
        this.addGameObject(go);
        var t = new Timer(liveTime, () => { this.removeGameObject(go); });
        this.timers.add(t);
    }
    removeGameObject(go) {
        var indexGo = this.gameObjects.indexOf(go);
        if (indexGo >= 0) {
            this.gameObjects.splice(indexGo, 1);
        }
        var indexRb = this.rigidBodys.indexOf(go);
        if (indexRb >= 0) {
            this.rigidBodys.splice(indexRb, 1);
        }
        if (indexGo >= 0 || indexRb >= 0) {
            go.onDelete();
        }
    }
    tick() {
        this.timers.tick();
    }
    drowText(text, color, pos){
        this.canvas.textAlign = "center";
        this.canvas.fillStyle = color;
        this.canvas.font = "48px serif";
        this.canvas.fillText(text, pos.x, pos.y);
    }
}

export class Resources {
    constructor() {
        this.imgs = new Map();
        this.countLoads = 0;
        this.Err = false;
        this.onDone = null;
    }

    isDone() {
        return this.imgs.size == this.countLoads;
    }

    add(name, src) {
        var image = new SingleImage(src);
        this.imgs.set(name, image);
        image.onload = () => {
            this.countLoads += 1;
            if (this.isDone() && this.onDone != null) {
                this.onDone();
            }
        };
    }

    addSequence(name, imgs, delay){
        var images = new ImageSequence(imgs, delay);
        this.imgs.set(name, images);
        images.onload = () => {
            this.countLoads += 1;
            if (this.isDone() && this.onDone != null) {
                this.onDone();
            }
        };
    }

    get(name) {
        if (this.imgs.has(name)) {
            return this.imgs.get(name);
        }
        return null;
    }
}

export class SingleImage{
    constructor(src){
        this.image = new Image();
        this.width = 0;
        this.height = 0;
        this.onload = null;
        this.image.src = src;
        this.image.onload = ()=>{
            if(this.onload != null){
                this.onload();
            }
            this.width = this.image.width;
            this.height = this.image.height;
        };
    }
    nextFrame(){
        return this.image;
    }
}

export class ImageSequence{
    constructor(imgs, delay){
        this.images = [];
        this.currentImg = 0;
        this.onload = null;
        this.countLoad = 0;
        this.delay = delay;
        this.timer = 0;
        this.width = 0;
        this.height = 0;
        imgs.forEach((e) =>{
            var image = new Image();
            image.src = e;
            this.images.push(image);
            image.onload = ()=>{
                this.countLoad += 1;
                this.afterLoadAll();
                this.width = image.width;
                this.height = image.height;
            };
        });
    }
    afterLoadAll(){
        if(this.images.length == this.countLoad && this.onload != null){
            this.onload();
        }
    }
    nextFrame(){
        if(this.timer >= this.delay){
            this.timer = 0;
            if(this.currentImg < this.images.length -1){
                this.currentImg += 1;
            }
            else{
                this.currentImg = 0;
            }
        }
        else{
            this.timer +=1;
        }
        return this.images[this.currentImg];
    }
}

export function randomInteger(min, max) {
    // случайное число от min до (max+1)
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

export class SpavnArea {
    constructor(scene, begin, end, objects, timer) {
        this.beign = begin;
        this.end = end;
        this.objects = objects;
        this.scene = scene;
        this.timer = timer;
    }

    getRandomPoint(w, h) {
        return new Point(
            randomInteger(this.beign.x, this.end.x - w),
            randomInteger(this.beign.y - h, this.end.y - h));
    }

    getRandomObject() {
        var i = randomInteger(0, this.objects.length - 2);
        return this.objects[i];
    }

    spavn() {
        var obj = this.getRandomObject()();
        obj.pos = this.getRandomPoint(obj.inmage.width, obj.inmage.height);
        this.scene.addGameObject(obj);
        /*
        setTimeout(() => {
            this.spavn();
        }, this.timer);
        */
    }
}

export class SensorArea {
    constructor(imege, pos, action, onState = alwes) {
        this.imege = imege;
        this.pos = pos;
        this.radius = this.imege.width / 4 + this.imege.height / 4;
        this.isPress = false;
        this.onState = onState;
        this.action = action;
        this.id = null;
        console.log(pos);
        console.log(this.center());
        console.log(imege);
    }

    drow(_canvas) {
        _canvas.drawImage(this.imege.nextFrame(), this.pos.x, this.pos.y);
    }

    center() {
        return new Point(
            this.imege.width / 2 + this.pos.x,
            this.imege.height / 2 + this.pos.y);
    }

    mouseDown(point) {
        var d = this.center().distance(point);
        if (d <= this.radius) {
            this.isPress = true;
        }
    }

    mouseUp(point) {
        var d = center().distance(point);
        if (d <= this.radius) {
            this.isPress = false;
        }
    }

    touchstart(evt, e, s) {
        var touches = evt.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var p = new Point(touches[i].pageX, touches[i].pageY).sub(e);
            p = new Point(p.x * s.x, p.y * s.y); 
            if (this.center().distance(p) <= this.radius) {
                this.isPress = true;
                this.id = touches[i].identifier;
            }
        }
    }

    touchmove(evt, e, s) {
        var touches = evt.changedTouches;
        this.isPress = false;
        for (var i = 0; i < touches.length; i++) {
            var p = new Point(touches[i].pageX, touches[i].pageY).sub(e);
            p = new Point(p.x * s.x, p.y * s.y); 
            if (this.center().distance(p) <= this.radius) {
                this.isPress = true;
                this.id = touches[i].identifier;
            }
        }
    }

    touchend(evt) {
        var touches = evt.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            if (this.id == touches[i].identifier) {
                this.isPress = false;
            }
        }
    }

    exeAction() {
        if (this.isPress) {
            this.action();
            if (this.onState == onlu) {
                this.isPress = false;
            }
        }
    }
}

export class SensorAreas {
    constructor() {
        this.areas = [];
    }

    addArea(area) {
        this.areas.push(area);
    }

    drow(canvas) {
        this.areas.forEach((a) => {
            a.drow(canvas);
        });
    }

    mouseDown(point) {
        this.areas.forEach((a) => {
            a.mouseDown(point);
        });
    }

    touchstart(evt, e, s) {
        this.areas.forEach((a) => {
            a.touchstart(evt, e, s);
        });
    }

    touchmove(evt, e, s) {
        this.areas.forEach((a) => {
            a.touchmove(evt, e, s);
        });
    }

    touchend(evt) {
        this.areas.forEach((a) => {
            a.touchend(evt);
        });
    }



    exeAction() {
        this.areas.forEach((a) => {
            a.exeAction();
        });
    }
}

export class Timers {
    constructor() {
        this.items = [];
    }

    add(item) {
        this.items.push(item);
    }

    deleteTimer(item) {
        var index = this.items.indexOf(item);
        if (index >= 0) {
            this.items.splice(index, 1);
        }
    }

    tick() {
        this.items.forEach((t) => {
            t.tick();
            if (t.time <= 0) {
                this.deleteTimer(t);
            }
        });
        //var timersOfTimeOut = this.items.filter((t) => { return t.time <= 0; });
    }

    log() {
        this.items.forEach((t) => {
            console.log(t.tick());
        });
    }
}

export class Timer {
    constructor(time, onTimeOut, interval = 0) {
        // /1000*60 нужно что бы перевести из фреймов в секунды.
        this.time = time / 1000 * 60;
        this.onTimeOut = onTimeOut;
        this.interval = interval / 1000 * 60;
        this.enable = true;
    }

    tick() {
        if (this.enable != true) {
            return;
        }
        this.time -= 1;
        if (this.time <= 0) {
            this.onTimeOut();
            this.time = this.interval;
        }
    }

}


export var speedAlwaysMove = 0.9;

export function alwaysMove(go) {
    go.velocity.y = speedAlwaysMove;
    if (go.pos.y > canvas.height + 10) {
        go.hitPoint = 0;
    }
}