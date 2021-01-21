<template>
  <div>
    <div class="row" v-if="labelPosition === 'left'">
      <!-- <slot name="label"/> -->

      <div class="col-md-12">
        <div class="row align-items-center" style="padding-bottom: 10px;">
          <h5 class="offset-md-1 col-md-2"> {{ form.label }} </h5>
          <select
            class="form-control col-md-3"
            v-model="selectedLang">
            <option v-for="alt in alternatives">{{alt.language}}</option>
          </select>
        </div>
        <form-builder-gui
          :selected-lang="selectedLang"
          :form="form"
          :alternatives="alternatives"
          :readonly="control.readonly"
          :key="control.referenceSchema.form._uniqueId"></form-builder-gui>
      </div>

      <slot name="errors"/>
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
  name: "ReferenceControl",
  components: {
    FormBuilderGui: () => import('@/gui/FormBuilderGui'),
    FontAwesomeIcon },
  props: ['control', 'isValid', 'labelPosition'],
  data: function() {
    return {
      form: this.control.referenceSchema.form,
      alternatives: this.control.referenceSchema.form.translations,
      selectedLang: this.control.referenceSchema.form.translations[0].language,
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
  created() {
    if(this.control && this.control.readonly) {
        this.control.referenceSchema.form.readonly = true
        this.control.referenceSchema.form.sections.forEach( section => {
            section.row.controls.forEach(control => {
              if (control) {
                control.readonly = true
              }
            })
        })
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
