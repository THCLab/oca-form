<template>
    <div>
        <div class="row" v-if="labelPosition === 'left'">
            <slot name="label"/>

            <div class="col-md-8">
                <div class="input-group">
                    <input type="number"
                           class="form-control"
                           :class="{ 'is-invalid': !isValid }"
                           :readonly="this.control.readonly"
                           :name="control.fieldName"
                           :step="controlStep"
                           v-model="control.value" />
                    <slot name="errors"/>
                </div>
            </div>

            <slot name="information"/>
        </div>
        <div class="form-group" v-else>
            <label> {{control.label}} </label>
            <span v-show="control.required"> *</span>

            <div class="input-group">
                <input type="number"
                       class="form-control"
                       :readonly="this.control.readonly"
                       :name="control.fieldName"
                       :step="controlStep"
                       v-model="control.value" />
            </div>
        </div>
    </div>
</template>

<script>
    import {Hooks} from '@/gui/components/hook_lists';

    export default {
        name: "NumberControl",
        props: ['control', 'isValid', 'labelPosition'],
        mounted() {
            if (!_.isEmpty(this.control.defaultValue)) {
                this.control.value = this.control.defaultValue;
            }

            // after hook
            Hooks.Control.afterInit.run(this.control, $(this.$el).find("input"));
        },
        methods: {
            numberChange(e) {
                let val = e.target.value;
                if(val.length == 0) { return }

                if (this.control.isInteger === false) {
                    this.control.value = parseFloat(val).toFixed(this.control.decimalPlace);
                } else {
                    this.control.value = parseInt(val);
                }
            }
        },
        computed: {
            controlStep() {
                return "any";
            }
        }
    }
</script>

<style scoped>

</style>
