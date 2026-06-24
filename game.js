const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player
const player = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 120,
    width: 80,
    height: 80
};

let score = 0;
let gameOver = false;

let objects = [];

let spawnInterval = 1500;
let fallSpeed = 9;

let lastSpawn = 0;

// Load images
const playerImg = new Image();
playerImg.src = "assets/player.png";

const mangoImg = new Image();
mangoImg.src = "assets/mango.png";

const yarnImg = new Image();
yarnImg.src = "assets/yarn.png";

const bgImg = new Image();
bgImg.src = "assets/background.png";

// Mouse control
canvas.addEventListener("mousemove", (e) => {
    player.x = e.clientX - player.width / 2;
});

// Touch control
canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();

    player.x =
        e.touches[0].clientX -
        player.width / 2;
}, { passive: false });

// Create falling object
function spawnObject() {

    const type =
        Math.random() < 0.5
            ? "mango"
            : "yarn";

    objects.push({
        x: Math.random() * (canvas.width - 50),
        y: -50,
        width: 50,
        height: 50,
        type: type
    });
}

// Collision check
function isColliding(a, b) {

    return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
    );
}

function update(deltaTime) {

    if (gameOver) return;

    const speedMultiplyer = deltaTime / 16.67;
    const groundY = player.y + player.height;

    if (
        Date.now() - lastSpawn >
        spawnInterval
    ) {
        spawnObject();
        lastSpawn = Date.now();
    }

    for (
        let i = objects.length - 1;
        i >= 0;
        i--
    ) {

        let obj = objects[i];

        obj.y += fallSpeed * speedMultiplyer;

        // Catch
        if (
            isColliding(player, obj)
        ) {

            score++;

            objects.splice(i, 1);

            // Difficulty scaling
            if (score % 10 === 0) {

                fallSpeed += 2;

                spawnInterval =
                    Math.max(
                        400,
                        spawnInterval - 100
                    );
            }

            continue;
        }

        // Missed item
        if (
            obj.y + obj.height >= groundY 
        ) {
            gameOver = true;
        }
    }
}

function drawBackground() {

    if (bgImg.complete) {

        ctx.drawImage(
            bgImg,
            0,
            0,
            canvas.width,
            canvas.height
        );

    } else {

        ctx.fillStyle = "#87CEEB";
        ctx.fillRect(
            0,
            0,
            canvas.width,
            canvas.height
        );
    }
}

function drawPlayer() {

    if (
        playerImg.complete &&
        playerImg.naturalWidth > 0
    ) {

        ctx.drawImage(
            playerImg,
            player.x,
            player.y,
            player.width,
            player.height
        );

    } else {

        ctx.fillStyle = "hotpink";
        ctx.fillRect(
            player.x,
            player.y,
            player.width,
            player.height
        );
    }
}

function drawObjects() {

    for (let obj of objects) {

        let image =
            obj.type === "mango"
                ? mangoImg
                : yarnImg;

        if (
            image.complete &&
            image.naturalWidth > 0
        ) {

            ctx.drawImage(
                image,
                obj.x,
                obj.y,
                obj.width,
                obj.height
            );

        } else {

            ctx.font = "40px Arial";

            ctx.fillText(
                obj.type === "mango"
                    ? "🥭"
                    : "🧶",
                obj.x,
                obj.y + 40
            );
        }
    }
}

function drawScore() {

    ctx.fillStyle = "white";

    ctx.font =
        "bold 32px Arial";

    ctx.fillText(
        "Score: " + score,
        20,
        50
    );
}

function drawGameOver() {

    ctx.fillStyle =
        "rgba(0,0,0,0.7)";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    ctx.fillStyle = "white";

    ctx.textAlign = "center";

    ctx.font =
        "48px Arial";

    ctx.fillText(
        "GAME OVER",
        canvas.width / 2,
        canvas.height / 2 - 80
    );

    ctx.font =
        "32px Arial";

    ctx.fillText(
        `Final Score: ${score}`,
        canvas.width / 2,
        canvas.height / 2 - 20
    );

    ctx.fillText(
        "🎉 Happy Birthday! 🎉",
        canvas.width / 2,
        canvas.height / 2 + 40
    );

    ctx.font =
        "24px Arial";

}

function draw() {

    drawBackground();

    drawObjects();

    drawPlayer();

    drawScore();

    if (gameOver) {
        drawGameOver();
    }
}

let lastTime = 0;

function gameLoop(timestamp) {

    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    update(deltaTime);

    draw();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

window.addEventListener(
    "resize",
    () => {

        canvas.width =
            window.innerWidth;

        canvas.height =
            window.innerHeight;

        player.y =
            canvas.height - 120;
    }
);