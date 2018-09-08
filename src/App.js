import React, { Component } from "react"
import Canvas from "./Canvas"
import AppWrapper from "./AppWrapper"

class App extends Component {
  constructor() {
    super()
    this.canvas = {
      width: 900,
      height: 900
    }
    this.ship = {
      x: 0,
      y: 0,
      width: 5,
      height: 5,
      speed: 10,
      directions: {
        up: 0,
        down: 0,
        left: 0,
        right: 0
      }
    }
    this.rocks = []
    this.rockConfig = {
      rocksAmount: 50,
      rockSpeed: 2,
      width: 5,
      height: 5
    }
    this.onKeyDown = this.onKeyDown.bind(this)
    this.onKeyUp = this.onKeyUp.bind(this)
  }

  componentDidMount() {
    this.ctx = this.canvasRef.getContext("2d")
    document.addEventListener("keydown", this.onKeyDown)
    document.addEventListener("keyup", this.onKeyUp)
    this.initCanvas()
    this.start()
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown)
    document.removeEventListener("keyup", this.onKeyUp)
  }

  initCanvas() {
    this.ship.x = (this.canvas.width - this.ship.width) / 2
    this.ship.y = (this.canvas.height - this.ship.height) / 2
    this.drawShip()
  }

  start() {
    const self = this
    this.interval = setInterval(() => {
      self.clearCanvas()
      self.moveShip()
      self.generateRocks()
      self.moveRocks()
      self.drawShip()
      self.drawRocks()
      self.survive()
    }, this.ship.speed)
  }

  moveShip() {
    this.ship.x += this.ship.directions.right - this.ship.directions.left
    this.ship.y += this.ship.directions.down - this.ship.directions.up
  }

  drawShip() {
    this.ctx.fillStyle = "red"
    this.ctx.fillRect(
      this.ship.x,
      this.ship.y,
      this.ship.width,
      this.ship.height
    )
  }

  generateRocks() {
    if (this.rocks.length < this.rockConfig.rocksAmount) {
      for (
        let i = 0;
        i < this.rockConfig.rocksAmount - this.rocks.length;
        i++
      ) {
        this.rocks.push(this.generateRock())
      }
    }
  }

  generateRock() {
    let rock = {}
    switch (this.randomDirection) {
      case "up":
        rock = {
          x: this.randomLocation,
          y: 0
        }
        break
      case "down":
        rock = {
          x: this.randomLocation,
          y: this.canvas.height
        }
        break
      case "left":
        rock = {
          x: 0,
          y: this.randomLocation
        }
        break
      case "right":
        rock = {
          x: this.canvas.width,
          y: this.randomLocation
        }
        break
      default:
        break
    }
    rock.unitVector = this.getUnitVector(rock)
    return rock
  }

  get randomDirection() {
    const directions = ["up", "down", "left", "right"]
    return directions[this.getRandom(4) - 1]
  }

  get randomLocation() {
    return this.getRandom(this.canvas.width)
  }

  getRandom(max) {
    return Math.floor(Math.random() * max) + 1
  }

  getUnitVector(rock) {
    const vx = this.ship.x - rock.x
    const vy = this.ship.y - rock.y
    return {
      x: vx / Math.sqrt(vx * vx + vy * vy),
      y: vy / Math.sqrt(vx * vx + vy * vy)
    }
  }

  moveRocks() {
    const newRocks = []
    this.rocks.forEach(rock => {
      rock.x += rock.unitVector.x * this.rockConfig.rockSpeed
      rock.y += rock.unitVector.y * this.rockConfig.rockSpeed
      if (
        rock.x >= 0 &&
        rock.x <= this.canvas.width &&
        rock.y >= 0 &&
        rock.y <= this.canvas.height
      ) {
        newRocks.push(rock)
      }
    })
    this.rocks = newRocks
  }

  drawRocks() {
    this.ctx.fillStyle = "green"
    this.rocks.forEach(rock => {
      this.ctx.fillRect(
        rock.x,
        rock.y,
        this.rockConfig.width,
        this.rockConfig.height
      )
    })
  }

  survive() {
    this.rocks.forEach(rock => {
      for (
        let i = Math.floor(this.ship.x);
        i < this.ship.width + Math.floor(this.ship.x);
        i++
      ) {
        for (
          let j = Math.floor(this.ship.y);
          j < this.ship.height + Math.floor(this.ship.y);
          j++
        ) {
          for (
            let k = Math.floor(rock.x);
            k < this.rockConfig.width + Math.floor(rock.x);
            k++
          ) {
            for (
              let l = Math.floor(rock.y);
              l < this.rockConfig.height + Math.floor(rock.y);
              l++
            ) {
              if (i === k && j === l) {
                clearInterval(this.interval)
              }
            }
          }
        }
      }
    })
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  onKeyDown(event) {
    switch (event.code) {
      case "ArrowUp":
        this.ship.directions.up = 1
        break
      case "ArrowDown":
        this.ship.directions.down = 1
        break
      case "ArrowLeft":
        this.ship.directions.left = 1
        break
      case "ArrowRight":
        this.ship.directions.right = 1
        break
      default:
        break
    }
  }

  onKeyUp(event) {
    switch (event.code) {
      case "ArrowUp":
        this.ship.directions.up = 0
        break
      case "ArrowDown":
        this.ship.directions.down = 0
        break
      case "ArrowLeft":
        this.ship.directions.left = 0
        break
      case "ArrowRight":
        this.ship.directions.right = 0
        break
      default:
        break
    }
  }

  render() {
    return (
      <AppWrapper>
        <Canvas
          innerRef={ref => (this.canvasRef = ref)}
          width={this.canvas.width}
          height={this.canvas.height}
        />
      </AppWrapper>
    )
  }
}

export default App
