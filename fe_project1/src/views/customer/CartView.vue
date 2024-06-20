<template>
    <div>
        <v-main min-height="100vh" class="px-3">
            <v-row>
                <v-col cols="9">
                    <v-card min-height="100vh">
                        <v-card-title>Cart</v-card-title>
                        <v-card-subtitle>List Products</v-card-subtitle>
                        <v-divider></v-divider>
                        <v-table v-if="cartItems.length > 0">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Image</th>
                                    <th>Variant</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in cartItems" :key="item._id">
                                    <td>
                                        {{ index + 1 }}
                                    </td>
                                    <td>{{ item.product_id.name }}</td>
                                    <td>
                                        <v-img :src="item.product_id.images[0]">

                                        </v-img>
                                    </td>
                                    <td>
                                        <div v-if="item.variant_id">
                                            {{ item.variant_id.color }}/{{ item.variant_id.other }}
                                        </div>
                                        <div v-else>
                                            <p>None</p>
                                        </div>
                                    </td>
                                    <td>
                                        <v-btn density="compact" icon="mdi-minus"
                                            @click="updateQuantity(item, item.quantity - 1)"
                                            :disabled="item.quantity <= 1">
                                        </v-btn>
                                        <input type="text"
                                            class="input-quantity form-control form-control-sm text-center"
                                            style="width: 50px;" v-model="item.quantity" disabled />

                                        <v-btn density="compact" icon="mdi-plus"
                                            @click="updateQuantity(item, item.quantity + 1)">
                                        </v-btn>
                                    </td>
                                    <td>
                                        <div v-if="item.variant_id">
                                            {{ formatCurrency(item.variant_id.price) }}
                                        </div>
                                        <div v-else>
                                            {{ formatCurrency(item.product_id.price) }}
                                        </div>
                                    </td>
                                    <td>
                                        <v-btn color="red" size="xs-small" icon="$close" @click="deleteCartItem(item)">
                                        </v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                        <v-alert v-else>
                            <p>There are no items in the cart <router-link to="/products">Place order</router-link></p>
                        </v-alert>
                    </v-card>
                </v-col>
                <v-col cols="3">
                    <v-card>
                        <v-card-title primary-title>
                            <p class="text-uppercase">Total Price</p>
                        </v-card-title>
                        <v-divider></v-divider>
                        <v-card-text>
                             <p class="font-weight-light text-h5 text-red-darken-1" >{{ formatCurrency(totalPrice) }}</p>
                        </v-card-text>
                        <v-card-actions>
                            <v-btn block color="yellow-darken-2" variant="tonal" to="/checkout" text="Checkout">
                                
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-main>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: "CartView",

    mounted() {
        const token = localStorage.getItem('tokenCus')
        this.$store.dispatch('fetchCart', token);
    },
    methods: {
        formatCurrency(value) {
            const formatter = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            });
            return formatter.format(value);
        },
        async updateQuantity(item, newQuantity) {
            try {
                const token = localStorage.getItem("tokenCus")
                await this.$store.dispatch('updateCartItemQuantity', { token: token, cartId: item._id, quantity: newQuantity })
            } catch (error) {
                console.error('Error updating quantity:', error);
            }
        },
        async deleteCartItem(item) {
            try {
                const token = localStorage.getItem("tokenCus");
                this.$store.dispatch('removeFromCart', { token: token, cartId: item._id });
            } catch (error) {
                console.log(error);
            }
        }
    },
    computed: {
        ...mapGetters(['cartItems']),
        totalPrice() {
            return this.cartItems.reduce((total, item) => {
                const price = item.variant_id ? item.variant_id.price : item.product_id.price;
                return total + (price * item.quantity);
            }, 0);
        },
    }
}
</script>

<style scoped></style>