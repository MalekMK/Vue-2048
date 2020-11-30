<template>
  <div id="app">
    <div class="left">
      <Game style="padding-top:100px" v-on:scoreChanged="scoreChanged" v-on:gridChange="changeGridLength"></Game>
      <Dashboard :score="score" :grid-length="gridLength" class="Dashboard"></Dashboard>
    </div>
  </div>
</template>

<script>
import Game from "./components/game";
import Dashboard from "./components/dashboard";

export default {
  name: "app",
  data() {
    return {
      gridLength: NaN,
      score:0
    };
  },
  methods: {
    scoreChanged(param){
      this.score=param
    },
    changeGridLength(param) {
      this.gridLength = param;
    }
  },
  components: {
    Game: Game,
    Dashboard: Dashboard
  }
};
</script>

<style scoped>
.left {
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: center;
}
.Dashboard {
  position: fixed;
  right: 40px;
  margin-top: 100px;
}
</style>

