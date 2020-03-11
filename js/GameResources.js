import {
    Resources,
    ImageSequence
} from "./2DGameEngine.js";

export var resources = new Resources();

resources.add("Player", "../Sprites/Ships/Player.png");

resources.add("Rocket1", "../Sprites/Missiles/spaceMissiles_001.png");


resources.add("Meteors1", "../Sprites/Meteors/spaceMeteors_001.png");
resources.add("Meteors2", "../Sprites/Meteors/spaceMeteors_002.png");
resources.add("Meteors3", "../Sprites/Meteors/spaceMeteors_003.png");
resources.add("Meteors4", "../Sprites/Meteors/spaceMeteors_004.png");

resources.add("Meteors5", "../Sprites/Meteors/spaceMeteors_005.png");
resources.add("Meteors6", "../Sprites/Meteors/spaceMeteors_006.png");

resources.add("FuelMeteor", "../Sprites/Meteors/fuelMeteor.png");


resources.add("Back", "../Sprites/Back/animatedBackground_0040.png");



resources.add("Up", "../Sprites/Interface/Up.png");
resources.add("Down", "../Sprites/Interface/Down.png");
resources.add("Left", "../Sprites/Interface/Left.png");
resources.add("Rigth", "../Sprites/Interface/Rigth.png");
resources.add("Rockets", "../Sprites/Interface/Rockets.png");
resources.add("Live", "../Sprites/Interface/Live.png");
resources.add("Rocket1Icon", "../Sprites/Interface/spaceMissiles_001.png");
resources.add("FuelIcon", "../Sprites/Interface/fuelIcon.png");
resources.add("StartNewGameButton", "../Sprites/Interface/NewGame.png");
resources.add("ShowHelpButton", "../Sprites/Interface/Controls.png");
resources.add("TryAgain", "../Sprites/Interface/TryAgain.png");
resources.add("Section", "../Sprites/Interface/Section.png");
resources.add("Section_H", "../Sprites/Interface/Section_H.png");
resources.add("RocketAmmunition", "../Sprites/Ammunition/Rocket.png");
resources.add("TheGameIsLost", "../Sprites/Interface/theGameIsLost.png");
resources.add("ToBeak", "../Sprites/Interface/ToBeak.png");
resources.add("Intro", "../Sprites/Interface/Intro.png");
resources.add("BackgroundWin", "../Sprites/Interface/BackgroundWin.png");
resources.add("ControlsScrean", "../Sprites/Interface/ControlsScrean.png");
resources.add("ControlsScreanMobile", "../Sprites/Interface/ControlsScreanMobile.png");

resources.addSequence("SBigExplosion", [
    "../Sprites/Effects/Explosion_1.png",
    "../Sprites/Effects/Explosion_2.png",
    "../Sprites/Effects/Explosion_3.png",
    "../Sprites/Effects/Explosion_4.png",
    "../Sprites/Effects/Explosion_5.png",
    "../Sprites/Effects/Explosion_6.png",
    "../Sprites/Effects/Explosion_7.png"
], 5);

resources.addSequence("SMeteorExplosion", [
    "../Sprites/Effects/MeteorExplosion_001.png",
    "../Sprites/Effects/MeteorExplosion_002.png",
    "../Sprites/Effects/MeteorExplosion_003.png",
    "../Sprites/Effects/MeteorExplosion_004.png",
    "../Sprites/Effects/MeteorExplosion_005.png",
    "../Sprites/Effects/MeteorExplosion_006.png",
    "../Sprites/Effects/MeteorExplosion_007.png",
    "../Sprites/Effects/MeteorExplosion_008.png"
], 5);
