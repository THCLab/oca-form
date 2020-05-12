<template>
    <div>
        <div class="row" v-if="labelPosition === 'left'">
            <slot name="label"/>

            <div class="col-md-8">
                <a v-if="control.attrType == 'URI' && control.readonly == true"
                   target="_blank"
                   :href="control.value">{{control.value}}</a>

                <input v-else
                       type="text"
                       class="form-control"
                       :class="{ 'is-invalid': !isValid }"
                       :readonly="this.control.readonly"
                       :name="control.fieldName"
                       v-model="control.value" />
                <slot name="errors"/>
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

    export default {
        name: "TextControl",
        props: ['control', 'isValid', 'labelPosition'],
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
