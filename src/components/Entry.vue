<template>
  <div ref="new_entry">
    <div v-if="!content && !isHex && !isManualEntry" class="new_entry_main mt-2">
      <button class="button save_button btn btn-primary mb-2" @click="saveNew">save</button>
      <button class="button throw_button btn btn-primary mb-2 me-2" @click="clickThrowHex">throw hex</button>
      <button class="button throw_button btn btn-primary mb-2" @click="clickManualEntry">manual entry</button>
      <textarea v-model="newContent"></textarea>
    </div>
  </div>
  <div v-if="content">
    <p class="entry_date">{{ date }}</p>
    <p class="entry_text" v-if="!isHex">{{ content }}</p>
  </div>
  <div v-if="isHex">
    <div class="row justify-content-center">
      <HexagramView :lines="hexLines"
        :class="{'mx-auto': !hasChangingLines}" @click="clickHexagram(hexLines)"/>
      <div v-if="hasChangingLines" class="col-2 col-md-1 arrow_container">
        <span><!-- helper element for vertical alignment of image /!--></span>
        <img src="@/assets/icons8-arrow-30.png">
      </div>
      <HexagramView :lines="secondaryHexLines"
      v-if="hasChangingLines" @click="clickHexagram(secondaryHexLines)"/>
        
    </div>
  </div>

    <div v-if="!content && !isManualEntry && isHex">
      <button class="button btn btn-primary" @click="throwLine">throw line</button>
      <button class="button btn btn-primary" @click="cancelThrowHex">cancel</button>
    </div>

    <div ref="manual_entry">
      <div class="manual_entry" v-if="isManualEntry">
        <div class="manual_entry_options">
          <button v-for="i in [6, 7, 8, 9]" :key="i" @click="addLine(i, $event)"
            class="btn" :class="{'btn-primary': [6, 9].includes(i)}">
              {{ i }}
          </button>
        </div>
        <button class="btn" @click="undoAddLine($event)">{{ hexLines.length ? 'undo' : 'back' }}</button>
      </div>
    </div>
</template>

<script>
import HexagramView from './Hexagram.vue'

const hexPrefix = '/hex:';

export default {
  name: 'EntryView',
  components: {
    HexagramView
  },
  props: {
    id: String,
    content: String,
    timestamp: Object
  },
  data() {
    return {
      newContent: '',
      hexLines: [],
      isHex: false,
      hasChangingLines: false,
      secondaryHexLines: [],
      isManualEntry: false
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
      this.addLine(this.generateLineNumber());
    },
    generateLineNumber() { 
      var coin1 = Math.random() < .5;
      var coin2 = Math.random() < .5;
      var coin3 = Math.random() < .5;
      return (coin1 ? 3 : 2) + (coin2 ? 3 : 2) + (coin3 ? 3 : 2);
    },
    clickManualEntry() {
      this.isHex = true;
      this.isManualEntry = true;
      setTimeout(() => this.$refs['manual_entry'].scrollIntoView({ behavior: 'instant' }));
    },
    addLine(i, $event) {
      $event?.target.blur();
      this.hexLines.push({val: i, idx: this.hexLines.length});
      if (this.hexLines.length === 6) {
        const lineNums = this.hexLines.map(line => line.val)
        this.newContent = hexPrefix + lineNums.join('');
        this.saveNew();
        this.hexLines.length = 0;
        this.isHex = false;
        this.isManualEntry = false;
      }
    },
    undoAddLine($event) {
      $event?.target.blur();
      const removed = this.hexLines.pop();
      if (!removed) {
        this.isHex = false;
        this.isManualEntry = false;
      }
    },
    clickHexagram(lines) {
      this.$emit('clickHexagram', lines);
    }
  },
  emits: ['saveEntry', 'clickHexagram'],
  mounted() {
    if (this.content) {
      if (this.content.indexOf(hexPrefix) === 0) {
        this.isHex = true;
        const hexStr = this.content.substring(hexPrefix.length);
        hexStr.split('').forEach((lineNumberStr, idx) => {
          let lineNumber = Number(lineNumberStr);
          this.hexLines.push({val: lineNumber, idx: idx});
          if (!this.primaryOnly) {
            if (lineNumber === 6) {
              this.hasChangingLines = true;
              this.secondaryHexLines.push({val: 7, idx: idx});
            } else if (lineNumber === 9) {
              this.hasChangingLines = true;
              this.secondaryHexLines.push({val: 8, idx: idx});
            } else {
              this.secondaryHexLines.push({val: lineNumber, idx: idx});
            }
          }
        });
        
      }
    } else {
      setTimeout(() => this.$refs['new_entry'].scrollIntoView({ behavior: 'instant' }));
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.new_entry_main {
  padding: 15px;
}
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
.button {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
.manual_entry {
  margin-top: 25px;
  margin-bottom: 45px;
}
.manual_entry_options {
  margin-bottom: 35px;
  padding: 0 15px;
}
.manual_entry_options>button {
  padding: 20px 30px 15px;
  font-size: 25px;
  width: 25%;
}
.manual_entry_options>button:nth-of-type(2) {
  padding-left: 7%;
}
.manual_entry_options>button:nth-of-type(3) {
  padding-right: 7%;
}
textarea {
  width: 100%;
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
.save_button {
  float: right;
}
.throw_button {
  float: left;
}
.arrow_container>span {
  vertical-align: middle;
  height: 100%; 
  display: inline-block
}
.arrow_container>img {
  margin-top: -10px;
}
</style>
