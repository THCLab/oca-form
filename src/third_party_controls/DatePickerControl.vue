<template>
  <div class="q-pa-none">
    <q-input filled :label="label" v-model="date" mask="####-##-##" :rules="[ val => val && val.length > 0]" :disable="readonly" :dense=true :class="{ 'is-invalid': !isValid }">
      <template v-slot:append>
        <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
            <q-date v-model="date" mask="YYYY-MM-DD">
              <div class="row items-center justify-end">
                <q-btn v-close-popup label="Close" color="primary" flat />
              </div>
            </q-date>
          </q-popup-proxy>
        </q-icon>
      </template>
    </q-input>
  </div>
</template>

<script>
export default {
  name: "DatePickerControl",
  data: () => ({
    date: (new Date()).toISOString().split('T')[0]
  }),
  model: {
    event: 'change',
    prop: 'value'
  },
  props: {
    readonly: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ''
    },
    options: {
      type: Object,
      default: () => {}
    },
    isValid: {
      type: Boolean,
      default: true
    },
    value: null
  },
  watch: {
    options(val) {
      this.setOption(val);
    },
    value(val) {
      this.setValue(val);
    }
  },
  methods: {
    setOption(val = []) {
      // TODO: impl
      /*let self = this;
      _.each(this.options, (val, key) => {
        self.datepicker.datepicker("option", key, val);
      });

      this.setValue(this.value);*/
    },
    setValue(val) {
      // TODO: impl
      //this.datepicker.datepicker('setDate', val);
    }
  },
  mounted() {
    // TODO: impl
    /*
            let self = this;
            this.datepicker = $(this.$el)
                .datepicker({
                    ...this.options,
                    beforeShow:function(input) {
                        if (self.readonly) {
                            return;
                        }

                      // styling the error style
                        let $selector = $(input);

                      // only increase z-index if this control is in a modal
                        if ($selector.parents(".modal").length <= 0) {
                            return;
                        }

                        $selector.css({
                            "position": "relative",
                            "z-index": 99999
                        });
                    },
                    onSelect: function (dateText) {
                        self.$emit('change', dateText);
                    },
                });

            this.setValue(this.value);
     */
                    }
}
</script>

<style scoped>

</style>
