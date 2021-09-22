import * as _ from 'loadash';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const button = [];
let bullet = {};
let flyingBullet = [];
let i = 0;
let bulletBool;
let minBallSize: number = 80;
let maxBallSize: number = 120;
let color: string;
let player = {
    x : 150,
    y : 150,
    width : 65,
    height : 65,
    speed : 8,
};
let imgW, imgH;

const pallete: string[] = ["#9c88ff", "#0097e6", "#353b48", "#1B1464", "#ED4C67", "#FFC312"];
const playerImg = new Image;
playerImg.src = "images/circle.png";
const bulletImg = new Image;
bulletImg.src = "images/bullet.png";
const backgroundImg = new Image;
backgroundImg.src = "images/TileCosmos.png";
ctx.canvas.width  = window.innerWidth*4;                            // HERE is *2 because background is 3840px width, not 1920px
  ctx.canvas.height = window.innerHeight - 20;


console.log("canvas width = " + canvas.width + " canvas height = " + canvas.height);

backgroundImg.onload = function(){
    imgW = backgroundImg.width;
    imgH = backgroundImg.height;
}

function ballColor() {
    color = pallete[Math.floor(Math.random() * pallete.length)];
    console.log(color);
}

function randomBall() {

    ballColor()
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.fill();

}

function playerHitbox() {
    ctx.beginPath();
    ctx.arc(player.x,player.y,  player.width/2, 0, Math.PI * 2, true);
    ctx.fillStyle = "pink";
    ctx.fill();
}

function playerBallImg() {
    ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
}

playerBallImg();
//randomBall();

setInterval(function() {
    ctx.fillStyle = "#1B1464";
    //ctx.clearRect(0,0,canvas.width, canvas.height);                                
    //ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImg, i , 0,3840, canvas.height);                       // Background        
    ctx.drawImage(backgroundImg, i + 3840 , 0,3840, canvas.height);             // Second Background 
    ctx.drawImage(backgroundImg, i + 3840*2 , 0,3840, canvas.height);           //Third Backgorund
    ctx.drawImage(backgroundImg, i + 3840*3 , 0,3840, canvas.height);           //Fourth Background
    i -= 2;                                                                         // Speed of scrolling the background
    playerBallImg(); // Spawn Player
    //playerHitbox();
    //console.log(player.x, player.y);

    if (button["w"] && player.y >= 0) player.y-= player.speed;
    if (button["a"] && player.x >= 0) player.x-= player.speed;
    if (button["s"] && player.y <= canvas.height - player.height) player.y+= player.speed;
    if (button["d"] && player.x <= canvas.width - player.width) player.x+= player.speed;

    /* making shooting animation in rendering */
    /*if (bulletBool == true) {
        spawnBullet();
        ctx.fillStyle = "red";
        flyingBullet[i] += 50;
    }*/

    for (var e=0; e<flyingBullet.length; e++){
        ctx.fillStyle = "red";
        let bullets = flyingBullet[e];
        ctx.drawImage(bulletImg, bullets.x - bullets.width/2, bullets.y - bullets.height/2, bullets.width, bullets.height); 
        bullets.x += 35;
    }

}, 1000/60);

window.addEventListener("keydown", function(e){
    button[e.key] = 1;

    if (e.code === 'Space') {
        flyingBullet.push({
            width: 16,
            height: 10,
            x: player.x + player.width/2,
            y:player.y + player.height/2,
        })
      }
})

window.addEventListener("keyup", function(e){
    delete button[e.key];
})


console.log(canvas.x);