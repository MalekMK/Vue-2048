<template>
  <div>
    <div>
      <table>
        <thead>
          <tr>
            <th>Top 10</th>
            <th>Player Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(player, index) in controlLength(displayPlayers)"
            v-bind:key="player.id"
          >
            <td
              v-if="player._id === user._id"
              style="background-color: #42b983"
            >
              {{ index + 1 }}
            </td>
            <td v-else>{{ index + 1 }}</td>
            <td
              v-if="player._id === user._id"
              style="background-color: #42b983"
            >
              {{ player.username }}
            </td>
            <td v-else>{{ player.username }}</td>
            <td
              v-if="player._id === user._id"
              style="background-color: #42b983"
            >
              {{ player.score }}
            </td>
            <td v-else>{{ player.score }}</td>

            <!-- <td>{{ index + 1 }}</td>
            <td>{{ player.username }}</td>
            <td>{{ player.score }}</td> -->
            <!-- <td>{{player.gridSize}}</td> -->
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
const socket = io("http://localhost:3500");
export default {
  name: "dashboard",
  props: ["gridLength", "score"],
  watch: {
    gridLength() {
      this.changeDisplay();
    },
    score() {
      this.changeScore();
    },
  },
  data() {
    return {
      players: [],
      displayPlayers: [],
      user: {},
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    changeScore() {
      // Listen for events
      socket.on("scoreChange", (data) => {
        this.user = data;
        this.load();
      });
    },
    changeDisplay() {
      this.displayPlayers = [];
      for (let i = 0; i < this.players.length; i++) {
        if (this.players[i].gridSize === this.gridLength) {
          this.displayPlayers.push(this.players[i]);
        }
      }
    },
    load() {
      fetch("http://localhost:3500/")
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          this.players = json;
          this.changeDisplay();
        })
        .catch((error) => {
          throw error;
        });
    },
    sortedPlayers(players) {
      return players.concat().sort((a, b) => {
        return a.score > b.score ? -1 : 1;
      });
    },
    controlLength(displayPlayers) {
      let tempTab = this.sortedPlayers(displayPlayers);
      while (tempTab.length > 10) {
        tempTab.pop();
      }
      Object.keys(this.user).length === 0
        ? null
        : tempTab.some((elt) => elt._id === this.user._id)
        ? null
        : tempTab.push(this.user);
      tempTab = this.sortedPlayers(tempTab);
      return tempTab;
    },
  },
};
</script>

<style scoped>
table {
  border: 2px solid #42b983;
  border-radius: 3px;
  background-color: #fff;
}

th {
  background-color: #42b983;
  color: rgba(255, 255, 255, 0.66);
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

td {
  background-color: #f9f9f9;
}

th,
td {
  text-align: center;
  min-width: 50px;
  padding: 10px 20px;
}

th.active {
  color: #fff;
}

th.active .arrow {
  opacity: 1;
}
</style>