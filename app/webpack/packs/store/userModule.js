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
      password: null,
      password_confirmation: null
    },
    users: []
  },
  getters: {
    user(state) {
      return state.user
    },
    users(state) {
      return state.users
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
      } else {
        var key = payload[0]
        var val = payload[1]
        state.user[key] = val
      }
    },
    setUsers(state, payload) {
      state.users = payload
    }
  },
  actions: {
    setUser({commit}, payload) {
      commit('setUser', payload)
    },
    setUserProperty({commit}, payload) {
      commit('setUserProperty', payload)
    },
    setUsers({commit}, payload) {
      commit('setUsers', payload)
    },
  }
}
