<template>
    <div>
        <v-app class="bg-grey-lighten-3">
            <AppbarComponent />
            <v-container>
                <router-view style="background-color: #F5F5F5;" />
                <FooterComponent class="mt-5" />
            </v-container>
            <ChatComponent v-if="isLoggedCusIn"/>
        </v-app>

    </div>
</template>

<script>
import AppbarComponent from "@/components/customer/AppbarComponent.vue";
import FooterComponent from "@/components/customer/FooterComponent.vue";
import ChatComponent from "@/components/customer/ChatComponent.vue"
export default {
    name: "ClientView",
    components: {
        AppbarComponent,
        FooterComponent,
        ChatComponent,
    },
    computed:{
        isLoggedCusIn() {
            return this.$store.state.isLoggedCusIn 
        },
    }
}
</script>

<style scoped></style>