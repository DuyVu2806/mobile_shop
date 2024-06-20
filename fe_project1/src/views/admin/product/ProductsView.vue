<template>
    <div>
        <v-main>
            <v-container fluid>
                <v-card>
                    <v-card-title class="px-2">List Products
                        <v-list class="d-flex justify-end " style="position: absolute; top: 0; right: 0;">
                            <v-btn variant="tonal" color="green-darken-3" to="/admin/product/add">Add Product</v-btn>
                        </v-list>
                    </v-card-title>
                    <v-divider></v-divider>

                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Name
                                </th>
                                <th class="text-left">
                                    Image
                                </th>
                                <th class="text-left">
                                    Category
                                </th>
                                <th class="text-left">
                                    Quantity
                                </th>
                                <th class="text-left">
                                    Price
                                </th>
                                <th class="text-left">
                                    Rating
                                </th>
                                <th class="text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="7">
                                    <p class="d-flex justify-center align-center">Loading ...</p>
                                </td>
                            </tr>
                            <tr v-for="product in products" :key="product._id" v-else>
                                <td>{{ product.name }}</td>
                                <td>
                                    <v-img v-if="product.images && product.images.length > 0" :src="product.images[0]"
                                        alt="Product Image" contain max-height="60" max-width="60"></v-img>
                                </td>
                                <td>{{ product.category_id.name }}</td>
                                <td>{{ product.quantity }}</td>
                                <td>{{ formatCurrency(product.price) }}</td>
                                <td>
                                    <v-icon v-for="i in 5" :key="i"
                                        :color="i <= product.rating ? 'yellow darken-2' : 'grey lighten-1'">mdi-star</v-icon>
                                </td>
                                <td>
                                    <v-btn class="mr-2" variant="flat" color="indigo-darken-3"
                                        :to="'/admin/product/edit/' + product._id">
                                        Edit
                                    </v-btn>
                                    <v-btn variant="tonal" color="red-accent-4">
                                        Delete
                                    </v-btn>
                                </td>
                            </tr>

                        </tbody>
                    </v-table>
                    <v-divider></v-divider>
                    <!-- <v-pagination :length="4"></v-pagination> -->
                </v-card>
            </v-container>

        </v-main>

    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            products: [],
            loading: true,
        }
    },
    created() {
        this.fetchProducts();
    },
    methods: {
        async fetchProducts() {
            try {
                this.loading = true;
                const response = await axios.get('http://localhost:3000/api/admin/product');
                this.products = response.data.product;
                this.loading = false;
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        },
        formatCurrency(value) {
            const formatter = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            });
            return formatter.format(value);
        }
    },
}
</script>

<style scoped></style>