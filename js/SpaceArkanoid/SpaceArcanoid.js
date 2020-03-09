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
    Timer,
    canvasScale,
    canvasOffset,
    Rectangle,
    alwes,
    runOnMobile
} from "./js/2DGameEngine.js";

import { resources } from "./js/SpaceArkanoid/GameResources.js";
import {
    spavnRocket_litle_001,
    spavnRocketAmmunition
} from "./js/SpaceArkanoid/Rockets.js";
import {
    getBigMeteor_001,
    getBigMeteor_002,
    getBigMeteor_003,
    getBigMeteor_004,
    getSmallMeteor_001,
    getSmallMeteor_002
} from "./js/SpaceArkanoid/Meteors.js";

const offset = 10;
const heigthProgress = 15;
var liveIcone = resources.get("Live").nextFrame();
var rocketIcon = resources.get("Rocket1Icon").nextFrame();
const section = resources.get("Section").nextFrame();
const fuelIcon = resources.get("FuelIcon").nextFrame();
const section_H = resources.get("Section_H").nextFrame();



function startNewGame(scene){
    return () =>{
        scene.gotoScene = "Level1";
    }
}

function showHelp(scene){
    return () =>{
        scene.gotoScene = "Help";
    }
}

function showTryAgain(scene){
    return () =>{
        scene.gotoScene = "TryAgain";
    }
}

function showMainMenu(scene){
    return () =>{
        scene.gotoScene = "MainMenu";
    }
}


function drowPlayerHitPoint(canvas, player){
    var step = 10;
    var hitPoint = player.hitPoint;
    var hp = hitPoint / step;
    if(hp == 0 && hitPoint > 0){
        hp = 1;
    }
    var offsetY = offset + heigthProgress;
    canvas.drawImage(liveIcone, offset, offsetY);
    for(var i = 0; i < hp; i++){
        canvas.drawImage(section, offset + section.width * i + liveIcone.width, offsetY);
    }
}

function drowRocketCount(canvas, count, canvasW){
    var step = 10;
    var hp = count / step;
    if(hp == 0 && count > 0){
        hp = 1;
    }
    var offsetY = offset + heigthProgress;
    var offsetX = canvasW - offset - rocketIcon.width;
    canvas.drawImage(rocketIcon, offsetX,  offsetY);
    for(var i = 0; i < hp; i++){
        canvas.drawImage(section, offsetX - section.width * i - rocketIcon.width, offsetY );
    }
}

function drowFuelCount(canvas, count){
    var step = 100;
    var f = count / step;
    if(f == 0 && count > 0){
        f = 1;
    }
    var offsetY = 2 * offset + heigthProgress + fuelIcon.height;
    var offsetX = offset;
    canvas.drawImage(fuelIcon, offsetX,  offsetY);
    for(var i = 0; i < f ; i++){
        canvas.drawImage(section, offsetX + section.width * i + fuelIcon.width, offsetY);
    }
}

function drowProgress(canvas, canvasW, current, max){
    
    var x = canvasW * (max - current) / max;
    canvas.fillStyle = "green";
    canvas.fillRect(0, 0, x, heigthProgress);
}

var Back = resources.get("Back");

var animatedBackground = new GameObject(Back, new Point(0,0));
var animatedBackground1 = new GameObject(Back, new Point(0,0));

