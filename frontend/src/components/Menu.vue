<template>
  <div class="fixed-top"> 
    <ProfileButton />
    <div class="btn-container-toggle">
      <button class="btn btn-info toggle-button" @click="toggleComponent">Gérez vos Kudos</button> 
    </div>
    <Notifications :kudos-count="kudosCount"/>
    <router-view :kudosCount="kudosCount" />
    <div class="btn-container">
      <UserSearch />
    </div>
    <transition name="slide">
      <Kudos v-if="showComponent" />
    </transition>
  </div>
</template>

<script>
import ProfileButton from '../components/ProfileButton'
import UserSearch from '../components/UserSearch'
import Notifications from '../components/Notifications'
import Kudos from '../components/Kudos'
import socket from "../services/socket";

export default {
  name: 'Menu',
  components: {
    ProfileButton,
    UserSearch,
    Kudos,
    Notifications
  },
  props: {
    kudosCount: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showComponent: false,
      notificationsList: []
    };
  },
  created() {
      socket.on("newKudo", (newKudo) => {
        this.kudosCount++;
      });
    },
  props: {
  kudosCount: {
    type: Number,
    default: 0
  }
},
  methods: {
    toggleComponent() {
      this.showComponent = !this.showComponent;
    },
  },
};
</script>

<style lang="scss">

.toggle-button {
  z-index: 1000;
  box-shadow: 0px 1px 1px 1px rgba(204, 204, 204, 0.2);
  background-color: white;
  border-radius: 40px;
  font-weight: 500;
  border: none;
  color: #000;
}

.btn-container-toggle {
  margin-right: 10rem;
  margin-top: 25px;
  display: flex;
  justify-content: flex-end;
}


@media screen and (min-width: 280px) and (max-width: 769px) {
  .btn-container {
    .toggle-button {
      top: 150px;
      position: fixed;
    }
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