<template>
    <div class="modal">
      <div class="modal-dialog" :class="[ size ? `modal-${size}` : '' ]">
            <div class="modal-content">

                <!-- Modal Header -->
                <div class="modal-header">
                    <h4 class="modal-title">{{ headerLabel }}</h4>
                    <div class="col-md-1" />
                    <slot name="header" />
                    <button type="button" class="close" data-dismiss="modal">&times;</button>
                </div>

                <!-- Modal body -->
                <div class="modal-body">
                    <slot name="body" />
                </div>

                <!-- Modal footer -->
                <div class="modal-footer">
                  <button type="button" class="btn btn-primary" v-if="!readonly" @click="confirmForm">{{ confirmLabel }}</button>
                    <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "DialogComponent",
        components: {},
        props: ['headerLabel', 'confirmLabel', 'size', 'readonly'],
        data: () => ({
            element: null,
        }),
        methods: {
            openModal() {
                // open
                this.element.modal('show');
            },
            confirmForm() {
                this.$parent.saveForm()
            },
            closeModal() {
                this.element.modal('hide');
            }
        },
        mounted() {
            this.element = $(this.$el);
        }
    }
</script>

<style lang="scss" scoped>
</style>
