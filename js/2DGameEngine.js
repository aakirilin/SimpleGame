export const keyUp = 38;
export const keyDown = 40;
export const keyLeft = 37;
export const keyRigth = 39;

export const keyA = 65;
export const keyD = 68;
export const enter = 13;

export const onlu = "onlu";
export const alwes = "alwes";

export const textColor = "LightSkyBlue";

export function runOnMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent);
};

export class KeyEvent {
    constructor(keyCode, action, onState = alwes) {
        this.keyCode = keyCode;
        this.action = action;
        this.isPress = false;
        this.onState = onState;
    }
    unplug(){
        this.isPress = false;
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
    unplugAll(){
        this.keyEvent.forEach((k)=>{
            k.unplug();
        });
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

export class Rectangle{
    constructor(top, bottom, left, rigth){
        this.top=top;
        this.bottom=bottom;
        this.left=left;
        this.rigth=rigth;
    }
    isInside(point){
        return this.left < point.x  && point.x < this.rigth && 
        this.top < point.y && point.y < this.bottom;
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
        this.limitPos = null;
        this.onMove = [];
        this.onResize = null;
    }
    dispose(){
        this.inmage.dispose();
        this.inmage = null;
    }

    onDelete() {
        if (this.onDeleteMethod != null) {
            this.onDeleteMethod();
        }
        this.dispose();
    }
    loadFromUrlImage(url, startPos, rotation = 0) {
        this.inmage.src = url;
        this.pos = startPos;
        this.rotation = rotation;
    }
    move() {
        var vel = this.velocity.add(this.localVelocity.rotation(this.rotation + 180, new Point(0, 0)));
        this.pos = this.pos.add(vel);
        if(this.limitPos != null){
            if(this.pos.y < this.limitPos.top){
                this.pos.y = this.limitPos.top;
            }
            if(this.pos.y > this.limitPos.bottom){
                this.pos.y = this.limitPos.bottom;
            }
            if(this.pos.x < this.limitPos.left){
                this.pos.x = this.limitPos.left;
            }
            if(this.pos.x > this.limitPos.rigth){
                this.pos.x = this.limitPos.rigth;
            }
        }
        this.velocity.x *= this.inertness;
        this.velocity.y *= this.inertness;
        this.localVelocity.x *= this.inertness;
        this.localVelocity.y *= this.inertness;
        this.onMove.forEach((p) => { p(this.pos); });
    }

    drow(_canvas) {
        if (this.hitPoint <= 0) {
            this.onDelete();
            return;
        }
        if(this.inmage == null){
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
        if(this.inmage == null){
            return new Point(0, 0);
        }
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
        this.keyEvents = new KeyEvents();
        this.sensorAreas = new SensorAreas();
        this.variables = new Map();
        this.runOnMobile = false;
        this.drowBefore = [];
        this.drowAfter = [];
        this.gotoScene = "";
    }

    onResize(canvas){
        this.gameObjects
            .filter((o) => {return o.onResize != null})
            .forEach((o) =>{o.onResize(canvas)});
            this.sensorAreas.onResize(canvas);
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
    nextFrame(){
        this.tick();
        this.keyEvents.exeAction();
        this.sensorAreas.exeAction(this.runOnMobile);
        this.onPhysics();
        this.drowBefore.forEach( (o) => {
            o(this.canvas);
        } );
        this.drow();
        this.drowAfter.forEach( (o) => {
            o(this.canvas);
        } );
        this.sensorAreas.drow(this.canvas, this.runOnMobile);
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

    locationsIsBusy(rect){
        for(var i = 0; i < this.gameObjects.length; i++ ){
            var o = this.gameObjects[i];
            if( rect.isInside(o.pos) ||
            rect.isInside(o.pos.add(new Point(o.inmage.width, 0))) ||
            rect.isInside(o.pos.add(new Point(0, o.inmage.height))) ||
            rect.isInside(o.pos.add(new Point(o.inmage.width, o.inmage.height)))
                ){
                return true;
            }
        }
        return false;
    }
}

export class Resources {
    constructor() {
        this.imgs = new Map();
        this.countLoads = 0;
        this.all = 0;
        this.Err = false;
        this.onDone = null;
    }

    isDone() {
        return this.all == this.countLoads;
    }

    addImage(name, src){
        this.all += 1;
        var image = new Image();
        image.src = src;
        image.onload = () => {
            this.countLoads += 1;
            this.imgs.set(name, () => { 
                return new SingleImage(image)});
            if (this.isDone() && this.onDone != null) {
                this.onDone();
            }
        };
        this.imgs.set(src, image);
        return image;
    }

    add(name, src) {
        this.addImage(name, src);
    }

    addSequence(name, imgs, delay){
        imgs.forEach((i) => {
            this.addImage(i, i);
        });
        this.imgs.set(name, ()=> {
            var images = [];
            imgs.forEach((i) => {
                images.push(this.get(i));
            });
            return new ImageSequence(images, delay, images[0].width, images[0].height);
        });
    }

    get(name) {
        if (this.imgs.has(name)) {
            var item = this.imgs.get(name);
            return item();
        }
        return null;
    }
}

export class SingleImage{
    constructor(image){
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }
    nextFrame(){
        return this.image;
    }
    dispose(){
        this.image = null;
    }
}

export class ImageSequence{
    constructor(images, delay, width, height){
        this.images = images;
        this.currentImg = 0;
        this.delay = delay;
        this.timer = 0;
        this.width = width;
        this.height = height;
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
        return this.images[this.currentImg].nextFrame();
    }
    dispose(){
        this.images.forEach((i) => {i.dispose()})
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
        this.onResize = null;
        this.maxNumberOfAttempts = 10;
    }

    getRandomPoint(w, h, scene) {
        var p = null;
        var begin = this.beign();
        var end = this.end();
        var numberOfAttempts = 0;
        do{
            p = new Point(
                randomInteger(begin.x, end.x - w),
                randomInteger(begin.y - h, end.y - h));
            numberOfAttempts += 1;
        } while(scene.locationsIsBusy(new Rectangle(p.y, p.y + h, p.x, p.x + w)) && numberOfAttempts < this.maxNumberOfAttempts);
        if(numberOfAttempts >= this.maxNumberOfAttempts){
            return null;
        }else{
            return p;
        }
    }

    getRandomObject() {
        var i = randomInteger(0, this.objects.length - 2);
        return this.objects[i];
    }

    spavn(liveTime) {
        var obj = this.getRandomObject()();
        var pos = this.getRandomPoint(obj.inmage.width, obj.inmage.height, this.scene);
        if(pos == null){
            return null;
        }
        else{
            obj.pos = pos;
            if(liveTime <= 0){
                this.scene.addGameObject(obj);
            }
            else{
                this.scene.addGameObjectWithLiveTime(obj, liveTime);
            }
            return obj;
        }
    }
}

export class SensorArea {
    constructor(imege, pos, action, onState = alwes, showConstantly = false) {
        this.imege = imege;
        this.pos = pos;
        this.radius = this.imege.width / 4 + this.imege.height / 4;
        this.isPress = false;
        this.onState = onState;
        this.action = action;
        this.id = null;
        this.showConstantly = showConstantly;
        this.onResize = null;
        this.beforeDraw = null;
        this.beforeAfter = null;
        this.enable = true;
    }

    unplug(){
        this.isPress = false;
    }
    
    drow(_canvas) {
        if(this.enable != true){
            return;
        }
        if(this.beforeDraw != null){
            this.beforeDraw(_canvas);
        }
        _canvas.drawImage(this.imege.nextFrame(), this.pos.x, this.pos.y);
        if(this.beforeAfter != null){
            this.beforeAfter(_canvas);
        }
    }

    center() {
        return new Point(
            this.imege.width / 2 + this.pos.x,
            this.imege.height / 2 + this.pos.y);
    }

    mouseDown(point, e, s) {
        var p = new Point(point.clientX, point.clientY).sub(e);
        p = new Point(p.x * s.x, p.y * s.y); 
        this.isPress = this.isTorhced(p) && this.enable;
    }

    mouseUp(point, e, s) {
        var p = new Point(point.clientX, point.clientY).sub(e);
        p = new Point(p.x * s.x, p.y * s.y);
        this.isPress = false;
    }

    mouseMove(point, e, s) {
        var p = new Point(point.clientX, point.clientY).sub(e);
        p = new Point(p.x * s.x, p.y * s.y);
        if(this.isPress && !this.isTorhced(p)){
            this.isPress = false;
        } 
    }

    getRectangle(){
        return new Rectangle(this.pos.y, this.pos.y + this.imege.height, this.pos.x, this.pos.x + this.imege.width);
    }

    isTorhced(point){
        return this.getRectangle().isInside(point);
    }

    touchstart(evt, e, s) {
        var touches = evt.changedTouches;
        for (var i = 0; i < touches.length; i++) {
            var p = new Point(touches[i].clientX, touches[i].clientY).sub(e);
            p = new Point(p.x * s.x, p.y * s.y); 
            if (this.isTorhced(p) && this.enable) {
                this.isPress = true;
                this.id = touches[i].identifier;
            }
        }
    }

    touchmove(evt, e, s) {
        var touches = evt.changedTouches;
        this.isPress = false;
        for (var i = 0; i < touches.length; i++) {
            var p = new Point(touches[i].clientX, touches[i].clientY).sub(e);
            p = new Point(p.x * s.x, p.y * s.y); 
            if (this.isTorhced(p)) {
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

    unplugAll(){
        this.areas.forEach((a)=> {
            a.unplug();
        });
    }
    
    onResize(canvas){
        this.areas
            .filter((a) => {return a.onResize != null})
            .forEach((a) =>{a.onResize(canvas)});
    }


    addArea(area) {
        this.areas.push(area);
    }

    drow(canvas, runOnMobile) {
        this.areas.forEach((a) => {
            if(runOnMobile || a.showConstantly){
                a.drow(canvas);
            }
        });
    }

    mouseDown(point, e, s) {
        this.areas.forEach((a) => {
            a.mouseDown(point, e, s);
        });
    }

    mouseMove(point, e, s) {
        this.areas.forEach((a) => {
            a.mouseMove(point, e, s);
        });
    }

    mouseUp(point, e, s) {
        this.areas.forEach((a) => {
            a.mouseUp(point, e, s);
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
    exeAction(runOnMobile) {
        this.areas.forEach((a) => {
            if(runOnMobile || a.showConstantly){
                a.exeAction();
            }
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
        this.time = Timer.inMS(time);
        this.onTimeOut = onTimeOut;
        this.interval = interval / 1000 * 60;
        this.enable = true;
        this.onTick = null;
    }
    static inMS(frame){
        return frame / 1000 * 60;
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
        if(this.onTick != null){
            this.onTick();
        }
    }

}


export var speedAlwaysMove = 0.9;

export function alwaysMove(go, speed, scene) {
    go.velocity.y = speed;
    if (go.pos.y > canvas.height + 10) {
        go.hitPoint = 0;
        go.onDeleteMethod = null;
    }
}

export function canvasScale(canvas) {
    return new Point(
        canvas.width / canvas.clientWidth, canvas.height / canvas.clientHeight
    );
}

export function canvasOffset(canvas) {
    return new Point(canvas.offsetLeft - document.body.scrollLeft, canvas.offsetTop - document.body.scrollTop);
}

export function calkHeigthText(imgText, fontSize, width, height){
    var canvas = document.createElement('canvas');
    canvas.width = imgText.width;
    canvas.height = imgText.height;
    var context = canvas.getContext('2d');
    context.drawImage(imgText, 0 , 0);
    for(var h = 0; h < imgText.height / fontSize; h++){
        var pixel = context.getImageData(0, h * fontSize, imgText.width, fontSize).data;
        var line = 0
        pixel.forEach((i) => {
            line += i;
        });
        if(line == 0){
            return h * fontSize;
        }
    }
    return imgText.height;
}

export function createImageWithTextSuper(lines, fontSize, width, heigth, offsetX, textAlign, textIndent){
    var data = "data:image/svg+xml," +
           "<svg xmlns='http://www.w3.org/2000/svg' width='"+width+"' height='"+heigth+"'>" +
             "<foreignObject y='"+offsetX+"' width='100%' height='"+heigth*2+"px'><div xmlns='http://www.w3.org/1999/xhtml' style='color:"+textColor+";font-size:"+fontSize+"px'>";
    for(var i = 0; i < lines.length; i++){
        data += "<div style='text-indent:"+textIndent+";text-align:"+textAlign+"'>" + lines[i] + "</div>";
    }
    data += "</div></foreignObject></svg>";
    var img = new Image();
    img.src = data;
    return img;
}

export function createImageWithText(lines, fontSize, width, heigth, offsetX){
    return createImageWithTextSuper(lines, fontSize, width, heigth, offsetX, "justify", "1em");
}