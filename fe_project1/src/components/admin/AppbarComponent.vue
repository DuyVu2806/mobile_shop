<template>
    <div>
        <v-app-bar>
            <v-app-bar-nav-icon variant="text" @click="toggleDrawer"></v-app-bar-nav-icon>
            <template v-slot:append>
                <v-btn icon="mdi-logout" @click="toggleLogOut"></v-btn>
            </template>
        </v-app-bar>
    </div>


</template>

<script>
import store from '@/store';
import { mapState } from 'vuex'
export default {
    name: "AppbarComponent",
    methods: {
        toggleDrawer() {
            store.dispatch('toggleDrawer');
        },
        toggleLogOut() {
            localStorage.removeItem('tokenAdmin');
            localStorage.removeItem('currentAdmin')
            this.$store.commit('SET_IS_LOGGED_IN', false);
            this.$router.push('/admin/login');
        }
    },
    created() {
        const token = localStorage.getItem('tokenAdmin')
        if (token) {
            this.$store.commit('SET_IS_LOGGED_IN', true) // set state isLoggedIn trong store là true
        }
    },
    computed: {
        isLoggedIn() {
            return this.$store.state.isLoggedIn // Sử dụng state isLoggedIn
        },
        ...mapState(['currentAdmin'])
    },
}
</script>

<style scoped></style>