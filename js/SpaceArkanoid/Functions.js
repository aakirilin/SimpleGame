import {
    Scene,
    GameObject,
    Point,
    CircleCollision,
    KeyEvents,
    KeyEvent,
    keyDown,
    keyUp,
    keyLeft,
    keyRigth,
    onlu,
    SpavnArea,
    SensorArea,
    SensorAreas,
    Timers,
    Timer
} from "/js/2DGameEngine.js";

import { resources } from "/js/SpaceArkanoid/GameResources.js";
import {
    spavnRocket_litle_001,
    spavnRocketAmmunition
} from "/js/SpaceArkanoid/Rockets.js";
import {
    getBigMeteor_001,
    getBigMeteor_002,
    getBigMeteor_003,
    getBigMeteor_004,
    getSmallMeteor_001,
    getSmallMeteor_002
} from "/js/SpaceArkanoid/Meteors.js";

////////////////////////////////////////////////
// переменные
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


var scene = null;
var keyEvents = null;
var sensorAreas = null;

var pause = false;
var runOnMobile = !!('ontouchstart' in window);

// переменные отвечающие за игрока
var plaeyrSpeed = 1;
var ceanShot = true;


////////////////////////////////////////////////

// объекты
// игрок
var plaeyr = null;
var spavnArea1 = null;
var timerSpavnArea1 = null;

var spavnAmmunition= null;
var timerSpavnAmmunition = null;

var plaeyrRocketTimer = null;
var sensorAreaMoveUp = null;
var sensorAreaMoveDown = null;
var sensorAreaMoveLeft = null;
var sensorAreaMoveRigth = null;
var RocketsAttak = null;
var rockrtCount = 100;
var maxRockrtCount = 100;

// функции
function canvasScale() {
    return new Point(
        canvas.width / canvas.clientWidth, canvas.height / canvas.clientHeight
    );
}

function canvasOffset() {
    return new Point(canvas.offsetLeft - document.body.scrollLeft, canvas.offsetTop - document.body.scrollTop);
}

function startNewGame() {
    scene = new Scene(ctx);
    keyEvents = new KeyEvents();
    sensorAreas = new SensorAreas();
    plaeyrSpeed = 1;
    ceanShot = true;
    createPlayer();
    createSpavnAreas();
    createPlayerKeyEvents();
    createSensoreAreas();
}

function createPlayer() {
    plaeyr = new GameObject(resources.get("Player"), new Point(0, 0), 0);
    plaeyr.collider = new CircleCollision(45, 1, false);
    plaeyr.pos = new Point(canvas.width / 2 - plaeyr.inmage.width / 2, canvas.height - plaeyr.inmage.height - 30);
    scene.addGameObject(plaeyr);
    plaeyr.hitPoint = 100;
    plaeyrRocketTimer = new Timer(300, () => {
        ceanShot = true;
        plaeyrRocketTimer.enable = false;
    }, 300);
    scene.timers.add(plaeyrRocketTimer);
    plaeyr.methods.set("rocket", function (o, a) {
        if (ceanShot && rockrtCount > 0) {
            rockrtCount -= 1;
            ceanShot = false;
            spavnRocket_litle_001(plaeyr, new Point(0, 0), 2000, scene);
            plaeyrRocketTimer.enable = true;
        }
    });
}

function drowPlayerHitPoint(){
    var countHitPoint = Math.round(plaeyr.hitPoint / 20);
    if(countHitPoint == 0 && plaeyr.hitPoint > 0){
        countHitPoint = 1;
    }
    var img = resources.get("Live");
    for(var i = 0 ; i < countHitPoint; i++){
        ctx.drawImage(img.nextFrame(), img.width * i + 5 * i + 5, 5);
    }
}

function drowPlaeyrRocketCount(){
    var countRocket = Math.round(rockrtCount / 10);
    if(countRocket > 9){
        countRocket = 9;
    }
    if(countRocket == 0 && rockrtCount > 0){
        countRocket = 1;
    }
    var img = resources.get("Rocket1Icon");
    for(var i = 0 ; i < countRocket; i++){
        ctx.drawImage(img.nextFrame(), img.width * i + 5 * i + 5, 55);
    }
}

function spavnRAmmunition(){
    return spavnRocketAmmunition((e) => { 
        if(e == plaeyr){
            rockrtCount += 50;
            if (rockrtCount > maxRockrtCount){
                rockrtCount = maxRockrtCount;
            }
        }
    });
}

