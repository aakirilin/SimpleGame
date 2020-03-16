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
    runOnMobile,
    createImageWithText,
    createImageWithTextSuper,
    calkHeigthText
} from "./2DGameEngine.js";

import { resources } from "./GameResources.js";
import {
    spavnRocket_litle_001,
    spavnRocketAmmunition,
    spavnEnemyRocket_litle_001,
    getMine
} from "./Rockets.js";
import {
    getBigMeteor_001,
    getBigMeteor_002,
    getBigMeteor_003,
    getBigMeteor_004,
    getSmallMeteor_001,
    getSmallMeteor_002,
} from "./Meteors.js";

const offset = 10;
const heigthProgress = 15;

function getLiveIcone(){
    return resources.get("Live").nextFrame();
}

function getRocketIcon(){
    return resources.get("Rocket1Icon").nextFrame();
}

function getSection(){
    return resources.get("Section").nextFrame();
}

function getFuelIcon(){
    return resources.get("FuelIcon").nextFrame();
}

//const section_H = resources.get("Section_H").nextFrame();



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
    canvas.drawImage(getLiveIcone(), offset, offsetY);
    for(var i = 0; i < hp; i++){
        canvas.drawImage(getSection(), offset + getSection().width * i + getLiveIcone().width, offsetY);
    }
}

function drowRocketCount(canvas, count, canvasW){
    var step = 10;
    var hp = count / step;
    if(hp == 0 && count > 0){
        hp = 1;
    }
    var offsetY = offset + heigthProgress;
    var offsetX = canvasW - offset - getRocketIcon().width;
    canvas.drawImage(getRocketIcon(), offsetX,  offsetY);
    for(var i = 0; i < hp; i++){
        canvas.drawImage(getSection(), offsetX - getSection().width * i - getRocketIcon().width, offsetY );
    }
}

function drowFuelCount(canvas, count){
    var step = 100;
    var f = count / step;
    if(f == 0 && count > 0){
        f = 1;
    }
    var offsetY = 2 * offset + heigthProgress + getFuelIcon().height;
    var offsetX = offset;
    canvas.drawImage(getFuelIcon(), offsetX,  offsetY);
    for(var i = 0; i < f ; i++){
        canvas.drawImage(getSection(), offsetX + getSection().width * i + getFuelIcon().width, offsetY);
    }
}

function drowProgress(canvas, canvasW, current, max){
    var x = canvasW * (max - current) / max;
    canvas.fillStyle = "green";
    canvas.fillRect(0, 0, x, heigthProgress);
}

