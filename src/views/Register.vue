<template>
    <form>
        <label for="email">Email address</label>
        <input type="email" name="email" v-model="email">
        <label for="password">Password</label>
        <input type="password" name="password" v-model="password">
        <button type="button" @click="signUp">sign up</button>
    </form>
</template>

<script>
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { auth } from '@/main';

export default {
    name: 'RegisterView',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        signUp() {
            createUserWithEmailAndPassword(auth, this.email, this.password)
                .then(user => console.log(user))
                .catch(e => console.log(e));
        }
    }
}
</script>