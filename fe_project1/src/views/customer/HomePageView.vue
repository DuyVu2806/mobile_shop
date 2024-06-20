<template>
    <div>
        <v-main min-height="100vh" >
            <v-row >
                <v-col cols="12" >
                    <v-sheet rounded="lg">
                        <v-carousel height="400" show-arrows="hover" cycle hide-delimiter-background>
                            <v-carousel-item v-for="(slide, i) in slides" :key="i" rounded>
                                <v-sheet :color="colors[i]" height="100%">
                                    <div class="d-flex fill-height justify-center align-center">
                                        <div class="text-h2">
                                            {{ slide }} Slide
                                        </div>
                                    </div>
                                </v-sheet>
                            </v-carousel-item>
                        </v-carousel>
                    </v-sheet>
                    <h3 class="ml-2 mt-5">CATEGORY</h3>
                </v-col>
            </v-row>
        </v-main>
    </div>
</template>

<script>
export default {
    name: "HomepageView",
    data() {
        return {
            colors: [
                'indigo',
                'warning',
                'pink darken-2',
                'red lighten-1',
                'deep-purple accent-4',
            ],
            slides: [
                'First',
                'Second',
                'Third',
                'Fourth',
                'Fifth',
            ],
        }
    }
}
</script>

<style scoped>
.v-col {
    padding: 2px 12px;
}</style>