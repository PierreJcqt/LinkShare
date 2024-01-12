<template>
    <div class="page-container-login">
        <b-container fluid>
            <b-row class="text-center justify-content-center">
                <b-col cols="12" lg="4">
                    <b-card
                        class="account-card border-0 shadow p-3 mb-5 mt-3 bg-white rounded"
                    >
                        <div class="pt-sm-3 pt-lg-0">
                            <b-card-text class="login-text h4"
                                >Se connecter</b-card-text
                            >

                            <b-form>
                                <b-form-group>
                                    <b-form-input
                                        id="email"
                                        type="email"
                                        placeholder="Email"
                                        v-model="input.email"
                                        class="account-input text-dark mb-2 mt-4 pl-3 w-100"
                                        aria-label="Écrire votre adresse mail"
                                    ></b-form-input>
                                    <b-form-input
                                        id="password"
                                        type="password"
                                        placeholder="Mot de passe"
                                        v-model="input.password"
                                        class="account-input text-dark mb-2 pl-3 w-100"
                                        aria-label="Écrire votre mot de passe"
                                    ></b-form-input>
                                </b-form-group>
                                <div class="mt-3">
                                    <b-button 
                                        variant="success"
                                        v-on:click.stop="login()"
                                        type="submit"
                                        id="login-button"
                                        aria-label="Connexion"
                                    >Connexion</b-button>
                                </div>
                                <p class="my-3 text-danger">
                                    {{ errorMessage }}
                                </p>
                            </b-form>
                        </div>
                        <div class="line my-3"></div>

                        <p
                            class="font-small grey-text d-flex justify-content-center mb-1"
                        >
                            Vous n'êtes pas encore inscrit ?
                            <router-link
                                to="/signup"
                                class="font-weight-bold ml-3 router-box"
                                >Créer un compte</router-link
                            >
                        </p>
                    </b-card>
                </b-col>
            </b-row>
        </b-container>
    </div>
</template>

<script>
import Signup from '../components/Signup'
import { apiClient } from '../services/ApiClient'
import router from '../router/index'

export default {
    name: 'Login',
    components: {
        Signup,
    },
    props: ['notification'],
    data() {
        return {
            errorMessage: '',
            input: {
                email: '',
                password: '',
            },
        }
    },
    mounted() {
        if (this.$route.query.deletedAccount) {
            this.$toast.success('Votre compte a bien été supprimé !')
        }
    },

    methods: {
        login() {
            if (this.input.email != '' && this.input.password != '') {
                apiClient
                    .post('/api/auth/login', this.input)
                    .then((data) => {
                        if (!data.token) {
                            this.errorMessage = 'Utilisateur introuvable'
                        } else {
                            localStorage.setItem('userToken', data.token)
                            localStorage.setItem(
                                'userData',
                                JSON.stringify(data.user)
                            )
                            localStorage.setItem('userId', data.user.id)
                            this.$toast.success(
                                "Bienvenue sur LinkShare, votre réseau social d'entreprise !"
                            )
                            // this.checkForNewKudos();
                            router.push({ name: 'Posts' })
                        }
                    })
                    .catch((error) => {
                        if (error.status) {
                            if (error.status === 429) {
                                this.errorMessage =
                                    'Votre compte a été bloqué suite à trop de tentatives de connexion infructueuses. Veuillez réessayer dans 15 minutes.'
                            } else if (error.status === 401) {
                                this.errorMessage = error.error
                            } else {
                                this.errorMessage =
                                    'Email et/ou mot de passe incorrect(s) !'
                            }
                        } else if (error.message) {
                            this.errorMessage = error.message
                        } else {
                            this.errorMessage =
                                "Une erreur s'est produite. Veuillez réessayer."
                        }
                    })
            } else {
                this.errorMessage =
                    'Veuillez renseigner un email et un mot de passe'
            }
        },
        // async checkForNewKudos() {
        //     try {
        //         const userId = localStorage.getItem('userId');
        //         const response = await apiClient.get(`/api/posts/kudos/${userId}/received-kudos`);
        //         if (response && response.length === 1) {
        //             this.$toast.info(`Vous avez reçu ${response.length} nouveau kudo !`);
        //         } 
        //         else if (response && response.length > 1) {
        //             this.$toast.info(`Vous avez reçu ${response.length} nouveaux kudos !`);
        //         }
        //     } catch (error) {
        //         console.error("Erreur lors de la vérification des nouveaux kudos :", error);
        //     }
        // }
    },
}
</script>

<style lang="scss">

.page-container-login {
    margin-top: 100px;
}
a {
    text-decoration: none;
    color: #2c3e50 !important;
}
.router-box {
    margin-left: 5px;
}
.line {
    display: block;
    width: 100%;
    height: 1px;
    background-color: rgba(192, 192, 192, 0.5);
}
.login-button {
    background-color: red;
    width: 500%;
}
.account-input {
    &:-webkit-autofill {
        border: none;
        -webkit-text-fill-color: #212529;
        -webkit-box-shadow: 0 0 0px 1000px rgba(32, 120, 244, 0.2) inset;
        transition: background-color 5000s ease-in-out 0s;
    }
    &:focus {
        border: none;
        border-radius: 6px;
        outline: 0;
        box-shadow: 0 0 0 0.2rem rgba(32, 120, 244, 0.5);
    }
}
</style>
