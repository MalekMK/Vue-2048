<template>
  <div>
    <div>
      <div class="settings">
      <button style="padding:10px 80px" @click="buttonClicked()">{{buttonValue}}</button>
      <div style="padding:40px 0">
        <input
          @click="changeGridLength()"
          class="radioInput"
          type="radio"
          id="three"
          :value="3"
          v-model="gridLength"
        />
        <label for="three">3</label>
        <input
          @click="changeGridLength()"
          class="radioInput"
          type="radio"
          id="four"
          :value="4"
          v-model="gridLength"
        />
        <label for="four">4</label>
        <input
          @click="changeGridLength()"
          class="radioInput"
          type="radio"
          id="five"
          :value="5"
          v-model="gridLength"
        />
        <label for="five">5</label>
      </div>
      <div v-bind:style="{ display: isActive}">
      <label for="fname">Name</label>
      <br/>
      <input
        class="nameInput"
        type="text"
        id="name"
        name="name"
        placeholder="Your name.."
        v-model="name"
      />
      <button class="submitButton" @click="submit">Submit</button>
    </div>
    </div>
    </div>
    <div ref="grid" tabindex="0" v-on:keyup="keypressed" style="position:relative">
      <div class="row" v-for="(n) in gridLength" :key="n+(gridLength** 2)">
        <div class="cell" v-for="(n,index) in gridLength" :key="index"></div>
      </div>
      <cell-tab class="cellItem" v-for="(cell,index) in cells" :key="index" :cell="cell" />
    </div>
    <div style="position:relative;padding-top:30px;text-align:center;">
      <pre style="font-weight: bold;font-size:20px"><span style="color:red">Score : </span>{{this.score}}</pre>
    </div>
    <div style="position:relative;text-align:center;font-weight: bold;font-size:40px;color:red">
      <span v-bind:style="{ display: isActive}">Game Over</span>
    </div>
  </div>
</template>

