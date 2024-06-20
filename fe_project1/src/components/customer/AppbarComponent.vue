<template>
    <div>
        <v-app-bar flat scroll-behavior="elevate" :elevation="2" color="surface-light">
            <v-container class="mx-auto d-flex align-center justify-center">
                <a href="" class="mr-5">logo</a>
                <v-responsive max-width="350">
                    <v-text-field density="compact" label="Search" rounded="lg" append-inner-icon="mdi-magnify"
                        variant="solo-filled" flat hide-details single-line></v-text-field>
                </v-responsive>

                <v-spacer></v-spacer>
                <v-btn key="Home" text="Home" to="/" variant="text" class="ml-2" :exact="true"></v-btn>
                <v-btn key="Product" text="Product" to="/products" variant="text" class="ml-2"></v-btn>
                <v-btn key="Blog" text="Blog" to="/blog" variant="text" class="ml-2"></v-btn>
                <v-btn key="About" text="About" to="/about" variant="text" class="ml-2"></v-btn>
                <v-badge :content="cartItemCount" overlap color="grey">
                    <v-btn key="Cart" text="Cart" to="/cart" variant="text" class="ml-2"></v-btn>
                </v-badge>
                <div v-if="!isLoggedCusIn">
                    <v-btn v-for="link1 in links2" :key="link1.text" :text="link1.text" :href="link1.url"
                        :variant="link1.variant" class="ml-3" :color="link1.color"></v-btn>
                </div>

                <v-menu open-on-hover width="200" v-if="isLoggedCusIn">
                    <template v-slot:activator="{ props }">
                        <v-avatar v-bind="props" class="ms-4" color="grey-darken-1" size="35"><v-img
                                :src="`https://ui-avatars.com/api/?name=${currentCus}`"></v-img></v-avatar>
                    </template>
                    <v-list>
                        <v-list-item link to="/profile">
                            <h3>{{ currentCus }}</h3>
                            <p class="text-caption mt-1">
                                {{ email }}
                            </p>
                        </v-list-item><v-divider class="my-3"></v-divider>
                        <v-list-item link to="/order">
                            <v-list-item-title>Order</v-list-item-title>
                        </v-list-item>
                        <v-list-item link @click="toggleSignOut">
                            <v-list-item-title>Sign Out</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-menu>
            </v-container>
        </v-app-bar>
    </div>
</template>

<script>
import { jwtDecode } from 'jwt-decode';
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
    name: "AppbarComponent",
    data: () => ({
        links2: [
            { text: 'Sign In', url: '/login', color: "light-blue-darken-1", variant: "outlined" },
            { text: 'Sign Up', url: '/register', color: 'green-accent-3', variant: "tonal" },
        ],
        email: ''
    }),
    computed: {
        isLoggedCusIn() {
            return this.$store.state.isLoggedCusIn // Sử dụng state isLoggedIn
        },
        ...mapState({
            currentCus: state => state.currentCus,
        }),
        ...mapGetters(['cartItemCount']),
    },
    created() {
        this.getEmailFromToken();
        const token = localStorage.getItem('tokenCus')
        if (token) {
            this.$store.dispatch('fetchCartItemCount', token);
            // this.$store.dispatch('fetchMyOrderItemCount',userId);

        }
        this.getCartItemCount();
        // this.getOrderItemCount();
    },
    methods: {
        ...mapActions(['fetchCartItemCount']),
        getEmailFromToken() {
            const token = localStorage.getItem('tokenCus'); // Hoặc cách bạn lưu token
            if (token) {
                const decodedToken = jwtDecode(token);
                this.email = decodedToken.email; // Đảm bảo trường email có trong token
            }
        },
        async getCartItemCount() {
            const token = localStorage.getItem('tokenCus');
            await this.fetchCartItemCount(token);
        },
        toggleSignOut() {
            localStorage.removeItem('tokenCus');
            localStorage.removeItem('currentCus')
            this.$store.commit('SET_IS_LOGGED_CUS_IN', false);
            this.$router.push('/');
        }
    }

}
</script>

<style scoped></style>