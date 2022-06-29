<template>
    <button class="btn btn-primary mb-3" @click="signOut">sign out</button>
    <div class="entries_container" ref="entries_container">
      <div v-for="entry in entries" :key="entry.id">
          <EntryView v-bind="entry" @clickHexagram="clickHexagram"/>
      </div>
    </div>
    <EntryView v-on:saveEntry="saveNewEntry"/>
    <MDBModal
      tabindex="-1"
      v-model="showHexagramModal">
      <MDBModalBody>
        <HexagramView class="mx-auto" :lines="modalHexagramLines"/>
        <h3>{{modalHexagramNumber}}</h3>
      </MDBModalBody>
      <MDBModalFooter>
        <button class="btn btn-default"
          @click="showHexagramModal = false">Close</button>
        <a class="btn btn-primary" target="_blank"
          :href="'http://www2.unipr.it/~deyoung/I_Ching_Wilhelm_Translation.html#' + modalHexagramNumber">View Wilhelm</a>
      </MDBModalFooter>
    </MDBModal>
</template>

<script>
import EntryView from '../components/Entry.vue';
import HexagramView from '../components/Hexagram.vue';
import { auth, database } from '../main';
import { collection, onSnapshot, query, addDoc, Timestamp, orderBy, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';
import { MDBModal, MDBModalBody, MDBModalFooter, MDBBtn } from 'mdb-vue-ui-kit';
import { hexagramIndex } from '@/util/hexagram-index';

export default {
    name: 'HomeView',
    components: {
      EntryView,
      MDBModal,
      MDBModalBody,
      MDBModalFooter,
      HexagramView
    },
  data() {
    return {
      entries: [],
      showHexagramModal: false
    };
  },
  mounted() {
      var removeSnapshotListener;
      onAuthStateChanged(auth, user => {
          if (user) {
            const q = query(collection(database, 'user/' + user.uid + '/entry' ),
                orderBy('timestamp'));
            removeSnapshotListener = onSnapshot(q, snapshot => {
                this.entries.length = 0;
                snapshot.forEach(entry => {
                    const entryData = entry.data();
                    this.entries.push({
                        id: entry.id, 
                        content: entryData.content,
                        timestamp: entryData.timestamp
                    });
                }); 
                const container = this.$refs['entries_container'];
                setTimeout(() => {
                  if (container) {
                    container.scrollTop = container.scrollHeight
                  } 
                });
            });
        } else {
            if (removeSnapshotListener) {
              removeSnapshotListener()
            }
        }
      });
  },
  methods: {
    saveNewEntry(content) {
      addDoc(collection(database, 'user/' + auth.currentUser.uid + '/entry'), {
        content: content,
        timestamp: Timestamp.now()
      });
    },
    signOut() {
        auth.signOut();
    },
    onVisibilityChanged(isVisible) {
        console.log(isVisible)
    },
    clickHexagram(lines) {
      for (let i = 0; i < hexagramIndex.length; i++) {
        const upper = hexagramIndex[i][0];
        const lower = hexagramIndex[i][1];
        if ((lines[0].val % 2 === 1) === lower[0] &&
        (lines[1].val % 2 === 1) === lower[1] &&
        (lines[2].val % 2 === 1) === lower[2] &&
        (lines[3].val % 2 === 1) === upper[0] &&
        (lines[4].val % 2 === 1) === upper[1] &&
        (lines[5].val % 2 === 1) === upper[2]) {
          this.modalHexagramNumber = i + 1;
          break;
        }
      }
      this.modalHexagramLines = lines;
      this.showHexagramModal = true;
    }
  }
}
</script>

<style scoped>
.sign_out_button {
    margin-bottom: 50px;
}
.entries_container {
  height: 70%;
  overflow-y: scroll;
  overflow-x: hidden;
}
</style>
