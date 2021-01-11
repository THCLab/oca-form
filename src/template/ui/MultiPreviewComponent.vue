<template>
    <dialog-component ref="DialogModal" size="xl" id="multiPreviewModal"
      :readonly="readonlyDialog" :headerLabel="label ? label : 'Service'"
      :confirmLabel="confirmLabel" :confirmProcessing="confirmProcessing"
      :rejectLabel="rejectLabel" :rejectProcessing="rejectProcessing">
        <template v-slot:body>
          <div class='row'>
            <div class="form-preview" v-for="(form, i) in forms"
                 :class="[ form.class ? form.class : '' ]">
              <div class="form-preview__header row">
                <div class="col-md-7 offset-md-1">{{ form.label }}</div>
                <select
                  class="form-control col-md-3"
                  v-model="selectedLang[i]">
                  <option v-for="alt in form.alternatives">{{alt.language}}</option>
                </select>
              </div>
              <form-builder-gui ref="FormBuilderGui"
                :selected-lang="selectedLang[i]"
                :form="form.formData"
                :alternatives="form.alternatives"
                :readonly="form.readonly"
                :key="i">
              </form-builder-gui>
            </div>
          </div>
        </template>
    </dialog-component>
</template>

<script>
    import DialogComponent from './DialogComponent';
    import FormBuilderGui from '@/gui/FormBuilderGui';
    import { EventHandlerConstant, eventBus } from '@/template/handler/event_handler'
    import { serializeFormData } from '@/form_data_serializer'

    export default {
        name: "MultiPreviewComponent",
        components: { FormBuilderGui, DialogComponent },
        props: ['forms', 'label', 'readonly',
          'confirmLabel', 'confirmProcessing',
          'rejectLabel', 'rejectProcessing'],
        data: function() {
          return {
            dialogModal: null,
            selectedLang: [],
            readonlyDialog: null
          }
        },
        watch: {
          forms: {
            handler: function() {
              this.readonlyDialog = this.readonly != false &&
                this.forms.every(form => form.readonly)
            },
            deep: true
          }
        },
        methods: {
            openModal() {
                this.forms.forEach((form, i) => {
                  if (form.input) {
                    this.fillForm(form.formData, form.input)
                  }
                  if(form.alternatives.length) {
                    this.selectedLang[i] = form.alternatives[0].language
                  }
                  if(form.readonly) {
                      form.formData.sections.forEach(section => {
                          section.row.controls.forEach(control => {
                              control.readonly = true
                          })
                      })
                  }
                })

                // open
                this.dialogModal.openModal();
            },
            fillForm(formData, input) {
              formData.sections.forEach(section => {
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
                const savedForms = []
                this.$refs.FormBuilderGui.forEach(form => {
                  const isValid = form.validateValues()

                  const serializedData = serializeFormData(form)
                  savedForms.push({ isValid, serializedData })
                })
                if(savedForms.some(f => !f.isValid)) { return }
                eventBus.$emit(EventHandlerConstant.SAVE_PREVIEW, savedForms[0].serializedData)
            },
            rejectForm() {
                eventBus.$emit(EventHandlerConstant.REJECT_PREVIEW, {})
            },
            closeModal() {
                this.dialogModal.closeModal();
            },
        },
        mounted() {
            this.dialogModal = this.$refs.DialogModal
        }
    }
</script>

<style lang="scss" scoped>
  .form-preview {
    border-left: 1px solid #dee2e6;

    &:first-child {
      border-left: 0px;
    }

    &__header {
      font-size: 20px;
      padding-bottom: 20px;
    }
  }
</style>
