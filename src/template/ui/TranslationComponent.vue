<template>
    <div class="row">
        <div class="col-md-2">
            <select class="form-control" v-model="lang.current">
                <option v-for="lang in lang.selected" :key="lang">
                    {{ lang }}
                </option>
            </select>
        </div>
        <select2-multiple-control class="col-md-5"
                                  v-model="lang.selected"
                                  :options="lang.all">
        </select2-multiple-control>
    </div>
</template>

<script>
    import Select2MultipleControl from "@/third_party_controls/Select2MultipleControl";
    import {eventBus, EventHandlerConstant} from '@/template/handler/event_handler';

    export default {
        components: { Select2MultipleControl },
        name: "translation-component",
        props: {
            form: {
                type: Object
            }
        },
        data: () => ({
            lang: {
                all: ['en_US', 'fr_FR', 'pl_PL', 'es_ES', 'de_DE'],
                selected: ['en_US'],
                current: null
            }
        }),
        mounted() {
          this.$nextTick(() => {
            this.addTranslation(this.lang.selected[0])
            this.lang.current = this.lang.selected[0]
            this.lang.selected = this.form.translations.map(t => t.language)
          })

          eventBus.$on(EventHandlerConstant.ADD_CONTROL, ({ controlInfo }) => {
            this.form.translations.forEach(translation => {
              const isLangDef = translation.language == this.lang.selected[0]
              translation.data.controls.push({
                fieldName: controlInfo.fieldName,
                label: isLangDef ? controlInfo.label || "" : "",
                defaultValue: isLangDef ? controlInfo.defaultValue || "" : "",
                information: isLangDef ? controlInfo.information || "" : "",
                dataOptions: controlInfo.dataOptions.map(op => (
                  { id: op.id, text: isLangDef ? op.text || "" : "" }
                ))
              })
            })

            let defaultLang = this.lang.selected[0]
            let defaultTranslation
            if(this.lang.current != defaultLang) {
              defaultTranslation = this.form.translations
                .find(t => t.language == defaultLang).data
            }
            const translation = this.form.translations
              .find(t => t.language == this.lang.current).data

            eventBus.$emit(
                EventHandlerConstant.ON_LANGUAGE_CHANGE,
                { lang: this.lang.current,
                  defaultTranslation, translation }
            );
          })

          eventBus.$on(EventHandlerConstant.CHANGE_DATA_OPTION_IN_CONTROL, ({ controlInfo, optionIndex, operation }) => {
            this.form.translations.forEach(translation => {

              const control = translation.data.controls.find(c => c.fieldName == controlInfo.fieldName)
              if(operation == "add") {
                control.dataOptions.push({
                  id: controlInfo.dataOptions[optionIndex].id,
                  text: ""
                })
              } else if(operation == "remove") {
                control.dataOptions.splice(optionIndex, 1)
              }
            })
          })

          eventBus.$on(EventHandlerConstant.ON_LANGUAGE_CHANGE, ({ defaultTranslation, translation }) => {
            this.form.sections.forEach((section, index) => {
              if(defaultTranslation) {
                section.labelPlaceholder = defaultTranslation.sections.find(tS => tS.id == index).label || ""
              }
              section.label = translation.sections.find(tS => tS.id == index).label || ""

              section.row.controls.forEach(control => {
                if(defaultTranslation) {
                  const translationDefControl = defaultTranslation.controls
                    .find(c => c.fieldName == control.fieldName)
                  control.labelPlaceholder = translationDefControl.label || ""
                  control.defaultValuePlaceholder = translationDefControl.defaultValue || ""
                  control.informationPlaceholder = translationDefControl.information || ""
                  if(control.dataOptions) {
                    control.dataOptions.forEach(op => {
                      const translationOp = translationDefControl.dataOptions.find(tOp => tOp.id == op.id)
                      op.placeholder = translationOp ? translationOp.text : ""
                    })
                  }
                }

                const translationControl = translation.controls
                  .find(c => c.fieldName == control.fieldName)
                control.label = translationControl.label || ""
                control.defaultValue = translationControl.defaultValue || ""
                control.information = translationControl.information || ""
                if(control.dataOptions) {
                  control.dataOptions.forEach(op => {
                    const translationOp = translationControl.dataOptions.find(tOp => tOp.id == op.id)
                    op.text = translationOp ? translationOp.text : ""
                  })
                }
              })
            })
          })

          eventBus.$on(EventHandlerConstant.ON_APPLY_EDITOR_SIDEBAR, ({ control }) => {
            const translationControl = this.form.translations
              .find(t => t.language == this.lang.current).data.controls
              .find(c => c.fieldName == control.fieldName)
            translationControl.label = control.label
            translationControl.defaultValue = control.defaultValue
            translationControl.information = control.information
            control.dataOptions.forEach(op => {
              const translationOp = translationControl.dataOptions.find(tOp => tOp.id == op.id)
              if(translationOp) {
                translationOp.text = op.text
              } else {
                translationControl.dataOptions.push({
                  id: op.id,
                  text: op.text
                })
              }
            })
          })
        },
        beforeDestroy() {
          eventBus.$off(EventHandlerConstant.ADD_CONTROL)
          eventBus.$off(EventHandlerConstant.CHANGE_DATA_OPTION_IN_CONTROL)
          eventBus.$off(EventHandlerConstant.ON_LANGUAGE_CHANGE)
          eventBus.$off(EventHandlerConstant.ON_APPLY_EDITOR_SIDEBAR)
        },
        watch: {
          'lang.current': {
            handler() {
              this.$parent.language = this.lang.current

              let defaultLang = this.lang.selected[0]
              let defaultTranslation
              if(this.lang.current != defaultLang) {
                defaultTranslation = this.form.translations
                  .find(t => t.language == defaultLang).data
              }
              const translation = this.form.translations
                .find(t => t.language == this.lang.current).data

              eventBus.$emit(
                  EventHandlerConstant.ON_LANGUAGE_CHANGE,
                  { lang: this.lang.current,
                    defaultTranslation, translation }
              );
            }
          },
          'lang.selected': {
            handler(val, oldVal) {
              if(val.length <= 0) {
                this.lang.selected = _.cloneDeep(oldVal)
              }
              if(!this.lang.selected.includes(this.lang.current)) {
                this.lang.current = this.lang.selected[0]
              }

              if(val.length > oldVal.length) {
                const lang = val.filter(lang => !oldVal.includes(lang))[0]
                this.addTranslation(lang)
              } else if(val.length < oldVal.length) {
                const lang = oldVal.filter(lang => !val.includes(lang))[0]
                this.removeTranslation(lang)
              }
            }
          },
        },
        methods: {
            addTranslation(lang) {
              if(this.form.translations.map(t => t.language).includes(lang)){ return }
              const isLangEn = lang == "en_US"
              const translation = {
                language: lang,
                data: {
                  sections: this.form.sections.map((section, i) => {
                    return { id: i, label: isLangEn ? section.label || "" : "" }
                  }),
                  controls: this.form.sections.map(section => {
                    return section.row.controls.map(control => {
                      return {
                        fieldName: control.fieldName,
                        label: isLangEn ? control.label || "" : "",
                        defaultValue: isLangEn ? control.defaultValue || "" : "",
                        information: isLangEn ? control.information || "" : "",
                        dataOptions: control.dataOptions ? control.dataOptions.map(op => (
                          { id: op.id, text: isLangEn ? op.text || "" : "" }
                        )) : []
                      }
                    })
                  }).flatten()
                }
              }
              this.form.translations.push(translation)
            },
            removeTranslation(lang) {
              this.form.translations = this.form.translations.filter(t => t.language != lang)
            },
        }
    }
</script>

<style scoped>
</style>
