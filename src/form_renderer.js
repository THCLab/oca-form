import * as ocaPkg from 'oca.js'
const oca = ocaPkg.com.thehumancolossuslab.oca
import Kotlin from 'kotlin'
var HashMap_init = Kotlin.kotlin.collections.HashMap_init_q3lmfv$;

import { FORM_CONSTANTS, TYPE_MAPPER } from './config/constants'
import Communicator from './communicator'
import DateFormater from './date_formater'

export function renderEmptyForm(uuid, label) {
  return {
    uuid: uuid,
    label: label,
    sections: [_.cloneDeep(FORM_CONSTANTS.Section)],
    type: ""
  }
}

export function renderForm(schemaObjects, schemaDRI = null) {
  const schemaData = deserializeSchema(schemaObjects)
  Communicator.publish('store_schema', schemaData)
  const schema = {
    name: schemaData.schemaBase.name,
    description: schemaData.schemaBase.description,
    classification: schemaData.schemaBase.classification,
    uuid: schemaData.uuid,
    did: "",
    version: "1"
  }
  const form = {
    uuid: schemaData.uuid,
    label: schemaData.schemaBase.name,
    DRI: schemaDRI,
    sections: [],
    translations: [],
    type: ""
  }

  const leftAttributes = schemaData.schemaBase.attributesUuid
  const pii_attributes = schemaData.schemaBase.piiAttributes.array_hd7ov6$_0

  const labelOverlays = schemaData.labelOverlays.array_hd7ov6$_0

  const generateControl = (attrUuid, attrName) => {
    let attrType = schemaData.schemaBase.attributesType.get_11rb$(attrUuid)
    if (attrType == "Array[Object]") {
      attrType = "Array[Text]"
    }
    let type = TYPE_MAPPER.typeInput[attrType] || "text"

    const controlName = _.domUniqueID(`control_${type}_`)
    const controlTranslations = { controlName: controlName, data: [] }

    let label, format, options, encoding, information
    label = labelOverlays[0] ? labelOverlays[0].attrLabels.get_11rb$(attrUuid) : ""
    labelOverlays.forEach(labelOverlay => {
      const translation = controlTranslations.data.find(t => t.language == labelOverlay.language)
      if(translation) {
        translation.label = labelOverlay.attrLabels.get_11rb$(attrUuid)
      } else {
        controlTranslations.data.push( {
          language: labelOverlay.language,
          label: labelOverlay.attrLabels.get_11rb$(attrUuid),
          information: "",
          dataOptions: []
        })
      }
    })

    const formatOverlays = schemaData.formatOverlays.array_hd7ov6$_0
    if (formatOverlays.length != 0) {
      format = formatOverlays[0].attrFormats.get_11rb$(attrUuid)
      if(format) {
        format = DateFormater.toJQuery(format)
      }
    }

    const entryOverlays = schemaData.entryOverlays.array_hd7ov6$_0
    if (entryOverlays.length != 0) {
      for(let entryOverlay of entryOverlays) {
        const translation = controlTranslations.data.find(t => t.language == entryOverlay.language)
        let entries = entryOverlay.attrEntries.get_11rb$(attrUuid)
        if (entries) {
          if (attrType != "Boolean") {
            type = "select"
          }

          options = entries.array_hd7ov6$_0.map((entry, index) => {
            return { value: index, label: entry }
          })
          translation.dataOptions = options
        }
      }
    }

    const encodeOverlays = schemaData.characterEncodingOverlays.array_hd7ov6$_0
    encoding = encodeOverlays[0] ? encodeOverlays[0].attrCharacterEncoding.get_11rb$(attrUuid) : ""
    const defaultEncoding = encodeOverlays[0] ? encodeOverlays[0].defaultCharacterEncoding : ""

    const informationOverlays = schemaData.informationOverlays.array_hd7ov6$_0
    if (informationOverlays.length != 0) {
      for(let informationOverlay of informationOverlays) {
        const translation = controlTranslations.data.find(t => t.language == informationOverlay.language)
        information = informationOverlay.attrInformation.get_11rb$(attrUuid)

        translation.information = informationOverlay.attrInformation.get_11rb$(attrUuid) || ""
      }
    }

    return {
      control: {...FORM_CONSTANTS.Control,
        ...{
          uuid: attrUuid,
          type: type,
          name: controlName,
          fieldName: controlName,
          attrName: attrName,
          attrType: attrType,
          isPII: pii_attributes.includes(attrUuid),
          label: label || null,
          dateFormat: format || null,
          dataOptions: options || null,
          isMultiple: attrType.includes("Array"),
          encoding: encoding || defaultEncoding,
          information: information,
          timeFormat: "HH:mm"
        }
      },
      translations: controlTranslations
    }
  }

  labelOverlays.forEach(labelOverlay => {
    let formTranslation = form.translations.find(t => t.language == labelOverlay.language)
    if(!formTranslation) {
      formTranslation = {
        language: labelOverlay.language,
        data: { sections: [], controls: [] }
      }
    }
    const categories = labelOverlay.attrCategories.array_hd7ov6$_0
    categories.forEach((categoryLink, index) => {
      const categoryLabel = labelOverlay.categoryLabels.get_11rb$(categoryLink)
      formTranslation.data.sections.push({ id: index, label: categoryLabel })
    })
    form.translations.push(formTranslation)
  })

  const labelOverlay = labelOverlays[0]
  if(labelOverlay) {
    const categories = labelOverlay.attrCategories.array_hd7ov6$_0
    categories.forEach(categoryLink => {
      const section = _.cloneDeep(FORM_CONSTANTS.Section)
      section.name = _.domUniqueID("section_")
      section.clientKey = section.name

      const categoryLabel = labelOverlay.categoryLabels.get_11rb$(categoryLink)
      section.label = categoryLabel
      form.sections.push(section)

      const categoryHasAttributes = labelOverlay.categoryAttributes.get_11rb$(categoryLink) ? true : false
      const categoryAttributes = categoryHasAttributes ? labelOverlay.categoryAttributes.get_11rb$(categoryLink).array_hd7ov6$_0 : []

      categoryAttributes.forEach(attrUuid => {
        let attrName = leftAttributes.remove_11rb$(attrUuid)
        let control, translations
        ({ control, translations } = generateControl(attrUuid, attrName))
        section.row.controls.push(control)
        translations.data.forEach(translation => {
          let formTranslation = form.translations.find(t => t.language == translation.language)
          formTranslation.data.controls.push({
            fieldName: control.fieldName,
            label: translation.label,
            defaultValue: "",
            information: translation.information,
            dataOptions: translation.dataOptions
          })
        })
      })
    })
  }
  if (leftAttributes.size > 0) {
    const section = _.cloneDeep(FORM_CONSTANTS.Section)
    section.name = _.domUniqueID("section_")
    section.clientKey = section.name
    form.sections.push(section)

    const iterator = leftAttributes.entries.iterator()
    while(iterator.hasNext()) {
      let element = iterator.next()
      let attrUuid = element.key
      let attrName = element.value
      let control, translations
      ({ control, translations } = generateControl(attrUuid, attrName))
      section.row.controls.push(control)
      translations.data.forEach(translation => {
        let formTranslation = form.translations.find(t => t.language == translation.language)
        formTranslation.data.controls.push({
          fieldName: control.fieldName,
          label: translation.label,
          defaultValue: "",
          information: translation.information,
          dataOptions: translation.dataOptions
        })
      })
    }
  }

  return { schema, form }
}

const deserializeSchema = (schema) => {
  const facade = new oca.Facade()
  const schemaInput = HashMap_init()

  schema.forEach((o, i) => {
    const type = o.type.split('/')
    let key
    if(type[1] == 'schema_base') {
      key = 'schemaBase'
    } else if (type[1] == 'overlay') {
      key = type[2].split('_').map(w => {
          return w.charAt(0).toUpperCase() + w.slice(1)
      }).join('') + `Overlay-${i}`
    }

    schemaInput.put_xwzc9p$(key, JSON.stringify(o))
  })

  return facade.deserializeSchemas([schemaInput])[0]
}
