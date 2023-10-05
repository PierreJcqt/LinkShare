<template>
    <div>
        <!-- <button
        @click="toggleActions"
        class="notification-btn d-flex position-fixed justify-content-center align-items-center p-0"
        aria-label="Afficher les notifications"
      >
        <span
          v-if="notificationsList.length || kudosCount"
          class="notifications-number position-absolute d-flex justify-content-center align-items-center"
          >{{ notificationsList.length + kudosCount }}</span
        >
        <b-icon icon="bell-fill"></b-icon>
      </button> -->
        <b-collapse
            v-if="notificationsList.length"
            id="notification-collapsed"
            v-bind:class="`collapsed mt-2 position-fixed ${
                areActionsVisible && 'visible'
            }`"
        >
            <b-card class="border-0" @click="toggleActions">
                <div v-for="notification in notificationsList">
                    <router-link
                        :to="{
                            name: 'OnePost',
                            params: { postId: notification.postId },
                        }"
                        @click.native="deleteNotification(notification)"
                    >
                        <div class="d-flex align-items-center">
                            <div>
                                <ProfileImage
                                    :src="notification.Sender.imageUrl"
                                    customClass="like-profile-picture"
                                    divCustomClass="div-like-picture"
                                />
                            </div>
                            <p
                                v-html="notification.content"
                                class="card-text text-left py-2 mb-3"
                            ></p></div
                    ></router-link>
                </div>
            </b-card>
        </b-collapse>

        <b-collapse
            v-else
            id="notification-collapsed"
            v-bind:class="`collapsed mt-2 position-fixed ${
                areActionsVisible && 'visible'
            }`"
        >
            <b-card class="border-0">
                <div class="d-flex align-items-center">
                    <p class="card-text text-left py-2 mb-3">
                        Vous n'avez pas de nouvelles notifications
                    </p>
                </div>
            </b-card>
        </b-collapse>
    </div>
</template>

<script>
import { apiClient } from '../services/ApiClient'
import ProfileImage from './ProfileImage'
import socket from '../services/socket'

export default {
    name: 'Notifications',
    components: {
        ProfileImage,
    },
    props: {},
    data() {
        return {
            areActionsVisible: false,
            notificationsList: [],
            kudosCount: 0,
        }
    },
    async mounted() {
        setTimeout(() => this.fetchNotifications(), 100)
        this.interval = setInterval(() => this.fetchNotifications(), 10000)
    },
    destroyed() {
        clearInterval(this.interval)
    },
    methods: {
        created() {
            socket.on('newPost', (newPost) => {
                this.addNotification({
                    postId: newPost.id,
                    content: 'Un nouvel utilisateur a créé une publication !',
                    // Ajoutez d'autres informations à la notification si nécessaire
                })
            })
        },
        toggleActions() {
            this.areActionsVisible = !this.areActionsVisible
        },
        async fetchNotifications() {
            const res = await apiClient.get(`/api/posts/notifications/`)
            console.log('API response:', res)
            this.notificationsList = res.data?.notifications || []
        },
        async deleteNotification(notificationToDelete) {
            const res = await apiClient.delete(
                `/api/posts/notifications/${notificationToDelete.id}`
            )
            this.notificationsList = this.notificationsList.filter(
                (notification) => notification.id !== notificationToDelete.id
            )
        },
    },
}
</script>

<style lang="scss">
.notification-btn {
    top: 22px;
    right: 175px;
    box-shadow: 0px 1px 1px 1px rgba(204, 204, 204, 0.2);
    background-color: rgba(108, 117, 125, 0.1) !important;
    border-radius: 100%;
    width: 42px;
    height: 42px;
    border: none;
    z-index: 2;
    &:hover {
        background-color: rgba(108, 117, 125, 0.2) !important;
    }
    &:focus {
        outline: none;
    }
    .notifications-number {
        top: -8px;
        right: -4px;
        font-size: 12px;
        border-radius: 100%;
        background: red;
        color: white;
        height: 20px;
        width: 20px;
    }
}

#notification-collapsed {
    top: 62px;
    right: 177px;
    z-index: 1;
    .card-body {
        padding-bottom: 5px;
    }
}

@media screen and (min-width: 280px) and (max-width: 769px) {
    .notification-btn {
        top: 17px;
        right: 65px;
        width: 32px;
        height: 32px;
        .notifications-number {
            top: -6px;
            height: 15px;
            width: 15px;
            font-size: 11px;
        }
    }

    #notification-collapsed {
        top: 45px;
        right: 64px;
        margin-left: 15px;
    }
}
</style>
