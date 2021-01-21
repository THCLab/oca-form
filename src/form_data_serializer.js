import { FormHandler } from "@/gui/handler/form_handler";

export function serializeFormData(formRef) {
  const serializedData = {}

  const formValues = Object.assign({}, ...Object.values(formRef.getValue()))
  if (formRef.form.DRI) {
    serializedData[`DRI:${formRef.form.DRI}`] = { t: 'o', p: formValues }

    const nestedForms = collectNestedForms(formRef.form)

    nestedForms.forEach(form => {
      const referenceValues = Object.assign({}, ...Object.values(FormHandler.getValue(form)))
      serializedData[`DRI:${form.DRI}`] = {t: 'o', p: referenceValues}
    })

    // formRef.form.sections[0].row.controls.forEach(control => {
    //   if (control.type == "reference") {
    //     const referenceForm = control.referenceSchema.form
    //     const referenceValues = Object.assign({}, ...Object.values(FormHandler.getValue(referenceForm)))
    //     serializedData[`DRI:${referenceForm.DRI}`] = {t: 'o', p: referenceValues}
    //   }
    // })
  } else {
    Object.assign(serializedData, formValues)
  }

  return serializedData
}

function collectNestedForms(form, collected = []) {
  const nested = []
  form.sections[0].row.controls.forEach(control => {
    if (control.type == "reference") {
      const referenceForm = control.referenceSchema.form
      collected.push(referenceForm)
      nested.push(...collectNestedForms(referenceForm))
    }
  })

  return [...collected, ...nested]
}
