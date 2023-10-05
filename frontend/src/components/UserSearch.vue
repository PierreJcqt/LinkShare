<template>
    <div>
      <div
        :class="`search-bar ${visible ? '' : 'position-fixed d-none'} d-lg-block`"
      >
        <div class="search-bar__content input-group d-flex align-items-center">
          <span class="search-btn input-group-append bg-transparent border-0 p-0">
            <b-icon icon="search" class="mr-2 icon-search"></b-icon>
          </span>
          <!-- rajouter :list="usersList" dans vue-simple-siggest si besoin -->
          <vue-simple-suggest
          v-model="search"
          @input="handleSearch"
          @selected="onSelect"
          display-attribute="fullName"
          placeholder="Chercher un utilisateur..."
          ref="input"
          aria-label="Chercher un utilisateur"
          class="search-text border-0 bg-transparent"
        ></vue-simple-suggest>
        </div>
      </div>
      <button
        class="search-btn-mobile position-fixed border-0 p-0 bg-transparent d-lg-none d-xl-none"
        type="button"
        @click="triggerInput"
        aria-label="Chercher"
      >
        <b-icon icon="search"></b-icon>
      </button>
  
      <div
        v-if="sortedUsersList.length"
        class="users-list card border-0 position-fixed"
      >
        <div v-for="user in sortedUsersList">
          <router-link :to="{ name: 'UserProfile', params: { userId: user.id } }"
            ><div class="d-flex align-items-center">
              <div class="d-flex text-center">
                <ProfileImage
                  :src="user.imageUrl"
                  customClass="like-profile-picture"
                  divCustomClass="div-like-picture"
                />
              </div>
              <p>{{ user.firstName }} {{ user.lastName }}</p>
            </div></router-link
          >
        </div>
      </div>
    </div>

  </template>
  
  <script>

  import VueSimpleSuggest from 'vue-simple-suggest'
  import 'vue-simple-suggest/dist/styles.css'
  import { apiClient } from '../services/ApiClient'
  import router from '../router/index'
  import ProfileImage from './ProfileImage'
  // import Typeahead from 'typeahead';

  export default {
    name: 'UserSearch',
    components: {
      ProfileImage,
      VueSimpleSuggest
    },
    data () {
      return {
        search: '',
        usersList: [],
        visible: false
      }
    },
    methods: {
      async handleSearch(search) {
      if (search.length < 1) {
        this.usersList = []
        return;
      }
      const res = await apiClient.get(`/api/auth/users?search=${search}`,
      {
        params: {
          q: this.search,
        }
      });
      console.log(res);
      console.log(res.users);
      if (res && res.users) {
      this.usersList = res.users.map(user => {
        return {
          ...user,
          fullName: `${user.lastName} ${user.firstName}`
        };
      })
      .filter(user => {
        const fullNameLowerCase = user.fullName.toLowerCase();
        const searchLowerCase = search.toLowerCase();
        return fullNameLowerCase.includes(searchLowerCase);
      });
    } else {
      this.usersList = [];
    }
  },
    catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error);
      },
      onSelect(user) {
        router.push({ name: 'UserProfile', params: { userId: user.id } })
        this.search = ''
      },
        onInput() {
      this.search = this.$refs.input.value;
      },
        triggerInput () {
          this.visible = true
          this.$refs.input.click()
        },
    },
  computed: {
    sortedUsersList() {
        return this.usersList.slice().sort((a, b) => {
          const lastNameA = a.lastName.toLowerCase();
          const lastNameB = b.lastName.toLowerCase();
          if (lastNameA < lastNameB) {
            return -1;
          }
          if (lastNameA > lastNameB) {
            return 1;
          }
          return 0;
        });
    },
  },
}
  </script>
  

  <style lang="scss">  
  
  .search-bar {
    top: 20px;
    left: 45px;
    z-index: 2;
    .input-group {
      flex-wrap: nowrap;
    }
    &__content {
      padding: 10px 18px;
      box-shadow: 0px 1px 1px 1px white(204, 204, 204, 0.2);
      // background-color: rgba(108, 117, 125, 0.1) !important;
      background-color: white;
      border-radius: 40px;
      border: none;
      .search-text {
        width: 200px;
        &:focus {
          outline: none;
        }
      }
      .search-btn {
        color: #747474;
      }
    }
  }
  .users-list {
    background: white;
    top: 73px;
    left: 80px;
    right: 80px;
    width: 200px;
    padding: 1rem;
    padding-bottom: 0.2rem;
    z-index: 1;
    box-shadow: 0px 1px 5px 4px rgba(204, 204, 204, 0.2);
  }
  .icon-search {
    margin-right: 10px;
  }
  

  @media screen and (min-width: 280px) and (max-width: 769px) {
    .search-bar {
      margin: 0 10px 15px 15px;
      &__content {
        padding: 5px 13px;
        .search-text {
          width: 100%;
        }
      }
    }
    .search-btn-mobile {
      top: 20px;
      right: 110px;
      color: #747474;
      font-size: 1.1rem;
      z-index: 2;
      &:focus {
        outline: none;
      }
    }
    .users-list {
      top: 119px;
      left: 15px;
      background: white;
      box-shadow: 0rem 0.2rem 0.5rem rgba(0, 0, 0, 0.08) !important;
    }
  }
  @media screen and (min-width: 769px) and (max-width: 992px) {
    .search-bar {
      display: block !important;
    }
  }
  </style>