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
      location: null,
      superior: null
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
    },
    postContact(context, payload) {
      var contactUser = {...context.getters.contact}
      if(context.getters.authUser.id != context.getters.contact.id || context.getters.contact.id == null) {
        contactUser.password = context.getters.contact.email
        contactUser.password_confirmation = context.getters.contact.email
      }
      var token = document.getElementsByName('csrf-token')[0].getAttribute('content')

      var axiosConfig = {
        utf8 : "✓",
        authenticity_token: token,
        contact : contactUser
      }
      if(context.getters.authUser.id) {
        axiosConfig.headers = {
          'Authorization' : 'Bearer' + context.getters.validToken
        }
      }
      if(context.getters.contact.id) {
        return new Promise((resolve, reject) => {
          axios.patch('/api/v1/contacts/' + context.getters.contact.id, axiosConfig).then(response => {
            // IF SUCCESFUll
            resolve(response)
          }).catch(error => {
            reject(error)
          })
        })
      } else {
        return new Promise((resolve, reject) => {
          axios.post('/api/v1/contacts/', axiosConfig).then(response => {
            // IF SUCCESFUll
            resolve(response)
          }).catch(error => {
            reject(error);
          })
        })
      }
    }
  }
}
