<template>
    <div>
        <div class="row" v-if="labelPosition === 'left'">
            <slot name="label"/>

            <div class="col-md-8">
                <a v-if="control.attrType == 'URI' && control.readonly == true"
                   target="_blank"
                   :href="control.value">{{control.value}}</a>

                <div class="input-group" v-else>
                  <input v-if="showPii"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': !isValid }"
                        :readonly="this.control.readonly"
                        :name="control.fieldName"
                        v-model="control.value" />

                  <input v-else
                        type="password"
                        class="form-control"
                        :class="{ 'is-invalid': !isValid }"
                        :readonly="this.control.readonly"
                        :name="control.fieldName"
                        v-model="control.value" />

                  <div class="input-group-append" v-if="control.isPII">
                      <span class="input-group-text clickable" @click="triggerShow">
                          <font-awesome-icon :icon="icon"></font-awesome-icon>
                      </span>
                  </div>
                  <slot name="errors"/>
                </div>
            </div>

            <slot name="information"/>
        </div>
        <div v-else class="form-group">
            <label> {{control.label}} </label>
            <span v-show="control.required"> *</span>

            <input type="text"
                   class="form-control"
                   :readonly="this.control.readonly"
                   :name="control.fieldName"
                   v-model="control.value" />
        </div>
    </div>
</template>

<script>
    import {Hooks} from '@/gui/components/hook_lists';
    import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

    export default {
        name: "TextControl",
        components: {FontAwesomeIcon},
        props: ['control', 'isValid', 'labelPosition'],
        data: function() {
          return {
            showPii: !this.control.isPII,
            icon: 'eye-slash'
          }
        },
        methods: {
          triggerShow() {
            this.showPii = !this.showPii
            if(this.showPii) {
              this.icon = "eye"
            } else {
              this.icon = "eye-slash"
            }
          }
        },
        mounted() {
            if (!_.isEmpty(this.control.defaultValue)) {
                this.control.value = this.control.defaultValue;
            }

            // after hook
            Hooks.Control.afterInit.run(this.control, $(this.$el).find(this.control.isMultiLine ? "textarea" : "input"));
        }
    }
</script>

<style scoped>

</style>
