<template>
    <form>
        <div class="form-group">
            <label for="email">Email address</label>
            <input type="email" name="email" v-model="email" class="form-control">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" name="password" v-model="password" class="form-control">
        </div>
        <button type="button" class="btn btn-primary mt-3" @click="signIn">sign in</button>
    </form>
    <router-link to="/register">Create new account</router-link>
</template>

<script>
import { signInWithEmailAndPassword } from "@firebase/auth"
import { auth } from '@/main'

export default {
    name: 'SignInView',
    data() {
        return {
            email: '',
            password: ''
        }
    },
    methods: {
        signIn() {
            signInWithEmailAndPassword(auth, this.email, this.password);
        }
    }
}
</script>