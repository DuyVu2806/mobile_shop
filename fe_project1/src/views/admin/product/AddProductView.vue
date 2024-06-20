<template>
    <div>
        <v-main>
            <v-container fluid>

                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-alert v-for="(alert, index) in alerts" :key="index" :color="alert.type"
                        :icon="alert.type == 'success' ? '$success' : '$error'">
                        {{ alert.message }}
                    </v-alert>
                    <v-card>
                        <v-card-title>
                            <span class="headline">Product Form</span>
                            <v-list class="d-flex justify-end " style="position: absolute; top: 0; right: 0;">
                                <v-btn variant="tonal" color="green-darken-3" to="/admin/product">Back</v-btn>
                            </v-list>
                        </v-card-title>
                        <v-divider></v-divider>

                        <v-card-text>
                            <v-container fluid>
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="product.name" :rules="[rules.required]" variant="solo-filled"
                                            label="Product Name" required></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="product.price" :rules="[rules.required, rules.number]" variant="solo-filled"
                                            label="Price" required></v-text-field>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-select v-model="product.category_id" :items="categories" item-title="name" variant="solo-filled"
                                            item-value="_id" :rules="[rules.required]" label="Category"
                                            required></v-select>
                                    </v-col>

                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="product.quantity" :rules="[rules.required, rules.number]" variant="solo-filled"
                                            label="Quantity" required></v-text-field>
                                    </v-col>

                                    <v-col cols="12">
                                        <v-btn color="primary" @click="addVariant">Add Variant</v-btn>
                                    </v-col>
                                    <v-col cols="12" v-for="(variant, index) in product.variants" :key="index"
                                        style="position: relative;">
                                        <v-icon color="red" @click="removeVariant(index)"
                                            style="position: absolute; top: 0;right: 0">mdi-close-circle</v-icon>
                                        <v-row>
                                            <v-col cols="12" md="3">
                                                <v-text-field v-model="variant.color" :rules="[rules.required]" variant="solo-filled"
                                                    label="Color" required></v-text-field> 
                                            </v-col>

                                            <v-col cols="12" md="3">
                                                <v-text-field v-model="variant.price"
                                                    :rules="[rules.required, rules.number]" label="Price" variant="solo-filled"
                                                    required></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="3">
                                                <v-text-field v-model="variant.quantity" :rules="[rules.required]" variant="solo-filled"
                                                    label="Quantity" required></v-text-field>
                                            </v-col>

                                            <v-col cols="12" md="3">
                                                <v-text-field v-model="variant.other" :rules="[rules.required]" variant="solo-filled"
                                                    label="Other" required></v-text-field>
                                            </v-col>
                                        </v-row>

                                    </v-col>

                                    <v-col cols="12">
                                        <v-file-input :rules="[rules.required]" label="Product Image" required
                                            accept="image/*" multiple placeholder="Pick an avatar"
                                            prepend-icon="mdi-camera" @change="previewImages"></v-file-input>
                                        <v-row v-if="imagePreviews.length" class="mt-4">
                                            <v-col v-for="(image, index) in imagePreviews" :key="index" cols="12"
                                                md="3">
                                                <v-img :src="image" max-width="200"></v-img>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="12">
                                        <v-textarea v-model="product.small_description" :rules="[rules.required]" variant="solo-filled"
                                            label="Small Description" required></v-textarea>
                                    </v-col>
                                    <v-col cols="12">
                                        <!-- <v-textarea v-model="product.description" :rules="[rules.required]"
                                            label="Description" required></v-textarea> -->
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

                <v-overlay :value="loading">
                    <v-progress-circular indeterminate size="64"></v-progress-circular>
                </v-overlay>
            </v-container>

        </v-main>
    </div>

</template>

<script>
import apiClient from '@/api';
export default {
    name: "AddProductView",
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
            loading: false,
        };
    },
    methods: {
        resetForm() {
            this.$refs.form.reset();
            this.imagePreviews = [];
            this.product.variants = [
                { color: '', price: '', other: '' },
            ];
        },
        async submitForm() {

            const isValid = await this.$refs.form.validate();
            // this.showAlert('Add To Product Successfully.', 'success');
            if (isValid.valid) {

                this.loading = true;
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
                    formData.append(`variants[${i}][color]`, variant.color);
                    formData.append(`variants[${i}][price]`, variant.price);
                    formData.append(`variants[${i}][quantity]`, variant.quantity);
                    formData.append(`variants[${i}][other]`, variant.other);
                }
                apiClient.post('/admin/product/add', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    this.product = response.data;
                    this.showAlert('Add To Product Successfully.', 'success');
                    this.resetForm();
                }).catch(error => {
                    this.showAlert('Failed to fetch products.', 'error');
                    console.log(error.response);
                }).finally(() => {
                    this.loading = false;
                });
            }
        },
        previewImages(event) {
            const files = event.target.files;
            // this.product.images = files;
            this.imagePreviews = [];
            if (files.length) {
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const reader = new FileReader();
                    reader.onload = e => {
                        this.imagePreviews.push(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            }
        },
        addVariant() {
            this.product.variants.push({ color: '', price: '', quantity: '', other: '' });
        },
        removeVariant(index) {
            this.product.variants.splice(index, 1);
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
        async fetchCategories() {
            try {
                const response = await apiClient.get('/admin/category');
                this.categories = response.data
                // if (this.categories.length > 0) {
                //     console.log('h');
                // }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        },
    },
    mounted() {
        this.fetchCategories();
    }
};
</script>


<style scoped>
.ql-container {
    height: 80% !important
}
</style>