<template>
    <div>
        <v-app
            style="background-image:url('https://fastly.picsum.photos/id/873/1920/1080.jpg?hmac=3ZayV9-ozngVA3oaVlJsXgw8XcT4H3OKBfBqfVhBEuI') ;">
            <v-row justify="center" align="center">
                <v-col cols="12" sm="8" md="4">
                    <v-card rounded="xs" elevation="15" style="background-color: rgba(0, 0, 0, 0.3)">
                        <v-card-title class="headline d-flex justify-center text-h4 text-white">SIGN IN</v-card-title>
                        <v-divider></v-divider>

                        <v-card-text class="text-white">
                            <v-form ref="form" v-model="valid">
                                <v-text-field v-model="email" label="Email" :rules="emailRules" required></v-text-field>
                                <v-text-field v-model="password" label="Password" :rules="passwordRules" type="password"
                                    required></v-text-field>
                            </v-form>
                            <p class="pt-4">Don't have an account? <a href="/register">Sign up now!</a> </p>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" size="large" min-width="120" border rounded="xs" elevation="2"
                                @click="login">Sign In</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>

        </v-app>
    </div>
</template>

<script>
import apiClient from '@/api';
import { jwtDecode } from 'jwt-decode';

export default {
    name: "LoginView",
    data() {
        return {
            valid: false,
            email: '',
            password: '',
            emailRules: [
                v => !!v || 'Email is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            passwordRules: [
                v => !!v || 'Password is required',
                v => v.length >= 8 || 'Password must be at least 8 characters',
            ],
        };
    },
    methods: {
        setCurrentCustomer(customer) {
            this.$store.commit('SET_CURRENT_CUS', customer)
            localStorage.setItem('currentCus', JSON.stringify(customer));
        },
        async login(){
            const isValid = await this.$refs.form.validate();
            if (isValid.valid) {
                try {
                    const response = await apiClient.post('/auth/login', {
                        email: this.email,
                        password: this.password
                    });
                    localStorage.setItem('tokenCus', response.data.token);
                    if (response.data.token) {
                        const decoded = jwtDecode(response.data.token)
                        this.currentCus = decoded.name
                        this.setCurrentCustomer(decoded.name)
                    }
                    this.$store.commit('SET_IS_LOGGED_CUS_IN', true);
                    this.$router.push('/');
                } catch (error) {
                    console.log(error);
                }
            } else {
                console.log('Form is invalid');
            }
        }
    }
}
</script>

<style scoped></style>