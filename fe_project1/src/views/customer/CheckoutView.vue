<template>
    <div>
        <v-main min-height=100vh>
            <div v-if="loading">
                <v-row>
                    <v-col cols="4">
                        <v-skeleton-loader type="heading">
                        </v-skeleton-loader>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="3">
                        <v-skeleton-loader type="heading">
                        </v-skeleton-loader>
                    </v-col>
                    <v-col cols="10">
                        <v-skeleton-loader type="text">
                        </v-skeleton-loader>
                    </v-col>
                </v-row>
                <v-skeleton-loader type="table-thead,table-tbody">
                </v-skeleton-loader>
                <v-row justify="end">
                    <v-col cols="2">
                        <v-skeleton-loader type="button">
                        </v-skeleton-loader>
                    </v-col>
                </v-row>

            </div>
            <div>
                <v-row>
                    <v-col cols="12" class="d-flex">
                        <h2 style="padding-right: 0.5rem"><v-icon>mdi-shopping-outline</v-icon> Name Shop</h2>
                        <v-divider vertical :thickness="2" color="warning"></v-divider>
                        <h2 style="padding-left: 0.5rem">Payment</h2>
                    </v-col>
                    <v-col cols="12">
                        <v-card style="padding:12px">
                            <v-card-title><v-icon>mdi-map-marker-outline</v-icon> Địa chỉ nhận hàng</v-card-title>
                            <v-card-text class="d-flex">
                                <p v-if="infoAddress">
                                    {{ infoAddress.fullname }} {{ infoAddress.phone }}
                                    {{ infoAddress.address }}, {{ infoAddress.ward }}, {{ infoAddress.district }}, {{
                                        infoAddress.province }}
                                </p>
                                <p v-else>None</p>
                                <v-btn variant="text" class="ml-3" color="orange" size="xs-small"
                                    @click="dialog = true">Thay đổi</v-btn>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    <v-dialog v-model="dialog" max-width="500" persistent>
                        <v-card>
                            <v-card-title style="position: relative;">
                                <span>Delivery Address</span>

                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text class="scrollAdress">
                                <span>
                                    My Address
                                </span>
                                <v-radio-group v-model="selectedAddress">
                                    <div class="mt-3" v-for="address in addressCus" :key="address._id">

                                        <v-row style="padding: 0.4rem 0">

                                            <v-col cols="1" class="d-flex ">
                                                <v-radio :value="address._id"></v-radio>
                                            </v-col>
                                            <v-col cols="11" style="position: relative;">
                                                <p class="mb-2">{{ address.fullname }} | <span
                                                        class="text-grey-darken-1">{{
                                                            address.phone }}</span></p>
                                                <p class="text-grey-darken-1">{{ address.address }}</p>
                                                <p class="text-grey-darken-1">{{ address.ward }}, {{ address.district
                                                    }}, {{
                                                        address.province }}</p>
                                                <v-btn icon="mdi-delete-empty-outline" size="xs-small" color="red"
                                                    variant="text" style="position: absolute; top:0;right:0"
                                                    @click="DeleteToAddress(address._id)"></v-btn>
                                            </v-col>
                                        </v-row>
                                        <v-divider></v-divider>
                                    </div>
                                </v-radio-group>

                                <v-btn prepend-icon="$plus" size="small" variant="outlined" class="mt-3"
                                    @click="dialog2 = true" color="deep-orange-lighten-1">
                                    Add to Address
                                </v-btn>
                            </v-card-text>
                            <v-card-actions>
                                <v-btn variant="outlined" color="deep-orange-darken-2" @click="dialog = false"
                                    min-width="150" text="Close">
                                </v-btn>
                                <v-btn variant="flat" color="deep-orange-darken-2" min-width="150" text="Submit"
                                    @click="selectAddress(selectedAddress)">
                                </v-btn>

                            </v-card-actions>

                        </v-card>
                    </v-dialog>

                    <v-dialog v-model="dialog2" max-width="650" persistent>

                        <v-card>
                            <v-card-title>
                                <span>New Address</span>
                            </v-card-title>
                            <v-divider></v-divider>
                            <v-card-text style="height: 30rem">
                                <v-form ref="addform" v-model="valid" lazy-validation>
                                    <v-row>
                                        <v-col cols="6" class="mb-3">
                                            <v-text-field label="Full Name" hide-details="auto" variant="solo"
                                                :rules="nameRules" v-model="cusAddress.fullname"
                                                required></v-text-field>
                                        </v-col>
                                        <v-col cols=6 class="mb-3">
                                            <v-text-field label="Number Phone" hide-details="auto" variant="solo"
                                                :rules="phoneRules" v-model="cusAddress.phone" required></v-text-field>

                                        </v-col>
                                        <v-col cols="4" class="mb-3">
                                            <v-select label="Province" hide-details="auto" variant="solo"
                                                :items="cusAddress.province" item-title="ProvinceName"
                                                item-value="ProvinceID" v-model="cusAddress.province_code"
                                                :rules="requiredRule"></v-select>
                                        </v-col>
                                        <v-col cols="4" class="mb-3">
                                            <v-select label="District" hide-details="auto" :items="cusAddress.district"
                                                item-title="DistrictName" item-value="DistrictID" variant="solo"
                                                v-model="cusAddress.district_code" :rules="requiredRule"></v-select>

                                        </v-col>
                                        <v-col cols="4" class="mb-3">
                                            <v-select label="Ward" hide-details="auto" variant="solo"
                                                :items="cusAddress.ward" item-title="WardName" item-value="WardCode"
                                                v-model="cusAddress.ward_code" :rules="requiredRule"></v-select>

                                        </v-col>
                                        <v-col cols="12" class="mb-3">
                                            <v-textarea label="Specific Address" hide-details="auto" variant="solo"
                                                rows="3" v-model="cusAddress.address" :rules="requiredRule"
                                                required></v-textarea>
                                        </v-col>
                                        <v-col cols="12" class="mb-3">
                                            <v-checkbox label="Set As Default"
                                                v-model="cusAddress.selected"></v-checkbox>
                                        </v-col>
                                    </v-row>
                                </v-form>
                            </v-card-text>
                            <v-divider></v-divider>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn text="Back" variant="outlined" color="blue-grey-lighten-1"
                                    @click="dialog2 = false" min-width="130"></v-btn>
                                <v-btn text="Save" variant="flat" color="success" min-width="130"
                                    @click="AddToAddress"></v-btn>
                            </v-card-actions>
                        </v-card>


                    </v-dialog>

                    <v-col cols="12">
                        <v-card min-height="100">
                            <v-row style="padding: 1.2rem 0">
                                <v-col cols="6">
                                    <h2 class="ml-5">Products</h2>
                                </v-col>
                                <v-col cols="2" class="d-flex align-center justify-center">
                                    <h4 class="ml-5 text-grey-darken-1">Price</h4>
                                </v-col>
                                <v-col cols="2" class="d-flex align-center justify-center">
                                    <h4 class="ml-1 text-grey-darken-1">Quantity</h4>
                                </v-col>
                                <v-col cols="2" class="d-flex align-center">
                                    <h4 class="ml-4 text-grey-darken-1">Total Price</h4>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <div v-for="order in orderItems" :key="order._id">
                                <v-row>
                                    <v-col cols="6">
                                        <v-row style="padding: 0.8rem 0">
                                            <v-col cols="2">
                                                <v-img height=60 width=60 class="ml-5"
                                                    :src="order.product_id.images[0]"></v-img>
                                            </v-col>
                                            <v-col cols="6" class="d-flex align-center">
                                                <h4>Name: {{ order.product_id.name }}</h4>
                                            </v-col>
                                            <v-col cols="4" class="d-flex align-center">
                                                <h5 class="text-grey-darken-1" v-if="order.variant_id">{{
                                                    order.variant_id.color }}|{{
                                                        order.variant_id.other }}
                                                </h5>
                                            </v-col>
                                        </v-row>
                                    </v-col>
                                    <v-col cols="2" class="d-flex align-center justify-center">

                                        <h4 class="ml-1 text-grey-darken-1" v-if="order.variant_id">{{
                                            formatCurrency(order.variant_id.price) }}</h4>
                                        <h4 class="ml-1 text-grey-darken-1" v-else>{{
                                            formatCurrency(order.product_id.price)
                                            }}</h4>

                                    </v-col>
                                    <v-col cols="2" class="d-flex align-center justify-center">
                                        <h4 class="text-grey-darken-1">{{ order.quantity }}</h4>
                                    </v-col>
                                    <v-col cols="2" class="d-flex align-center ">
                                        <h4 class="ml-3 text-grey-darken-1">{{
                                            formatCurrency(calculateTotalPrice(order)) }}
                                        </h4>
                                    </v-col>
                                </v-row>
                                <v-divider></v-divider>
                            </div>
                            <v-row justify="end" style="padding:1.2rem 0">
                                <v-col cols="3">
                                    <p class=text-h7>Transport Fee: <span>{{ formatCurrency(transport_Fee) }}</span></p>
                                </v-col>
                            </v-row>
                            <v-divider></v-divider>
                            <v-row justify="end" style="padding:1.2rem 0">
                                <v-col cols="4">
                                    <p class="text-h6 text-grey-darken-1">Total Price(n product): <span
                                            class="text-red-accent-3">{{
                                                formatCurrency(totalPrice) }}</span></p>
                                </v-col>
                            </v-row>
                        </v-card>
                    </v-col>
                </v-row>
                <v-row justify="end">
                    <v-col cols="2">
                        <v-btn block color="amber-darken-1" rounded @click="Payment">Payment</v-btn>
                    </v-col>

                </v-row>

            </div>

        </v-main>
    </div>
