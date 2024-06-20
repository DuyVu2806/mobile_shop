<template>
    <div>
        <v-main>
            <v-row>
                <!-- Contact List -->
                <v-col cols="12" v-if="loading">
                    <p class="d-flex justify-center align-center">Loading ...</p>
                </v-col>
                <v-col cols="4" v-else >
                    <v-card min-height="100vh">
                        <v-list>
                            <v-list-item v-for="contact in contacts" :key="contact.id" @click="selectContact(contact)" class="px-4">
                                <v-row>
                                    <v-col cols="2">
                                        <v-img :src="contact.avatar" width="50" height="50"></v-img>
                                    </v-col>
                                    <v-col>
                                        <v-list-item-title>{{ contact.name }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ contact.lastMessage }}</v-list-item-subtitle>
                                    </v-col>
                                </v-row>
                                <v-divider></v-divider>
                            </v-list-item>
                        </v-list>
                    </v-card>

                </v-col>

                <!-- Chat Window -->
                <v-col cols="8">
                    <v-card v-if="selectedContact">
                        <v-card-title>
                            <v-avatar left>
                                <v-img :src="selectedContact.avatar"></v-img>
                            </v-avatar>
                            <span>{{ selectedContact.name }}</span>
                        </v-card-title>
                        <v-divider></v-divider>

                        <v-card-text>
                            <div class="chat-window" ref="chatWindow">
                                <v-list>
                                    <v-list-item v-for="(message, index) in selectedContact.messages" :key="index">
                                        <v-list-item-title :class="{ 'mine': message.sender === senderAdmin }">{{
                                            message.content
                                        }}</v-list-item-title>
                                    </v-list-item>
                                </v-list>
                            </div>
                        </v-card-text>


                        <v-divider></v-divider>
                        <v-card-actions>
                            <v-text-field v-model="newMessage" @keyup.enter="sendMessage" density="compact"
                                label="Type your message..." variant="solo" hide-details single-line></v-text-field>
                            <v-btn @click="sendMessage" color="primary">Send</v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>

        </v-main>
    </div>
</template>

<script>
import apiClient from '@/api';
import { jwtDecode } from 'jwt-decode';

export default {
    name: "ChatView",
    data() {
        return {
            contacts: [
            ],
            selectedContact: null,
            newMessage: '',
            senderAdmin: jwtDecode(localStorage.getItem("tokenAdmin")).id,
            ws: null,
            loading: true,
        };
    },
    methods: {
        async selectContact(contact) {
            try {
                this.selectedContact = contact;
                const response = await apiClient.get(`/admin/chat/${contact.id}`);
                this.selectedContact.messages = response.data;
                this.$nextTick(() => {
                    this.scrollToEnd();
                });
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        },
        async fetchContact() {
            this.loading = true;
            const response = await apiClient.get("/admin/customers");
            this.contacts = response.data.map(customers => ({
                id: customers._id,
                name: customers.fullname,
                avatar: 'https://via.placeholder.com/150',
                lastMessage: '',
                messages: [],
            }));
            this.loading = false;

        },
        sendMessage() {
            if (this.newMessage.trim() !== '') {
                const message = {
                    room_chat: this.selectedContact.id,
                    content: this.newMessage,
                    sender: jwtDecode(localStorage.getItem("tokenAdmin")).id,
                    recipient: this.selectedContact.id,
                    timestamp: new Date().toISOString(),
                };
                this.selectedContact.messages.push(message);
                this.newMessage = '';
                this.$nextTick(() => {
                    this.scrollToEnd();
                });
                // Gửi tin nhắn qua WebSocket
                if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                    // console.log(JSON.stringify(message));
                    this.ws.send(JSON.stringify(message));
                }
            }
        },
        initializeWebSocket() {
            this.ws = new WebSocket('ws://localhost:3000');

            this.ws.onopen = () => {
                console.log('WebSocket connection established');
            };

            this.ws.onmessage = (event) => {
                const message = JSON.parse(event.data);
                const contact = this.contacts.find(c => c.id === message.room_chat);
                if (contact) {
                    // contact.messages.push(message);
                    if (this.selectedContact && this.selectedContact.id === message.room_chat) {
                        this.selectedContact.messages.push(message);
                        this.$nextTick(() => {
                            this.scrollToEnd();
                        });
                    }
                }
            };

            this.ws.onclose = () => {
                console.log('WebSocket connection closed');
                this.ws = null;
            };

            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        },
        scrollToEnd() {
            const chatWindow = this.$refs.chatWindow;
            if (chatWindow) {
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }
        }
    },
    created() {
        this.initializeWebSocket();
        this.fetchContact();
    }

}
</script>

<style scoped>
.v-application {
    font-family: Roboto, sans-serif;
}

.v-list-item {
    cursor: pointer;
}

.chat-window {
    height: 500px;
    overflow-y: auto;
}

.mine {
    text-align: right;
}
</style>