import {
    canvasScale,
    canvasOffset,
    runOnMobile
} from "/js/2DGameEngine.js";
import { resources } from "/js/SpaceArkanoid/GameResources.js";
import{
    CreateLevel,
    CreateMainMenu,
    CreateTryAgain,
    CreateControlsScrean
} from "/js/SpaceArkanoid/SpaceArcanoid.js";

////////////////////////////////////////////////
// переменные
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


var level = null;
//var keyEvents = null;
//var sensorAreas = null;

var pause = false;

function OnKeyDown(e){
    if(level != null){
        level.keyEvents.onKeyDown(e.keyCode);
    }
}

function OnKeyUp(e){
    if(level != null){
        level.keyEvents.onKeyUp(e.keyCode);
    }
}

function OnTouchStart(e){
    if(level != null){
        e.preventDefault();
        var s = canvasScale(canvas);
        var o = canvasOffset(canvas);
        level.sensorAreas.touchstart(e, o, s);
    }
}

function OnTouchEnd(e){
    if(level != null){
        e.preventDefault();
        level.sensorAreas.touchend(e);
    }
}

function OnTouchMove(e){
    if(level != null){
        e.preventDefault();
        var s = canvasScale(canvas);
        var o = canvasOffset(canvas);
        level.sensorAreas.touchmove(e, o, s);
    }
}


function OnMouseDown(e){
    if(level != null){
        e.preventDefault();
        var s = canvasScale(canvas);
        var o = canvasOffset(canvas);
        level.sensorAreas.mouseDown(e, o, s);
    }
}

//mouseMove
function OnMouseMove(e){
    if(level != null){
        e.preventDefault();
        var s = canvasScale(canvas);
        var o = canvasOffset(canvas);
        level.sensorAreas.mouseMove(e, o, s);
    }
}

//mouseUp
function OnMouseUp(e){
    if(level != null){
        e.preventDefault();
        var s = canvasScale(canvas);
        var o = canvasOffset(canvas);
        level.sensorAreas.mouseUp(e, o, s);
    }
}

function GotoMainMenu(){
    level = CreateMainMenu(canvas);
}

function GotoLevel(){
    level = CreateLevel(canvas);
}

function GotoTryAgain(){
    level = CreateTryAgain(canvas);
}   

function GotoCreateControlsScrean(){
    level = CreateControlsScrean(canvas);
}  
//CreateControlsScrean

resources.onDone = () => {
    GotoMainMenu();
    window.addEventListener("keydown", OnKeyDown);
    window.addEventListener("keyup", OnKeyUp);
    canvas.addEventListener("touchstart", OnTouchStart, false);
    canvas.addEventListener("touchend", OnTouchEnd, false);
    canvas.addEventListener("touchmove", OnTouchMove, false);

    canvas.addEventListener("mouseup", OnMouseUp, false);
    canvas.addEventListener("mousedown", OnMouseDown, false);
    canvas.addEventListener("mousemove", OnMouseMove, false);

};

function loadScrean() {
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#120D21";
    ctx.fillText("Загрузка", canvas.width / 2, canvas.height / 2)
}

function pauseScrean() {
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#120D21";
    ctx.fillText("Пауза", canvas.width / 2, canvas.height / 2)
}

var canvasHeight = canvas.height;
var canvasWight = canvas.width;

function onResize(){
    var perrentCanvas = document.getElementById("perrentCanvas");
    var bodyW = perrentCanvas.offsetWidth;
    var bodyH = perrentCanvas.offsetHeight;
    if(bodyH > bodyW){
        var swap = bodyW;
        bodyW = bodyH;
        bodyH = swap;
    }
    var scale = canvasHeight / bodyH  * 1.1;
    canvas.width = bodyW * scale;
    canvas.height = bodyH * scale;
    if(level != null){
        level.onResize(canvas);
    }
}

function onOrientationchange(){
    pause = screen.orientation.angle == 0 &&  runOnMobile();
    onResize();
}

onResize();
onOrientationchange();

window.addEventListener("resize", onResize);
window.addEventListener("orientationchange", onOrientationchange);


function draw() {
    if (pause == false) {
        if (resources.isDone()) {
            level.nextFrame();
            if(level.gotoScene == "Level1"){
                GotoLevel();                
            }
            if(level.gotoScene == "TryAgain"){
                GotoTryAgain(); 
            }
            if(level.gotoScene == "Help"){
                GotoCreateControlsScrean(); 
            }
            if(level.gotoScene == "MainMenu"){
                GotoMainMenu(); 
            }
        }
        else {
            loadScrean();
        }
    }
    else{
        pauseScrean();
    }
    requestAnimationFrame(draw);
}
draw();