export function CreateLevel(canvas){
    var ctx = canvas.getContext("2d");
    var scene = new Scene(ctx);

    
    scene.runOnMobile = !!('ontouchstart' in window);
    scene.variables.set("plaeyrSpeed", 1);
    scene.variables.set("ceanShot", true);
    scene.variables.set("rockrtCount", 100);
    scene.variables.set("maxRockrtCount", 100);
    scene.variables.set("meteorsSpavtTime",2000);
    scene.variables.set("ammunitionSpavtTime", 9000);
    scene.variables.set("maxProgress", 1000000);
    scene.variables.set("speedAlwaysMove", 2);

    scene.variables.set("fuel", 1000);
    scene.variables.set("maxFuel", 1000);


    animatedBackground.pos = new Point(0,0);
    animatedBackground1.pos = new Point(0,-Back.height);
    scene.drowBefore.push( (c) => { 
        animatedBackground.drow(c);
        animatedBackground1.drow(c);
        animatedBackground.pos.y += scene.variables.get("speedAlwaysMove");
        animatedBackground1.pos.y += scene.variables.get("speedAlwaysMove");
        if(animatedBackground.pos.y > canvas.height){
            animatedBackground.pos.y = animatedBackground1.pos.y - Back.height;
        }
        if(animatedBackground1.pos.y > canvas.height){
            animatedBackground1.pos.y = animatedBackground.pos.y - Back.height;
        }
    } );


    var progressTimer = new Timer(scene.variables.get("maxProgress"), () => {});
    scene.timers.add(progressTimer);
    progressTimer.onTick = () => { 
        var mp = Timer.inMS(scene.variables.get("maxProgress"));
        var newT = 2000 - 1800 * (mp - progressTimer.time) / mp;
        scene.variables.set("meteorsSpavtTime", newT);
     };
    scene.drowAfter.push( (c) => {drowProgress(c, canvas.width, progressTimer.time, Timer.inMS(scene.variables.get("maxProgress")))} );

    // игрок
    var player = new GameObject(resources.get("Player"), new Point(0, 0), 0);

    scene.variables.set("player", player);

    player.collider = new CircleCollision(45, 1, false);
    player.pos = new Point(canvas.width / 2 - player.inmage.width / 2, canvas.height - player.inmage.height - 30);
    scene.addGameObject(player);
    player.hitPoint = 100;
    player.limitPos = new Rectangle(0, canvas.height - player.inmage.height, 0, canvas.width - player.inmage.width);
    player.onResize = (c) => {player.limitPos = new Rectangle(0, c.height - player.inmage.height, 0, c.width - player.inmage.width)};
    var playerRocketTimer = new Timer(300, () => {
        scene.variables.set("ceanShot", true);
        playerRocketTimer.enable = false;
    }, 300);
    scene.timers.add(playerRocketTimer);
    player.methods.set("rocket", function (o, a) {
        var rc = scene.variables.get("rockrtCount");
        if (scene.variables.get("ceanShot") && rc > 0) {
            scene.variables.set("rockrtCount", rc - 1 );
            scene.variables.set("ceanShot", false);
            spavnRocket_litle_001(player, new Point(0, 0), 2000, scene);
            playerRocketTimer.enable = true;
        }
    });
    player.methods.set("spavnRAmmunition", 
        () => {
            return spavnRocketAmmunition((e) => { 
                if(e == player){
                    var rc = scene.variables.get("rockrtCount");
                    scene.variables.set("rockrtCount", rc + 50 );
                    if (scene.variables.get("rockrtCount") > scene.variables.get("maxRockrtCount")){
                        scene.variables.set("rockrtCount", scene.variables.get("maxRockrtCount") );
                    }
                }
            }, scene.variables.get("speedAlwaysMove"))
        }
    );
    //TryAgain
    player.onDeleteMethod = showTryAgain(scene);
        
    scene.drowAfter.push( (c) => {drowPlayerHitPoint(c, player)} );
    scene.drowAfter.push( (c) => {drowRocketCount(c, scene.variables.get("rockrtCount"), canvas.width)} );    
    scene.drowAfter.push( (c) => {drowFuelCount(c, scene.variables.get("fuel"))} );    

    // спавны объектов
    var ceanSpavn = true;
    var spavnArea1 = new SpavnArea(
        scene,
        () => {return new Point(0, 0);},
        () => {return new Point(canvas.width, 0);},
        [   
            () => {return getBigMeteor_001(scene.variables.get("speedAlwaysMove"), scene)},
            () => {return getBigMeteor_002(scene.variables.get("speedAlwaysMove"), scene)},
            () => {return getSmallMeteor_001(scene.variables.get("speedAlwaysMove"), scene)},
            () => {return getSmallMeteor_002(scene.variables.get("speedAlwaysMove"), scene)}
        ],
        1
    );
    var timerSpavnArea1 = new Timer(scene.variables.get("meteorsSpavtTime"), () => {
        spavnArea1.spavn();
    }, scene.variables.get("meteorsSpavtTime"));
    scene.timers.add(timerSpavnArea1);

    var spavnAmmunition = new SpavnArea(
        scene,
        () => {return new Point(0, 0);},
        () => {return new Point(canvas.width, 0);},
        [
            player.methods.get("spavnRAmmunition")
        ],
        1
    );
    var timerSpavnAmmunition = new Timer(scene.variables.get("ammunitionSpavtTime"), () => {
        var rand = Math.random() * scene.variables.get("maxRockrtCount") / scene.variables.get("rockrtCount");
        if(rand > 0.5){
            spavnAmmunition.spavn();
        }
    }, scene.variables.get("ammunitionSpavtTime"));
    scene.timers.add(timerSpavnAmmunition);


    function addAllOnSceneVelosity(ignoreGO, vel){
        scene.gameObjects.forEach((o) => {
            if(ignoreGO != o){
                o.velocity = o.velocity.add(vel);
            }
        });
    }

    function playerMoveToUp(){
        if(scene.variables.get("fuel") > 0){
            player.localVelocity.y += scene.variables.get("plaeyrSpeed");
            scene.variables.set("fuel", scene.variables.get("fuel") - 1);
        }
    }

    function playerMoveToDown(){
        if(scene.variables.get("fuel") > 0){
            player.localVelocity.y -= scene.variables.get("plaeyrSpeed");
            scene.variables.set("fuel", scene.variables.get("fuel") - 1);
        }
    }

    function playerMoveToLeft(){
        if(scene.variables.get("fuel") > 0){
            player.localVelocity.x += scene.variables.get("plaeyrSpeed");
            scene.variables.set("fuel", scene.variables.get("fuel") - 1);
        }
    }

    function playerMoveToRigth(){
        if(scene.variables.get("fuel") > 0){
            player.localVelocity.x -= scene.variables.get("plaeyrSpeed");
            scene.variables.set("fuel", scene.variables.get("fuel") - 1);
        }
    }

    function playerShootRocket(){
        player.execute("rocket", null);
    }

    // события нажатия кнопок для ПК
    scene.keyEvents.addKeyEvent(new KeyEvent(keyDown, playerMoveToDown));
    scene.keyEvents.addKeyEvent(new KeyEvent(keyUp, playerMoveToUp));
    scene.keyEvents.addKeyEvent(new KeyEvent(keyLeft, playerMoveToLeft));
    scene.keyEvents.addKeyEvent(new KeyEvent(keyRigth, playerMoveToRigth));
    scene.keyEvents.addKeyEvent(new KeyEvent(32, playerShootRocket), onlu);

    // события сенсорного экрана для телефонов
    var sensorAreaMoveUp = new SensorArea(
        resources.get("Up"),
        new Point(100, canvas.height - 300),
        playerMoveToUp
    );

    var sensorAreaMoveDown = new SensorArea(
        resources.get("Down"),
        new Point(100, canvas.height - 100),
        playerMoveToDown
    );

    var sensorAreaMoveLeft = new SensorArea(
        resources.get("Left"),
        new Point(0, canvas.height - 200),
        playerMoveToLeft
    );

    var sensorAreaMoveRigth = new SensorArea(
        resources.get("Rigth"),
        new Point(200, canvas.height - 200),
        playerMoveToRigth
    );
    var RocketsAttak = new SensorArea(
        resources.get("Rockets"),
        new Point(canvas.width - 100, canvas.height - 100),
        playerShootRocket
    );
    RocketsAttak.onResize = (c) =>{ RocketsAttak.pos = new Point(c.width - 100, c.height - 100)  };

    scene.sensorAreas.addArea(sensorAreaMoveUp);
    scene.sensorAreas.addArea(sensorAreaMoveDown);
    scene.sensorAreas.addArea(sensorAreaMoveLeft);
    scene.sensorAreas.addArea(sensorAreaMoveRigth);
    scene.sensorAreas.addArea(RocketsAttak);

    //
    return scene;
}



