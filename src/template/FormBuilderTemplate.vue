<template>
    <div class="row" style="margin: 0 20px;">

        <div class="col-md-9">
            <translation-component :form="form"></translation-component>
        </div>
        <div class="col-md-3">
            <standard-component></standard-component>
        </div>
        <div class="col-md-9 form-builder">
            <section-component :form="form" ref="SectionComponent"></section-component>
        </div>
        <div class="col-md-3">
          <affix relative-element-selector=".form-builder" style="width: 22vw;"
            :scrollAffix="true" :offset="{ top: 40, bottom: 40 }">
            <sidebar-component></sidebar-component>
            <slot name="afterSidebar"/>
          </affix>
        </div>

        <preview-component ref="PreviewComponent" :alternatives="alternatives" :form="form"></preview-component>
    </div>
</template>

<script>
    import SectionComponent from "./ui/SectionComponent";
    import { dom } from '@fortawesome/fontawesome-svg-core'
    import { Affix } from 'vue-affix'
    import SidebarComponent from "./ui/SidebarComponent";
    import PreviewComponent from "./ui/PreviewComponent";
    import TranslationComponent from "./ui/TranslationComponent";
    import StandardComponent from "./ui/StandardComponent";
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
            Affix, SidebarComponent,
            SectionComponent,
            TranslationComponent,
            StandardComponent
        },
        props: {
            form: {
                type: Object
            },
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
