<template>
<div class="modal" tabindex="-1" style="display: block">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-body">
        <HexagramView class="mx-auto" :lines="lines"/>
        <h1>{{number}}</h1>
        <h3>
          <span>Notes</span>
          <button class="btn btn-primary btn-sm" @click="clickAddNote" v-if="!showCreateNote"><img src="../assets/icons8-plus-24.png"/></button>
        </h3>
        <div class="mx-auto" v-if="showCreateNote">
          <textarea v-model="newNote"></textarea>
          <button class="btn btn-default" @click="clickCancelNote">Cancel</button>
          <button class="btn btn-primary" @click="clickSaveNote">Save</button>
        </div>
        <div class="notes-container">
          <p v-for="note in notes" :key="note">{{note}}</p>
          <p v-if="notes.length === 0" class="no-notes-message">There are no notes yet.</p>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="$emit('closeModal')">Close</button>
        <a class="btn btn-primary" target="_blank"
          :href="`http://www2.unipr.it/~deyoung/I_Ching_Wilhelm_Translation.html#${number}`">View Wilhelm</a>
      </div>
    </div>
  </div>
</div>
    
</template>

<script>
import HexagramView from './Hexagram.vue';
import { database } from '../main';
import { hexagramIndex } from '@/util/hexagram-index';
import { collection, onSnapshot, query, addDoc, Timestamp, orderBy, doc, getDoc, where } from 'firebase/firestore';

export default {
    name: 'HexagramModalView',
    components: {
      HexagramView
    },
    emits: ['closeModal'],
    props: {
        lines: Array,
        userUid: String
    },
    data() {
        return {
            notes: [],
            number: -1,
            showCreateNote: false,
            newNote: ''
        }
    },
    mounted() {
        for (let i = 0; i < hexagramIndex.length; i++) {
        const upper = hexagramIndex[i][0];
        const lower = hexagramIndex[i][1];
        if ((this.lines[0].val % 2 === 1) === lower[0] &&
        (this.lines[1].val % 2 === 1) === lower[1] &&
        (this.lines[2].val % 2 === 1) === lower[2] &&
        (this.lines[3].val % 2 === 1) === upper[0] &&
        (this.lines[4].val % 2 === 1) === upper[1] &&
        (this.lines[5].val % 2 === 1) === upper[2]) {
          this.number = i + 1;
          break;
        }
      }
      let q = query(collection(database, 'user/' + this.userUid + '/hexagram-note' ),
          where('hexagram', '==', this.number), orderBy('timestamp'));
      onSnapshot(q, snapshot => {
        this.notes.length = 0;
        snapshot.forEach(note => {
          this.notes.push(note.data().content)
        })
      })
    },
    methods: {
      clickAddNote() {
        this.showCreateNote = true;
      },
      clickSaveNote() {
        addDoc(collection(database, 'user/' + this.userUid + '/hexagram-note'), {
          content: this.newNote,
          hexagram: this.number,
          timestamp: Timestamp.now(),
        });
        this.showCreateNote = false;
      },
      clickCancelNote() {
        this.showCreateNote = false;
      }
    }
}
</script>

<style scoped>
.modal-body {
  width: 80%;
  margin: auto
}
textarea {
  width: 100%;
}
h3 > span {
  float: left
}
h3 > button {
  float: right
}
.notes-container {
  text-align: left;
  clear: both;
  padding: 10px;
}
.no-notes-message {
  text-align: center;
  font-style: italic;
}
</style>