export function CreateLevel(canvas, nextLevel, meteorsTimeSpavn){
    
    var Back = resources.get("Back");

    var animatedBackground = new GameObject(Back, new Point(0,0));
    var animatedBackground1 = new GameObject(Back, new Point(0,0));

    var ctx = canvas.getContext("2d");
    var scene = new Scene(ctx);

    scene.runOnMobile = !!('ontouchstart' in window);
    scene.variables.set("plaeyrSpeed", 1);
    scene.variables.set("ceanShot", true);
    scene.variables.set("rockrtCount", 100);
    scene.variables.set("maxRockrtCount", 100);
    scene.variables.set("meteorsSpavtTime",500);
    scene.variables.set("ammunitionSpavtTime", 9000);
    scene.variables.set("maxProgress", 200000);
    scene.variables.set("speedAlwaysMove", 3);
    scene.variables.set("spavtRocket", false);
    scene.variables.set("spavtMine", false);
    scene.variables.set("nextLevel", nextLevel);
        
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


    var progressTimer = new Timer(scene.variables.get("maxProgress"), () => {}, 1000);
    scene.timers.add(progressTimer);
    progressTimer.onTick = () => { 
        if(progressTimer.time <= 10){
            scene.gotoScene = scene.variables.get("nextLevel");
        }
     };
    scene.drowAfter.push( (c) => {
        drowProgress(c, canvas.width, progressTimer.time, Timer.inMS(scene.variables.get("maxProgress")))
    } );

    // игрок
    var player = new GameObject(resources.get("Player"), new Point(0, 0), 0);

    scene.variables.set("player", player);
    scene.variables.set("progressTimer", progressTimer);


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


    var spavnEnemyRocketArea_1 = new SpavnArea(
        scene,
        () => {return new Point(-50, -100);},
        () => {return new Point(-50, canvas.height-100);},
        [
            () => { return  spavnEnemyRocket_litle_001(90, scene, scene.variables.get("speedAlwaysMove"))},
        ]
    );
    var timerSpavnEnemyRocketArea_1 = new Timer(1000, () => {
        if(scene.variables.get("spavtRocket")){
            spavnEnemyRocketArea_1.spavn(4000);
        }
    }, 1000);
    scene.timers.add(timerSpavnEnemyRocketArea_1);
    // спавны объектов
    var spavnArea1 = new SpavnArea(
        scene,
        () => {return new Point(0, 0);},
        () => {return new Point(canvas.width, 0);},
        [   
            () => {return getSmallMeteor_002(scene.variables.get("speedAlwaysMove"), scene)},
            () => {return getBigMeteor_001(scene.variables.get("speedAlwaysMove"), scene)},
            () => {return getSmallMeteor_001(scene.variables.get("speedAlwaysMove"), scene)},
            () => {return getBigMeteor_002(scene.variables.get("speedAlwaysMove"), scene)},
            () => {return getSmallMeteor_002(scene.variables.get("speedAlwaysMove"), scene)},
            () => {
                if(scene.variables.get("spavtMine")){
                    return getMine(scene.variables.get("speedAlwaysMove"), scene, player);
                }
                else
                {
                    return getSmallMeteor_001(scene.variables.get("speedAlwaysMove"), scene);
                }
                
            },
            () => {return getSmallMeteor_001(scene.variables.get("speedAlwaysMove"), scene)}
        ],
        1
    );
    var timerSpavnArea1 = new Timer(scene.variables.get("meteorsSpavtTime"), () => {
        var mp = Timer.inMS(scene.variables.get("maxProgress"));
        if(progressTimer.time / mp > 0.02 ){
            spavnArea1.spavn(-1);
        }
        var newT = meteorsTimeSpavn - ((meteorsTimeSpavn / 3) * (mp - progressTimer.time) / mp);
        timerSpavnArea1.interval = Timer.inMS(newT);
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
        var currentR = scene.variables.get("rockrtCount");
        if(currentR <= 0){
            currentR = 1;
        }
        var rand = Math.random() * scene.variables.get("maxRockrtCount") / currentR;
        if(rand > 0.5){
            spavnAmmunition.spavn(-1);
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

    var playerFieldToStap = 2;

    function playerMoveToUp(){
        if(scene.variables.get("fuel") > 0){
            player.localVelocity.y += scene.variables.get("plaeyrSpeed");
            scene.variables.set("fuel", scene.variables.get("fuel") - playerFieldToStap);
        }
    }

    function playerMoveToDown(){
        if(scene.variables.get("fuel") > 0){
            player.localVelocity.y -= scene.variables.get("plaeyrSpeed");
            scene.variables.set("fuel", scene.variables.get("fuel") - playerFieldToStap);
        }
    }

    function playerMoveToLeft(){
        if(scene.variables.get("fuel") > 0){
            player.localVelocity.x += scene.variables.get("plaeyrSpeed");
            scene.variables.set("fuel", scene.variables.get("fuel") - playerFieldToStap);
        }
    }

    function playerMoveToRigth(){
        if(scene.variables.get("fuel") > 0){
            player.localVelocity.x -= scene.variables.get("plaeyrSpeed");
            scene.variables.set("fuel", scene.variables.get("fuel") - playerFieldToStap);
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

function CreateScrollArea(img, canvas, dx, dy, onclick){
    var area = new SensorArea(
        img,
        new Point(canvas.width/2 + dx, canvas.height/2 + dy),
        onclick,
        alwes, true
    );
    area.onResize = (c) =>{area.pos= new Point(c.width/2 + dx, c.height/2 + dy);};
    return area;
}

function CreateScrollUpArea(canvas, dx, dy, onclick){
    return CreateScrollArea(resources.get("ScrollUp"), canvas, dx, dy, onclick);
}

function CreateScrollDownArea(canvas, dx, dy, onclick){
    return CreateScrollArea(resources.get("ScrollDown"), canvas, dx, dy, onclick);
}

function createMainMenuText(textSrollY){
    var text = [
        "Сержант, в систему вторгся вражеский флот. Уже уничтожены модули дальней связи станции. Без них невозможно направить сообщение штаб космического флота о нападении. Возьмите разведывательный крейсер и доставите сообщение лично.", 
        "Незаметно пройти мимо кораблей противника можно только через пояс астероидов. Вам придется активно маневрировать, а при этом быстро расходуется запас топлива. К счастью в некоторых астероидах встречается урановая руда, реактор крейсера сможет работать и на ней. Смело разрушайте астероиды ракетами. Время от времени мы будем направлять в пояс контейнеры с боезапасом. ",
        "Вылетайте, как только сможете. Удачи.",
    ];
    return createImageWithText(text, "30", 633, 1500, textSrollY);
}

function getFontSize(){
    if(runOnMobile()){
        return 25;
    }
    else{
        return 30;
    }
}

function createButton(canvas, text, dx, dy, onclick){ 
    var fontSize = getFontSize();
    var img = resources.get("Button");
    var button = new SensorArea(
        img,
        new Point(canvas.width/2 + dx, canvas.height/2 + dy),
        onclick,
        alwes, true
    );
    var textHeigth = fontSize * text.length *1.2;
    var text = createImageWithTextSuper(text, fontSize, img.width, textHeigth, 0, "center", "0");
    button.beforeAfter = (c) => {c.drawImage(text, button.pos.x, button.pos.y + img.height / 2 - textHeigth / 2);};
    button.onResize = (c) =>{button.pos= new Point(c.width/2 + dx, c.height/2 + dy);};
    return button;
}

function CreateMenuScrean(canvas, text, textWidth, textOffsetX, img, buttons){
    var fontSize = getFontSize();
    var ctx = canvas.getContext("2d");
    var scene = new Scene(ctx);
    var beckFullColor = resources.get("BeckFullColor").nextFrame();
    scene.runOnMobile = !!('ontouchstart' in window);
    var textSrollY = 0;
    var textArea = createImageWithText(text, fontSize, textWidth, 1500, textSrollY);
    var heigthLimit = 1500;
    var scrollUpArea = CreateScrollUpArea(canvas, - textOffsetX - 90, -80, null);
    scrollUpArea.enable = false;
    var scrollDownArea = CreateScrollDownArea(canvas, - textOffsetX - 90, 0, null);
    scene.sensorAreas.areas = buttons;  
    scene.sensorAreas.addArea(scrollUpArea);
    scene.sensorAreas.addArea(scrollDownArea);
    textArea.onload = () => {
        scrollUpArea.action = () =>{ 
            if(textSrollY < 0){ 
                textSrollY += 10; 
            }
        }
        scrollDownArea.action  = () =>{
            if(textSrollY > -heigthLimit){
                textSrollY -= 10;
            }
        }
    };
    scene.drowBefore.push( (c) => {
        DrowInCenter(beckFullColor, c, canvas);
        c.drawImage(textArea, canvas.width / 2 - textOffsetX, canvas.height / 2 - 261 + textSrollY);
        DrowInCenter(img, c, canvas); 
        scrollUpArea.enable = textSrollY < 0;
        scrollDownArea.enable = textSrollY > -heigthLimit;
    } );
    return scene;
}

export function CreateMainMenu(canvas){
    var text = [
        "Сержант, в систему вторгся вражеский флот. Уже уничтожены модули дальней связи станции. Без них невозможно направить сообщение штаб космического флота о нападении. Возьмите разведывательный крейсер и доставите сообщение лично.", 
        "Незаметно пройти мимо кораблей противника можно только через пояс астероидов. Вам придется активно маневрировать, а при этом быстро расходуется запас топлива. К счастью в некоторых астероидах встречается урановая руда, реактор крейсера сможет работать и на ней. Смело разрушайте астероиды ракетами. Время от времени мы будем направлять в пояс контейнеры с боезапасом. ",
        "Вылетайте, как только сможете. Удачи.",
    ];
    var offsetX = 10;
    var offsetY = 140;
    var back = resources.get("Intro").nextFrame();
    var scene = CreateMenuScrean(canvas, text, 633, 220, back, []);
    var startNewGameArea = createButton(canvas, ["Приступить", "к заданию" ], -offsetX-280, offsetY, startNewGame(scene));
    var showHelpArea = createButton(canvas, ["Управление" ], offsetX, offsetY, showHelp(scene));
    scene.sensorAreas.addArea(startNewGameArea);
    scene.sensorAreas.addArea(showHelpArea);
    return scene;
}

export function CreateTryAgain(canvas){
    var text = [
        "Падение галактической империи происходило в абсолютной радио тишине. Вражеский флот, переходя из систем в систему, первыми залпами уничтожал модули дальней связи. Военные силы, находившиеся в это время в системах, были слишком разрознены. Они не могли противостоять значительно превосходящей военной мощи.",
        "Капитаны вели свои корабли в отчаянные атаки. Но каждый пал под градом вражеских залпов, так и не дождавшись подмоги.",
    ];
    var offsetY = 140;
    var back = resources.get("Message").nextFrame();
    var scene = CreateMenuScrean(canvas, text, 770, 360, back, []);
    var startNewGameArea = createButton(canvas, ["Попытаться", "снова" ], -140, offsetY, startNewGame(scene));
    scene.sensorAreas.addArea(startNewGameArea);
    return scene;
}

export function CreateRadio(canvas, nextLevel){
    var text = [
        "Станция вызывает разведчика...",
    ];
    var offsetY = 140;
    var back = resources.get("Radio").nextFrame();
    var scene = CreateMenuScrean(canvas, text, 633, 220, back, []);
    var startNewGameArea = createButton(canvas, ["Прием"], -140, offsetY, () => { scene.gotoScene = nextLevel;});
    scene.sensorAreas.addArea(startNewGameArea);
    return scene;
}

export function CreateIntro_2(canvas){
    var text = [
        "Сержант, отлично справляетесь, пройдена треть пути!", 
        "Далее будьте осторожнее, фронт сместился в сторону пояса астероидов. До Вас могут долетать отдельные вражеские торпеды.",
    ];
    var offsetY = 140;
    var back = resources.get("IntroRadio").nextFrame();
    var scene = CreateMenuScrean(canvas, text, 633, 220, back, []);
    var startNewGameArea = createButton(canvas, ["Продолжить"], -140, offsetY, () => { scene.gotoScene = "Level2";});
    scene.sensorAreas.addArea(startNewGameArea);
    return scene;
}

export function CreateIntro_3(canvas){
    var text = [
        "Сержант, рад Вас слышать! Осталась треть пути!",
        "Силы обороны отброшены к станции. Что бы хоть как то замедлить продвижение противника активированы магнитные мины. Часть из них была установлена в поясе астероидов. К несчастью это устаревшая модель — в них нет системы распознавания свой-чужой. Держитесь от них на расстоянии. Но даже если мина активировалась есть шанс, что быстрый корабль, наподобие Вашего, сможет от нее оторваться.",
        "Надеемся на Вас.",
    ];
    var offsetY = 140;
    var back = resources.get("IntroRadio").nextFrame();
    var scene = CreateMenuScrean(canvas, text, 633, 220, back, []);
    var startNewGameArea = createButton(canvas, ["Продолжить"], -140, offsetY, () => { scene.gotoScene = "Level3";});
    scene.sensorAreas.addArea(startNewGameArea);
    return scene;
}

export function CreateWinScrean(canvas){
    var text = [
        "Пояс астероидов внезапно закончился. Бортовой компьютер уже рассчитывал курс к штабу космического флота. Казалось это происходило чуть быстрее чем обычно. Мгновение и экран, холодным зеленым светом, высветил: «Расчет закончен. Включены ионные двигатели». Пучек частиц вырвался из сопла, толкая корабль в темноту космоса. Где-то позади, синими всполохами, шиты станции отзывались на алые шары взрывов, атакующие корабли несли разрушение непокорной станции. Впереди же, только размазанные точки звезд.",
        "Прошло не более пяти стандартных единиц времени, как началось торможение.  Компьютер, имея ключи высшего доступа, быстро получил курс на посадку. Штаб космического флота призывно манил корабль стыковочными огнями. Слабый удар по корпусу возвестил о стыковке. Быстрое выравнивание давления. Герметичная дверь открылась с легким шипением. В проеме стоял офицер штаба.",
    ];
    var offsetY = 140;
    var back = resources.get("BackWin").nextFrame();
    var scene = CreateMenuScrean(canvas, text, 633, 220, back, []);
    var startNewGameArea = createButton(canvas, ["Продолжить"], -140, offsetY, () => { scene.gotoScene = "Epilogue";});
    scene.sensorAreas.addArea(startNewGameArea);
    return scene;
}

export function CreateControlsScrean(canvas){
    var text = [
        "Управление крейсером не отличается от правления другими кораблями. Вся значимая информация отражается на экране командира корабля. В верхней части слева — прочность корпуса и запас топлива, справа — количество ракет."
    ];
    if(runOnMobile()){
        text.push("Управлять маневровыми двигателями можно сенсорными клавишами внизу экрана слева, клавиша внизу экрана справа отвечает за запуск ракет.");
    }
    else{
        text.push("Управлять маневровыми двигателями можно клавишами вверх, вниз, влево, вправо, клавиша пробел отвечает за запуск ракет.");
    }
    var offsetY = 140;
    var back = resources.get("Message").nextFrame();
    var scene = CreateMenuScrean(canvas, text, 770, 360, back, []);
    var startNewGameArea = createButton(canvas, ["Вернуться", "к брифингу" ], -140, offsetY, showMainMenu(scene));
    scene.sensorAreas.addArea(startNewGameArea);
    return scene;
}

export function CreateEpilogue(canvas){
    var text = [
        "Доставленное сообщение поможет спасти много жизней.",
        "Благодарю за службу!",
    ];
    var offsetY = 140;
    var back = resources.get("BackgroundWin").nextFrame();
    var scene = CreateMenuScrean(canvas, text, 633, 220, back, []);
    var startNewGameArea = createButton(canvas, ["Пройти игру", "сначала"], -140, offsetY, () => { scene.gotoScene = "MainMenu";});
    scene.sensorAreas.addArea(startNewGameArea);
    return scene;
}