function createSpavnAreas() {
    spavnArea1 = new SpavnArea(
        scene,
        new Point(0, 0),
        new Point(canvas.width, 0),
        [getBigMeteor_001,
            getBigMeteor_002,
            getSmallMeteor_001,
            getSmallMeteor_002
        ],
        9000
    );
    timerSpavnArea1 = new Timer(5000, () => {
        spavnArea1.spavn();
    }, 5000);
    scene.timers.add(timerSpavnArea1);

    spavnAmmunition = new SpavnArea(
        scene,
        new Point(0, 0),
        new Point(canvas.width, 0),
        [
            spavnRAmmunition
        ],
        5
    );
    timerSpavnAmmunition = new Timer(9000, () => {
        var rand = Math.random() * maxRockrtCount / rockrtCount / 2;
        if(rand > 0.5){
            spavnAmmunition.spavn();
        }
    }, 9000);
    scene.timers.add(timerSpavnAmmunition);
}

function createPlayerKeyEvents() {
    keyEvents.addKeyEvent(new KeyEvent(keyDown, function () {
        plaeyr.localVelocity.y -= plaeyrSpeed;
    }));
    keyEvents.addKeyEvent(new KeyEvent(keyUp, function () {
        plaeyr.localVelocity.y += plaeyrSpeed;
    }));
    keyEvents.addKeyEvent(new KeyEvent(keyLeft, function () {
        plaeyr.localVelocity.x += plaeyrSpeed;
    }));
    keyEvents.addKeyEvent(new KeyEvent(keyRigth, function () {
        plaeyr.localVelocity.x -= plaeyrSpeed;
    }));

    keyEvents.addKeyEvent(new KeyEvent(32, function () {
        plaeyr.execute("rocket", null);
    }), onlu);

    document.addEventListener("keydown", (e) => { keyEvents.onKeyDown(e.keyCode); });
    document.addEventListener("keyup", (e) => { keyEvents.onKeyUp(e.keyCode); });
}

function createSensoreAreas() {
    sensorAreaMoveUp = new SensorArea(
        resources.get("Up"),
        new Point(50, canvas.height - 150),
        () => { plaeyr.localVelocity.y += plaeyrSpeed; }
    );

    sensorAreaMoveDown = new SensorArea(
        resources.get("Down"),
        new Point(50, canvas.height - 50),
        () => { plaeyr.localVelocity.y -= plaeyrSpeed; }
    );

    sensorAreaMoveLeft = new SensorArea(
        resources.get("Left"),
        new Point(0, canvas.height - 100),
        () => { plaeyr.localVelocity.x += plaeyrSpeed; }
    );

    sensorAreaMoveRigth = new SensorArea(
        resources.get("Rigth"),
        new Point(100, canvas.height - 100),
        () => { plaeyr.localVelocity.x -= plaeyrSpeed; }
    );
    RocketsAttak = new SensorArea(
        resources.get("Rockets"),
        new Point(canvas.width - 70, canvas.height - 70),
        () => {
            plaeyr.execute("rocket", null);
        }
    );
    sensorAreas.addArea(sensorAreaMoveUp);
    sensorAreas.addArea(sensorAreaMoveDown);
    sensorAreas.addArea(sensorAreaMoveLeft);
    sensorAreas.addArea(sensorAreaMoveRigth);
    sensorAreas.addArea(RocketsAttak);

    canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        var s = canvasScale();
        var o = canvasOffset();
        console.log(o);
        sensorAreas.touchstart(e, o, s);
    }, false);
    canvas.addEventListener("touchend", (e) => {
        e.preventDefault();
        sensorAreas.touchend(e);
    }, false);
    canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        var s = canvasScale();
        var o = canvasOffset();
        sensorAreas.touchmove(e, o, s);
    }, false);
}

resources.onDone = () => {
    startNewGame();
    spavnArea1.spavn();
};

function loadScrean() {
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#120D21";
    ctx.fillText("Loading", canvas.width / 2, canvas.height / 2)
}

function drowTexts(){
    //scene.drowText(rockrtCount, "#137fad", new Point(canvas.width /2, canvas.height -28));
}

function draw() {
    if (pause == false) {
        if (resources.isDone()) {
            keyEvents.exeAction();
            if (runOnMobile) {
                sensorAreas.exeAction();
            }
            scene.onPhysics();
            ctx.drawImage(resources.get("Back").nextFrame(), 0, 0);
            scene.tick();
            scene.drow();
            drowPlayerHitPoint();
            drowTexts();
            drowPlaeyrRocketCount();
            if (runOnMobile) {
                sensorAreas.drow(ctx);
            }
        }
        else {
            loadScrean();
        }
    }
    requestAnimationFrame(draw);
}
draw();
