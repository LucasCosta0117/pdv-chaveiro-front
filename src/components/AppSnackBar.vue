<template>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    location="bottom right"
    variant="flat"
  >
    <div class="text-white font-medium">
      {{ snackbar.message }}
    </div>

    <template #actions>
      <v-btn
        icon="mdi-close"
        size="small"
        variant="text"
        @click="hideSnackbar"
      />
    </template>
  </v-snackbar>
</template>

<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'AppSnackbar',
  computed: {
    ...mapState('ui', ['snackbar'])
  },
  methods: {
    ...mapActions('ui', ['hideSnackbar'])
  }
}
</script>