</template>

<script>
import apiClient from '@/api';
import axios from 'axios';

export default {
    name: "CheckOutView",
    data() {
        return {
            loading: true,
            selectedAddress: null,
            infoAddress: {},
            order: '',
            orderItems: [],
            addressCus: [],
            transport_Fee: 0,

            cusAddress: {
                fullname: '',
                phone: '',
                province: [],
                province_code: '',
                district: [],
                district_code: '',
                ward: [],
                ward_code: '',
                address: '',
                selected: false,
            },


            dialog: false,
            dialog2: false,
            valid: false,
            nameRules: [
                v => !!v || 'Name is required',
                v => (v && v.length <= 50) || 'Name must be less than 50 characters',
            ],
            phoneRules: [
                v => !!v || 'Phone number is required',
                v => /^\d+$/.test(v) || 'Phone number must be numeric',
                v => (v && v.length >= 10 && v.length <= 15) || 'Phone number must be between 10 and 15 characters',
            ],
            requiredRule: [
                v => !!v || 'This field is required',
            ],
        }
    },
    async mounted() {
        try {
            await this.fetchCartItem();
            await this.fetchProvince();
            await this.fetchAddress();
        } catch (error) {
            console.log(error);
        } finally {
            this.loading = false;
        }

    },
    watch: {
        async 'cusAddress.province_code'(newVal) {
            console.log(newVal);
            this.cusAddress.district = [];
            this.cusAddress.district_code = '';
            this.cusAddress.ward = [];
            this.cusAddress.ward_code = '';
            if (newVal) {
                await this.fetchDistrict(newVal);
            }
        },
        async 'cusAddress.district_code'(newVal) {
            this.cusAddress.ward = [];
            this.cusAddress.ward_code = '';
            if (newVal) {
                await this.fetchWard(newVal);
            }
        }
    },
    computed: {
        totalPrice() {
            return this.orderItems.reduce((total, item) => {
                const price = item.variant_id ? item.variant_id.price : item.product_id.price;
                return total + (price * item.quantity) + this.transport_Fee;
            }, 0);
        },
    },
    methods: {
        async Payment() {
            try {
                const data = {
                    fullname: this.infoAddress.fullname,
                    phone: this.infoAddress.phone,
                    district: this.infoAddress.district,
                    district_code: this.infoAddress.district_code,
                    province: this.infoAddress.province,
                    province_code: this.infoAddress.province_code,
                    ward: this.infoAddress.ward,
                    ward_code: this.infoAddress.ward_code,
                    address: this.infoAddress.address,
                    total_price: this.totalPrice,
                    shipping_fee: this.transport_Fee,
                    payment_mode: "Cod On Delivery",
                    order_items: this.orderItems.map((item) => {
                        return {
                            "product_id": item.product_id._id,
                            "variant_id": item.variant_id ? item.variant_id._id : null,
                            "quantity": item.quantity,
                            "price": item.variant_id ? item.variant_id.price : item.product_id.price
                        }
                    })
                }
                console.log(data);
                const token = localStorage.getItem('tokenCus');
                await apiClient.post("/order/checkout", data, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                this.$store.dispatch('clearCart', token);
                this.$router.push('/cart');
            } catch (error) {
                console.log(error);
            }
        },
        async AddToAddress() {
            const isValid = await this.$refs.addform.validate();
            if (isValid.valid) {
                try {
                    const token = localStorage.getItem('tokenCus');
                    const formData = {
                        'fullname': this.cusAddress.fullname,
                        'phone': this.cusAddress.phone,
                        'district': this.cusAddress.district.find(d => d.DistrictID === this.cusAddress.district_code)?.DistrictName || '',
                        'district_code': this.cusAddress.district_code,
                        'province': this.cusAddress.province.find(p => p.ProvinceID === this.cusAddress.province_code)?.ProvinceName || '',
                        'province_code': this.cusAddress.province_code,
                        'ward': this.cusAddress.ward.find(w => w.WardCode === this.cusAddress.ward_code)?.WardName || '',
                        'ward_code': this.cusAddress.ward_code,
                        'address': this.cusAddress.address,
                        'selected': this.cusAddress.selected,
                    };
                    await apiClient.post('/address/add-to-address', formData, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        }
                    });
                    this.dialog2 = false;
                    await this.fetchAddress();
                } catch (error) {
                    console.log(error);
                }
            }

        },
        async DeleteToAddress(address_id) {
            try {
                const token = localStorage.getItem('tokenCus');
                await apiClient.delete(`/address/delete-to-address/${address_id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                await this.fetchAddress();
            } catch (error) {
                console.log(error);
            }
        },
        async selectAddress(address_id) {
            try {
                const token = localStorage.getItem('tokenCus');
                await apiClient.put(`/address/update-to-address/${address_id}`, {
                    selected: true,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                this.dialog = false;
                await this.fetchAddress();
            } catch (error) {
                console.log(error);
            }
        },
        async fetchProvince() {
            try {
                const token = '3e93da2c-5bbd-11ee-af43-6ead57e9219a';
                const response = await axios.get("https://online-gateway.ghn.vn/shiip/public-api/master-data/province", {
                    headers: {
                        'Token': token,
                    }
                });
                this.cusAddress.province = response.data.data;
            } catch (error) {
                console.log(error);
            }

        },
        async fetchDistrict(value) {
            if (this.cusAddress.province_code) {
                try {
                    let token = '3e93da2c-5bbd-11ee-af43-6ead57e9219a';
                    let response = await axios.post("https://online-gateway.ghn.vn/shiip/public-api/master-data/district", {
                        province_id: Number(value),
                    },
                        {
                            headers: {
                                'Token': token,
                            },

                        });
                    this.cusAddress.district = response.data.data;
                } catch (error) {
                    console.log(error);
                }

            }

        },
        async fetchWard(newVal) {
            if (this.cusAddress.district_code) {
                try {
                    const token = '3e93da2c-5bbd-11ee-af43-6ead57e9219a';
                    const response = await axios.post("https://online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id", {
                        district_id: Number(newVal),
                    }, {
                        headers: {
                            'Token': token,
                        }
                    });
                    this.cusAddress.ward = response.data.data;
                } catch (error) {
                    console.log(error);
                }

            }

        },
        async fetchAddress() {
            try {
                const token = localStorage.getItem('tokenCus');
                const response = await apiClient.get('/address', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                this.addressCus = response.data;
                this.addressCus.map((address) => {
                    if (address.selected) {
                        this.selectedAddress = address._id;
                    }
                });
                this.fetchMyAddress();
            } catch (error) {
                console.log(error);
            }
        },
        async fetchCartItem() {
            try {
                const token = localStorage.getItem("tokenCus");
                const response = await apiClient.get("/cart", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                })
                this.orderItems = response.data;
            } catch (error) {
                console.log(error);
            }

        },
        async fetchMyAddress() {
            try {
                const token = localStorage.getItem('tokenCus');
                const response = await apiClient.get(`/address/${this.selectedAddress}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                });
                this.infoAddress = response.data;
                this.fetchTranspotFee();
            } catch (error) {
                console.log(error);
            }

        },
        async fetchTranspotFee() {
            try {
                const token = '3e93da2c-5bbd-11ee-af43-6ead57e9219a';
                const ShopId = '4575887';
                const response = await axios.post("https://online-gateway.ghn.vn/shiip/public-api/v2/shipping-order/fee", {
                    service_type_id: 2,
                    to_district_id: Number(this.infoAddress.district_code),
                    weight: 200,
                }, {
                    headers: {
                        'Token': token,
                        'ShopId': Number(ShopId),
                    }
                });
                this.transport_Fee = response.data.data.total
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
        calculateTotalPrice(order) {
            const price = order.variant_id ? order.variant_id.price : order.product_id.price;
            return price * order.quantity;
        },
    }
}
</script>

<style scoped>
.scrollAdress {
    height: 30rem;
    overflow-y: scroll;
}
</style>