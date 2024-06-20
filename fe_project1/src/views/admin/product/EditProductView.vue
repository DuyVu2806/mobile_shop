<template>
    <v-main>
        <v-container fluid>
            <v-skeleton-loader class="mx-auto" min-height="100vh" elevation="2"
                type="card,paragraph,paragraph,paragraph,paragraph" boilerplate v-if="loading">
            </v-skeleton-loader>
            <v-form ref="form" v-model="valid" lazy-validation v-else>
                <v-alert v-for="(alert, index) in alerts" :key="index" :color="alert.type"
                    :icon="alert.type == 'success' ? '$success' : '$error'">
                    {{ alert.message }}
                </v-alert>
                <v-card>
                    <v-card-title>
                        <v-card-title>
                            <span class="headline">Product Form</span>
                            <v-list class="d-flex justify-end " style="position: absolute; top: 0; right: 0;">
                                <v-btn variant="tonal" color="green-darken-3" to="/admin/product">Back</v-btn>
                            </v-list>
                        </v-card-title>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-container fluid>
                            <v-row>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="product.name" :rules="[rules.required]" label="Product Name"
                                        variant="solo-filled" required></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="product.price" :rules="[rules.required, rules.number]"
                                        variant="solo-filled" label="Price" required></v-text-field>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-select v-model="product.category_id" :items="categories" item-title="name"
                                        variant="solo-filled" item-value="id" :rules="[rules.required]" label="Category"
                                        required></v-select>
                                </v-col>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="product.quantity" :rules="[rules.required, rules.number]"
                                        variant="solo-filled" label="Quantity" required></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-btn color="primary" @click="addVariant">Add Variant</v-btn>
                                </v-col>
                                <v-col cols="12" v-for="(variant, index) in product.variants" :key="index"
                                    style="position: relative;">
                                    <v-icon color="red" @click="removeVariant(index)"
                                        style="position: absolute; top: 0;right: 0;z-index:100">mdi-close-circle</v-icon>
                                    <v-row>
                                        <v-col cols="12" md="3">
                                            <v-text-field v-model="variant.color" :rules="[rules.required]"
                                                variant="solo-filled" label="Color" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field v-model="variant.price"
                                                :rules="[rules.required, rules.number]" label="Price"
                                                variant="solo-filled" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field v-model="variant.quantity" :rules="[rules.required]"
                                                variant="solo-filled" label="Quantity" required></v-text-field>
                                        </v-col>
                                        <v-col cols="12" md="3">
                                            <v-text-field v-model="variant.other" :rules="[rules.required]"
                                                variant="solo-filled" label="Other" required></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12">
                                    <input type="file" ref="fileInput" @change="previewImages" multiple
                                        style="display: none">
                                    <v-btn icon @click="triggerFileInput">
                                        <v-icon>mdi-camera</v-icon>
                                    </v-btn>
                                    <v-row v-if="imagePreviews.length" class="mt-4">
                                        <v-col v-for="(image, index) in imagePreviews" :key="index" cols="12" md="2"
                                            style="position: relative;">
                                            <v-img :src="image" max-width="150" max-height="100"></v-img>
                                            <v-icon color="red" @click="removeImage(index)"
                                                style="position: absolute; top: 0">mdi-close-circle</v-icon>
                                        </v-col>
                                    </v-row>
                                </v-col>
                                <v-col cols="12">
                                    <v-textarea v-model="product.small_description" :rules="[rules.required]"
                                        variant="solo-filled" label="Small Description" required></v-textarea>
                                </v-col>
                                <v-col cols="12">
                                    <QuillEditor theme="snow" style="min-height: 80vh; padding-bottom: 3rem;"
                                        toolbar="full" id="description" v-model:content="product.description"
                                        contentType="html" />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" text @click="submitForm">Submit</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-container>
    </v-main>
</template>

<script>
import apiClient from '@/api';

