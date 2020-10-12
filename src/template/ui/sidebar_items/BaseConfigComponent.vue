<template>
    <div>
        <div class="row">
            <div class="col-md-6">
                <label>Attribute type</label>
            </div>
            <div class="col-md-6">
                <input type="text" readonly class="form-control" :value="control.attrType">
            </div>
        </div>

        <div class="row mt-2">
            <div class="col-md-12 boxes">
                <label>
                    <input type="checkbox" name="isRequired" v-model="control.required"> Required?
                </label>
                <label>
                    <input type="checkbox" name="isReadonly" v-model="control.readonly"> Readonly?
                </label>
            </div>
        </div>

        <div class="row">
            <div class="col-md-10">
                <label>Attribute name</label>
            </div>
            <div class="col-md-2">
                <label>PII</label>
            </div>
            <div class="col-md-10">
                <vue-bootstrap-typeahead
                  ref="inputAttributeName"
                  :class="{
                    error: errorLabels(control, 'error').includes('attrName'),
                    warning: errorLabels(control, 'warning').includes('attrName')
                  }"
                  :showOnFocus="true"
                  :minMatchingChars="1"
                  @hit="control.isPII = true"
                  v-model="control.attrName"
                  :data="suggest_list"
                >
                    <template slot="suggestion" slot-scope="{ data, htmlText }">
                        PII:
                        <span v-html="htmlText"></span>
                    </template>
                </vue-bootstrap-typeahead>
            </div>
            <div class="col-md-2">
                <input type="checkbox" name="isPII" v-model="control.isPII">
            </div>
        </div>
    </div>
</template>

<script>
    import VueBootstrapTypeahead from "vue-typeahead-bootstrap";
    import { TYPE_MAPPER } from '@/config/constants'
    import { mapState, mapGetters } from 'vuex'

    export default {
        name: "BaseConfigComponent",
        components: { VueBootstrapTypeahead },
        props: {
            control: {
                type: Object
            },
        },
        data() {
          return {
            suggest_list: []
          }
        },
        computed: {
          ...mapState('Standards', ['current_standard']),
          ...mapGetters('ControlErrors', ['control_errors'])
        },
        watch: {
          current_standard: {
            handler: function() {
              if(this.current_standard) {
                this.suggest_list = this.current_standard.attributes
              } else {
                this.suggest_list = []
              }
            },
            immediate: true
          }
        },
        methods: {
          errorLabels(control, type = null) {
            const errors = this.control_errors(control.name)
            const filtered = type ? errors.filter(e => e.type == type) : errors
            return filtered.map(e => e.label)
          },
          setAttributeNameValue() {
            this.$refs.inputAttributeName.inputValue = this.control.attrName;
          }
        },
        mounted() {
            $('[data-toggle="tooltip"]').tooltip(); // trigger tooltip
            this.control.attrType = TYPE_MAPPER.inputType[this.control.type]
            this.setAttributeNameValue();
        },
        updated() {
            this.setAttributeNameValue();
        }
    }
</script>

<style scoped>
    .boxes {
      display: flex;
      justify-content: space-between;
    }

    .warning {
      border: 1px solid orange;
      border-radius: 4px;
    }

    .error {
      border: 1px solid red;
      border-radius: 4px;
    }
</style>
