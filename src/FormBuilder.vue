<template>
    <div>
        <form-builder-template v-if="type === 'template'" ref="FormBuilderTemplate" :form="form">
          <template #afterSidebar><slot name="afterSidebar"/></template>
        </form-builder-template>
        <form-builder-gui v-else-if="type === 'gui'" ref="FormBuilderGui" :form="form"></form-builder-gui>
        <div v-else>
            <p>Type not found, did you enter correct type <b>(template, gui)</b>?</p>
        </div>
    </div>
</template>

<script>
    require('@/config/loader');

    import { mapActions } from "vuex"

    // load necessary
    import {Hooks as GUI_Hooks} from './gui/components/hook_lists';
    import {Hooks as Template_Hooks} from './template/components/hook_lists';
    import {FormHandler} from "./gui/handler/form_handler";
    import { EventHandlerConstant, eventBus } from './template/handler/event_handler'

    // import
    import FormBuilderTemplate from './template/FormBuilderTemplate';
    import FormBuilderGui from './gui/FormBuilderGui';

    // special hook
    import {ValidateSettingHandler} from "./template/handler/validate_setting_handler";
    import {CONTROL_TYPES} from "./config/control_constant";
    import {FORM_CONSTANTS} from "./config/constants";

    export default {
        name: "FormBuilder",
        components: {
            FormBuilderTemplate,
            FormBuilderGui
        },
        model: {
            prop: 'value',
            event: 'change'
        },
        props: {
            type: {
                type: String,
                default: "template"
            },
            form: {
                type: Object,
                default:() => ({
                    sections: [_.cloneDeep(FORM_CONSTANTS.Section)],
                    translations: []
                })
            },
            standards: {
                type: Array,
                default: () => ([])
            },
            standard: {
                type: String,
                default: ""
            },
            value: null,
            options: {
                type: Object,
                default: () => ({})
            }
        },
        watch: {
            form: {
                handler(val) {
                    if (this.type === 'template') {
                        this.$emit('change', val);
                    } else {
                        this.debounceGetFormGUIValue();
                    }
                },
                deep: true
            },
            value(val) {
                this.setValue(val);
            }
        },
        methods: {
            ...mapActions(
              "Standards",
              ["add_standard", "delete_all_standards", "set_current_standard"]
            ),
            getValue() {
                if (this.type === 'template') {
                    return this.$refs.FormBuilderTemplate.getValue();
                } else {
                    if (!_.accessStr(this, '$refs.FormBuilderGui')) {
                        return;
                    }

                    return this.$refs.FormBuilderGui.getValue();
                }
            },
            setValue(values) {
                if (_.isEmpty(values)) {
                    return;
                }

                // set values for specific type
                if (this.type === 'template') {
                    _.deepExtend(this.form, FormHandler.recorrectStructure(values));
                    // this.$refs.FormBuilderTemplate.setValue(values);
                } else {
                    this.$refs.FormBuilderGui.setValue(values);
                }
            },
            validate(showError = true) {
                if (this.type !== 'gui') {
                    return;
                }

                var hasError = FormHandler.validate(this.form);
                if (showError && hasError) {
                    eventBus.$emit(
                      EventHandlerConstant.ERROR,
                      "There are errors on the page. Please rectify the errors so the action can be completed."
                    )
                }

                // true => no error | false => errors
                return !hasError;
            },
            clearError() {
                FormHandler.clearErrorField();
            }
        },
        created() {
            let self = this;
            this.form.sections[0].row.controls = [];
            this.debounceGetFormGUIValue = _.debounce(() => {
                if (typeof self === "undefined" || typeof self.getValue === "undefined") {
                    return;
                }

                self.$emit('change', self.getValue());
            }, 500);

            // Register for hook
            if (this.type === 'template') {
                if(_.has(this.options, 'hooks')) {
                    Template_Hooks.register(this.options.hooks);
                }

                // add special hooks for template
                ValidateSettingHandler.init(Template_Hooks);
            } else {
                if(_.has(this.options, 'hooks')) {
                    GUI_Hooks.register(this.options.hooks);
                }

                // Re-correct data for GUI
                _.deepExtend(this.form, FormHandler.recorrectStructure(this.form));
            }

            // extends for controls
            if (_.has(this.options, 'moreControls')) {
                _.each(this.options.moreControls, (item, key) => {
                    // won't add existed
                    if (CONTROL_TYPES[key]) {
                        console.error("EXISTED CONTROL KEY: " + key);
                        return;
                    }

                    CONTROL_TYPES[key] = item;
                });
            }
        },
        mounted() {
            this.setValue(this.value);
            this.delete_all_standards()
            this.standards.forEach(standard => {
                this.add_standard(standard)
            })
            this.set_current_standard(this.standard)
        }
    }
</script>

<style scoped>
</style>
