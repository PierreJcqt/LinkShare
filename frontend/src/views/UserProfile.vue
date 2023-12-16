<template>
    <div>
        <Menu />
        <b-row class="text-center justify-content-center">
            <div class="d-flex align-items-center flex-column">
                <ProfileImage
                    v-if="userProfile"
                    :src="userProfile.imageUrl"
                    customClass="profile-main-picture"
                    divCustomClass="div-user-profile-picture"
                />
                <p class="user-name">
                    {{ userProfile.firstName }} {{ userProfile.lastName }}
                </p>
            </div>
        </b-row>
        <PostsList :userId="this.$route.params.userId" @update:isEmpty="handleEmptyList" />
        <div v-if="isPostsListEmpty" class="no-posts">Pas de publications</div>
    </div>
</template>

<script>
import { apiClient } from '../services/ApiClient'
import ProfileImage from '../components/ProfileImage'
import PostsList from '../components/PostsList'
import Menu from '../components/Menu'

export default {
    name: 'UserProfile',
    components: {
        ProfileImage,
        PostsList,
        Menu,
    },
    watch: {
        $route(to, from) {
            window.location.reload()
        },
    },
    data() {
        return {
            userProfile: {},
            userData: JSON.parse(localStorage.getItem('userData')),
            isPostsListEmpty: false,
        }
    },
    async mounted() {
        const res = await apiClient.get(`/api/auth/users/${this.$route.params.userId}/`);
        console.log('API response:', res);
        this.userProfile = res || {};
        console.log(JSON.stringify(this.userProfile));
    },
    methods: {
        handleEmptyList(isEmpty) {
            this.isPostsListEmpty = isEmpty;
        },
    },
}
</script>

<style lang="scss">
.div-user-profile-picture {
    width: 120px;
    height: 120px;
    margin-bottom: 1rem;
    box-shadow: 0px 1px 2px 2px rgba(204, 204, 204, 0.5);
}
.profile-main-picture {
    height: 120px;
}
.no-posts {
    text-align: center;
    font-size: 1.5em; 
    margin-top: 20px; 
    margin-bottom: 250px;
    color: #666; 
    font-weight: bold;
}
.user-name {
    font-size: 20px;
    font-weight: bold;
}
@media screen and (min-width: 280px) and (max-width: 767px) {
    .user-name {
        font-size: 16px;
    }
    .div-user-profile-picture {
        width: 95px;
        height: 95px;
    }
    .profile-main-picture {
        height: 95px;
    }
}
</style>
