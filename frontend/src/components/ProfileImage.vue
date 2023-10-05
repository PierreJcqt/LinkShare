<template>
    <div class="profile-picture" :class="divCustomClass">
        <img
            class="profile-picture__img"
            :class="customClass"
            :src="src || 'avatar-1577909_960_720.png'"
            alt=""
        />
    </div>
</template>

<script>
export default {
    name: 'ProfileImage',
    props: ['customClass', 'divCustomClass', 'src'],
}
</script>

<style lang="scss">
.profile-picture {
    overflow: hidden;
    border-radius: 100%;
    background: black;
    &__img {
        transform: scale(1.35);
    }
}
</style>
