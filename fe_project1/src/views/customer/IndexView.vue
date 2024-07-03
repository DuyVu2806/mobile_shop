<template>
    <div>
        <v-app class="bg-grey-lighten-3">
            <AppbarComponent />
            <v-container>
                <router-view style="background-color: #F5F5F5;" />
                <FooterComponent class="mt-5" />
            </v-container>
            <ChatComponent v-if="isLoggedCusIn" />
        </v-app>

    </div>
</template>

<script>
import AppbarComponent from "@/components/customer/AppbarComponent.vue";
import FooterComponent from "@/components/customer/FooterComponent.vue";
import ChatComponent from "@/components/customer/ChatComponent.vue"
import axios from "axios";
export default {
    name: "ClientView",
    components: {
        AppbarComponent,
        FooterComponent,
        ChatComponent,
    },
    computed: {
        isLoggedCusIn() {
            this.verify();
            return this.$store.state.isLoggedCusIn
        },
    },
    methods: {
        async verify() {
            try {
                const tokenCus = localStorage.getItem("tokenCus");
                await axios.get("http://localhost:3000/api/auth/verify-token", {
                    headers: {
                        Authorization: `Bearer ${tokenCus}`,
                    },
                });
            } catch (error) {
                localStorage.removeItem("tokenCus");
                localStorage.removeItem("isLoggedCusIn");
                
            }

        }
    }
}
</script>

<style scoped></style>