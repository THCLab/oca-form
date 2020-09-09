<template>
    <div class="row  align-items-center">
        <div class="col-md-1"></div>
        <label class="col-md-3 col-form-label">Standard:</label>
        <div class="col-md-7">
            <select class="form-control form-control-sm" v-model="standardList.selected">
                <option v-for="standard in standardList.all" :key="standard.name">
                    {{ standard.name }}
                </option>
            </select>
        </div>
    </div>
</template>

<script>
    export default {
        components: {},
        name: "standard-component",
        props: {
            standards: {
                type: Array,
                default: () => ([])
            }
        },
        data: function() {
            return {
                standardList: {
                    default: { name: 'None' },
                    all: this.standards,
                    selected: null
                }
            }
        },
        mounted() {
          this.standardList.all.unshift(this.standardList.default)
          this.standardList.selected = this.standardList.default.name
        }
    }
</script>

<style scoped>
</style>
