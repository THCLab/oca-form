<template>
  <div class="q-pa-md q-gutter-sm">
      <q-dialog v-model="showModal" persistent>
        <q-card>
          <q-toolbar>
            <q-toolbar-title><span class="text-weight-bold">{{headerLabel}}</span></q-toolbar-title>

            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>
          <q-card-section>
            <slot name="body" />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="Close" color="primary" v-close-popup />
              <q-btn flat :label="confirmLabel" color="primary" v-if="!readonly" @click="confirmForm" :disabled="processing" v-show="confirmLabel" v-close-popup />
              <q-btn flat :label="rejectLabel" color="primary" v-if="!readonly" @click="rejectForm" :disabled="processing" v-show="rejectLabel" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
  </div>
</template>

<script>
export default {
  name: "DialogComponent",
  components: {},
  props: ['headerLabel', 'size', 'readonly',
    'confirmLabel', 'confirmProcessing',
    'rejectLabel', 'rejectProcessing'
  ],
  data: () => ({
    element: null,
    showModal: false
  }),
  computed: {
    processing: function() {
      return this.confirmProcessing || this.rejectProcessing
    }
  },
  methods: {
    openModal() {
      this.showModal = true;
    },
    confirmForm() {
      this.$parent.saveForm()
    },
    rejectForm() {
      this.$parent.rejectForm()
    },
    closeModal() {
      this.showModal = false;
    }
  },
  mounted() {
    this.element = $(this.$el);
  }
}
</script>

<style lang="scss" scoped>
</style>
