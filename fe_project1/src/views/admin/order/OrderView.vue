<template>
    <div>
        <v-main>
            <div class="d-flex align-center justify-center" style="height: 100vh;" v-if="loading">
                <v-progress-circular :size="70" :width="7" color="blue" indeterminate></v-progress-circular>
            </div>
            <v-container fluid v-else>
                <v-card>
                    <v-card-title>
                        Orders
                    </v-card-title>
                    <v-divider></v-divider>
                    <v-card-text>
                        <v-row>
                            <v-col cols="3" class="border-lg rounded border-info">
                                <p class="text-subtitle-2">Total orders</p>
                                <h1 class="text-info">{{total_order}}</h1>
                                <span>abc</span>
                            </v-col>
                            <v-col cols="3" class="border-lg rounded border-primary">
                                <p class="text-subtitle-2">Orders item over time</p>
                                <h1 class="text-primary">{{orderedOverTime}}</h1>
                                <span>abc</span>
                            </v-col>
                            <v-col cols="3" class="border-lg rounded border-error">
                                <p class="text-subtitle-2">Returns orders</p>
                                <h1 class="text-error">{{orderReturn}}</h1>
                                <span>abc</span>
                            </v-col>
                            <v-col cols="3" class="border-lg rounded border-success">
                                <p class="text-subtitle-2">Fulilled orders over time</p>
                                <h1 class="text-success">{{orderFulilled}}</h1>
                                <span>abc</span>
                            </v-col>
                        </v-row>
                        <v-data-table-virtual :headers="headers" :items="items" item-value="name" class="mt-4 border"
                            loading-text="Loading... Please wait" :loading="loading">
                            <template v-slot:[`item.payment`]="{ item }">
                                <v-btn :color="getPaymentColor(item.payment)" prepend-icon="mdi-circle-medium"
                                    variant="outlined" size="small" rounded="lg" :ripple="false" height="25"
                                    min-width="100">
                                    <p style="font-size: 7pt;">{{ item.payment }}</p>
                                </v-btn>
                            </template>
                            <template v-slot:[`item.fulfilment`]="{ item }">
                                <v-btn :color="getPaymentColor(item.fulfilment)" prepend-icon="mdi-circle-medium"
                                    variant="outlined" size="small" rounded="lg" :ripple="false" height="25"
                                    min-width="100">
                                    <p style="font-size: 7pt;">{{ item.payment === 'Delivery' ? 'Fulfilled' :
                                        'Unfulfilled' }}</p>
                                </v-btn>
                            </template>
                            <template v-slot:[`item.ac`]="{ item }">
                                <v-btn color="primary" icon="mdi-text-box-search" variant="text" size="xs-small"
                                    @click="handleView(item.order_code)"></v-btn>
                                <v-btn color="red" icon="mdi-message-text" variant="text" size="xs-small"
                                    @click="handleDelete(item)"></v-btn>
                            </template>
                        </v-data-table-virtual>

                    </v-card-text>
                </v-card>

            </v-container>
        </v-main>
    </div>
</template>

<script>
import apiClient from '@/api';

export default {
    name: "OrderView",
    data() {
        return {
            headers: [
                { title: 'Orders', align: 'start', key: 'order_code' },
                { title: 'Date', align: 'end', key: 'createdAt' },
                { title: 'Customer', align: 'end', key: 'cus' },
                { title: 'Payment', align: 'end', key: 'payment' },
                { title: 'Total', align: 'end', key: 'price' },
                { title: 'Items', align: 'end', key: 'items' },
                { title: 'Fulfilment', align: 'end', key: 'fulfilment' },
                { title: 'Action', align: 'end', key: 'ac' },
            ],
            items: [],
            total_order: 0,
            orderedOverTime: 0,
            orderReturn: 0,
            orderFulilled: 0,
            loading: true,


        }
    },
    mounted() {
        this.fetchOrders();
    },
    methods: {
        async fetchOrders() {
            try {
                this.loading = true;
                const token = localStorage.getItem("tokenAdmin");
                const response = await apiClient.get("/admin/order", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                this.total_order = response.data.totalOrders;
                this.orderedOverTime = response.data.ordersThisWeek;
                this.orderReturn = response.data.cancelledOrders;
                this.orderFulilled = response.data.fulfilledOrders;
                this.items = response.data.data.map(order => ({
                    order_code: order.order_code,
                    createdAt: this.formatDate(order.createdAt),
                    cus: order.fullname,
                    payment: order.status_message,
                    price: this.formatCurrency(order.total_price),
                    items: `${order.order_items.length} items`,
                    fulfilment: order.status_message === 'Delivery' ? 'Fulfilled' : 'Unfulfilled',
                }));
                this.loading = false;
            } catch (error) {
                console.log(error);
            }
        },
        handleView(order_code) {
            this.$router.push(`/admin/order/${order_code}`);
        },
        formatDate(dateString) {
            const options = { day: '2-digit', month: 'short', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('en-US', options);
        },
        formatCurrency(value) {
            const formatter = new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND',
            });
            return formatter.format(value);
        },
        getPaymentColor(status) {
            switch (status) {
                case "In Progress":
                    return "green";
                case "Pending":
                    return "yellow";
                case "Delivery":
                    return "blue";
                case "Cancelled":
                    return "red";
                case "Fulfilled":
                    return "green";
                case "Unfulfilled":
                    return "red";
                default:
                    return "";
            }
        },
    },

}
</script>

<style scoped>
.v-row {
    margin: 0;
}

.payment-cell {
    border: 1px solid #ccc;
    /* Hoặc màu viền bạn muốn */
    padding: 8px;
    /* Điều chỉnh khoảng cách theo ý bạn */
}
</style>