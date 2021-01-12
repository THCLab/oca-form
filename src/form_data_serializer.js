export function serializeFormData(formRef) {
  const serializedData = {}

  const formValues = Object.assign({}, ...Object.values(formRef.getValue()))
  if (formRef.form.DRI) {
    serializedData[`DRI:${formRef.form.DRI}`] = { t: 'o', p: formValues }
  } else {
    Object.assign(serializedData, formValues)
  }

  return serializedData
}
