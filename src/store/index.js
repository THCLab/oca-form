import modules from './modules';

export default function(store) {
  Object.entries(modules).forEach(moduleEntry => {
    [name, module] = moduleEntry
    store.registerModule(name, module)
  })
}
