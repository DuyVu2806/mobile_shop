<template>
    <div>
        <v-main min-height="100vh">
            <div v-if="loading">
                <v-row>
                    <v-col cols=3>
                        <v-skeleton-loader :loading="loading" height="240" type="ossein">
                        </v-skeleton-loader>
                    </v-col>
                    <v-col cols="9">
                        <v-row>
                            <v-col v-for="n in 8" :key="n" cols="12" lg="3" md="4" sm="6">
                                <v-skeleton-loader class="mb-3" :loading="loading" height="240" type="image, list-item-two-line,actions">
                                </v-skeleton-loader>

                            </v-col>
                        </v-row>
                    </v-col>

                </v-row>

            </div>
            <v-row v-else>
                <v-col cols="3">
                    <v-card variant="elevated" elevation="2">
                        <v-card-title>
                            <h5><v-icon>mdi-filter</v-icon>SEARCH FILTER </h5>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                            <v-list rounded="lg">
                                <h3 style="margin-left: 1rem;">Category</h3>
                                <v-checkbox color="red" label="red" value="red" hide-details></v-checkbox>
                                <v-checkbox color="red-darken-3" label="red-darken-3" hide-details></v-checkbox>
                                <v-checkbox color="red" label="red" value="red" hide-details></v-checkbox>
                                <v-checkbox color="red-darken-3" label="red-darken-3" hide-details></v-checkbox>
                            </v-list>
                            <v-list>
                                <h3 style="margin-left: 1rem;">
                                    Price
                                </h3>

                            </v-list>
                        </v-card-text>

                    </v-card>


                </v-col>

                <v-col cols="9">

                    <v-card variant="text">
                        <v-sheet min-height="100vh" rounded="lg">
                            <div class="d-flex align-center justify-left"
                                style="padding: 10px;background-color: #EEEEEE">
                                <h3 class="mr-3">Filter: </h3>
                                <v-btn class="mr-3">Select</v-btn>
                                <v-btn class="mr-3">Select 2</v-btn>
                                <v-menu offset-y>
                                    <template v-slot:activator="{ props }">
                                        <v-btn v-bind="props">
                                            Price
                                            <v-icon>mdi-chevron-down</v-icon>

                                        </v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item v-for="(item, index) in items" :key="index" :value="index">
                                            <v-list-item-title>{{ item }}</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </div>
                            <v-divider></v-divider>
                            <v-row >
                                <v-col cols="12" lg="3" md="4" sm="6" v-for="product in products" :key="product._id">
                                    <v-card class="mx-auto" elevation="2" max-width="344">
                                        <div class="image-container">
                                            <v-img height="12rem" width="100%" :src="product.images[0]" cover></v-img>
                                            <div class="overlay"></div>

                                            <v-btn class="detail-btn" absolute bottom color="light-blue-darken-4"
                                                variant="outlined"
                                                :to="{ name: 'Product Detail View', params: { slug: product.slug } }">
                                                View
                                                details</v-btn>
                                        </div>

                                        <v-card-title>
                                            {{ product.name }}
                                            <v-tooltip activator="parent" location="start">{{ product.name
                                                }}</v-tooltip>
                                        </v-card-title>
                                        <v-card-subtitle>
                                            {{ product.small_description }}
                                        </v-card-subtitle>
                                        <v-card-actions>
                                            <v-btn variant="outlined" color="light-blue-accent-3"
                                                prepend-icon="mdi-cart" size="small">
                                                <span>Add to card</span>
                                            </v-btn>
                                            <v-icon class="ml-4" color="red">mdi-heart</v-icon>
                                        </v-card-actions>
                                    </v-card>
                                </v-col>

                            </v-row>
                        </v-sheet>
                    </v-card>

                </v-col>
            </v-row>
        </v-main>
    </div>
</template>

<script>
import apiClient from '@/api';

export default {
    name: "ProductView",
    data() {
        return {
            items: [
                "Price: low to high",
                "Price: high to low"
            ],
            products: [
            ],
            value: [],
            loading: true,
            searchQuery: this.$route.query.search || '',
        }
    },
    created() {
        this.fetchProducts();
    },
    methods: {
        handleItemClick(item) {
            console.log("Selected item:", item);
        },
        async fetchProducts() {
            try {
                this.loading = true;
                const response = await apiClient.get(`/products?search=${this.searchQuery}`);
                this.products = response.data;
                this.loading = false;
            } catch (error) {
                console.log(error);
            }

        }
    }
}
</script>

<style scoped>
.v-input--density-default {
    --v-input-control-height: 0 !important;
}

.v-row {
    margin: 0 !important;
}

.image-container {
    position: relative;
}

.overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #BDBDBD4b;
    opacity: 0;
    transition: opacity 0.3s;
}

.detail-btn {
    opacity: 0;
    transition: opacity 0.3s;
    position: absolute;
    top: 40%;
    left: 15%;

}

.image-container:hover .overlay,
.image-container:hover .detail-btn {
    opacity: 1;
}
</style>