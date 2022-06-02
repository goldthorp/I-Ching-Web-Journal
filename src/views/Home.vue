<template>
    <button class="btn btn-primary mb-3" @click="signOut">sign out</button>
    <div class="entries_container" ref="entries_container">
      <div v-for="entry in entries" :key="entry.id">
          <EntryView v-bind="entry"/>
      </div>
    </div>
    <EntryView v-on:saveEntry="saveNewEntry"/>
</template>

<script>
import EntryView from '../components/Entry.vue';
import { auth, database } from '../main';
import { collection, onSnapshot, query, addDoc, Timestamp, orderBy, doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from '@firebase/auth';

export default {
    name: 'HomeView',
  components: {
    EntryView
  },
  data() {
    return {
      entries: []
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
  overflow: scroll;
}
</style>
