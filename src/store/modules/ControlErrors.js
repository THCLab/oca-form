const state = {
  error_list: [],
}

const getters = {
  invalid_controls: (state) => {
    return state.error_list.map(el => {
      return el.errors.some(e => e.type == 'error') ? el.control : null
    }).filter(el => el != null)
  },
  warned_controls: (state) => {
    return state.error_list.map(el => {
      return el.errors.some(e => e.type == 'warning') ? el.control : null
    }).filter(el => el != null)
  },
  control_errors: (state) =>  (controlName) => {
    let detail = state.error_list.find(el => el.control == controlName)
    return detail ? detail.errors : []
  }
}

const mutations = {
  ADD_ERROR(state, detail) {
    const index = state.error_list.findIndex(el => el.control == detail.control)
    const error = {
      label: detail.error.label,
      type: detail.error.type,
      msg: detail.error.msg
    }
    if (index == -1) {
      state.error_list.push({ control: detail.control, errors: [error] })
    } else {
      const controlErrors = state.error_list[index]
      controlErrors.errors.push(error)
    }
  },
  DELETE_CONTROL_ERRORS(state, controlName) {
    state.error_list = state.error_list.filter(function(element) {
      return element.control != controlName
    })
  }
};

const actions = {
  add_error (context, control_error) {
    context.commit('ADD_ERROR', {
      control: control_error.controlName, error: control_error.error
    })
  },
  delete_control_errors (context, controlName) {
    context.commit('DELETE_CONTROL_ERRORS', controlName)
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