function DrowInCenter(img, ctx, canvas){
    var x = canvas.width / 2 - img.width / 2;
    var y = canvas.height / 2 - img.height / 2;
    ctx.drawImage(img, x, y); 
}

function GetPosStartNewGameButton(canvasWidth, canvasHeight, width, offsetX, offsetY){
    return new Point(canvasWidth  / 2 - width  - offsetX, canvasHeight / 2 + offsetY)
}

function GetPosHelpButton(canvasWidth, canvasHeight, width, offsetX, offsetY){
    return new Point(canvasWidth  / 2 + offsetX, canvasHeight / 2 + offsetY)
}

export function CreateMainMenu(canvas){
    var offsetX = 10;
    var offsetY = 140;
    var startNewGameButton = resources.get("StartNewGameButton");
    var showHelpButton = resources.get("ShowHelpButton");
    var ctx = canvas.getContext("2d");
    var scene = new Scene(ctx);
    scene.runOnMobile = !!('ontouchstart' in window);
    scene.drowBefore.push( (c) => { 
        DrowInCenter(resources.get("Intro").nextFrame(), c, canvas);
    } );

    var startNewGameArea = new SensorArea(
        startNewGameButton,
        GetPosStartNewGameButton(canvas.width, canvas.height, startNewGameButton.width, offsetX, offsetY),
        startNewGame(scene), alwes, true
    );
    startNewGameArea.onResize = (c) =>{startNewGameArea.pos= GetPosStartNewGameButton(c.width, c.height, startNewGameButton.width, offsetX, offsetY)};
    var showHelpArea = new SensorArea(
        showHelpButton,
        GetPosHelpButton(canvas.width, canvas.height, showHelpButton.width, offsetX, offsetY),
        showHelp(scene), alwes, true
    );
    showHelpArea.onResize = (c) =>{ showHelpArea.pos = GetPosHelpButton(c.width, c.height, showHelpButton.width, offsetX, offsetY)  };

    scene.sensorAreas.addArea(startNewGameArea);
    scene.sensorAreas.addArea(showHelpArea);

    return scene;
}

