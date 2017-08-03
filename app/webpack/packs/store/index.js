import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import axios from 'axios'
import Notifications from 'vue-notification'
Vue.use(Notifications)
Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    authUser: {
      id: null,
      role: null
    },
    message: "Update Form",
    flash: [],
    reveal: {
      type: null,
      title: null,
      msg: null,
      project_id: null
    },
    contactSession: null,
    showLogin: false,
  },
  getters: {
    authUser(state) {
      return state.authUser
    },
    message(state) {
      return state.message
    },
    flash(state) {
      return state.flash
    },
    reveal(state) {
      return state.reveal
    },
    contactSession(state) {
      return state.contactSession
    },
    showLogin(state) {
      return state.showLogin
    }
  },
  mutations: {
    setAuth(state, payload) {
      state.authUser.id = payload.id
      state.authUser.role = payload.role
    },
    setMessage(state, message) {
      state.message = message
    },
    setFlash(state, payload) {
      var flash_obj = payload
      state.flash.push(flash_obj)
    },
    setReveal(state, payload) {
      state.reveal.reveal_type = payload.reveal_type
      state.reveal.title = payload.title
      state.reveal.msg = payload.msg
      state.reveal.project_id = payload.pid
    },
    setContactSession(state, id) {
      state.contactSession = id
    },
    toggleLogin(state, bool) {
      state.showLogin = bool
    }
  },
  actions: {
    // Global actions
    setAuth({commit}, payload) {
      if(payload) {
        commit('setAuth', payload)
      } else {
        var emptyAuth = {
          id: null,
          role: null
        }
        commit('setAuth', emptyAuth)
      }
    },
    setContactSession({commit}, id) {
      if(id) {
        commit('setContactSession', id)
      } else {
        var nameEQ = "current_contact_id="
        var ca = document.cookie.split(';')
        for(var i=0;i < ca.length;i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') c = c.substring(1,c.length);
          if (c.indexOf(nameEQ) == 0) {
            var contactId = c.substring(nameEQ.length,c.length)
            commit('setContactSession', id)
          }
        }
      }
    },
    setMessage({commit}, message) {
      commit('setMessage', message)
    },
    setFlash({commit}, payload) {
      commit('setFlash', payload)
    },
    setReveal({commit}, payload) {
      commit('setReveal', payload)
      $('#reveal').foundation('open');
    },
    closeReveal({commit}) {
      var emptyReveal = {
        reveal_type: null,
        title: null,
        msg: null,
        pid: null
      }
      commit('setReveal', emptyReveal)
      $('#reveal').foundation('close');
    },
    toggleLogin({commit}, bool) {
      commit('toggleLogin', bool)
    },

    // Project Actions
    deleteProject(context, id) {
      axios.delete('/projects/' + id)
      .then(function (response) {
        context.dispatch('closeReveal')
        context.dispatch('setFlash', response.data.flash[0][1])

        // If Delete is succesfull we route to the list page
        router.push({ name: 'list' })
      })
      .catch(function (error) {
        // if it fails we just console log an error for now
        console.log(error)
      });

    }
  }
})
