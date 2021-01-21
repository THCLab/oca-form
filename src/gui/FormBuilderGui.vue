<template>
    <div class="col-md-12">
        <section-component :form="form"></section-component>
    </div>
</template>

<script>
    import {FormHandler} from "./handler/form_handler";
    import SectionComponent from "./ui/SectionComponent";
    import { dom } from '@fortawesome/fontawesome-svg-core'
    import { EventHandlerConstant, eventBus } from '@/template/handler/event_handler'

    dom.watch();
    export default {
        name: "FormBuilderGui",
        components: {SectionComponent},
        props: {
            form: {
                type: Object
            },
            selectedLang: String,
            alternatives: Array,
            readonly: Boolean
        },
        watch: {
          selectedLang: {
            handler: function() {
              this.changeOcaForm()
            }
          }
        },
        methods: {
            getValue() {
                return FormHandler.getValue(this.form);
            },
            setValue(values) {
                if (!_.isObject(values))
                {
                    console.error("Invalid values for Form GUI!");
                    return;
                }

                FormHandler.setValue(this.form, values);
            },
            changeOcaForm() {
                const inputData = Object.assign({}, ...Object.values(this.getValue()))
                this.form = this.alternatives
                  .find(alt => alt.language == this.selectedLang).form
                this.fillForm(inputData)
                if(this.readonly) {
                    this.form.sections.forEach(section => {
                        section.row.controls.forEach(control => {
                            control.readonly = true
                        })
                    })
                }
            },
            fillForm(input) {
                if(!this.form) { return }
                this.form.sections.forEach(section => {
                    section.row.controls.forEach(control => {
                        if(input[control.attrName] == null) {
                            eventBus.$emit(EventHandlerConstant.ERROR, "Invalid data")
                            throw "Invalid data"
                        }
                        control.value = input[control.attrName]
                    })
                })
            },
            validateValues() {
                let isSuccess = true
                const controls = this.form.sections.map(section => {
                    return section.row.controls
                }).flatten()
                controls.forEach(control => {
                    control.errors = []
                    if(control.required && control.value.length <= 0) {
                        control.errors.push('must be filled')
                    }

                  if(control.errors.length > 0) { isSuccess = false }
                })
                return isSuccess
            },
        },
        created() {
            // this.form = JSON.parse(localStorage.getItem('BUILD_FORM'));
            if(this.readonly) {
                this.form.sections.forEach(section => {
                    section.row.controls.forEach(control => {
                        if (control) {
                          control.readonly = true
                        }
                    })
                })
            }
        }
    }
</script>

<style scoped>

</style>
