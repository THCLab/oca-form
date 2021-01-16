<template>
  <dialog-component ref='DialogModal' size='lg' id="previewModal"
                                                :readonly="readonly" :headerLabel="label"
                                                :confirmLabel="confirmLabel ? confirmLabel : 'Save'"
                                                :confirmProcessing="confirmProcessing">
    <template v-slot:header>
      <select
        class="form-control col-md-3"
        v-model="selectedLang">
        <option v-for="alt in alternatives">{{alt.language}}</option>
      </select>
    </template>

    <template v-slot:body>
      <form-builder-gui ref="FormBuilderGui"
                        :selected-lang="selectedLang"
                        :form="formData"
                        :alternatives="alternatives"
                        :readonly="readonly"
                        :key="formData._uniqueId"></form-builder-gui>
    </template>
  </dialog-component>
</template>

<script>
import DialogComponent from './DialogComponent';
import FormBuilderGui from '@/gui/FormBuilderGui';
import { EventHandlerConstant, eventBus } from '@/template/handler/event_handler'
import { serializeFormData } from '@/form_data_serializer'

export default {
  name: "PreviewComponent",
  components: {
    FormBuilderGui,
    DialogComponent
  },
  props: ['form', 'alternatives', 'readonly',
    'confirmLabel', 'confirmProcessing'],
  data: () => ({
    dialogModal: null,
    selectedLang: null,
    formData: {},
    formInput: null,
    formReadonly: null,
    savedData: null,
    label: ''
  }),
  methods: {
    openModal(formData, formInput = null) {
      console.log(formInput);
      if(this.$parent.language) {
        this.selectedLang = this.$parent.language
      } else if(this.alternatives && this.alternatives.length) {
        this.selectedLang = this.alternatives[0].language
      }
      this.formInput = formInput
      // set data
      this.formData = _.cloneDeep(formData);
      this.formData._uniqueId = Math.random();
      this.label = this.formData.label
      if(formInput) {
        this.fillForm(formInput)
        if(this.formReadonly == null) {
          this.formReadonly = true
        }
      }
      if(this.formReadonly) {
        this.formData.sections.forEach( section => {
          section.row.controls.forEach(control => {
            control.readonly = true
          })
        })
      }

      // open
      this.dialogModal.openModal()
    },
    fillForm(input) {
      this.formData.sections.forEach(section => {
        section.row.controls.forEach(control => {
          if(input[control.attrName] == null) {
            eventBus.$emit(EventHandlerConstant.ERROR, "Invalid data")
            throw "Invalid data"
          }
          control.value = input[control.attrName]
        })
      })
    },
    saveForm() {
      const formRef = this.$refs.FormBuilderGui
      const isValid = formRef.validateValues()
      if(!isValid) { return }

      const serializedData = serializeFormData(formRef)
      eventBus.$emit(EventHandlerConstant.SAVE_PREVIEW, serializedData)
    },
    closeModal() {
      this.dialogModal.closeModal();
    }
  },
  mounted() {
    this.dialogModal = this.$refs.DialogModal
    this.formReadonly = this.readonly
  }
}
</script>

<style lang="scss" scoped>
</style>
