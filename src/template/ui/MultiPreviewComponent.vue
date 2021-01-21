<template>
    <dialog-component ref="DialogModal" size="xl" id="multiPreviewModal"
      :readonly="readonlyDialog" :headerLabel="label ? label : 'Service'"
      :reviewable="reviewable"
      :confirmLabel="confirmLabel" :confirmProcessing="confirmProcessing"
      :rejectLabel="rejectLabel" :rejectProcessing="rejectProcessing">
        <template v-slot:body>
          <div class='row'>
            <div class="form-preview" v-for="(formRows, i) in forms"
                 :class="[ formRows[0].class ? formRows[0].class : '' ]">
              <div class='row' v-for="(form, j) in formRows">
                <div class="form-preview__header row" style="width: 100%">
                  <div class="col-md-7 offset-md-1">{{ form.label }}</div>
                  <select
                    class="form-control col-md-3"
                    v-model="selectedLang[i][j]">
                    <option v-for="alt in form.alternatives">{{alt.language}}</option>
                  </select>
                </div>
                <form-builder-gui ref="FormBuilderGui"
                  :selected-lang="selectedLang[i][j]"
                  :form="form.formData"
                  :alternatives="form.alternatives"
                  :readonly="form.readonly"
                  :key="i">
                </form-builder-gui>
              </div>
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
        props: ['forms', 'label', 'readonly', 'reviewable',
          'confirmLabel', 'confirmProcessing',
          'rejectLabel', 'rejectProcessing'],
        data: function() {
          return {
            dialogModal: null,
            selectedLang: [[], []],
            readonlyDialog: null
          }
        },
        watch: {
          forms: {
            handler: function() {
              this.readonlyDialog = this.readonly != false &&
                this.forms.flat().every(form => form.readonly)
            },
            deep: true
          }
        },
        methods: {
            openModal() {
                this.forms.forEach((formsRow, i) => {
                  formsRow.forEach((form, j) => {
                    if (form.input) {
                      this.fillForm(form.formData, form.input)
                    }
                    if(form.alternatives.length) {
                      this.selectedLang[i][j] = form.alternatives[0].language
                    }
                    if(form.readonly) {
                        form.formData.sections.forEach(section => {
                            section.row.controls.forEach(control => {
                                control.readonly = true
                            })
                        })
                    }
                  })
                })

                // open
                this.dialogModal.openModal();
            },
            fillForm(formData, input) {
              let payload
              if (Array.isArray(Object.values(input)[0])) {
                if (!input[formData.DRI][0]) { return }
                payload = input[formData.DRI][0].content.p
                Object.entries(payload).forEach(([attrName, value]) => {
                  if (value.startsWith('DRI:')) {
                    const control = formData.sections[0].row.controls.find(c => c.attrName == attrName)
                    this.fillForm(control.referenceSchema.form, input)
                  }
                })
              } else if (Object.keys(input)[0].startsWith('DRI:')) {
                payload = input[`DRI:${formData.DRI}`].p
                Object.entries(payload).forEach(([attrName, value]) => {
                  if (value.startsWith('DRI:')) {
                    const control = formData.sections[0].row.controls.find(c => c.attrName == attrName)
                    this.fillForm(control.referenceSchema.form, input)
                  }
                })
              } else {
                payload = input
              }

              formData.sections.forEach(section => {
                  section.row.controls.forEach(control => {
                      if(payload[control.attrName] == null) {
                          eventBus.$emit(EventHandlerConstant.ERROR, "Invalid data")
                          throw "Invalid data"
                      }
                      control.value = payload[control.attrName]
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
