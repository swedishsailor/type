"use strict";
exports.__esModule = true;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var button = [];
var flyingBullet = [];
var scrollingSpeed = -2; // It is ALWAYS added to an object that is not moving with background
var counter = 0;
var time, actual;
var color;
var gameState = false;
var expframeTime = 0;
var expthisFrame = 0;
var playerIsDead = false;
var canIMove = true;
var gameInterval;
var player = {
    x: 75,
    y: 445,
    width: 128,
    height: 128,
    speed: 8,
    thisFrame: 0,
    frameTime: 0,
    radius: 128,
    score: 0
};
var nrFloatingEnemies = 0; // Count every floating enemy
var maxFloatingEnemies = 160; // How many floating enemies should spawn
var floatingEnemy = [];
var pallete = ["#9c88ff", "#0097e6", "#353b48", "#1B1464", "#ED4C67", "#FFC312"];
/*  IMAGES  */
var playerImg = new Image;
playerImg.src = "images/playerAnim128.png";
var bulletImg = new Image;
bulletImg.src = "images/bullet.png";
var backgroundImg = new Image;
backgroundImg.src = "images/TileCosmos.png";
var floatingEnemyImg = new Image;
floatingEnemyImg.src = "images/enemy.png";
var bombImg = new Image;
bombImg.src = "images/bomb.png";
var playerDeathImg = new Image;
playerDeathImg.src = "images/explosion.png";
var bulletExplosionImg = new Image;
bulletExplosionImg.src = "images/shoot.png";
var testBoom = new Image;
testBoom.src = "images/testBoom.png";
/* SELECTORS */
var playButton = document.querySelector('#playBtn');
var menuDiv = document.querySelector('.menu');
var pauseDiv = document.querySelector('#pauseScreen');
var mainMenuButton = document.querySelector('.mainMenuButton');
var mainMenuButton2 = document.querySelector('.mainMenuButton2');
var restartDiv = document.querySelector('#restartScreen');
var instructionsButton = document.querySelector('.instructionsButton');
var instructionDiv = document.getElementById('instructions');
var backButton = document.querySelector('.fas');
ctx.canvas.width = window.innerWidth * 4; // HERE is *2 because background is 3840px width, not 1920px
ctx.canvas.height = window.innerHeight - 20;
console.log("canvas width = " + canvas.width + " canvas height = " + canvas.height);
function showInstructions() {
    menuDiv.classList.add('hide');
    instructionDiv.style.display = "block";
}
function floatingEnemyLogic() {
    var enemiesNr = floatingEnemy.length;
    for (var i = 0; i < enemiesNr; i++) {
        floatingEnemy[i].x += Math.floor(Math.random() * 14 + 1);
        floatingEnemy[i].y += Math.floor(Math.random() * 14 + 1);
        floatingEnemy[i].x += scrollingSpeed / 500; // Moving floating enemies a bit like a background is scrolling to not let them stay in the main screen forever
        floatingEnemy[i].x -= Math.floor(Math.random() * 14 + 1);
        floatingEnemy[i].y -= Math.floor(Math.random() * 14 + 1);
        if (floatingEnemy[i].hp <= 0) {
            floatingEnemy[i].x = 0;
            floatingEnemy[i].y = -150;
        }
    }
}
function reloadPage() {
    window.location.reload();
}
function drawPlayer() {
    player.frameTime += 0.9;
    player.frameTime = player.frameTime % 20;
    player.thisFrame = Math.round(player.frameTime / 10);
    ctx.drawImage(playerImg, player.width * player.thisFrame, 0, player.width, player.height, player.x, player.y, player.width, player.height);
}
function enemyGotShot(enemy, damage) {
    enemy.hp -= damage;
    time += 0.5;
    time = time % 20;
    actual = Math.round(time / 10);
    //ctx.drawImage(bulletExplosionImg, 100 * 3, 0, 100, 100, enemy.x,enemy.y , 100, 100); // EXPLOSION ANIM FOR LATER
    ctx.drawImage(testBoom, enemy.x, enemy.y, 100, 100);
}
function playerDies() {
    expframeTime += 6.9;
    expframeTime = expframeTime % 710;
    expthisFrame = Math.round(expframeTime / 10);
    var deadX = player.x;
    var deadY = player.y;
    playerImg.src = "images/empty.png";
    canIMove = false;
    ctx.drawImage(playerDeathImg, 100 * expthisFrame, 0, 100, 100, deadX - 18 * 2, deadY - 18 * 2, 100 * 2, 100 * 2);
    setTimeout(function () {
        clearInterval(gameInterval);
        restartDiv.classList.remove('hide');
    }, 1600); // Cancel set interval adter explosion animation
}
function collision(object1, object2, colliderObject) {
    var dx = object1.x - object2.x;
    var dy = object1.y - object2.y;
    var distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < object1.radius + object2.radius) {
        if (colliderObject == 'player') {
            playerIsDead = true; // When collied, player is dead
        }
        if (colliderObject == 'playerBullet') {
            object1.x = 0;
            object1.y = -100;
            enemyGotShot(object2, object1.damage);
        }
        if (colliderObject == 'playerBullet' && object1.range >= 50) {
            object1.x = 0;
            object1.y = -100;
        }
    }
}
/* Main Functions init BELOW */
// Clicking button PLAY  in menu
playButton.addEventListener('click', function () {
    menuDiv.classList.add('hide');
    gameState = true;
    Game();
});
/* START and body of the game itself */
function Game() {
    if (gameState == true) {
        clearInterval(gameInterval);
        gameInterval = setInterval(function () {
            ctx.fillStyle = "#1B1464";
            //ctx.clearRect(0,0,canvas.width, canvas.height);                                
            //ctx.fillRect(0, 0, canvas.width, canvas.height);
            window.onload = ctx.drawImage(backgroundImg, scrollingSpeed, 0, 3840, canvas.height); // Background        
            ctx.drawImage(backgroundImg, scrollingSpeed + 3840, 0, 3840, canvas.height); // Second Background 
            ctx.drawImage(backgroundImg, scrollingSpeed + 3840 * 2, 0, 3840, canvas.height); //Third Backgorund
            ctx.drawImage(backgroundImg, scrollingSpeed + 3840 * 3, 0, 3840, canvas.height); //Fourth Background
            scrollingSpeed -= 2; // Speed of scrolling the background
            drawPlayer(); // Spawn Player
            // Draw floating enemies on canvas
            while (nrFloatingEnemies <= maxFloatingEnemies) {
                nrFloatingEnemies++;
                floatingEnemy.push({
                    x: Math.floor(Math.random() * 13000 + 250),
                    y: Math.floor(Math.random() * 1000 + 10),
                    width: 128,
                    height: 128,
                    radius: 0 - 10,
                    hp: 15,
                    score: 100
                });
            }
            //playerHitbox();
            // Drawing floating blue enemy
            for (var x = 0; x < floatingEnemy.length; x++) {
                ctx.drawImage(floatingEnemyImg, floatingEnemy[x].x, floatingEnemy[x].y, floatingEnemy[x].width, floatingEnemy[x].height);
                collision(player, floatingEnemy[x], 'player'); // COLLISION player with floating enemy
            }
            floatingEnemyLogic(); // Apply a logic to the enemy
            //ctx.drawImage(bombImg, 755 + scrollingSpeed, 466, 64, 64); // drawing random bomb ! IMPORTANT
            if (canIMove == true) {
                if ((button["w"] || button["W"]) && player.y >= 0)
                    player.y -= player.speed;
                if ((button["a"] || button["A"]) && player.x >= 0)
                    player.x -= player.speed;
                if ((button["s"] || button["S"]) && player.y <= canvas.height - player.height)
                    player.y += player.speed;
                if ((button["d"] || button["D"]) && player.x <= canvas.width - player.width)
                    player.x += player.speed;
            }
            if (button["Escape"]) { // On ESCAPE click go back to menu
                clearInterval(gameInterval);
                pauseDiv.classList.remove('hide');
                /*menuDiv.classList.remove('hide');
                gameState = false;*/
            }
            /* Player bullets maker */
            for (var e = 0; e < flyingBullet.length; e++) {
                ctx.fillStyle = "red";
                var bullets = flyingBullet[e];
                ctx.drawImage(bulletImg, bullets.x - bullets.width / 2, bullets.y - bullets.height / 2, bullets.width, bullets.height);
                bullets.x += 25;
                bullets.range++;
                for (var x = 0; x < floatingEnemy.length; x++) {
                    collision(bullets, floatingEnemy[x], 'playerBullet');
                    if (bullets.range >= 20) { // Delete the bullet after reaching amount of range
                        bullets.x = 0;
                        bullets.y = -150;
                    }
                }
            }
            if (playerIsDead == true) {
                playerDies();
            }
            /* COLLISIONS */
        }, 1000 / 60);
    }
}
// Overwrite a char + add creating bullet on Space press
window.addEventListener("keydown", function (e) {
    button[e.key] = 1;
    if (e.code === 'Space' || (e.code === 'Space' && (button["w"] || button["W"])) || (e.code === 'Space' && (button["a"] || button["A"])) || (e.code === 'Space' && (button["s"] || button["S"])) || (e.code === 'Space' && (button["d"] || button["D"]))) {
        flyingBullet.push({
            width: 24,
            height: 24,
            x: player.x + player.width / 2 + 50,
            y: player.y + player.height / 2,
            radius: 30,
            damage: 5,
            range: 0
        });
    }
    // If ENTER is pressed when the game is paused, unpause it
    if (e.code == 'Enter') {
        pauseDiv.classList.add('hide');
        gameState = true;
        Game();
    }
});
// Creating bullet on clicking in window
window.addEventListener("click", function (e) {
    flyingBullet.push({
        width: 24,
        height: 24,
        x: player.x + player.width / 2 + 50,
        y: player.y + player.height / 2,
        radius: 50,
        damage: 5,
        range: 0
    });
});
backButton.addEventListener('click', function () {
    menuDiv.classList.remove('hide');
    instructionDiv.style.display = "none";
});
instructionsButton.addEventListener('click', function () {
    showInstructions();
});
window.addEventListener("keyup", function (e) {
    delete button[e.key];
});
// When paused, on press main menu display menu and turn the game from hte start IT'S FROM GAME PAUSE
mainMenuButton.addEventListener('click', function () {
    clearInterval(gameInterval);
    pauseDiv.classList.add('hide');
    menuDiv.classList.remove('hide');
    reloadPage();
});
// On game over press main menu to refresh the game IT'S FROM GAME OVER SCREEN!
mainMenuButton2.addEventListener('click', function () {
    clearInterval(gameInterval);
    restartDiv.classList.add('hide');
    menuDiv.classList.remove('hide');
    reloadPage();
});
