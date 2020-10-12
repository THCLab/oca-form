const state = {
  standard_list: [],
  current_standard: null
}

const mutations = {
  ADD_STANDARD(state, detail) {
    state.standard_list.push(detail)
  },
  DELETE_STANDARD(state, name) {
    state.standard_list = state.standard_list.filter(function(element) {
      return element.name != name
    })
  },
  DELETE_ALL_STANDARDS(state) {
    state.standard_list = []
  },
  SET_CURRENT_STANDARD(state, name) {
    state.current_standard = state.standard_list.find(function(element){
      return element.name == name
    });
  }
};

const actions = {
  add_standard (context, detail) {
    context.commit('ADD_STANDARD', detail)
  },
  delete_standard (context, detail) {
    context.commit('DELETE_STANDARD', detail.name)
  },
  delete_all_standards (context) {
    context.commit('DELETE_ALL_STANDARDS')
  },
  get_standard (context, name) {
    let detail = context.state.standard_list.find(function(element){
      return element.name == name
    });
    return detail
  },
  set_current_standard(context, name) {
    context.commit('SET_CURRENT_STANDARD', name)
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
