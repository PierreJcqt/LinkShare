<template>

  <div>
    <button @click="showModal" class="btn btn-danger">
      Supprimer le compte
    </button>
    <b-modal ref="myModalRef" hide-footer title="Confirmer la suppression">
      <p>Êtes-vous sûr de vouloir supprimer votre compte ?</p>
      <b-button class="btn-danger-account" variant="danger" @click="onDeleteAccount">
        Oui, supprimer le compte
      </b-button>
      <b-button class="btn-danger-account" @click="hideModal">
        Non, annuler
      </b-button>
    </b-modal>
  </div>

</template>


<script>
export default {
  name: 'DeleteAccountButton',
  data () {
    return {
      userData: JSON.parse(localStorage.getItem('userData'))
    }
  },
    methods: {
      showModal() {
      this.$refs.myModalRef.show()
    },
    hideModal() {
      this.$refs.myModalRef.hide()
    },
      async onDeleteAccount () {
        this.$emit('onDeleteAccount');
        this.hideModal();
    }
  }
}
</script>

<style lang="scss">
.delete-account {
  font-size: 14px;
  border-radius: 0.25rem;
  background-color: transparent;
  border: none;
  &:hover {
    text-decoration: underline;
  }
  &:focus {
    outline: none;
  }
}

.btn-danger-account {
  margin-bottom: 25px;
}

.icon-trash {
  margin-left: 5px;
}
</style>