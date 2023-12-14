<template>
    <div id="app">
        <div
            id="nav"
            class="d-flex sticky-top justify-content-start justify-content-sm-center mb-3 p-3"
        >
            <router-link to="/">
                <img
                    id="logo"
                    :src="
                        require('./assets/Colorful People Group Community Logo.png')
                    "
                    alt="logo LinkShare"
                />
            </router-link>
        </div>
        <NotificationAlert />
        <transition name="fade" mode="out-in">
            <router-view />
        </transition>
    </div>
</template>

<script>
import NotificationAlert from '../src/components/NotificationAlert'

export default {
    name: 'App',
    components: {
        NotificationAlert,
    },
}
</script>

<style lang="scss">
#app {
    font-family:
        Nunito Sans,
        Arial,
        sans-serif;
    // -webkit-font-smoothing: antialiased;
    // -moz-osx-font-smoothing: grayscale;
    // text-align: center;
    background: url(assets/fond-ecran-wallpaper-image-abstrait-bleu-06.jpg);
    background-size: cover;
    overflow: hidden;
}

#logo {
    margin-bottom: 50px;
    margin-top: 10px;
    width: 350px;
}

#nav {
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.2);
    position: static;
    z-index: 1;
}

/* styles pour la transition */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}

@media screen and (min-width: 280px) and (max-width: 767px) {
    body,
    .btn,
    .form-control {
        font-size: 13px !important;
    }
    #nav #logo {
        max-width: 180px;
    }
    #logo {
    width: 100px;
}
}
@media screen and (min-width: 767px) and (max-width: 991px) {
    #nav #logo {
        max-width: 200px;
    }
}
</style>
