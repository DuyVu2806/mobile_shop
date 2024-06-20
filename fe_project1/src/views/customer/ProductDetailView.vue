<template>
    <div>
        <v-main min-height="200vh">
            <v-row>
                <v-col cols="5">
                    <v-carousel>
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
                            <v-number-input control-variant="split" :min="1" :model-value="quantity" v-model="quantity"
                                width="150"></v-number-input>

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
                            <v-btn class="mr-3" color="success" prepend-icon="mdi-cart" variant="outlined" size="large"
                                @click="addToCard">Add to card</v-btn>
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
            <h3>Comment</h3>
            {{ quantity }}
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
            product: {
                name: '',
                category_id: '',
                images: [],
                variant_id: [],
                price: 0,
                quantity: 0
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
            const response = await apiClient.get(`/product/${this.$route.params.slug}`);
            this.product = response.data;
            this.selectedPrice = this.product.price;
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