<template>
    <div class="kudos-component" ref="kudosModal">
        <h1>Kudos reçus :</h1>
        <div v-if="isLoading">Chargement des données...</div>
        <div v-else>
            <ul v-if="receivedKudos.length > 0">
                <li v-for="kudo in receivedKudos" :key="kudo.id" v-if="kudo">
                    <strong>{{ getSenderName(kudo.senderId) }}</strong> :
                    {{ kudo.message }}
                    <button
                        class="btn btn-danger btn-sm rounded-circle"
                        title="Supprimer le kudo"
                        @click="deleteKudo(kudo.id, kudo.recipientId)"
                    >
                        X
                    </button>
                </li>
            </ul>
            <p v-else>Pas de kudos reçus</p>
        </div>
        <h2>Envoyer un kudo :</h2>
        <div>
            <b-dropdown text="Sélectionnez un ou plusieurs destinataires" class="m-md-2">
                <div class="px-3">
                    <b-form-checkbox-group 
                    v-model="newKudo.recipients" 
                    :state="isDestinatairesValid">
                        <b-form-checkbox
                        v-for="user in users"
                        :key="user.id"
                        :value="user.id"
                        v-if="user && String(user.id) !== String(currentUserId)"
                        class="user-checkbox"
                        @change="validateDestinataires"
                        >
                        <span class="user-name">{{ user.name }}</span>
                        </b-form-checkbox>
                    </b-form-checkbox-group>
                </div>
            </b-dropdown>
            <b-form @submit.prevent="sendKudo">
                <b-form-textarea 
                    v-model="newKudo.message"
                    id="message"
                    placeholder="Félicitez vos collègues en partageant vos kudos :)..."
                    rows="3"
                    max-rows="6"
                    required
                    :state="triedToSubmit ? newKudo.message.length !== 0: null"
                ></b-form-textarea>
                <button type="submit" variant="primary" class="btn btn-success send-btn mt-2">Envoyer</button>
            </b-form>
        </div>
    </div>
</template>

<script>
import { apiClient } from '../services/ApiClient'
import { mapActions } from 'vuex'

export default {
    name: 'Kudos',
    data() {
        return {
            kudos: [],
            users: [],
            isLoading: true,
            receivedKudos: [],
            currentUserId: localStorage.getItem('userId'),
            selectedUserIds: [], // ID de l'utilisateur sélectionné
            isDestinatairesValid: false,
            triedToSubmit: false,
            message: '', 
            newKudo: {
                recipients: [],
                message: '',
            },
        }
    },
    methods: {
        ...mapActions(['displayNotification']),
        toggleActions() {
            this.areActionsVisible = !this.areActionsVisible
        },
        async fetchUsers() {
            try {
                const response = await apiClient.get('/api/auth/users')
                if (response && response.users) {
                    this.users = response.users.map((user) => {
                        return {
                            ...user,
                            name: `${user.firstName} ${user.lastName}`,
                        }
                    })
                }
            } catch (error) {
            } finally {
                this.isLoading = false
            }
        },
        async deleteKudo(kudoId, recipientId) {
            try {
                await apiClient.delete(`/api/posts/kudos/${kudoId}/${recipientId}`);
                const kudoIndex = this.receivedKudos.findIndex(
                    (k) => k.id === kudoId
                )
                if (kudoIndex > -1) {
                    this.receivedKudos.splice(kudoIndex, 1)
                }
                this.$toast.success('Kudo supprimé avec succès !')
            } catch (error) {
                this.$toast.error('Impossible de supprimer le kudo !');
            }
        },
        async fetchReceivedKudos() {
            try {
                const userId = localStorage.getItem('userId')
                const response = await apiClient.get(`/api/posts/kudos/${userId}/received-kudos`);
                this.receivedKudos = response;
            } catch (error) {
            } finally {
                this.isLoading = false
            }
        },
        async sendKudo() {
            if (!this.isFormValid()) {
                this.triedToSubmit = true; 
                this.$toast.error("Veuillez sélectionner des destinataires.");
                return;
            }
            try {
                const { recipients, message } = this.newKudo 
                const senderId = localStorage.getItem('userId');
                const body = {
                    senderId,
                    recipients,
                    message,
                };
                await apiClient.post('/api/posts/kudos', body);
                this.$toast.success(`Kudo envoyé avec succès`);
                this.resetForm();
                this.triedToSubmit = false; 
                await this.fetchReceivedKudos();
                } catch (error) {
                    this.$toast.error("Erreur lors de l'envoi du kudo.");
                }
        },
        validateDestinataires() {
            this.isDestinatairesValid = this.newKudo.recipients.length > 0;
        },
        isFormValid() {
            return this.newKudo.recipients.length !== 0 && this.newKudo.message.trim().length !== 0;
        },
        resetForm() {
            this.newKudo.recipients = [];
            this.newKudo.message = '';
            this.isDestinatairesValid = false;
            this.triedToSubmit = false; 
        },
        getSenderName(senderId) {
            const sender = this.users.find((user) => user.id === senderId)
            return sender ? `${sender.firstName} ${sender.lastName}` : 'Inconnu'
        },
        handleClickOutside(event) {
            const modalElement = this.$refs.kudosModal;
            if (modalElement && !modalElement.contains(event.target)) {
                this.$emit('close');
            }
        },
    },
    async mounted() {
        document.addEventListener('click', this.handleClickOutside);
        try {
            await Promise.all([this.fetchUsers(), this.fetchReceivedKudos()])
        } catch (error) {
            console.error('Erreur lors du chargement des données :', error)
        } finally {
            this.isLoading = false
        }
        $(function () {
            $('[data-toggle="tooltip"]').tooltip({
                delay: { show: 50, hide: 50 },
            })
        })
    },
    incrementCount() {
        this.kudosCount++
    },
    beforeDestroy() {
        document.removeEventListener('click', this.handleClickOutside);
    },
}
</script>

<style lang="scss">
.kudos-component {
    max-width: 600px;
    margin: 2rem auto;
    padding: 1rem;
    background-color: #f8f9fa;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h1,
h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
}

ul {
    list-style-type: none;
    padding: 0;
}

.user-name {
  margin-left: 10px; /* Ajustez la marge selon vos besoins */
}

li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #e9ecef;
}

li:last-child {
    border-bottom: none;
}

form {
    display: flex;
    flex-direction: column;
}

label {
    font-weight: bold;
    margin-top: 1rem;
}

select,
textarea {
    margin-top: 0.5rem;
    padding: 0.5rem;
    border: 1px solid #ced4da;
    border-radius: 4px;
}

textarea {
    resize: vertical;
    min-height: 100px;
}

.send-btn[type='submit'] {
    margin-top: 1rem;
    align-self: center;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
}

@media screen and (min-width: 280px) and (max-width: 768px) {
    .kudos-component {
        margin: 2rem 1rem;
    }
}
</style>
