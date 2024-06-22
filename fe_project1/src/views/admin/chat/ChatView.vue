<template>
    <div>
        <v-main>
            <v-container fluid>
                <v-card>
                    <v-row>
                        <v-col cols="4" class="discussions">
                            <div class="discussion search">
                                <div class="searchbar">
                                    <v-text-field append-inner-icon="mdi-magnify" density="compact"
                                        label="Search templates" variant="solo" hide-details single-line></v-text-field>
                                </div>
                            </div>
                            <div v-for="contact in contacts" :key="contact.id"
                                :class="['discussion', { 'message-active': selectedContact && selectedContact.id === contact.id }]"
                                @click="selectContact(contact)">
                                <div class="photo" style="background-image:">
                                    <div class="online"></div>
                                </div>
                                <div class="desc-contact">
                                    <p class="name">{{ contact.name }}</p>
                                    <p class="message">{{ contact.lastMessage }}</p>
                                </div>
                                <div class="timer">{{ formatDate(contact.lastTime) }}</div>
                            </div>
                        </v-col>
                        <v-col cols="8" class="chat" v-if="selectedContact">
                            <v-card>
                                <v-card-title>
                                    <div class="d-flex">
                                        <img :src="selectedContact.avatar" alt="" width="50px" height="50px"
                                            style="border-radius: 50%">
                                        <p class="name ml-2 d-flex align-center">{{ selectedContact.name }}</p>
                                    </div>
                                </v-card-title>
                                <v-divider></v-divider>
                                <v-card-text>
                                    <div class="messages-chat" ref="chatWindow">
                                        <div v-for="(message, index) in selectedContact.messages" :key="index"
                                            class="message">
                                            <div class="response" v-if="message.sender === senderAdmin">
                                                <p class="text"> {{ message.content }} </p>
                                            </div>
                                            <template v-else>
                                                <div class="photo" style="background-image: ">
                                                    <div class="online"></div>
                                                </div>
                                                <p class="text"> {{ message.content }} </p>
                                            </template>
                                        </div>
                                    </div>

                                </v-card-text>
                                <v-divider></v-divider>
                                <v-card-actions>
                                    <input type="text" class="write-message" placeholder="Type your message here"
                                        v-model="newMessage" @keyup.enter="sendMessage" />
                                    <v-btn size="large" height="50" width="120" class="ml-2" variant="elevated" color="primary"
                                        prepend-icon="mdi-send" @click="sendMessage">Send</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-col>
                    </v-row>

                </v-card>
            </v-container>

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
    mounted() {
        this.initializeWebSocket();
        this.fetchContact();
    },
    methods: {
        async selectContact(contact) {
            try {
                this.selectedContact = contact;
                const response = await apiClient.get(`/admin/chat/contact/${contact.id}`);
                this.selectedContact.messages = response.data;
                this.$nextTick(() => {
                    this.scrollToEnd();
                });
                this.sendJoinMessage(contact.id);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        },
        async fetchContact() {
            this.loading = true;
            const res = await apiClient.get("/admin/chat/contact");
            this.contacts = res.data.map(customers => ({
                id: customers.room_chat._id,
                name: customers.room_chat.fullname,
                avatar: 'https://via.placeholder.com/150',
                lastMessage: customers.last_message,
                messages: [],
                lastTime: customers.updatedAt,
            }));
            this.loading = false;

        },
        async sendMessage() {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                if (this.newMessage.trim() !== '') {
                    const message = {
                        room_chat: this.selectedContact.id,
                        content: this.newMessage,
                        sender: jwtDecode(localStorage.getItem("tokenAdmin")).id,
                        recipient: this.selectedContact.id,
                        timestamp: new Date().toISOString(),
                    };
                    await this.ws.send(JSON.stringify(message));
                    this.selectedContact.messages.push(message);
                    this.newMessage = '';
                    this.$nextTick(() => {
                        this.scrollToEnd();
                    });
                }

            } else {
                console.error('WebSocket connection is not open.');

            }

        },
        initializeWebSocket() {
            this.ws = new WebSocket('ws://localhost:3000');

            this.ws.onopen = () => {
                console.log('WebSocket connection established');
                if (this.selectedContact) {
                    this.sendJoinMessage(this.selectedContact.id);
                }
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
        sendJoinMessage(roomChatId) {
            if (this.ws && this.ws.readyState === WebSocket.OPEN) {
                const joinMessage = {
                    type: "join",
                    room_chat: roomChatId,
                };
                this.ws.send(JSON.stringify(joinMessage));
            }
        },
        scrollToEnd() {
            const chatWindow = this.$refs.chatWindow;
            if (chatWindow) {
                chatWindow.scrollTop = chatWindow.scrollHeight;
            }
        },
        formatDate(dateString) {
            const options = { day: '2-digit', month: 'numeric', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('vi-VN', options);
        },
    },
    

}
</script>

<style scoped>
.discussions {
    height: 635px;
    box-shadow: 0px 8px 10px rgba(0, 0, 0, 0.20);
    overflow: hidden;
    background-color: #f5f5f5;
    display: inline-block;
}

.discussions .discussion {
    width: 100%;
    height: 90px;
    background-color: #FAFAFA;
    border-bottom: solid 1px #E0E0E0;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.discussions .search {
    display: flex;
    align-items: center;
    justify-content: center;
    color: #E0E0E0;
}

.discussions .search .searchbar {
    height: 40px;
    background-color: #FFF;
    width: 100%;
    padding: 0 20px;
    display: flex;
    align-items: center;
    cursor: pointer;
}

.discussions .search .searchbar input {
    margin-left: 15px;
    height: 38px;
    width: 100%;
    border: none;
    font-family: 'Montserrat', sans-serif;
    ;
}

.discussions .search .searchbar *::-webkit-input-placeholder {
    color: #E0E0E0;
}

.discussions .search .searchbar input *:-moz-placeholder {
    color: #E0E0E0;
}

.discussions .search .searchbar input *::-moz-placeholder {
    color: #E0E0E0;
}

.discussions .search .searchbar input *:-ms-input-placeholder {
    color: #E0E0E0;
}

.discussions .message-active {
    height: 90px;
    background-color: #b0b0b0;
    border-bottom: solid 1px #E0E0E0;
}

.discussions .discussion .photo {
    margin-left: 20px;
    display: block;
    width: 45px;
    height: 45px;
    background: #E6E7ED;
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}

.online {
    position: relative;
    top: 30px;
    left: 35px;
    width: 13px;
    height: 13px;
    background-color: #8BC34A;
    border-radius: 13px;
    border: 3px solid #FAFAFA;
}

.desc-contact {
    height: 43px;
    width: 50%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.discussions .discussion .name {
    margin: 0 0 0 20px;
    font-family: 'Montserrat', sans-serif;
    font-size: 11pt;
    color: #515151;
}

.discussions .discussion .message {
    margin: 6px 0 0 20px;
    font-family: 'Montserrat', sans-serif;
    font-size: 9pt;
    color: #515151;
}

.timer {
    margin-left: 15%;
    font-family: 'Open Sans', sans-serif;
    font-size: 11px;
    padding: 3px 8px;
    color: #BBB;
    background-color: #FFF;
    border: 1px solid #E5E5E5;
    border-radius: 15px;
}


.header-chat {
    background-color: #FFF;
    height: 90px;
    box-shadow: 0px 3px 2px rgba(0, 0, 0, 0.100);
    display: flex;
    align-items: center;
}

.chat .header-chat .icon {
    margin-left: 30px;
    color: #515151;
    font-size: 14pt;
}

.chat .header-chat .name {
    margin: 0 0 0 20px;
    text-transform: uppercase;
    font-family: 'Montserrat', sans-serif;
    font-size: 13pt;
    color: #515151;
}

.chat .header-chat .right {
    position: absolute;
    right: 40px;
}

.chat .messages-chat {
    height: 450px;
    overflow-y: auto;
}

.chat .messages-chat .message {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.chat .messages-chat .message .photo {
    display: block;
    width: 45px;
    height: 45px;
    background: #E6E7ED;
    -moz-border-radius: 50px;
    -webkit-border-radius: 50px;
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
}

.chat .messages-chat .text {
    margin: 0 35px;
    background-color: #f6f6f6;
    padding: 15px;
    border-radius: 12px;
}

.text-only {
    margin-left: 45px;
}

.time {
    font-size: 10px;
    color: lightgrey;
    margin-bottom: 10px;
    margin-left: 85px;
}

.response-time {
    float: right;
    margin-right: 40px !important;
}

.response {
    float: right;
    margin-right: 0px !important;
    margin-left: auto;
}

.response .text {
    background-color: #e3effd !important;
}

.footer-chat {
    width: calc(65% - 66px);
    height: 80px;
    display: flex;
    align-items: center;
    position: absolute;
    bottom: 0;
    background-color: transparent;
    border-top: 2px solid #EEE;

}

.chat .footer-chat .icon {
    margin-left: 30px;
    color: #C0C0C0;
    font-size: 14pt;
}

.chat .footer-chat .send {
    color: #fff;
    background-color: #4f6ebd;
    position: absolute;
    right: 50px;
    padding: 12px 12px 12px 12px;
    border-radius: 50px;
    font-size: 14pt;
}

.chat .footer-chat .name {
    margin: 0 0 0 20px;
    text-transform: uppercase;
    font-family: 'Montserrat', sans-serif;
    font-size: 13pt;
    color: #515151;
}

.chat .footer-chat .right {
    position: absolute;
    right: 40px;
}

.write-message {
    border: 1px solid #b0b0b0;
    border-radius: 8px;
    width: 80%;
    height: 50px;
    margin-left: 20px;
    padding: 10px;
}
.clickable {
    cursor: pointer;
}
</style>