export default {
    name: "EditProductView",
    data() {
        return {
            valid: false,
            product: {
                name: '',
                price: '',
                category_id: '',
                quantity: '',
                small_description: '',
                description: '',
                images: [],
                variants: [
                    { color: '', price: '', quantity: '', other: '' },
                ],
            },
            imagePreviews: [],
            categories: [],
            selectedCategoryId: '',
            rules: {
                required: value => !!value || 'Required.',
                number: value => !isNaN(Number(value)) || 'Must be a number.',
            },
            alert: {
                show: false,
                message: '',
                type: '',
            },
            alerts: [],
            loading: true,
        }
    },
    methods: {
        async fetchProduct(id) {
            try {
                this.loading = true;
                const response = await apiClient.get(`/admin/product/${id}`);
                this.product = response.data;
                this.product.category_id = response.data.category_id._id
                if (response.data.variant_id && Array.isArray(response.data.variant_id)) {
                    this.product.variants = response.data.variant_id.map(variant => ({
                        _id: variant._id,
                        color: variant.color,
                        price: variant.price,
                        quantity: variant.quantity,
                        other: variant.other
                    }));
                }

                this.imagePreviews = this.product.images.map(image =>
                    typeof image === 'string' ? image : URL.createObjectURL(image));
                this.loading = false;
            } catch (error) {
                console.error(error);
            }
        },
        async fetchCategories() {
            try {
                const response = await apiClient.get('/admin/category');
                this.categories = response.data.map(category => ({ id: category._id, name: category.name }));
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        },
        async submitForm() {
            const isValid = await this.$refs.form.validate();
            if (isValid.valid) {
                let formData = new FormData();
                formData.append('name', this.product.name);
                formData.append('price', this.product.price);
                formData.append('category_id', this.product.category_id);
                formData.append('quantity', this.product.quantity);
                formData.append('small_description', this.product.small_description);
                formData.append('description', this.product.description);
                for (let i = 0; i < this.product.images.length; i++) {
                    formData.append('images', this.product.images[i]);
                }
                for (let i = 0; i < this.product.variants.length; i++) {
                    const variant = this.product.variants[i];
                    if (variant._id) {
                        formData.append(`variants[${i}][_id]`, variant._id);
                    }
                    formData.append(`variants[${i}][color]`, variant.color);
                    formData.append(`variants[${i}][price]`, variant.price);
                    formData.append(`variants[${i}][quantity]`, variant.quantity);
                    formData.append(`variants[${i}][other]`, variant.other);
                }
                apiClient.put('/admin/product/update/' + this.$route.params.id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    this.product = response.data;
                    this.showAlert('Add To Product Successfully.', 'success');
                    this.fetchProduct(this.$route.params.id);
                    window.scrollTo(0, 0);
                }).catch(error => {
                    this.showAlert('Failed to fetch products.', 'error');
                    console.log(error);
                }).finally(() => {
                    this.loading = false;
                });
            }
        },

        addVariant() {
            if (!this.product.variants) {
                this.product.variants = [];
            }
            this.product.variants.push({ color: '', price: '', quantity: '', other: '' });
        },
        removeVariant(index) {
            this.product.variants.splice(index, 1);
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        previewImages(event) {
            const files = event.target.files;
            if (files.length) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    this.product.images.push(file);
                    const reader = new FileReader();
                    reader.onload = e => {
                        this.imagePreviews.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
        },
        removeImage(index) {
            this.product.images.splice(index, 1);
            this.imagePreviews.splice(index, 1);
        },
        showAlert(message, type) {
            this.alerts.push({ message, type });
            setTimeout(() => {
                this.removeAlert(message);
            }, 5000);
        }
        ,
        removeAlert(message) {
            this.alerts = this.alerts.filter(alert => alert.message !== message);
        },
    },
    mounted() {
        const productId = this.$route.params.id;
        this.fetchProduct(productId);
        this.fetchCategories();
    }
}
</script>

<style scoped>
.ql-container {
    height: 80% !important
}
</style>