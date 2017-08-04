import axios from 'axios'
import router from '../router'

export const contactModule = {
  namespaced: false,
  state: {
    contact: {
      id: null,
      email: null,
      first_name: null,
      last_name: null,
      full_name: null,
      phone: null,
      location: null
    },
    contacts: []
  },
  getters: {
    contact(state) {
      return state.contact
    },
    contacts(state) {
      return state.contacts
    }
  },
  mutations: {
    setContact(state, payload) {
      state.contact = payload
    },
    setContactProperty(state, payload) {
      if(payload.contact) {
        for (var key in payload.contact) {
          state.contact[key] = payload.contact[key]
        }
      } else {
        var key = payload[0]
        var val = payload[1]
        state.contact[key] = val
      }
    },
    setContacts(state, payload) {
      state.contacts = payload
    }
  },
  actions: {
    setContact({commit}, payload) {
      commit('setContact', payload)
    },
    setContactProperty({commit}, payload) {
      commit('setContactProperty', payload)
    },
    setContacts({commit}, payload) {
      commit('setContacts', payload)
    }
  }
}
