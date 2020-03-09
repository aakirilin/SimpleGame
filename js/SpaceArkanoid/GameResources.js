import {
    Resources,
    ImageSequence
} from "/js/2DGameEngine.js";

export var resources = new Resources();

resources.add("Player", "/SimpleGame/Sprites/Ships/Player.png");

resources.add("Rocket1", "/SimpleGame/Sprites/Missiles/spaceMissiles_001.png");


resources.add("Meteors1", "/SimpleGame/Sprites/Meteors/spaceMeteors_001.png");
resources.add("Meteors2", "/SimpleGame/Sprites/Meteors/spaceMeteors_002.png");
resources.add("Meteors3", "/SimpleGame/Sprites/Meteors/spaceMeteors_003.png");
resources.add("Meteors4", "/SimpleGame/Sprites/Meteors/spaceMeteors_004.png");

resources.add("Meteors5", "/SimpleGame/Sprites/Meteors/spaceMeteors_005.png");
resources.add("Meteors6", "/SimpleGame/Sprites/Meteors/spaceMeteors_006.png");

resources.add("FuelMeteor", "/SimpleGame/Sprites/Meteors/fuelMeteor.png");


resources.add("Back", "/SimpleGame/Sprites/Back/animatedBackground_0040.png");



resources.add("Up", "/SimpleGame/Sprites/Interface/Up.png");
resources.add("Down", "/SimpleGame/Sprites/Interface/Down.png");
resources.add("Left", "/SimpleGame/Sprites/Interface/Left.png");
resources.add("Rigth", "/SimpleGame/Sprites/Interface/Rigth.png");
resources.add("Rockets", "/SimpleGame/Sprites/Interface/Rockets.png");
resources.add("Live", "/SimpleGame/Sprites/Interface/Live.png");
resources.add("Rocket1Icon", "/SimpleGame/Sprites/Interface/spaceMissiles_001.png");
resources.add("FuelIcon", "/SimpleGame/Sprites/Interface/fuelIcon.png");
resources.add("StartNewGameButton", "/SimpleGame/Sprites/Interface/NewGame.png");
resources.add("ShowHelpButton", "/SimpleGame/Sprites/Interface/Controls.png");
resources.add("TryAgain", "/SimpleGame/Sprites/Interface/TryAgain.png");
resources.add("Section", "/SimpleGame/Sprites/Interface/Section.png");
resources.add("Section_H", "/SimpleGame/Sprites/Interface/Section_H.png");
resources.add("RocketAmmunition", "/SimpleGame/Sprites/Ammunition/Rocket.png");
resources.add("TheGameIsLost", "/SimpleGame/Sprites/Interface/theGameIsLost.png");
resources.add("ToBeak", "/SimpleGame/Sprites/Interface/ToBeak.png");
resources.add("Intro", "/SimpleGame/Sprites/Interface/Intro.png");
resources.add("BackgroundWin", "/SimpleGame/Sprites/Interface/BackgroundWin.png");
resources.add("ControlsScrean", "/SimpleGame/Sprites/Interface/ControlsScrean.png");
resources.add("ControlsScreanMobile", "/SimpleGame/Sprites/Interface/ControlsScreanMobile.png");

resources.addSequence("SBigExplosion", [
    "/SimpleGame/Sprites/Effects/Explosion_1.png",
    "/SimpleGame/Sprites/Effects/Explosion_2.png",
    "/SimpleGame/Sprites/Effects/Explosion_3.png",
    "/SimpleGame/Sprites/Effects/Explosion_4.png",
    "/SimpleGame/Sprites/Effects/Explosion_5.png",
    "/SimpleGame/Sprites/Effects/Explosion_6.png",
    "/SimpleGame/Sprites/Effects/Explosion_7.png"
], 5);

resources.addSequence("SMeteorExplosion", [
    "/SimpleGame/Sprites/Effects/MeteorExplosion_001.png",
    "/SimpleGame/Sprites/Effects/MeteorExplosion_002.png",
    "/SimpleGame/Sprites/Effects/MeteorExplosion_003.png",
    "/SimpleGame/Sprites/Effects/MeteorExplosion_004.png",
    "/SimpleGame/Sprites/Effects/MeteorExplosion_005.png",
    "/SimpleGame/Sprites/Effects/MeteorExplosion_006.png",
    "/SimpleGame/Sprites/Effects/MeteorExplosion_007.png",
    "/SimpleGame/Sprites/Effects/MeteorExplosion_008.png"
], 5);
