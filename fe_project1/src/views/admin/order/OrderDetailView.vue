<template>
    <div>
        <v-main>
            <div class="d-flex align-center justify-center" style="height: 100vh;" v-if="loading">
                <v-progress-circular :size="70" :width="7" color="blue" indeterminate></v-progress-circular>
            </div>
            <v-container fluid v-else>
                <v-row>
                    <v-col cols="6">
                        <v-card height="250">
                            <v-card-title>
                                Status Message
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text >
                                <v-timeline direction="horizontal" line-inset="12">
                                    <v-timeline-item :dot-color="getStatusColor(1)">
                                        <template v-slot:icon>
                                            <span>1</span>
                                        </template>
                                        <v-btn variant="outlined" :color="getStatusColor(1)">
                                            In Progress
                                        </v-btn>

                                    </v-timeline-item>
                                    <v-timeline-item :dot-color="getStatusColor(2)">
                                        <template v-slot:opposite>
                                            <v-btn variant="outlined" :color="getStatusColor(2)">
                                                Pending
                                            </v-btn>
                                        </template>
                                        <template v-slot:icon>
                                            <span>2</span>
                                        </template>
                                    </v-timeline-item>
                                    <v-timeline-item :dot-color="getStatusColor(3)">
                                        <v-btn variant="outlined" :color="getStatusColor(3)">
                                            Delivery
                                        </v-btn>
                                        <template v-slot:icon>
                                            <span>3</span>
                                        </template>
                                    </v-timeline-item>
                                </v-timeline>
                            </v-card-text>

                        </v-card>
                    </v-col>
                    <v-col cols="6">
                        <v-card height="250">
                            <v-card-title>
                                Information Order
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text>
                                <div class="d-flex align-center mb-2">
                                    <h3>Fullname:{{ info_order.name }} | Phone:<span class="text-grey"> {{
                                        info_order.phone }}</span></h3>
                                </div>
                                <p class="mb-2"><span class="text-body-1 font-weight-bold">Address:</span> {{ info_order.address }},
                                    {{ info_order.ward }}, {{
                                        info_order.district }}, {{ info_order.province }}</p>
                                <p class="mb-2">
                                    <span class="text-body-1 font-weight-bold">Order time:</span> {{
                                        info_order.orderTime }}
                                </p>
                                <p class="mb-2">
                                    <span class="text-body-1 font-weight-bold"> Status Message: </span>
                                    <v-btn variant="outlined" size="small" prepend-icon="mdi-circle-medium" color="blue"
                                        width="130" height="20">{{ info_order.status_message }}</v-btn>
                                    <v-btn icon="mdi-file-document-edit-outline" size="xs-small" variant="text"
                                        @click="dialog = true"></v-btn>
                                </p>

                                <v-dialog v-model="dialog" width="auto">
                                    <v-card max-width="400" >
                                        <v-card-title>
                                            Update Status Order
                                        </v-card-title>
                                        <v-divider></v-divider>
                                        <v-card-text>
                                            
                                        </v-card-text>
                                        <template v-slot:actions>
                                            <v-btn class="ms-auto" text="Ok" @click="dialog = false"></v-btn>
                                        </template>
                                    </v-card>
                                </v-dialog>
                                <p>
                                    <span class="text-body-1 font-weight-bold">Total price: </span>
                                    <span class="text-red">{{ info_order.total_price }}</span>
                                </p>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-col>
                        <v-card>
                            <v-card-title>
                                Order items
                            </v-card-title>
                            <v-card-text>
                                <v-data-table-virtual :headers="headers" item-value="name" :items="items"
                                    class="mt-4 border" loading-text="Loading... Please wait" :loading="loading">
                                    <template v-slot:[`item.image`]="{ item }">
                                        <v-img :src="item.image" height="50" width="50"></v-img>
                                    </template>

                                </v-data-table-virtual>

                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-main>
    </div>
</template>

<script>
import apiClient from '@/api';

export default {
    name: "OrderDetailView",
    data() {
        return {
            loading: true,
            dialog: false,
            headers: [
                { title: 'Name', align: 'start', key: 'name' },
                { title: 'Image', align: 'start', key: 'image' },
                { title: 'Variant', align: 'start', key: 'variant' },
                { title: 'Quantity', align: 'start', key: 'quantity' },
                { title: 'Price', align: 'start', key: 'price' },
            ],
            items: [],
            info_order: {
                name: '',
                phone: '',
                province: '',
                district: '',
                ward: '',
                address: '',
                orderTime: '',
                status_message: '',
                total_price: '',
                shipping_fee: '',
            },
        }
    },
    mounted() {
        this.fetchOrderItem();
    },
    methods: {
        async fetchOrderItem() {
            try {
                this.loading = true;
                const token = localStorage.getItem("tokenAdmin");
                const order_code = this.$route.params.order_code;
                const res = await apiClient.get(`/admin/order/${order_code}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                this.items = res.data.order_items.map(item => ({
                    name: item.product_id.name,
                    image: item.product_id.images[0],
                    variant: item.variant_id ? `${item.variant_id.color} | ${item.variant_id.other}` : "none",
                    quantity: item.quantity,
                    price: this.formatCurrency(item.price),
                }));
                this.info_order = {
                    name: res.data.fullname,
                    phone: res.data.phone,
                    province: res.data.province,
                    district: res.data.district,
                    ward: res.data.ward,
                    address: res.data.address,
                    orderTime: this.formatDate(res.data.createdAt),
                    status_message: res.data.status_message,
                    total_price: this.formatCurrency(res.data.total_price),
                    shipping_fee: this.formatCurrency(res.data.shipping_fee)
                }
                this.loading = false
            } catch (error) {
                console.log(error);
            }
        },
        formatCurrency(value) {
            const formatter = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            });
            return formatter.format(value);
        },
        formatDate(dateString) {
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        },
        getStatusColor(index) {
            const status = this.info_order.status_message;
            if (status === "Cancelled") {
                return "red";
            } else if (status === "Delivery" && index <= 3) {
                return "blue";
            } else if (status === "Pending" && index <= 2) {
                return "yellow";
            } else if (status === "In Progress" && index === 1) {
                return "green";
            } else {
                return "grey";
            }
        },
    }
}
</script>

<style scoped>
.v-row {
    margin: 0;
}
</style>