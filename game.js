const canvas = document.getElementById("canvas")
const canvasContext = canvas.getContext('2d')
var interval;

window.onload = () => {
   gameLoop()

}

function randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function changeInterval(){

    clearInterval(interval)
    interval = setInterval(show, 1000 / snake.fps)
}

function gameLoop() {
   
   changeInterval()

}

function show() {
    
    update()
    draw()
}

function update() {
    canvasContext.clearRect(0, 0, canvas.width, canvas.height)
    snake.move()
    eatApple()
    checkHitWall()
}

function eatApple() {
    let amount = 1;
    if (snake.tail[snake.tail.length - 1].x == apple.x &&
        snake.tail[snake.tail.length - 1].y == apple.y) {
          
            snake.tail[snake.tail.length -1].last = false;
        let last = snake.tail[snake.tail.length] = { x: apple.x, y: apple.y, last: true }
        apple = new Apple();
        snake.point = apple.score

        let random = randomNumber(1, gapple.chance)

        if (random == gapple.chance) {
            gapple.isDisplay = true
        }
    }

    if (snake.tail[snake.tail.length - 1].x == gapple.x &&
        snake.tail[snake.tail.length - 1].y == gapple.y) {
        for (let i = 0; i < 3; i++) {
            snake.tail[snake.tail.length] = { x: gapple.x, y: gapple.y }
        }

        gapple = new GoldenApple();
        snake.point = gapple.score
    }

}

function checkHitWall() {
    let headTail = snake.tail[snake.tail.length - 1]

    if (headTail.x == - snake.size) {
        headTail.x = canvas.width - snake.size
    } else if (headTail.x == canvas.width) {
        headTail.x = 0
    } else if (headTail.y == - snake.size) {
        headTail.y = canvas.height - snake.size
    } else if (headTail.y == canvas.height) {
        headTail.y = 0
    }
    eatApple()
}

function clearDisplayScore() {

    let x = [apple.x, gapple.x]
    let y = [apple.y, gapple.y]

    setTimeout(() => {
        if (x.toString() != [apple.x, gapple.x].toString() || y.toString() != [apple.y, gapple.y].toString()) {
            clearDisplayScore()
        } else snake.point = null
    }, 1000)
}

async function alreadyExist(x, y, pos){
var exist = false;
for(let i = 0; i < snake.tail.length; i++){

if(i != pos){
    if(snake.tail[i].x == x && snake.tail[i].y == y) exist = true;
}
}
return exist

}

async function draw() {
    createRect(0, 0, canvas.width, canvas.height, "black")
    createRect(0, 0, canvas.width, canvas.height)

    for (let i = 0; i < snake.tail.length; i++) {
        let exist = await alreadyExist(snake.tail[i].x, snake.tail[i].y, i);
        createRect(snake.tail[i].x + 2.5, snake.tail[i].y + 2.5,
            snake.size - 5, snake.size - 5, snake.tail[snake.tail.length - 1] == snake.tail[i] ? "blue" : exist && !snake.tail[i].last ? "grey" :  "white")
           
    }

    canvasContext.font = "20px Arial"
    canvasContext.fillStyle = "#00FF42"
    canvasContext.fillText("Score: " + (snake.tail.length - 1), canvas.width - 120, 18)
    if (snake.point) {
        canvasContext.fillStyle = "#f04105"
        canvasContext.fillText("+ " + snake.point, 185, 200)

        clearDisplayScore()

    }
    createRect(apple.x, apple.y, apple.size, apple.size, apple.color)
    if (gapple.isDisplay) createRect(gapple.x, gapple.y, gapple.size, gapple.size, gapple.color)
}

function createRect(x, y, width, height, color) {
    canvasContext.fillStyle = color
    canvasContext.fillRect(x, y, width, height)
}

window.addEventListener("keypress", (event) => {

        if (!snake.isBoosted && event.keyCode == 32){
             snake.fps += 10
             changeInterval()
             snake.isBoosted = true
             
        }

})

window.addEventListener("keyup", (event) => {
        if (event.keyCode == 32){
             snake.fps -= 10
             changeInterval()
             snake.isBoosted = false
        }

})

window.addEventListener("keydown", (event) => {
    setTimeout(() => {
        if ((event.keyCode == 81) && snake.rotateX != 1) {
            snake.rotateX = -1
            snake.rotateY = 0
        } else if ((event.keyCode == 90) && snake.rotateY != 1) {
            snake.rotateX = 0
            snake.rotateY = -1
        } else if ((event.keyCode == 68) && snake.rotateX != -1) {
            snake.rotateX = 1
            snake.rotateY = 0
        } else if ((event.keyCode == 83) && snake.rotateY != -1) {
            snake.rotateX = 0
            snake.rotateY = 1
        } else if(event.keyCode == 82){
            window.location.reload()
        } else if(event.keyCode == 27){
            window.alert("Paused")
        }
    }, 1)
})

class Snake {
    constructor(x, y, size) {
        this.x = x
        this.y = y
        this.size = size
        this.tail = [{ x: this.x, y: this.y, last: true }]
        this.rotateX = 0
        this.rotateY = 1
        this.point = null
        this.fps = 10
        this.isBoosted = false

    }

    move() {
        let newRect

        if (this.rotateX == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x + this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateX == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x - this.size,
                y: this.tail[this.tail.length - 1].y
            }
        } else if (this.rotateY == 1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y + this.size
            }
        } else if (this.rotateY == -1) {
            newRect = {
                x: this.tail[this.tail.length - 1].x,
                y: this.tail[this.tail.length - 1].y - this.size
            }
        }

        this.tail.shift()
        this.tail.push(newRect)
    }
}

class GoldenApple {
    constructor() {
        let isTouching

        while (true) {
            isTouching = false;
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size
            if (this.x == apple.x && this.y == apple.y) this.y += 1

            for (let i = 0; i < snake.tail.length; i++) {
                if (this.x == snake.tail[i].x && this.y == snake.tail[i].y) {
                    isTouching = true
                }
            }

            this.size = snake.size
            this.color = "yellow"
            this.score = 3;
            this.chance = 5;
            this.isDisplay = false;

            if (!isTouching) {
                break;
            }
        }
    }
}

class Apple {
    constructor() {
        let isTouching

        while (true) {
            isTouching = false;
            this.x = Math.floor(Math.random() * canvas.width / snake.size) * snake.size
            this.y = Math.floor(Math.random() * canvas.height / snake.size) * snake.size

            for (let i = 0; i < snake.tail.length; i++) {
                if (this.x == snake.tail[i].x && this.y == snake.tail[i].y) {
                    isTouching = true
                }
            }

            this.size = snake.size
            this.color = "red"
            this.score = 1

            if (!isTouching) {
                break;
            }
        }
    }
}

const snake = new Snake(20, 20, 20);
let apple = new Apple();
let gapple = new GoldenApple();