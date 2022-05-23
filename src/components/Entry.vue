<template>
    <div v-if="!content && !isHex">
      <textarea v-model="newContent"></textarea>
      <button @click="saveNew">save</button>
      <button @click="clickThrowHex">throw hex</button>
    </div>
  <div v-if="content">
    <p class="entry_date">{{ date }}</p>
    <p class="entry_text" v-if="!isHex">{{ content }}</p>
  </div>
  <div v-if="isHex">
    <div class="hex_container">
      <div  v-for="line in hexLines" :key="line.idx">
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
  </div>

    <div v-if="!content && isHex">
      <button @click="throwLine">throw line</button>
      <button @click="cancelThrowHex">cancel</button>
    </div>
</template>

<script>

const hexPrefix = '/hex:';

export default {
  name: 'EntryView',
  props: {
    id: String,
    content: String,
    timestamp: Object
  },
  data() {
    return {
      newContent: '',
      hexLines: [],
      isHex: false
    }
  },
  computed: {
    date() {
      return new Date(this.timestamp.seconds * 1000).toLocaleString();
    }
  },
  methods: {
    saveNew() {
      this.$emit('saveEntry', this.newContent);
      this.newContent = '';
    },
    clickThrowHex() {
      this.isHex = true;
    },
    cancelThrowHex() {
      this.isHex = false;
      this.hexLines.length = 0;
    },
    throwLine() {
      this.hexLines.push({val: this.generateLineNumber(), idx: this.hexLines.length});
      if (this.hexLines.length === 6) {
        const lineNums = this.hexLines.map(line => line.val)
        this.newContent = hexPrefix + lineNums.join('');
        this.saveNew();
        this.hexLines.length = 0;
        this.isHex = false;
      }
    },
    generateLineNumber() { 
      var coin1 = Math.random() < .5;
      var coin2 = Math.random() < .5;
      var coin3 = Math.random() < .5;
      return (coin1 ? 3 : 2) + (coin2 ? 3 : 2) + (coin3 ? 3 : 2);
    } 
  },
  emits: ['saveEntry'],
  mounted() {
    if (this.content) {
      if (this.content.indexOf(hexPrefix) === 0) {
        this.isHex = true;
        const hexStr = this.content.substring(hexPrefix.length);
        hexStr.split('').forEach((lineNumber, idx) => {
          this.hexLines.push({val: Number(lineNumber), idx: idx})
        })
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
button {
  /* clear: both; */
  display: block;
  margin-left: auto;
  margin-right: auto;
}
textarea {
  width: 400px;
  height: 100px;
}
.entry_date {
  margin-bottom: 0;
  font-size: 14px;
  color: grey;
}
.entry_text {
  margin-top: 0;
}
.hex_container {
  height: 110px;
  transform: rotate(180deg);
  margin-bottom: 10px;
}
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