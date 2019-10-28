<template>
  <!-- <div :style="{marginLeft:45+90*cell.x+'px',marginTop: cell.y*95 + 'px' }">{{cell.val}}</div> -->
  <div :style="cellStyle">
    <div
      style="text-align:center;padding:30px 0;color:white;font-style:gras;font-size: 1.5em;"
    >{{cell.val}}</div>
  </div>
</template>

<script>
export default {
  name: "CellTab",
  props: ["cell"],
  mounted() {},
  computed: {
    cellStyle() {
      return {
        top: 5 + 95 * this.cell.y + "px",
        left: 5 + 95 * this.cell.x + "px",
        width: 88 + "px",
        height: 88 + "px",
        backgroundColor: this.cellColor[this.cell.val]
      };
    }
  },
  data() {
    return {
      cellColor: {
        "2": "#cee19e",
        "4": "#bad433",
        "8": "#70bf48",
        "16": "#36783c",
        "32": "#44b1a6",
        "64": "#3768b4",
        "128": "#2c296a",
        "256": "#452963",
        "512": "#f1592a",
        "1024": "#c7382d",
        "2048": "#a9302f",
        "4096": "#8a2c46",
        "8192": "#818a87",
        "16384": "#3a1411",
        "32768": "#000000"
      }
    };
  }
};
</script>

<style>
</style>