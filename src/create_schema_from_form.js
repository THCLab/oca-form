import * as odcaPkg from 'odca'
const odca = odcaPkg.com.thehumancolossuslab.odca
import Kotlin from 'kotlin'
var HashMap_init = Kotlin.kotlin.collections.HashMap_init_q3lmfv$;
import { TYPE_MAPPER } from './config/constants'
import DateFormater from './date_formater'

const facade = new odca.Facade()

export const createSchemaFromForm = (baseForm, form, standard) => {
    const baseInfo = HashMap_init()
    const attributes = []

    baseInfo.put_xwzc9p$("name", baseForm.name)
    baseInfo.put_xwzc9p$("description", baseForm.description)
    if (standard && standard.name) {
      baseInfo.put_xwzc9p$("classification", standard.name)
    } else {
      baseInfo.put_xwzc9p$("classification", baseForm.classification)
    }

    const attrNames = form.sections.map(s => s.row.controls.map(c => c.attrName)).flat(1)
    const duplicates = attrNames.filter((attrName, index) => {
        return attrNames.indexOf(attrName) != index;
    })
    if (duplicates.length > 0) {
        duplicates.forEach(attrName => {
            throw `Attribute name '${attrName}' is duplicated`
        })
    }

    const defaultTranslation = form.translations[0]

    form.sections.forEach((section, sectionIndex) => {
      section.row.controls.forEach(control => {
          if (control.attrName.length <= 0) {
            throw "Attribute name cannot be empty"
          }

          const format = (control.dateFormat &&
            control.dateFormat.length > 0) ?
            DateFormater.toStandard(control.dateFormat) : null

          const translations = HashMap_init()
          form.translations.forEach(translation => {
            const translationFields = HashMap_init()
            const translationControl = translation.data.controls.find(tC => tC.fieldName == control.fieldName)

            if (translation.language != defaultTranslation.language) {
              const defaultTranslationControl = defaultTranslation.data.controls.find(tC => tC.fieldName == control.fieldName)
              if(defaultTranslationControl.label.length > 0 &&
                translationControl.label.length == 0) {
                throw `Missing ${translation.language} translation for '${control.attrName}' label`
              }
              if(defaultTranslationControl.information.length > 0 &&
                translationControl.information.length == 0) {
                throw `Missing ${translation.language} translation for '${control.attrName}' information`
              }
              if(defaultTranslationControl.dataOptions.length > 0) {
                translationControl.dataOptions.forEach((op, index) => {
                  if(op.text.length == 0) {
                    throw `Missing ${translation.language} translation for ${index + 1}. element in '${control.attrName}' options`
                  }
                })
              }
            }

            const translationSection = translation.data.sections[sectionIndex]
            const category = translationSection ? translationSection.label : ''
            const categories = [category]

            translationFields.put_xwzc9p$("categories", categories)
            translationFields.put_xwzc9p$("label", translationControl.label)
            if(translationControl.information.length > 0) {
              translationFields.put_xwzc9p$("information", translationControl.information)
            }
            if(translationControl.dataOptions.length > 0) {
              translationFields.put_xwzc9p$("entry", translationControl.dataOptions.map(o => o.text))
            }
            translations.put_xwzc9p$(translation.language, translationFields)
          })

          attributes.push(
            new odca.AttributeDto(
              control.attrName,
              control.attrType,
              control.isPII,
              translations,
              format,
              control.encoding
            )
          )
      })
    })

  return JSON.parse(
    facade.serialize(
      facade.renderSchema(baseInfo, attributes)
    )
  )
}
