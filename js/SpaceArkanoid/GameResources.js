import {
    Resources,
    ImageSequence
} from "/js/2DGameEngine.js";

export var resources = new Resources();

resources.add("Player", "/SimpleGame/Sprites/Ships/Player.png");
resources.add("Player_L", "/SimpleGame/Sprites/Ships/Player_L.png");
resources.add("Player_R", "/SimpleGame/Sprites/Ships/Player_R.png");
resources.add("SpaceShip2", "/SimpleGame/Sprites/Ships/spaceShips_002.png");
resources.add("SpaceShip3", "/SimpleGame/Sprites/Ships/spaceShips_003.png");
resources.add("SpaceShip4", "/SimpleGame/Sprites/Ships/spaceShips_004.png");
resources.add("SpaceShip5", "/SimpleGame/Sprites/Ships/spaceShips_005.png");
resources.add("SpaceShip6", "/SimpleGame/Sprites/Ships/spaceShips_006.png");
resources.add("SpaceShip7", "/SimpleGame/Sprites/Ships/spaceShips_007.png");
resources.add("SpaceShip8", "/SimpleGame/Sprites/Ships/spaceShips_008.png");
resources.add("SpaceShip9", "/SimpleGame/Sprites/Ships/spaceShips_009.png");

resources.add("Rocket1", "/SimpleGame/Sprites/Missiles/spaceMissiles_001.png");


resources.add("Meteors1", "/SimpleGame/Sprites/Meteors/spaceMeteors_001.png");
resources.add("Meteors2", "/SimpleGame/Sprites/Meteors/spaceMeteors_002.png");
resources.add("Meteors3", "/SimpleGame/Sprites/Meteors/spaceMeteors_003.png");
resources.add("Meteors4", "/SimpleGame/Sprites/Meteors/spaceMeteors_004.png");

resources.add("Meteors5", "/SimpleGame/Sprites/Meteors/spaceMeteors_005.png");
resources.add("Meteors6", "/SimpleGame/Sprites/Meteors/spaceMeteors_006.png");

resources.add("BigExplosion", "/SimpleGame/Sprites/Effects/spaceEffects_016.png");


resources.add("Up", "/SimpleGame/Sprites/Interface/Up.png");
resources.add("Down", "/SimpleGame/Sprites/Interface/Down.png");
resources.add("Left", "/SimpleGame/Sprites/Interface/Left.png");
resources.add("Rigth", "/SimpleGame/Sprites/Interface/Rigth.png");
resources.add("Rockets", "/SimpleGame/Sprites/Interface/Rockets.png");
resources.add("Live", "/SimpleGame/Sprites/Interface/Live.png");
resources.add("Rocket1Icon", "/SimpleGame/Sprites/Interface/spaceMissiles_001.png");



resources.add("RocketAmmunition", "/SimpleGame/Sprites/Ammunition/Rocket.png");

//5ec65a4b3b937130fc36e1340bd52e14.gif

resources.add("Back", "/SimpleGame/Sprites/back.png");


resources.addSequence("SBigExplosion", [
    "/SimpleGame/Sprites/Effects/spaceEffects_008.png",
    "/SimpleGame/Sprites/Effects/spaceEffects_009.png",
    "/SimpleGame/Sprites/Effects/spaceEffects_010.png",
    "/SimpleGame/Sprites/Effects/spaceEffects_011.png",
    "/SimpleGame/Sprites/Effects/spaceEffects_012.png",
    "/SimpleGame/Sprites/Effects/spaceEffects_013.png",
    "/SimpleGame/Sprites/Effects/spaceEffects_014.png",
    "/SimpleGame/Sprites/Effects/spaceEffects_015.png",
    "/SimpleGame/Sprites/Effects/spaceEffects_016.png"
], 5);
