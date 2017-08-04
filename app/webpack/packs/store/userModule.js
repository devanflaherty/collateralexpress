import axios from 'axios'
import router from '../router'

export const userModule = {
  namespaced: false,
  state: {
    user: {
      id: null,
      email: null,
      first_name: null,
      last_name: null,
      full_name: null,
      phone: null,
      location: null
    }
  },
  getters: {
    user(state) {
      return state.user
    }
  },
  mutations: {
    setUser(state, payload) {
      state.user = payload
    },
    setUserProperty(state, payload) {
      if(payload.user) {
        for (var key in payload.user) {
          state.user[key] = payload.user[key]
        }
      } else if(payload.set){
        var key = payload.set[0]
        var val = payload.set[1]
        state.user[key] = val
      }
    },
  },
  actions: {
    setUser({commit}, payload) {
      commit('setUser', payload)
    },
    setUserProperty({commit}, payload) {
      commit('setUserProperty', payload)
    }
  }
}
