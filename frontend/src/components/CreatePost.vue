<template>
    <div>
        <b-form @submit="onSubmit">
            <PostForm
                @onFileSelected="onFileSelected"
                v-model="content"
                :onFormSubmit="didSubmitForm"
                :isCreating="true"
                @keydown.enter.prevent="onEnterKeyPress"
                @submitForm="onEnterKeyPress"
            />
        </b-form>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
import PostForm from './PostForm'
import socket from '../services/socket'
export default {
    name: 'CreatePost',
    components: {
        PostForm,
    },
    props: {},
    data() {
        return {
            content: '',
            selectedFile: null,
            didSubmitForm: false,
        }
    },
    methods: {
        async onEnterKeyPress() {
            // Vérifiez si le contenu est vide ou s'il y a un fichier sélectionné
            if (!this.content.trim().length && !this.selectedFile) return
            // Appeler la méthode onSubmit
            await this.onSubmit()
            // Réinitialiser le formulaire
            this.resetForm()
        },
        ...mapActions(['createPost']),
        onFileSelected(file) {
            this.selectedFile = file
        },
        async onSubmit(event) {
            const newPost = await this.createPost({
                selectedFile: this.selectedFile,
                content: this.content,
            })
            this.$toast.success('Publication créée !');
            socket.emit('postCreated', newPost);
            this.resetForm(event)
        },
        resetForm() {
            this.content = ''
            this.selectedFile = null
            this.didSubmitForm = !this.didSubmitForm
        },
    },
}
</script>

<style lang="scss">
.custom-file-label {
    text-align: left;
}
</style>
