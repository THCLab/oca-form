<template>
  <div v-if="form !== null">
    <div class="sectionItem">
      <section-layout :section="section" v-for="section in form.sections" :key="section.name" />
    </div>
  </div>
</template>

<script>
import SectionLayout from "./SectionLayout";
export default {
  name: "SectionComponent",
  components: {SectionLayout},
  props: {
    form: {
      type: Object
    }
  }
}
</script>

<style scoped>

</style>
