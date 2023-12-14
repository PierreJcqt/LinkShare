<template>
    <div class="kudos-component">
        <h1>Liste des Tâches :</h1>
        <div v-if="isLoading">Chargement des données...</div>
        <div>
        <h1>Liste des Tâches</h1>
        <ul>
            <li v-for="task in tasks" :key="task.id">
            {{ task.description }} - {{ task.domaine }} - Échéance: {{ task.dateLimite | formatDate }}
            </li>
        </ul>
        </div>    
    </div>
</template>
    
    <script>
    import axios from 'axios';
    
    export default {
        name: 'Tasks',
        data() {
        return {
            tasks: []
        };
        },
        created() {
        this.fetchTasks();
        },
        methods: {
        async fetchTasks() {
            try {
            const response = await axios.get('http://localhost:3000/taches');
            this.tasks = response.data;
            } catch (error) {
            console.error('Erreur lors de la récupération des tâches:', error);
            }
        }
        },
        filters: {
        formatDate(date) {
            return new Date(date).toLocaleDateString();
        }
        }
    };
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