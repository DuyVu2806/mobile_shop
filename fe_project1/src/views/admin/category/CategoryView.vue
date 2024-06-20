<template>
    <div>
        <v-main>
            <v-container fluid>
                <v-card>
                    <v-card-title class="px-2">List Category
                        <v-list class="d-flex justify-end " style="position: absolute; top: 0; right: 0;">
                            <v-btn variant="tonal" color="green-darken-3" @click="openAddDialog">Add Category</v-btn>

                        </v-list>
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Image</th>
                                <th>Meta title</th>
                                <th>Description</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="loading">
                                <td colspan="6">
                                    <p class="d-flex justify-center align-center">Loading ...</p>
                                </td>
                                
                            </tr>
                            <tr v-for="(category, index) in categories" :key="category._id" v-else>
                                <td>{{ index + 1 }}</td>
                                <td>{{ category.name }}</td>
                                <td>
                                    <v-img alt="Product Image" contain max-height="60" max-width="60"
                                        :src="category.image">

                                    </v-img>
                                </td>
                                <td>{{ category.meta_title }}</td>
                                <td> {{ category.description }}</td>
                                <td>
                                    <v-btn class="mr-2" variant="flat" color="indigo-darken-3"
                                        @click="openEditDialog(category)">
                                        Edit
                                    </v-btn>

                                    <v-btn variant="tonal" color="red-accent-4">
                                        Delete
                                    </v-btn>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                    <v-dialog v-model="editDialog" max-width="600px">
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ isEditMode ? 'Edit' : 'Add' }} Category</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-form ref="editForm" v-model="formValid">
                                        <v-row>
                                            <v-col cols="12">
                                                <v-text-field v-model="editCategoryData.name" variant="solo-filled"
                                                    :rules="[v => !!v || 'Name is required']" required
                                                    label="Name"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-btn size="x-small" class="mb-2" icon @click="triggerFileInput">
                                                    <v-icon>mdi-camera</v-icon>
                                                </v-btn>
                                                <input type="file" ref="fileInput" @change="previewImage"
                                                    style="display: none">
                                                <v-img :src="imagePreviews" max-width="100" max-height="75"></v-img>
                                                <small v-if="imageError" class="mt-2" style="color: #F44336;">Image is required</small>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-text-field v-model="editCategoryData.meta_title" variant="solo-filled"
                                                    :rules="[v => !!v || 'Meta Title is required', v => v.length >=5 || 'Meta_title must be at least 10 characters']" required
                                                    label="Meta Title"></v-text-field>
                                            </v-col>
                                            <v-col cols="12">
                                                <v-textarea v-model="editCategoryData.description" variant="solo-filled"
                                                    :rules="[v => !!v || 'Description is required', v => v.length >=10 || 'Description must be at least 10 characters']" required
                                                    label="Description"></v-textarea>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn color="blue darken-1" text @click="saveCategory">Save</v-btn>
                                <v-btn color="grey darken-1" text @click="closeEditDialog">Cancel</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-card>
            </v-container>

        </v-main>
    </div>
</template>

<script>
import apiClient from '@/api';

export default {
    name: "CategoryView",
    data() {
        return {
            categories: {
                name: '',
                image: '',
                metascription: '',
            },
            editDialog: false,
            editCategoryData: {
                _id: '',
                name: '',
                image: '',
                meta_title: '',
                description: '',
            },
            rules: {
                required: value => !!value || 'Required.',
                number: value => !isNaN(Number(value)) || 'Must be a number.',
            },
            imagePreviews: '',
            isEditMode: false, //flat add or edit
            formValid: false,
            imageError: false,
            loading: true,
        }
    },
    mounted() {
        this.fetchCategories();
    },
    methods: {
        async fetchCategories() {
            try {
                this.loading = true;
                const response = await apiClient.get('/admin/category');
                this.categories = response.data;
                this.loading = false;
            } catch (error) {
                console.log(error);
            }
        },
        openEditDialog(category) {
            this.editCategoryData = { ...category };
            this.editDialog = true;
            this.isEditMode = true;
            this.imagePreviews = typeof this.editCategoryData.image === 'string' ? this.editCategoryData.image : URL.createObjectURL(this.editCategoryData.image);
        },
        openAddDialog() {
            this.editCategoryData = {
                _id: '',
                name: '',
                image: '',
                meta_title: '',
                description: '',
            };
            this.imagePreviews = '';
            this.isEditMode = false;
            this.editDialog = true;
        },
        previewImage() {
            const file = event.target.files[0];
            if (file) {
                this.editCategoryData.image = file;
                const reader = new FileReader();
                reader.onload = e => {
                    this.imagePreviews = e.target.result;
                };
                reader.readAsDataURL(file);
                this.imageError = false;
            }
        },
        triggerFileInput() {
            this.$refs.fileInput.click();
        },
        closeEditDialog() {
            this.editDialog = false;
            this.editCategoryData = {
                _id: '',
                name: '',
                image: '',
                meta_title: '',
                description: '',
            };
            this.imagePreviews = '';
        },
        validateImage() {
            if (!this.editCategoryData.image && !this.imagePreviews) {
                this.imageError = true;
                
                return false;
            }
            return true;
        },
        async saveCategory() {
            try {
                const isValid = await this.$refs.editForm.validate();
                if (isValid.valid && this.validateImage()) {
                    console.log(this.isEditMode);
                    const formData = new FormData();
                    formData.append('name', this.editCategoryData.name);
                    formData.append('meta_title', this.editCategoryData.meta_title);
                    formData.append('description', this.editCategoryData.description);
                    formData.append('image', this.editCategoryData.image);
                    if (this.isEditMode) {
                        await apiClient.put(`/admin/category/update/${this.editCategoryData._id}`, formData);
                    } else {
                        await apiClient.post("/admin/category/add", formData);
                    }
                    this.fetchCategories();
                    this.closeEditDialog();
                }

            } catch (error) {
                console.error(error);
            }
        }

    }
}
</script>

<style scoped></style>