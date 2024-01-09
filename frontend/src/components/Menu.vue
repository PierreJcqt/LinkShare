<template>
    <div class="fixed-top">
        <ProfileButton />
        <div class="btn-container-toggle">
            <button
                class="btn btn-light toggle-button"
                @click="toggleComponent($event)"
            >
                Gérez vos Kudos
            </button>
        </div>
        <router-view :kudosCount="kudosCount" />
        <div class="btn-container">
            <UserSearch />
        </div>
        <transition name="slide">
            <Kudos v-if="showComponent" @close="toggleComponent"/>
        </transition>
    </div>
</template>

<script>
import ProfileButton from '../components/ProfileButton'
import UserSearch from '../components/UserSearch'
import Kudos from '../components/Kudos'
import Tasks from '../components/Tasks'
import socket from '../services/socket'

export default {
    name: 'Menu',
    components: {
        ProfileButton,
        UserSearch,
        Kudos,
        Tasks,
    },
    props: {
        kudosCount: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            showComponent: false,
            showComponentTask: false,
            notificationsList: [],
        }
    },
    created() {
        socket.on('newKudo', (newKudo) => {
            this.kudosCount++
        })
    },
    props: {
        kudosCount: {
            type: Number,
            default: 0,
        },
    },
    methods: {
        toggleComponent(event) {
            if (event) {
                event.stopPropagation();
            }
            this.showComponent = !this.showComponent;
        },
    },
}
</script>

<style lang="scss">

.toggle-button {
    z-index: 1000;
    box-shadow: 0px 1px 1px 1px rgba(204, 204, 204, 0.2);
    background-color: white;
    border-radius: 40px;
    font-weight: 500;
    border: none;
    color: black;
    width: 150px;
    margin-right: 10px;
}

.toggle-button:focus {
    outline: none;
}

.btn-container-toggle {
    margin-right: 10rem;
    margin-top: 25px;
    display: flex;
    justify-content: flex-end;
}

@media screen and (min-width: 280px) and (max-width: 580px) {
    .btn-container-toggle {
        margin-top: 20px;
        max-width: 100px;
        width: 100px;
        margin-left: 130px;
    }
}

.slide-enter-active,
.slide-leave-active {
    transition: all 0.5s ease;
}

.slide-enter,
.slide-leave-to {
    transform: translateY(-100%);
    opacity: 0;
}
</style>
