<template>
    <div class="col-md-12 mb-2 rowItem row" :id="row.name">

        <component v-for="(control) in row.controls"
                   :is="CONTROL_TYPES[control.type].source.template"
                   :key="control.name"
                   :control="control"
                   :valid="isControlValid(control)"
                   :warned="isControlWarned(control)"
                   :ref="control.name"
                   input-class="col-md-7"
                   :label-position="labelPosition">
            <template v-slot:label>
                <div class="col-md-4">
                    <label> {{ control.label }} </label>
                    <span v-show="control.required">*</span>
                    <span v-show="control.attrName"> [
                      <span v-show="control.isPII">PII: </span>
                      {{ control.attrName }}
                    ]</span>
                </div>
            </template>

            <template v-slot:options>
                <div class="col-md-1 options">
                    <font-awesome-icon :icon="faPencilAlt"
                    @click="openConfig(control)" class="clickable" />
                    <font-awesome-icon :icon="faTimes"
                    @click="removeControl(control)" class="clickable" />
                </div>
            </template>

            <template v-slot:information>
                <div class="col-md-1" />
                <div class="col-md-10 information">
                  {{ control.information }}
                </div>
                <div class="col-md-1" />
            </template>
            <template v-slot:errors>
                <template v-if="controlErrors(control, 'error').length > 0" >
                    <div class="col-md-1 errors-icon">
                      <font-awesome-icon :icon="faExclamationTriangle" />
                    </div>
                    <div class="col-md-10 errors">
                      {{ controlErrors(control, 'error') }}
                    </div>
                    <div class="col-md-1" />
                </template>
                <template v-if="controlErrors(control, 'warning').length > 0" >
                    <div class="col-md-1 warning-icon">
                      <font-awesome-icon :icon="faExclamationTriangle" />
                    </div>
                    <div class="col-md-10 warning">
                      {{ controlErrors(control, 'warning') }}
                    </div>
                    <div class="col-md-1" />
                </template>
            </template>
        </component>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import {FORM_CONSTANTS} from "@/config/constants";
    import {CONTROL_TYPES} from "@/config/control_constant";
    import {eventBus, EventHandlerConstant} from '@/template/handler/event_handler';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
    import { faPencilAlt, faTimes, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons'
    import {Hooks} from '@/template/components/hook_lists';
    import {ControlHandler} from '@/template/handler/control_handler';

    export default {
        components: {FontAwesomeIcon},
        name: "row-item",
        props: {
            formUuid: null,
            row: {
                type: Object,
                default: {}
            },
            labelPosition: null
        },
        data: () => ({
            CONTROL_TYPES,
            faPencilAlt, faTimes, faExclamationTriangle,
            editing_control: null,
        }),
        computed: {
            ...mapGetters('ControlErrors', ['invalid_controls', 'warned_controls', 'control_errors']),
        },
        methods: {
            isControlValid(control) {
                return !this.invalid_controls.includes(control.name)
            },
            isControlWarned(control) {
                return this.warned_controls.includes(control.name)
            },
            controlErrors(control, type = null) {
              const errors = this.control_errors(control.name)
              const filtered = type ? errors.filter(e => e.type == type) : errors
              return filtered.map(e => e.msg).join(', ')
            },
            addControl(controlType) {
                var controlInfo = _.cloneDeep(FORM_CONSTANTS.Control);
                controlInfo.type = controlType;
                // generate id
                controlInfo.name = _.domUniqueID(`control_${controlType}_`);
                controlInfo.label = FORM_CONSTANTS.Type[controlType].label;
                controlInfo.fieldName = controlInfo.name; // same for both
                if (controlType == "datepicker") {
                  controlInfo.dateFormat = "dd/mm/yy"
                }

                // check if there's any more special fields?
                if(CONTROL_TYPES[controlType].other_properties) {
                    _.each(CONTROL_TYPES[controlType].other_properties, (value, key) => {
                        controlInfo[key] = value;
                    });
                }

                // before hook
                let b4Run = Hooks.Control.beforeAdd.runSequence(controlInfo, this.row);
                if (b4Run === false) {
                    return;
                }

                // add to row
                eventBus.$on(controlInfo.name, (uuid) => {
                  controlInfo.uuid = uuid
                  eventBus.$off(controlInfo.name)
                })
                this.row.controls.push(controlInfo);

                eventBus.$emit(
                  EventHandlerConstant.ADD_CONTROL,
                  { schemaUuid: this.formUuid, controlInfo }
                )

                // after hook
                Hooks.Control.afterAdd.run(controlInfo, this.row);
            },
            removeControl(controlInfo) {
              eventBus.$emit(
                EventHandlerConstant.REMOVE_CONTROL,
                { schemaUuid: this.formUuid, controlInfo }
              )
            },

            traverseControl() {
                let self = this;

                // prepare data
                var items = $(this.$el).find('.controlItem');
                var finalItems = [];

                // sort
                _.each(items, (item, index) => {
                    var id = $(item).attr('id');
                    var controlItem = _.find(self.row.controls, {name: id});
                    controlItem.order = index;
                    finalItems.push(controlItem);
                });

                // reset the current sections
                this.row.controls = finalItems;
            },

            // control
            openConfig(controlInfo) {
                ControlHandler.clearSelect();
                ControlHandler.setSelect(controlInfo.name);
                this.editing_control = controlInfo;
              eventBus.$emit(
                EventHandlerConstant.ACTIVATE_EDITOR_SIDEBAR,
                { formUuid: this.formUuid,
                  controlInfo: _.cloneDeep(controlInfo) }
              );
            }
        },
        created() {
            let self = this;

            // remove control bus
          eventBus.$on(EventHandlerConstant.REMOVE_CONTROL, ({ controlInfo }) => {
                // prepare data
                var controlIndex = _.findIndex(this.row.controls, {name: controlInfo.name});

                if (controlIndex < 0) {
                    return;
                }

                // before hook
                let beforeRun = Hooks.Control.beforeRemove.runSequence(controlInfo);
                if (beforeRun === false) {
                    return;
                }

                // remove control
                this.row.controls.splice(controlIndex, 1);

                // after hook
                Hooks.Control.afterRemove.run(controlInfo);
            });

            // update control bus
          eventBus.$on(EventHandlerConstant.ON_APPLY_EDITOR_SIDEBAR, ({ control }) => {
                //var oldControl = _.find(this.row.controls, {name: control.name});
                let controlIndex = _.findIndex(self.row.controls, {name: control.name});
                if (controlIndex <= -1 || self.row.controls[controlIndex].name !== self.editing_control.name) {
                    return;
                }

                let oldControl = self.row.controls[controlIndex];
                // check if existed name in this section
                if (control.fieldName !== oldControl.fieldName && ControlHandler.isControlNameExisted(self.row.name, control.fieldName)) {
                    eventBus.$emit(
                      EventHandlerConstant.ERROR,
                      "This field Name is already existed in the current section."
                    )
                    return;
                }

                // replace value
                var controlInfo = _.cloneDeep(control);
                _.each(controlInfo, (value, key) => {
                    self.row.controls[controlIndex][key] = value;
                });

                // update gui for specific control
                if (self.$refs[controlInfo.name]) {
                    if (_.isFunction(self.$refs[controlInfo.name].configUpdated)) {
                        self.$refs[controlInfo.name].configUpdated();
                    }
                }

                // replace
                this.$nextTick(() => {
                    ControlHandler.setSelect(oldControl.name);
                });
            });
        },
        mounted() {
            let self = this;
            $(this.$el).droppable({
                accept: ".control-wrapper",
                drop: function (event, ui){
                    self.addControl($(ui.draggable[0]).attr('data-control-type'));
                },
                over: function( event, ui ) {
                    ui.helper.css('border', '1px solid green');
                },
            });

            $(this.$el).sortable({
                cursor: "move",
                delay: 100,
                helper: 'clone',
                placeholder: "ui-state-highlight",
                update: function (event, ui) {
                    self.traverseControl();
                },
                start: function(e, ui){
                    ui.placeholder.height(
                      ui.item.height() +
                        parseInt(ui.item.css('margin-top')) +
                        parseInt(ui.item.css('margin-bottom'))
                    );
                    ui.placeholder.width(ui.item.width());
                    ui.placeholder.css("opacity", "0");
                }
            }).disableSelection();
        }
    }
</script>

<style lang="scss" scoped>
    .rowItem {
        padding: 30px 30px;
        margin: 0;
        position: relative;
    }

    .rowItem .tools {
        position: absolute;
        top: 3px;
        right: 12px;
    }

    .clickable {
        cursor: pointer;
    }

    .controlItemWrapper {
        margin: 5px 0;

        &:hover {
            cursor: grab;
        }
    }

    .options {
      display: flex;
      justify-content: space-between;
    }

    .information {
      text-align: justify;
      font-style: italic;
      color: #6a6a6a;
    }


    .errors {
      &-icon {
        padding-top: 10px;
        color: red;
      }

      padding-top: 10px;
      font-weight: 600;
      text-align: justify;
      color: #2c3e50;
    }

    .warning {
      &-icon {
        padding-top: 10px;
        color: #a5a5a5;
      }

      padding-top: 10px;
      text-align: justify;
      color: #2c3e50;
    }
</style>
