<template>
    <div class="modal" id="previewModal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title">{{ label }}</h4>
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

                <div class="generateHashlinkForm" v-if="!formReadonly" v-show="formSaved">
                    <div class="row">
                        <label class="col-form-label col-md-4" for="fileserver">
                          File server with responses:
                        </label>
                        <div class="col-md-4">
                            <input type="text"
                              class="form-control form-control-sm"
                              ref="fileserver"
                              id="fileserver"
                              placeholder="File server host"
                              v-model="hashlinkInfo.fileserver"
                              />
                        </div>
                    </div>
                    <div class="row">
                        <label class="col-form-label col-md-4" for="ocaRepoHost">
                            OCA Repository:
                        </label>
                        <div class="col-md-4">
                            <input type="text"
                              class="form-control form-control-sm"
                              ref="ocaRepoHost"
                              id="ocaRepoHost"
                              placeholder="Host"
                              v-model="hashlinkInfo.ocaRepo.host"
                              />
                        </div>
                        <div class="col-md-4">
                            <input type="text"
                              class="form-control form-control-sm"
                              ref="ocaRepoNamespace"
                              id="ocaRepoNamespace"
                              placeholder="Namespace"
                              v-model="hashlinkInfo.ocaRepo.namespace"
                              />
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-3">
                        </div>
                        <div class="col-md-6">
                            <button type="button" class="btn btn-sm btn-block btn-success" @click="generateHashlink">Generate Hashlink</button>
                        </div>
                        <div class="col-md-3">
                        </div>
                    </div>
                    <div class="row generatedHashlink" v-show="generatedHashlink">
                        <div class="col-md-12">
                            <pre>{{ generatedHashlink }}</pre>
                        </div>
                        <div class="col-md-12 text-left">
                            <pre>{{ generatedHashlinkMeta }}</pre>
                        </div>
                    </div>
                </div>
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
        props: ['form', 'readonly'],
        data: () => ({
            previewModal: null,
            formData: null,
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
            fillForm(input) {
                this.formData.sections.forEach(section => {
                    section.row.controls.forEach(control => {
                        if(!input[control.attrName]) {
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

  .generateHashlinkForm {
    border-top: 1px solid #dee2e6;
    padding: 20px 5px;
  }

  .generateHashlinkForm .row {
    padding: 5px 0;
  }

  .generateHashlinkForm .hasError {
    border-color: darkred;
  }

  .generatedHashlink {
    margin-top: 15px;
  }

</style>
