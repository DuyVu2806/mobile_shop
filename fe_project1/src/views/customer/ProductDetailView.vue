<template>
    <div>
        <v-main min-height="200vh">
            <div v-if="loading" class="d-flex justify-center align-center" style="height: 80vh;">
                <v-progress-circular :size="70" :width="7" color="purple" indeterminate></v-progress-circular>
            </div>
            <div v-else>
                <v-row>
                    <v-col cols="5">
                        <v-carousel hide-delimiter-background show-arrows="hover" cycle>
                            <v-carousel-item v-for="(image, index) in product.images" :key="index">
                                <v-img aspect-ratio="16/9" cover :src="image">
                                </v-img>
                            </v-carousel-item>
                        </v-carousel>
                    </v-col>
                    <v-col cols="7">
                        <v-card min-height="500" class="px-1">
                            <v-card-title primary-title>
                                {{ product.name }}
                            </v-card-title>
                            <v-card-subtitle>
                                {{ product.category_id.name }}
                            </v-card-subtitle>
                            <v-card-text>
                                <h3>{{ formatCurrency(selectedPrice) }}</h3>
                                <v-number-input control-variant="split" :min="1" :model-value="quantity"
                                    v-model="quantity" width="150"></v-number-input>

                                <v-chip-group selected-class="text-primary" column>
                                    <v-chip v-for="variant in product.variant_id" :key="variant._id"
                                        :class="{ 'selected-chip': selectedVariant === variant }"
                                        @click="toggleVariant(variant)">
                                        {{ variant.color }} / {{ variant.other }}
                                    </v-chip>
                                </v-chip-group>
                                <p>{{ product.small_description }}</p>

                            </v-card-text>
                            <v-card-actions>
                                <v-btn class="mr-3" color="success" prepend-icon="mdi-cart" variant="outlined"
                                    size="large" @click="addToCard">Add to card</v-btn>
                                <v-btn :icon="isSelected ? 'mdi-heart' : 'mdi-heart-outline'" color="red"></v-btn>

                            </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
                <div>
                    <h3>Description</h3>
                    <p v-html="product.description"></p>
                </div>
                <v-divider></v-divider>
                <v-card min-height="500">
                    <v-row>
                        <v-col cols="4">
                            <v-card class="d-flex flex-column mx-auto py-8" elevation="2" height="250">
                                <div class="d-flex justify-center mt-auto text-h5 ">
                                    Rating overview
                                </div>

                                <div class="d-flex align-center flex-column my-auto">
                                    <div class="text-h2 mt-5">
                                        {{ product.rating }}
                                        <span class="text-h6 ml-n3">/5</span>
                                    </div>

                                    <v-rating readonly :model-value="product.rating" color="yellow-darken-3"
                                        half-increments></v-rating>
                                    <div class="px-3">3,360 ratings</div>
                                </div>
                            </v-card>
                        </v-col>
                        <v-col cols="8">
                            <v-card height="250">
                                <v-list bg-color="transparent" class="d-flex flex-column-reverse" density="compact">
                                    <v-list-item v-for="(rating, i) in 5" :key="i">
                                        <v-progress-linear :model-value="rating * 15" class="mx-n5"
                                            color="yellow-darken-3" height="20" rounded></v-progress-linear>

                                        <template v-slot:prepend>
                                            <span>{{ rating }}</span>
                                            <v-icon class="mx-3" icon="mdi-star"></v-icon>
                                        </template>

                                        <template v-slot:append>
                                            <div class="rating-values">
                                                <span class="d-flex justify-end"> {{ rating * 224 }} </span>
                                            </div>
                                        </template>
                                    </v-list-item>
                                </v-list>
                            </v-card>
                        </v-col>
                        <v-col cols="12">
                            <h2>User Reviews</h2>
                            <v-card v-for="review in reviews" :key="review.id" class="mb-3">
                                <v-card-title>
                                    <v-avatar left>
                                        <v-img :src="review.user.avatar"></v-img>
                                    </v-avatar>
                                    <div>
                                        <h3 class="title">{{ review.user.name }}</h3>
                                        <v-rating :value="review.rating" readonly></v-rating>
                                        <p class="subtitle">{{ review.date }}</p>
                                    </div>
                                </v-card-title>
                                <v-card-text>
                                    <p>{{ review.comment }}</p>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>
                </v-card>
            </div>
        </v-main>
    </div>
</template>

<script>
import apiClient from '@/api';
import { mapActions } from 'vuex';

export default {
    name: "ProductDetailView",
    data() {
        return {
            loading: true,
            product: {
                name: '',
                category_id: '',
                images: [],
                variant_id: [],
                price: 0,
                quantity: 0,
                rating: 0,
            },
            selectedPrice: 0,
            selectedVariant: {},
            isSelected: false,
            quantity: 1,
        }
    },
    created() {
        this.fetchProduct();
    },
    methods: {
        async fetchProduct() {
            try {
                this.loading = true;
                const response = await apiClient.get(`/product/${this.$route.params.slug}`);
                this.product = response.data;
                this.selectedPrice = this.product.price;
                this.loading = false;
            } catch (error) {
                console.log(error);
            }
        },
        toggleVariant(variant) {
            if (this.selectedVariant === variant) {
                this.selectedVariant = {};
                this.selectedPrice = this.product.price;
            } else {
                this.selectedVariant = variant;
                this.selectedPrice = variant.price;
            }
        },
        formatCurrency(value) {
            const formatter = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            });
            return formatter.format(value);
        },
        ...mapActions(['addToCartAction']),
        addToCard() {
            try {
                const productId = this.product._id;
                const quantity = this.quantity;
                const variantId = this.selectedVariant._id;
                const token = localStorage.getItem("tokenCus");
                this.addToCartAction({ token, productId, variantId, quantity });
            } catch (error) {
                console.log(error);
            }
        }
    }
}
</script>

<style scoped></style>