<script>
import CellTab from "./cell";
const axios = require("axios");
export default {
  name: "game",
  watch: {
    score(){
      let socket = io.connect('http://localhost:3000');
      socket.emit('scoreChange', {
      name: this.username,
      score: this.score,
      gridLength: this.gridLength
      });
      this.$emit("scoreChanged", this.score);
    },
    gridLength() {
      this.$emit("gridChange", this.gridLength);
    },
    cells() {
      if (this.cells.length == this.gridLength ** 2 && this.verifyGameOver()) {
        setTimeout(() => {
          // alert("Game Over :p")
          this.isActive = "inline-block";
        }, 100);
      }
    }
  },
  mounted() {
    this.$emit("gridChange", this.gridLength);
  },
  methods: {
    submit() {
      axios
        .post("http://localhost:3000/", {
          name: this.name,
          score: this.score,
          gridSize: this.gridLength
        })
        .then(function(response) {
          console.log(response);
        })
        .catch(function(error) {
          console.log(error);
        });
      location.reload();
    },
    generateCell(position) {
      let found = true;
      let cell = {};
      while (found) {
        if (position === "up") {
          cell = {
            x: Math.floor(Math.random() * this.gridLength),
            y: Math.floor(
              (1 - Math.random() * Math.random()) * this.gridLength
            ),
            val: Math.round(Math.random()) * 2 + 2
          };
        } else if (position === "down") {
          cell = {
            x: Math.floor(Math.random() * this.gridLength),
            y: Math.floor(Math.random() * Math.random() * this.gridLength),
            val: Math.round(Math.random()) * 2 + 2
          };
        } else if (position === "left") {
          cell = {
            x: Math.floor(
              (1 - Math.random() * Math.random()) * this.gridLength
            ),
            y: Math.floor(Math.random() * this.gridLength),
            val: Math.round(Math.random()) * 2 + 2
          };
        } else {
          cell = {
            x: Math.floor(Math.random() * Math.random() * this.gridLength),
            y: Math.floor(Math.random() * this.gridLength),
            val: Math.round(Math.random()) * 2 + 2
          };
        }
        found = this.cells.find(c => cell.x === c.x && cell.y === c.y);
      }
      return cell;
    },
    initialTabPositionUp() {
      let positionTab = new Array(this.gridLength).fill(0);
      for (let x = 0; x < this.gridLength; x++) {
        for (let y = 0; y < this.gridLength; y++) {
          let found = this.cells.find(cell => cell.x === x && cell.y === y);
          if (found) {
            positionTab[x] = found.y + 1;
          }
        }
      }
      return positionTab;
    },
    initialTabPositionDown() {
      let positionTab = new Array(this.gridLength).fill(this.gridLength - 1);
      for (let x = 0; x < this.gridLength; x++) {
        for (let y = this.gridLength - 1; y >= 0; y--) {
          let found = this.cells.find(cell => cell.x === x && cell.y === y);
          if (found) {
            positionTab[x] = found.y - 1;
          }
        }
      }
      return positionTab;
    },
    initialTabPositionLeft() {
      let positionTab = new Array(this.gridLength).fill(0);
      for (let y = 0; y < this.gridLength; y++) {
        for (let x = 0; x < this.gridLength; x++) {
          let found = this.cells.find(cell => cell.x === x && cell.y === y);
          if (found) {
            positionTab[y] = found.x + 1;
          }
        }
      }
      return positionTab;
    },
    initialTabPositionRight() {
      let positionTab = new Array(this.gridLength).fill(this.gridLength - 1);
      for (let y = 0; y < this.gridLength; y++) {
        for (let x = this.gridLength - 1; x >= 0; x--) {
          let found = this.cells.find(cell => cell.x === x && cell.y === y);
          if (found) {
            positionTab[y] = found.x - 1;
          }
        }
      }
      return positionTab;
    },
    keypressed(event) {
        switch (event.key) {
        case "ArrowUp":
          let initialPositionUp = this.initialTabPositionUp();
          let positionTabUp = new Array(this.gridLength).fill(0);
          let valueTabUp = new Array(this.gridLength).fill(0);
          for (let x = 0; x < this.gridLength; x++) {
            let modifiedUp = false;
            for (let y = 0; y < this.gridLength; y++) {
              let found = this.cells.find(cell => cell.x === x && cell.y === y);
              if (found) {
                if (valueTabUp[x] === found.val && !modifiedUp) {
                  modifiedUp = true;
                  found.val = 2 * valueTabUp[x];
                  this.score += found.val;
                  let index = NaN;
                  this.cells.find((cell, i) => {
                    index = i;
                    return cell.y === positionTabUp[x] - 1 && cell.x === x;
                  });
                  this.cells.splice(index, 1);
                  found.y = positionTabUp[x] - 1;
                } else {
                  found.y = positionTabUp[x];
                  positionTabUp[x]++;
                  modifiedUp = false;
                }
                valueTabUp[x] = found.val;
              }
            }
          }
          if (
            this.cells.length !== this.gridLength ** 2 &&
            !(
              JSON.stringify(initialPositionUp) == JSON.stringify(positionTabUp)
            )
          ) {
            this.cells.push(this.generateCell("up"));
          }
          break;
        case "ArrowDown":
          let initialPositionDown = this.initialTabPositionDown();
          let positionTabDown = new Array(this.gridLength).fill(
            this.gridLength - 1
          );
          let valueTabDown = new Array(this.gridLength).fill(0);
          for (let x = 0; x < this.gridLength; x++) {
            let modifiedDown = false;
            for (let y = this.gridLength - 1; y >= 0; y--) {
              let found = this.cells.find(cell => cell.x === x && cell.y === y);
              if (found) {
                if (valueTabDown[x] === found.val && !modifiedDown) {
                  modifiedDown = true;
                  found.val = 2 * valueTabDown[x];
                  this.score += found.val;
                  let index = NaN;
                  this.cells.find((cell, i) => {
                    index = i;
                    return cell.y === positionTabDown[x] + 1 && cell.x === x;
                  });
                  this.cells.splice(index, 1);
                  found.y = positionTabDown[x] + 1;
                } else {
                  modifiedDown = false;
                  found.y = positionTabDown[x];
                  positionTabDown[x]--;
                }
                valueTabDown[x] = found.val;
              }
            }
          }
          if (
            this.cells.length !== this.gridLength ** 2 &&
            !(
              JSON.stringify(initialPositionDown) ==
              JSON.stringify(positionTabDown)
            )
          ) {
            this.cells.push(this.generateCell("down"));
          }
          break;
        case "ArrowLeft":
          let initialPositionLeft = this.initialTabPositionLeft();
          let positionTabLeft = new Array(this.gridLength).fill(0);
          let valueTabLeft = new Array(this.gridLength).fill(0);
          for (let y = 0; y < this.gridLength; y++) {
            let modifiedLeft = false;
            for (let x = 0; x < this.gridLength; x++) {
              let found = this.cells.find(cell => cell.x === x && cell.y === y);
              if (found) {
                if (valueTabLeft[y] === found.val && !modifiedLeft) {
                  modifiedLeft = true;
                  found.val = 2 * valueTabLeft[y];
                  this.score += found.val;
                  let index = NaN;
                  this.cells.find((cell, i) => {
                    index = i;
                    return cell.x === positionTabLeft[y] - 1 && cell.y === y;
                  });
                  this.cells.splice(index, 1);
                  found.x = positionTabLeft[y] - 1;
                } else {
                  modifiedLeft = false;
                  found.x = positionTabLeft[y];
                  positionTabLeft[y]++;
                }
                valueTabLeft[y] = found.val;
              }
            }
          }
          if (
            this.cells.length !== this.gridLength ** 2 &&
            !(
              JSON.stringify(initialPositionLeft) ==
              JSON.stringify(positionTabLeft)
            )
          ) {
            this.cells.push(this.generateCell("left"));
          }
          break;
        case "ArrowRight":
          let initialPositionRight = this.initialTabPositionRight();
          let positionTabRight = new Array(this.gridLength).fill(
            this.gridLength - 1
          );
          let valueTabRight = new Array(this.gridLength).fill(0);
          for (let y = 0; y < this.gridLength; y++) {
            let modifiedRight = false;
            for (let x = this.gridLength - 1; x >= 0; x--) {
              let found = this.cells.find(cell => cell.x === x && cell.y === y);
              if (found) {
                if (valueTabRight[y] === found.val && !modifiedRight) {
                  modifiedRight = true;
                  found.val = 2 * valueTabRight[y];
                  this.score += found.val;
                  let index = NaN;
                  this.cells.find((cell, i) => {
                    index = i;
                    return cell.x === positionTabRight[y] + 1 && cell.y === y;
                  });
                  this.cells.splice(index, 1);
                  found.x = positionTabRight[y] + 1;
                } else {
                  modifiedRight = false;
                  found.x = positionTabRight[y];
                  positionTabRight[y]--;
                }
                valueTabRight[y] = found.val;
              }
            }
          }
          if (
            this.cells.length !== this.gridLength ** 2 &&
            !(
              JSON.stringify(initialPositionRight) ==
              JSON.stringify(positionTabRight)
            )
          ) {
            this.cells.push(this.generateCell("right"));
          }
          break;
      }
    },
    buttonClicked() {
      this.buttonValue = "Restart";
      this.score = 0;
      this.isActive = "none";
      this.cells = [];
      let cell = {
        x: Math.floor(Math.random() * this.gridLength),
        y: Math.floor(Math.random() * this.gridLength),
        val: Math.round(Math.random()) * 2 + 2
      };
      this.cells.push(cell);
      this.$refs.grid.focus();
    },
    changeGridLength() {
      this.buttonValue = "Start";
      this.cells = [];
      this.score = 0;
      this.isActive = "none";
    },
    verifyGameOver() {
      for (let y = 0; y < this.gridLength; y++) {
        for (let x = 0; x < this.gridLength; x++) {
          let Element = this.cells.find(cell => cell.x === x && cell.y === y);
          let findX = this.cells.find(cell => cell.x === x + 1 && cell.y === y);
          let findY = this.cells.find(cell => cell.x === x && cell.y === y + 1);
          if (x < this.gridLength - 1 && Element.val === findX.val) {
            return false;
          }
          if (y < this.gridLength - 1 && Element.val === findY.val) {
            return false;
          }
        }
      }
      return true;
    }
  },
  data() {
    return {
      isActive: "none",
      gridLength: 3,
      score: 0,
      username:"testtt",
      buttonValue: "Start",
      name: "",
      cells: [
        // {x:0,y:0,val:8},
        // {x:0,y:1,val:8},
        // {x:0,y:2,val:16},
        // {x:0,y:3,val:8},
        // {x:0,y:4,val:32},
        // {x:1,y:0,val:8},
        // {x:1,y:1,val:8},
        // {x:1,y:2,val:8},
        // {x:1,y:3,val:8},
        // {x:1,y:4,val:8},
        // {x:2",y:0,val:2048},
        // {x:2,y:1,val:8},
        // {x:2,y:2,val:4},
        // {x:2,y:3,val:4}
        // {x:2,y:4,val:32768}
      ]
    };
  },
  components: {
    CellTab
  }
};
</script>

<style scoped>
.cell {
  width: 80px;
  height: 80px;
  border: solid #000;
  display: inline-block;
  margin: 5px;
}
.row {
  height: 90px;
  margin: 5px 0;
}
.settings {
  position: absolute;
  left: 200px;
  top: 150px;
}
.radioInput {
  margin-left: 30px;
}
.cellItem {
  position: absolute;
}
.nameInput {
  width: 70%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.submitButton {
  width: 70%;
  background-color: #4caf50;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submitButton:hover {
  background-color: #42b983;
}
*:focus {
  outline: none;
}
</style>