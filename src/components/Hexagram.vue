<template>
    <div class="hex_container col-4 col-md-2">
        <div  v-for="line in lines" :key="line.idx">
          <div v-if="line.val % 2 === 1">
            <div class="line">
              <div class="long_line">
                <div class="changing_dot_container" v-if="line.val === 9">
                  <div class="changing_dot changing_dot_white"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="line" v-else>
            <div class="short_line_left"></div>
            <div class="short_line_right"></div>
            <div class="changing_dot_container" v-if="line.val === 6">
              <div class="changing_dot"></div>
            </div>
          </div>
        </div>
      </div> 
</template>

<script>

export default {
    name: 'HexagramView',
    props: {
        lines: Array
    }
}
</script>
<style scoped>
.line {
  width: 100px;
  height: 10px;
  margin: 10px auto;
}
.long_line {
  background: black;
  width: 100%;
  height: 100%;
}
.short_line_left {
  background: black;
  width: 45%;
  height: 100%;
  float: left;
}
.short_line_right {
  background: black;
  width: 45%;
  height: 100%;
  float: right;
}
.changing_dot {
  height: 6px;
  width: 6px;
  margin: auto;
  border-radius: 100%;
  background: black;
}
.changing_dot_white {
  background: white;
  margin: auto;
}
.changing_dot_container {
  padding-top: 2px;
}
</style>