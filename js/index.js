import {
    canvasScale,
    canvasOffset,
    runOnMobile,
    enter,
    Timer
} from "./2DGameEngine.js";
import { resources } from "./GameResources.js";
import{
    CreateLevel,
    CreateMainMenu,
    CreateTryAgain,
    CreateControlsScrean,
    CreateWinScrean,
    CreateIntro_2,
    CreateIntro_3,
    CreateRadio,
    CreateEpilogue
} from "./CreateLevels.js";

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
    if(e.keyCode == enter){
        pause = !pause;
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

function GotoLevel(nextLevel, meteorsTimeSpavn){
    level = CreateLevel(canvas, nextLevel, meteorsTimeSpavn);
}

function GotoTryAgain(){
    level = CreateTryAgain(canvas);
}   

function GotoCreateControlsScrean(){
    level = CreateControlsScrean(canvas);
}  

function GotoCreateWinScrean(){
    level = CreateWinScrean(canvas);
}

function GotoIntro2(){
    level = CreateIntro_2(canvas);
}



function GotoIntro3(){
    level = CreateIntro_3(canvas);
}

//CreateRadio
function GotoCreateRadio(nextLevel){
    level = CreateRadio(canvas, nextLevel);
}
//CreateEpilogue
function GotoCreateEpilogue(){
    level = CreateEpilogue(canvas);
}

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
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#120D21";
    ctx.fillText("Загрузка...", canvas.width / 2, canvas.height / 2)
}

function pauseScrean() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = "48px serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "#120D21";
    ctx.fillText("Пауза.", canvas.width / 2, canvas.height / 2);
    ctx.font = "32px serif";
    if(runOnMobile()){
        ctx.fillText("Поверните устройство, что бы продолжить.", canvas.width / 2, canvas.height / 2 + 48);
    }
    else{
        ctx.fillText("Нажмите ентэр, что бы продолжить.", canvas.width / 2, canvas.height / 2 + 48)
    }
    
}

var canvasHeight = canvas.height;
var canvasWight = canvas.width;

function onResize(){
    var perrentCanvas = document.getElementById("perrentCanvas");
    var bodyW = perrentCanvas.offsetWidth;
    var bodyH = perrentCanvas.offsetHeight;
    var scale = 1;
    if(bodyW / bodyH < canvasWight / canvasHeight){
        scale = canvasWight / bodyW  * 1.1;
    }
    else{
        scale = canvasHeight / bodyH  * 1.1;
    }
    canvas.width = bodyW * scale;
    canvas.height = bodyH * scale;
    if(level != null){
        level.onResize(canvas);
    }
}

function onOrientationchange(){
    pause = runOnMobile() && (screen.orientation.angle == 0 || screen.orientation.angle == 180);
    onResize();
}

onResize();
onOrientationchange();

window.addEventListener("resize", onResize);
window.addEventListener("orientationchange", onOrientationchange);

var temp = null;


function draw() {
    if (pause == false) {
        if (resources.isDone()) {
            if(level.gotoScene == "Level1"){
                GotoLevel("RadioIntro2", 700);  
                temp = level;      
            }
            if(level.gotoScene == "Level2"){
                //GotoLevel("RadioIntro3", 1500);    
                level = temp;
                level.gotoScene = "";  
                level.variables.set("spavtRocket", true);
                level.variables.get("progressTimer").time = Timer.inMS(level.variables.get("maxProgress"));
                level.variables.set("nextLevel", "RadioIntro3");
                level.sensorAreas.unplugAll();
                level.keyEvents.unplugAll();
                
            }
            if(level.gotoScene == "Level3"){
                //GotoLevel("WinGame", 1500);
                level = temp;  
                level.gotoScene = ""; 
                level.variables.set("spavtRocket", false);
                level.variables.set("spavtMine", true); 
                level.variables.get("progressTimer").time = Timer.inMS(level.variables.get("maxProgress"));
                level.variables.set("nextLevel", "WinGame");
                level.sensorAreas.unplugAll();
                level.keyEvents.unplugAll();
            }
            //GotoCreateRadio
            if(level.gotoScene == "RadioIntro2"){
                GotoCreateRadio("Intro2");
            }
            if(level.gotoScene == "RadioIntro3"){
                GotoCreateRadio("Intro3");
            }

            if(level.gotoScene == "WinGame"){
                GotoCreateWinScrean();   
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
            if(level.gotoScene == "Intro2"){
                GotoIntro2();   
            }
            if(level.gotoScene == "Intro3"){
                GotoIntro3();   
            }
            if(level.gotoScene == "Epilogue"){
                GotoCreateEpilogue();   
            }
            level.nextFrame();
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
/*
var audio = new Audio(); // Создаём новый элемент Audio
  audio.src = '../Sounds/embient.ogg'; // Указываем путь к звуку "клика"
  audio.autoplay = true; // Автоматически запускаем
  audio.loop = true;
  */