export function CreateTryAgain(canvas){
    var tryAgainButton = resources.get("TryAgain");
    var ctx = canvas.getContext("2d");
    var scene = new Scene(ctx);
    scene.runOnMobile = !!('ontouchstart' in window);
    scene.drowBefore.push( (c) => { 
        DrowInCenter(resources.get("TheGameIsLost").nextFrame(), c, canvas);
    } );

    var tryAgainArea = new SensorArea(
        tryAgainButton,
        new Point(canvas.width  / 2 - tryAgainButton.width / 2, canvas.height / 2),
        startNewGame(scene), alwes, true
    );
    tryAgainArea.onResize = (c) =>{tryAgainArea.pos = new Point(c.width  / 2 - tryAgainButton.width / 2, c.height / 2)  };

    scene.sensorAreas.addArea(tryAgainArea);
    return scene;
}

function GetToBeackButton(canvasWidth, canvasHeight, width, height, offset){
    return new Point(canvasWidth / 2 + 450 - width - offset, canvasHeight / 2 + 300 - offset - height);
}

export function CreateControlsScrean(canvas){
    var toBeack = resources.get("ToBeak");
    var offset = 10;
    var ctx = canvas.getContext("2d");
    var scene = new Scene(ctx);
    scene.runOnMobile = !!('ontouchstart' in window);
    scene.drowBefore.push( (c) => { 
        if(runOnMobile()){
            DrowInCenter(resources.get("ControlsScreanMobile").nextFrame(), c, canvas);
        }
        else{
            DrowInCenter(resources.get("ControlsScrean").nextFrame(), c, canvas);
        }
       
    } );

    var toBeackArea = new SensorArea(
        toBeack,
        GetToBeackButton(canvas.width, canvas.height, toBeack.width, toBeack.height, offset),
        showMainMenu(scene), alwes, true
    );
    toBeackArea.onResize = (c) =>{toBeackArea.pos = GetToBeackButton(canvas.width, canvas.height, toBeack.width, toBeack.height, offset) };

    scene.sensorAreas.addArea(toBeackArea);
    return scene;
}