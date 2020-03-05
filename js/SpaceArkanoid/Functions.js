import {
    canvasScale,
    canvasOffset
} from "/js/2DGameEngine.js";
import { resources } from "/js/SpaceArkanoid/GameResources.js";
import{
    CreateLevel,
    CreateMainMenu,
    CreateTryAgain
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

resources.onDone = () => {
    GotoMainMenu();
    document.addEventListener("keydown", OnKeyDown);
    document.addEventListener("keyup", OnKeyUp);
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
    ctx.fillText("Loading", canvas.width / 2, canvas.height / 2)
}

canvas.width = document.body.clientWidth;

canvas.height = document.body.clientHeight;

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
        }
        else {
            loadScrean();
        }
    }
    requestAnimationFrame(draw);
}
draw();
