<template>
    <div>
        <v-app>
            <SidebarComponent />
            <AppbarComponent />
            <router-view />
        </v-app>

    </div>
</template>

<script>
import AppbarComponent from "@/components/admin/AppbarComponent.vue";
import SidebarComponent from "@/components/admin/SidebarComponent.vue";
export default {
    name: "IndexView",
    components: {
        AppbarComponent,
        SidebarComponent,
    }
}
</script>

<style scoped></style>