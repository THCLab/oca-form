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
                    <button type="button" class="btn btn-primary" @click="saveForm">Save</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
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
        props: ['form', 'formInput', 'readonly'],
        data: () => ({
            previewModal: null,
            formData: null,
            label: ''
        }),
        methods: {
            openModal(formData) {
                // set data
                this.formData = _.cloneDeep(formData);
                this.formData._uniqueId = Math.random();
                this.label = this.formData.label
                if(this.formInput) {
                    this.fillForm(this.formInput)
                    if(this.readonly == null) {
                        this.readonly = true
                    }
                }
                if(this.readonly) {
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
                this.formData.sections.forEach( section => {
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
                const data = Object.assign({}, ...Object.values(this.getData()))
                eventBus.$emit(EventHandlerConstant.SAVE_PREVIEW, data)
            },
            closeModal() {
                this.previewModal.modal('hide');
            },
            getData() {
                return this.$refs.FormBuilderGui.getValue();
            }
        },
        mounted() {
            this.previewModal = $(this.$el);
        }
    }
</script>

<style scoped>

</style>
