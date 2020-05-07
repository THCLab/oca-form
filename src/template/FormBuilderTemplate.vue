<template>
    <div class="row" style="margin: 0 20px;">
        <div class="col-md-9">
            <translation-component :form="form"></translation-component>
        </div>
        <div class="col-md-9">
            <section-component :form="form" ref="SectionComponent"></section-component>
        </div>
        <div class="col-md-3">
            <sidebar-component></sidebar-component>
        </div>

        <preview-component ref="PreviewComponent" :alternatives="alternatives" :form="form"></preview-component>
    </div>
</template>

<script>
    import SectionComponent from "./ui/SectionComponent";
    import { dom } from '@fortawesome/fontawesome-svg-core'
    import SidebarComponent from "./ui/SidebarComponent";
    import PreviewComponent from "./ui/PreviewComponent";
    import TranslationComponent from "./ui/TranslationComponent";
    import { EventHandlerConstant, eventBus } from '@/template/handler/event_handler'
    dom.watch();

    var default_form_value = () => ({
        sections: [],
        layout: "",
        _uniqueId: Math.random()
    });

    export default {
        name: "form-builder-template",
        components: {
            PreviewComponent,
            SidebarComponent,
            SectionComponent,
            TranslationComponent
        },
        props: {
            form: {
                type: Object
            }
        },
        data: () => ({
          language: null,
          alternatives: {}
        }),
        methods: {
            getValue() {
                return this.form;
            },
            setValue(val) {
                this.form = val;
            },
            preview() {
                this.$refs.PreviewComponent.openModal(this.form);
            },
            download() {
                eventBus.$emit(EventHandlerConstant.EXPORT_FORM, this.form)
            },
            publish(publishInfo) {
                eventBus.$emit(
                  EventHandlerConstant.PUBLISH_FORM,
                  {
                    info: publishInfo,
                    form: this.form
                  }
                )
            }
        }
    }
</script>

<style scoped>

</style>
