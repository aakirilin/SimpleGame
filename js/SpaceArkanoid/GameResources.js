import {
    Resources,
    ImageSequence
} from "/SimpleGame/js/2DGameEngine.js";

export var resources = new Resources();

resources.add("Player", "/SimpleGame/SimpleGame/Sprites/Ships/Player.png");

resources.add("Rocket1", "/SimpleGame/SimpleGame/Sprites/Missiles/spaceMissiles_001.png");


resources.add("Meteors1", "/SimpleGame/SimpleGame/Sprites/Meteors/spaceMeteors_001.png");
resources.add("Meteors2", "/SimpleGame/SimpleGame/Sprites/Meteors/spaceMeteors_002.png");
resources.add("Meteors3", "/SimpleGame/SimpleGame/Sprites/Meteors/spaceMeteors_003.png");
resources.add("Meteors4", "/SimpleGame/SimpleGame/Sprites/Meteors/spaceMeteors_004.png");

resources.add("Meteors5", "/SimpleGame/SimpleGame/Sprites/Meteors/spaceMeteors_005.png");
resources.add("Meteors6", "/SimpleGame/SimpleGame/Sprites/Meteors/spaceMeteors_006.png");

resources.add("FuelMeteor", "/SimpleGame/SimpleGame/Sprites/Meteors/fuelMeteor.png");


resources.add("Back", "/SimpleGame/SimpleGame/Sprites/Back/animatedBackground_0040.png");



resources.add("Up", "/SimpleGame/SimpleGame/Sprites/Interface/Up.png");
resources.add("Down", "/SimpleGame/SimpleGame/Sprites/Interface/Down.png");
resources.add("Left", "/SimpleGame/SimpleGame/Sprites/Interface/Left.png");
resources.add("Rigth", "/SimpleGame/SimpleGame/Sprites/Interface/Rigth.png");
resources.add("Rockets", "/SimpleGame/SimpleGame/Sprites/Interface/Rockets.png");
resources.add("Live", "/SimpleGame/SimpleGame/Sprites/Interface/Live.png");
resources.add("Rocket1Icon", "/SimpleGame/SimpleGame/Sprites/Interface/spaceMissiles_001.png");
resources.add("FuelIcon", "/SimpleGame/SimpleGame/Sprites/Interface/fuelIcon.png");
resources.add("StartNewGameButton", "/SimpleGame/SimpleGame/Sprites/Interface/NewGame.png");
resources.add("ShowHelpButton", "/SimpleGame/SimpleGame/Sprites/Interface/Controls.png");
resources.add("TryAgain", "/SimpleGame/SimpleGame/Sprites/Interface/TryAgain.png");
resources.add("Section", "/SimpleGame/SimpleGame/Sprites/Interface/Section.png");
resources.add("Section_H", "/SimpleGame/SimpleGame/Sprites/Interface/Section_H.png");
resources.add("RocketAmmunition", "/SimpleGame/SimpleGame/Sprites/Ammunition/Rocket.png");
resources.add("TheGameIsLost", "/SimpleGame/Sprites/Interface/theGameIsLost.png");
resources.add("ToBeak", "/SimpleGame/SimpleGame/Sprites/Interface/ToBeak.png");
resources.add("Intro", "/SimpleGame/SimpleGame/Sprites/Interface/Intro.png");
resources.add("BackgroundWin", "/SimpleGame/SimpleGame/Sprites/Interface/BackgroundWin.png");
resources.add("ControlsScrean", "/SimpleGame/SimpleGame/Sprites/Interface/ControlsScrean.png");
resources.add("ControlsScreanMobile", "/SimpleGame/SimpleGame/Sprites/Interface/ControlsScreanMobile.png");

resources.addSequence("SBigExplosion", [
    "/SimpleGame/SimpleGame/Sprites/Effects/Explosion_1.png",
    "/SimpleGame/SimpleGame/Sprites/Effects/Explosion_2.png",
    "/SimpleGame/SimpleGame/Sprites/Effects/Explosion_3.png",
    "/SimpleGame/SimpleGame/Sprites/Effects/Explosion_4.png",
    "/SimpleGame/SimpleGame/Sprites/Effects/Explosion_5.png",
    "/SimpleGame/SimpleGame/Sprites/Effects/Explosion_6.png",
    "/SimpleGame/SimpleGame/Sprites/Effects/Explosion_7.png"
], 5);

resources.addSequence("SMeteorExplosion", [
    "/SimpleGame/SimpleGame/Sprites/Effects/MeteorExplosion_001.png",
    "/SimpleGame/SimpleGame/Sprites/Effects/MeteorExplosion_002.png",
    "/SimpleGame/SimpleGame/Sprites/Effects/MeteorExplosion_003.png",
    "/SimpleGame/SimpleGame/Sprites/Effects/MeteorExplosion_004.png",
    "/SimpleGame/SimpleGame/Sprites/Effects/MeteorExplosion_005.png",
    "/SimpleGame/SimpleGame/Sprites/Effects/MeteorExplosion_006.png",
    "/SimpleGame/SimpleGame/Sprites/Effects/MeteorExplosion_007.png",
    "/SimpleGame/SimpleGame/Sprites/Effects/MeteorExplosion_008.png"
], 5);
