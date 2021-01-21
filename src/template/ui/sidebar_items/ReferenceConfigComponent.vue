<template>
  <div class="row mt-2">
    <div class="col-md-4">
      <label>OCA Schema</label>
    </div>
    <div class="col-md-8">
      <vue-bootstrap-typeahead
        :showOnFocus="true"
        :minMatchingChars="0"
        :data="ocaSearch.results"
        v-model="ocaSearch.query"
        :serializer="s => `${s.namespace} / ${s.schemaName}`"
        @hit="selectOcaSchema">
        <template slot="suggestion" slot-scope="{ data, htmlText }">
          <span v-html="htmlText"></span>
        </template>
      </vue-bootstrap-typeahead>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import VueBootstrapTypeahead from "vue-typeahead-bootstrap";

export default {
  name: "ReferenceConfigComponent",
  components: {
    VueBootstrapTypeahead
  },
  props: {
    control: {
      type: Object
    },
  },
  data() {
    return {
      ocaSearch: {
        query: this.control.referencedSchemaName,
        selected: {},
        results: []
      }
    }
  },
  computed: {
    ocaRepo() {
      return 'http://repository.localhost'
    }
  },
  watch: {
    'ocaSearch.query': function(input) {
      if(input.length == 0) {
        this.control.attrType = null
      }
      this.fetchOcaSchemas(input)
    },
  },
  methods: {
    selectOcaSchema: async function(schema) {
      this.control.attrType = `DRI:${schema.branchesDRI[0]}`
      this.control.referencedSchemaName = `${schema.namespace} / ${schema.schemaName}`
    },
    fetchOcaSchemas(input) {
      axios.get(`${this.ocaRepo}/api/v2/schemas?suggest=${input}`)
        .then(r => {
          const mapped = r.data.map(async x => {
            const branchesDRI = (
              await axios.get(`${this.ocaRepo}/api/v2/schemas?_index=branch&q=${x.DRI}`)
            ).data.map(b => b.DRI)

            return {
              namespace: x.namespace,
              DRI: x.DRI,
              schemaName: x.schema.name,
              branchesDRI
            }
          })
          Promise.all(mapped).then(v => {
            this.ocaSearch.results = v.filter(s => s.branchesDRI.length > 0)
          })
        })
    },
  },
  created() {
    axios.get(`${this.ocaRepo}/api/v2/schemas?type=schema_base&limit=10`)
      .then(r => {
        const mapped = r.data.map(async x => {
          const branchesDRI = (
            await axios.get(`${this.ocaRepo}/api/v3/schemas?q=${x.DRI}`)
          ).data.map(b => b.DRI)

          return {
            namespace: x.namespace,
            DRI: x.DRI,
            schemaName: x.schema.name,
            branchesDRI
          }
        })
        Promise.all(mapped).then(v => {
          this.ocaSearch.results = v.filter(s => s.branchesDRI.length > 0)
        })
      })
  }
}
</script>

<style scoped>
</style>
