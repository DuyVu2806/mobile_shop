<template>
    <v-navigation-drawer v-model="drawer" width="300">
        <v-list style="padding: 30px;">
            <v-list-item :prepend-avatar="`https://ui-avatars.com/api/?name=${currentAdmin}`" :subtitle=email
                :title="currentAdmin"></v-list-item>
        </v-list>
        <v-divider></v-divider>
        <v-list>
            <v-list-item prepend-icon="mdi-view-dashboard-outline" title="Dashboard" to="/admin" :exact="true"></v-list-item>
            <v-list-item prepend-icon="mdi-account-multiple" title="Product" value="product"
                to="/admin/product"></v-list-item>
            <v-list-item prepend-icon="mdi-clipboard-list-outline" title="Category" value="category" to="/admin/category"></v-list-item>
            <v-list-item prepend-icon="mdi-order-bool-descending" title="Orders" value="order" to="/admin/order"></v-list-item>
            <v-list-item prepend-icon="mdi-star-outline" title="Rating" value="rating" to="/admin/rating"></v-list-item>
            <v-list-item prepend-icon="mdi-chat-outline" title="Chat" value="Chat" to="/admin/chat"></v-list-item>

        </v-list>
        <v-list style="position: absolute; bottom: 0; width: 100%;">
            <v-list-item prepend-icon="mdi-magnify" title="Setting" value="setting"></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script>
import { jwtDecode } from 'jwt-decode';
import { mapState } from 'vuex'

export default {
    name: "SidebarComponent",
    data() {
        return {
            email: ''
        }
    },
    computed: {
        ...mapState({
            drawer: state => state.drawer,
            currentAdmin: state => state.currentAdmin,
        }),
    },
    created() {
        this.getEmailFromToken();
    },
    methods: {
        getEmailFromToken() {
            const token = localStorage.getItem('tokenAdmin'); // Hoặc cách bạn lưu token
            if (token) {
                const decodedToken = jwtDecode(token);
                this.email = decodedToken.email; // Đảm bảo trường email có trong token
            }
        }
    }
}
</script>

<style scoped></style>