var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage, desert;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score, lives;

var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound


function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  desert = loadImage("desert.jpg")
   restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() {
  createCanvas(windowWidth - 500, windowHeight - 20);

  trex = createSprite(50, windowHeight - 320, 20, 50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.x = width / 2;

  trex.scale = 0.5;
  
  ground = createSprite(300, windowHeight - 300, 600, 20);
  ground.addImage("ground", groundImage);
  
  console.log(ground.width / 2);
  ground.x = ground.width / 2;

  
   gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  invisibleGround = createSprite(ground.width / 2, windowHeight - 290, ground.width, 10);
  invisibleGround.visible = false;
 
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();
  

  
  trex.setCollider("circle",0,0,40);
  
  trex.velocityX = 4
  score = 0;
  lives = 3;
  
}

function draw() {
  
  background(desert);
  //displaying score
  textSize(35);
  text("Score: " + score, 500 + camera.position.x - 200, 120);
  text("Lives left: " + lives, -500 + camera.position.x - 200, 120);
  
  
  if(gameState === PLAY){
    gameOver.visible = false
    restart.visible = false
    camera.position.x = trex.x
    //move the ground
    ground.velocityX = 0;
    //scoring
    score = score + Math.round(frameCount/60);
    
    if (camera.position.x + width / 2 > ground.x + ground.width / 2) {
      ground.x = camera.position.x;
      invisibleGround.x = camera.position.x;

    }
    //jump when the space key is pressed
    if(keyDown("space") &&
    trex.y >= windowHeight - 330) {
        trex.velocityY = -12;
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    lifecheck();
    if(lives <= 0){

      gameState = END
    }
  }
   else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    gameOver.x = trex.x;
    restart.x = trex.x;
    gameOver.y = windowHeight/2
    restart.y = windowHeight/2 +40
    //change the trex animation
    trex.changeAnimation("collided", trex_collided);

    //ground.velocityX = 0;
    trex.velocityY = 0;
    trex.velocityX = 0;

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);

    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);

    if (mousePressedOver(restart)) {
      reset();
    }
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  
  
  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(camera.position.x + windowWidth / 2, windowHeight - 320, 10, 40);
   obstacle.velocityX = 0;
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 700;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
     cloud = createSprite(camera.position.x + windowWidth / 2, trex.y - 40, 10, 40);
    cloud.y = Math.round(random(trex.y -10, trex.y - 60));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = 0;
    
     //assign lifetime to the variable
    cloud.lifetime = 700 ;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //adding cloud to the group
   cloudsGroup.add(cloud);
    }
}

function reset() {
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running", trex_running);
  score = 0;
  lives = 3;
}

function lifecheck(){
  if(obstaclesGroup.isTouching(trex)){
    lives = lives - 1;
    obstaclesGroup.destroyEach();
  }
}