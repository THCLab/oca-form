<template>
  <div class="row mt-2">
    <div class="col-md-4">
      <label>OCA Schema</label>
    </div>
    <div class="col-md-8">
      <input type="text" class="form-control">
    </div>
  </div>
</template>

<script>
export default {
  name: "ReferenceConfigComponent",
  props: {
    control: {
      type: Object
    },
  }
}
</script>

<style scoped>
</style>
