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
                                <v-text-field v-model="data.fullname" label="Full Name" :rules="[rules.required]"
                                    required ></v-text-field>
                                <v-text-field v-model="data.email" label="Email" :rules="emailRules"
                                    required></v-text-field>
                                <v-text-field v-model="data.phone" label="Phone" :rules="[rules.required]"
                                    required></v-text-field>
                                <v-text-field v-model="data.password" label="Password" :rules="passwordRules"
                                    type="password" required></v-text-field>
                                <v-text-field v-model="data.password_confirmation" label="Password Confirmation"
                                    :rules="passwordRules" type="password" required></v-text-field>


                            </v-form>
                            <p class="pt-4">Do have an account? <a href="/login">Sign in now!</a> </p>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" size="large" min-width="120" border rounded="xs" elevation="2"
                                @click="register()">Sign Up</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>

        </v-app>
    </div>
</template>

<script>
import apiClient from '@/api';

export default {
    name: "RegisterView",
    data() {
        return {
            valid: false,
            data: {
                fullname: '',
                email: '',
                phone: '',
                password: '',
                password_confirmation: ''
            },
            emailRules: [
                v => !!v || 'Email is required',
                v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
            ],
            passwordRules: [
                v => !!v || 'Password is required',
                v => v.length >= 8 || 'Password must be at least 8 characters',
            ],
            rules: {
                required: value => !!value || 'Required.',
                number: value => !isNaN(Number(value)) || 'Must be a number.',
            },

        }
    },
    methods: {
        async register() {
            try {
                const isValid = await this.$refs.form.validate();
                if (isValid.valid) {
                    const response = await apiClient.post('/auth/register', this.data);
                    console.log(response.data);
                }
            } catch (error) {
                console.log(error);
            }

        }
    }
}
</script>

<style scoped></style>