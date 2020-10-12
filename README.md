# oca.js-vue
As a reference of using this dependency check [OCA Editor](https://github.com/THCLab/oca-editor) or [Aries TDA](https://github.com/THCLab/aries-toolbox)

## Functions

### Zip files

- `resolveZipFile(file)`
  - arguments
    - `file` - zip file in [OCA format](https://github.com/THCLab/odca-search-engine#v2)
  - returns  
    array of OCA Array<sup>[1](#schema-1)</sup>, each element matches one OCA schema

- `exportToZip(schema)`
  - arguments
    - `schema` - OCA Schema<sup>[2](#schema-2)</sup>
  - returns  
    zip file in [OCA format](https://github.com/THCLab/odca-search-engine#v2)

### Forms

- `renderForm(schemaObjects)`
  - arguments
    - `schemaObjects` - OCA Array<sup>[1](#schema-1)</sup>
  - returns  
    object with two attributes: `schema`<sup>[3](#schema-3)</sup> and `form`<sup>[4](#schema-4)</sup>

- `renderEmptyForm(uuid, label)`
  - arguments
    - `uuid`
    - `label`
  - returns  
    `form`<sup>[4](#schema-4)</sup> object of mapped OCA schema

- `createSchemaFromForm(baseForm, form)`
  - arguments
    - `baseForm`<sup>[3](#schema-3)</sup>
    - `form`<sup>[4](#schema-4)</sup>
  - returns  
    OCA Schema<sup>[2](#schema-2)</sup>

## Events

- `EventHandlerConstant`  
provides constants of emited events:
  - ADD_CONTROL
  - REMOVE_CONTROL
  - CHANGE_DATA_OPTION_IN_CONTROL
  - EXPORT_FORM
  - PUBLISH_FORM
  - SAVE_PREVIEW
  - REJECT_PREVIEW
  - ON_LANGUAGE_CHANGE
  - ERROR
  - ACTIVATE_EDITOR_SIDEBAR
  - DEACTIVATE_EDITOR_SIDEBAR
  - ON_APPLY_EDITOR_SIDEBAR
- `eventBus`

## Vue Components

- `PreviewComponent`  
shows dialog of OCA form
  - props
    - `form`  
    - `alternatives`  
    - `readonly`  
    - `confirmLabel`  
    - `confirmProcessing`

  - methods
    - `openModal(formData, formInput)`
    - `closeModal()`

- `MultiPreviewComponent`  
shows dialog of many OCA forms
  - props
    - `forms`  
    - `label`  
    - `readonly`  
    - `confirmLabel`  
    - `confirmProcessing`
    - `rejectLabel`  
    - `rejectProcessing`

  - methods
    - `openModal()`
    - `closeModal()`

- `FormBuilder`
  - props
    - `form`
    - `standards`
    - `standard`

## vuex

- `vuexModulesPlugin`  
Add it to `Vuex.Store` constructor in plugins array

---
## Schemas
<a name="schema-1">1) OCA Array</a>: Array of OCA JSONs, first object is `schema_base` JSON and the rest are `overlays` JSONs, ex.: 

```
[<schema base json>, <overlay json>, <overlay json>, ...]
```

<a name="schema-2">2) OCA Schema</a>: JSON of OCA data, ex.:

```
{
  "schemaBase": <schema base json>,
  "overlay1Name-DRI": <overlay json>,
  "overlay2Name-DRI": <overlay json>,
  ...
}
```

<a name="schema-3">3) schema</a>: JSON of base OCA schema data, ex.:
```
{
  "name": string,
  "description": string,
  "classification": string,
  "uuid": string,
  "did": string,
  "version": string
}
```

<a name="schema-4">4) form</a>: JSON of OCA schema mapped into form format, ex.:
```
{
  "uuid": string,
  "label": string,
  "sections": array of Sections (see below),
  "type": string
}
```

- [Section](https://github.com/THCLab/odca-form/blob/master/src/config/constants.js#L14)
