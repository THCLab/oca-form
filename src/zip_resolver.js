import JSZip from 'jszip'

export const exportToZip = async (schema) => {
    const zip = new JSZip()
    const schemaName = schema.schemaBase.name

    zip.file(
      `${schemaName}.json`,
      JSON.stringify(schema.schemaBase, null, 2)
    )
    zip.file(`${schemaName}/`, null, { dir: true })
    const { schemaBase, ...schemaOverlays } = schema

    for(let overlays of Object.values(schemaOverlays)) {
        for(let [key, value] of Object.entries(overlays)) {
            zip.file(
              `${schemaName}/${key}.json`,
              JSON.stringify(value, null, 2)
            )
        }
    }

    return await zip.generateAsync({type:"blob"}).then((content) => {
        if (window.Cypress) {
            const fr = new FileReader()
            fr.addEventListener('load', () => {
                window.sessionStorage
                .setItem('zipBase64', fr.result.split(',')[1])
            })
            fr.readAsDataURL(content)

            return
        }

      return content
    });
}

export const resolveZipFile = async (file) => {
    const jszip = new JSZip()
    const results = []
    const promises = []
    let schemaNames

    await jszip.loadAsync(file).then((zip) => {
        schemaNames = Object.values(zip.files)
            .filter((f) => f.dir)
            .map((dir) => dir.name.replace("/", ""))

        schemaNames.forEach((name) => {
            const p = []

            p.push({
                name: "schemaBase",
                value: zip.file(`${name}.json`).async("string")
            })
            let overlayNames = Object.values(zip.files)
                .filter((f) => !f.dir && f.name.match(`${name}/`))
                .map((overlay) => overlay.name)

            overlayNames.forEach((overlayName) => {
                p.push({
                    name: overlayName.replace(`${name}/`, ""),
                    value: zip.file(overlayName).async("string")
                })
            })

            promises.push(p)

        })
    })
    await Promise.all(promises.map((schemaPromise) => {
        return Promise.all(schemaPromise.map(({value}) => value)).then((schema)=> {
            let result = []
            schema.forEach(content => result.push(JSON.parse(content)))
            results.push(result)
        })
    }))

    return results;
}
