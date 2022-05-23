import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            component: () => import("../views/Home.vue"),
            meta: {
                requiresAuth: true
            }
        },
        {
            path: "/register",
            component: () => import("../views/Register.vue"),
        },
        {
            path: "/sign-in",
            component: () => import("../views/SignIn.vue"),
        }
    ]
});

