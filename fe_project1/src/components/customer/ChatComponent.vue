<template>
    <div>
        <v-btn icon @click="toggleMessage" :class="['btn-message', { 'show': showChat }]">
            <v-icon color="blue">
                mdi-message
            </v-icon>
        </v-btn>

        <div :class="['chat-popup', { 'show': showChat }]" v-if="showChat">
            <v-card class="chat-container">
                <v-card-title>
                    Message
                    <v-btn icon="mdi-close-circle" color="red" size="xs-small" variant="text" @click="closeForm"
                        style="position: absolute;top:0.3rem;right: 0.3rem">

                    </v-btn>

                </v-card-title>
                <v-divider></v-divider>
                <div class="message-container" ref="messageContainer">
                    <div v-for="(message, index) in messages" :key="index"
                        :class="['message', message.sender === id ? 'sender-message' : 'receiver-message']">
                        <img :src="`https://ui-avatars.com/api/?name=${currentCus}`" alt="Avatar" class="avatar">
                        {{ message.content }}
                    </div>

                </div>
                <v-divider></v-divider>
                <div style="padding: 0.5rem; margin: 0.5rem;">
                    <v-row>
                        <v-col cols="8">
                            <v-text-field density="compact" label="Type your message..." variant="solo" hide-details
                                single-line v-model="newMessage" @keyup.enter="sendMessage"></v-text-field>
                        </v-col>
                        <v-col cols="4">
                            <v-btn color="blue" variant="text" append-icon="mdi-send" size="large"
                                @click="sendMessage">Send</v-btn>
                        </v-col>
                    </v-row>


                </div>
            </v-card>
        </div>
    </div>
</template>

<script>
import apiClient from '@/api';
import { jwtDecode } from 'jwt-decode';
import { mapState } from 'vuex';

export default {
    name: "ChatComponent",
    data() {
        return {
            showChat: false,
            newMessage: '',
            messages: [],
            ws: null,
            id: ''
        }
    },
    computed: {
        ...mapState({
            currentCus: state => state.currentCus,
        }),
    },
    mounted() {
        this.id = jwtDecode(localStorage.getItem("tokenCus")).id;
        this.fetchSavedMessages();
        this.connectWebSocket();
    },
    methods: {
        toggleMessage() {
            this.showChat = !this.showChat;
            if (this.showChat) {
                this.$nextTick(() => {
                    const container = this.$refs.messageContainer;
                    if (container) {
                        container.scrollTop = container.scrollHeight;
                    }
                });
            }
        },
        closeForm() {
            this.showChat = false;
        },
        connectWebSocket() {
            this.ws = new WebSocket('ws://localhost:3000');

            this.ws.onopen = () => {
                console.log('WebSocket connection established');
                this.sendJoinMessage(jwtDecode(localStorage.getItem("tokenCus")).id);
            };
            this.ws.onmessage = (event) => {

                const message = JSON.parse(event.data);
                this.messages.push(message);
                this.$nextTick(this.scrollToBottom);

            };
            this.ws.onclose = () => {
                console.log('WebSocket connection closed');
                this.ws = null;
            };
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        },
        sendMessage() {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                if (this.newMessage.trim() !== '') {
                    const message = {
                        room_chat: jwtDecode(localStorage.getItem("tokenCus")).id,
                        content: this.newMessage,
                        sender: jwtDecode(localStorage.getItem("tokenCus")).id,
                        recipient: '661644b2ca46c128447ccc9f',
                        timestamp: new Date().toISOString()
                    };
                    this.ws.send(JSON.stringify(message));
                    this.messages.push(message);
                    this.newMessage = '';
                    this.$nextTick(this.scrollToBottom);
                    
                }
            } else {
                console.error('WebSocket connection is not open.');
            }
        },
        sendJoinMessage(roomChatId) {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                const joinMessage = {
                    type: "join",
                    room_chat: roomChatId,
                };
                this.ws.send(JSON.stringify(joinMessage));
            }
        },
        async fetchSavedMessages() {
            try {
                const response = await apiClient.get('/chat/messages', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("tokenCus")}`,
                    }
                });
                this.messages = response.data;
                this.$nextTick(this.scrollToBottom);
            } catch (error) {
                console.error('Error fetching saved messages:', error);
            }
        },
        scrollToBottom() {
            const container = this.$refs.messageContainer;
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }

    }
}
</script>

<style scoped>
/* The popup chat - hidden by default */
.chat-popup {
    display: block;
    position: fixed;
    bottom: 0;
    right: 15px;
    z-index: 9;
}

.chat-popup.show {
    display: block;
}

.btn-message {
    display: block;
    position: fixed;
    right: 2.5rem;
    bottom: 1.5rem;
}

.btn-message.show {
    display: none;
}

.chat-container {
    max-width: 600px;
    margin: 50px auto;
    background-color: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.message-container {
    display: flex;
    flex-direction: column;
    /* max-height: 50rem; */
    height: 25rem;
    width: 22rem;
    overflow-y: auto;
}

.message {
    padding: 10px;
    margin: 10px;
    border-radius: 5px;
    max-width: 100%;
    word-wrap: break-word;
    display: flex;
    align-items: center;
    word-wrap: break-word;
    white-space: pre-wrap;
}

.receiver-message  {
    background-color: #e0e0e0;
    color: #000;
    align-self: flex-start;
}

.sender-message{
    background-color: #4CAF50;
    color: #fff;
    align-self: flex-end;
}

.avatar {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin-right: 10px;
}

.message input {
    width: calc(100% - 20px);
    padding: 8px;
    margin: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
}

.message button {
    padding: 8px;
    margin: 10px;
    background-color: #4CAF50;
    color: #fff;
    border: none;
    border-radius: 5px;
    cursor: pointer;
}
</style>