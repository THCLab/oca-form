<template>
    <div class="modal" id="previewModal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title">{{ label }}</h4>
                    <div class="col-md-1" />
                    <select
                      class="form-control col-md-3"
                      v-model="selectedLang"
                      @change="changeOcaForm">
                      <option v-for="alt in alternatives">{{alt.language}}</option>
                    </select>
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>

                <!-- Modal body -->
                <div class="modal-body" v-if="formData !== null">
                    <form-builder-gui ref="FormBuilderGui" :form="formData" :key="formData._uniqueId"></form-builder-gui>
                </div>

                <!-- Modal footer -->
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" v-if="!formReadonly" @click="saveForm">Save</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>

                <slot name="afterSave" v-if="!formReadonly && formSaved" />
            </div>
        </div>
    </div>
</template>

<script>
    import FormBuilderGui from '@/gui/FormBuilderGui';
    import { EventHandlerConstant, eventBus } from '@/template/handler/event_handler'

    export default {
        name: "PreviewComponent",
        components: {FormBuilderGui},
        props: ['form', 'alternatives', 'readonly'],
        data: () => ({
            previewModal: null,
            selectedLang: null,
            formData: null,
            formInput: null,
            formReadonly: null,
            formSaved: null,
            savedData: null,
            hashlinkInfo: {
              fileserver: '',
              ocaRepo: { host: '', namespace: '' }
            },
            generatedHashlink: null,
            generatedHashlinkMeta: null,
            label: ''
        }),
        methods: {
            openModal(formData, formInput = null) {
                if(this.alternatives) {
                  this.selectedLang = this.alternatives[0].language
                }
                this.formInput = formInput
                this.formSaved = false
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
                this.previewModal.modal('show');
            },
            changeOcaForm() {
                this.formData = _.cloneDeep(
                  this.alternatives
                    .find(alt => alt.language == this.selectedLang).form
                )
                if(this.formInput) {
                    this.fillForm(this.formInput)
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
                this.savedData = Object.assign({}, ...Object.values(this.getData()))
                eventBus.$emit(EventHandlerConstant.SAVE_PREVIEW, this.savedData)
                this.formSaved = true
            },
            generateHashlink() {
                let isError = false
                if(!this.hashlinkInfo.fileserver ||
                    this.hashlinkInfo.fileserver.length == 0) {
                    isError = true
                    this.$refs.fileserver.classList.add('hasError')
                } else {
                    this.$refs.fileserver.classList.remove('hasError')
                }

                if(!this.hashlinkInfo.ocaRepo.host ||
                    this.hashlinkInfo.ocaRepo.host.length == 0) {
                    isError = true
                    this.$refs.ocaRepoHost.classList.add('hasError')
                } else {
                    this.$refs.ocaRepoHost.classList.remove('hasError')
                }

                if(this.hashlinkInfo.ocaRepo.namespace.length == 0) {
                    isError = true
                    this.$refs.ocaRepoNamespace.classList.add('hasError')
                } else {
                    this.$refs.ocaRepoNamespace.classList.remove('hasError')
                }

                if(!isError) {
                    eventBus.$emit(
                        EventHandlerConstant.GENERATE_HASHLINK,
                        {
                            form: this.formData,
                            data: this.savedData,
                            info: this.hashlinkInfo
                        }
                    )
                }
            },
            closeModal() {
                this.alternatives = []
                this.selectedLang = null
                this.previewModal.modal('hide');
                this.formSaved = null
                this.savedData = null
                this.hashlinkInfo.ocaRepo.namespace = ""
                this.generatedHashlink = null,
                this.generatedHashlinkMeta = null
            },
            getData() {
                return this.$refs.FormBuilderGui.getValue();
            }
        },
        mounted() {
            this.previewModal = $(this.$el);
            this.formReadonly = this.readonly

            eventBus.$on(EventHandlerConstant.HASHLINK_GENERATED, ({hashlink, meta}) => {
              this.generatedHashlink = hashlink
              this.generatedHashlinkMeta = meta
            })
        }
    }
</script>

<style scoped>

  .afterSave {
    border-top: 1px solid #dee2e6;
    padding: 20px 5px;
  }

  .afterSave .row {
    padding: 5px 0;
  }

  .afterSave .hasError {
    border-color: darkred;
  }

  .generatedHashlink {
    margin-top: 15px;
  }

</style>
