<template>
    <div class="row  align-items-center">
        <div class="col-md-1"></div>
        <label class="col-md-3 col-form-label">Standard:</label>
        <div class="col-md-7">
            <select class="form-control form-control-sm" v-model="standards.selected">
                <option v-for="standard in standards.all" :key="standard.name">
                    {{ standard.name }}
                </option>
            </select>
        </div>
    </div>
</template>

<script>
    import { mapState, mapActions } from 'vuex'

    export default {
        components: {},
        name: "standard-component",
        data: function() {
            return {
                standards: {
                    default: { name: 'None' },
                    all: [],
                    selected: null
                }
            }
        },
        computed: {
            ...mapState('Standards', ['standard_list', 'current_standard'])
        },
        watch: {
          standard_list: {
            handler: function() {
              this.standards.all = [
                this.standards.default, ...this.standard_list
              ]
            },
            immediate: true
          },
          'standards.selected': {
            handler: function() {
              this.set_current_standard(this.standards.selected)
            }
          }
        },
        methods: {
          ...mapActions('Standards', ['set_current_standard'])
        },
        mounted() {
          this.$nextTick(function() {
            if (this.current_standard) {
              this.standards.selected = this.current_standard.name
            } else {
              this.standards.selected = this.standards.default.name
            }
          })
        }
    }
</script>

<style scoped>
</style>
