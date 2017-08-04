import Vue from 'vue'
import Vuex from 'vuex'
import router from '../router'
import axios from 'axios'
Vue.use(Vuex)

// modules
import {projectModule} from './projectModule'
import {contactModule} from './contactModule'
import {userModule} from './userModule'


export const store = new Vuex.Store({
  modules: {
    project: projectModule,
    contact: contactModule,
    user: userModule
  },
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
    validUser: false,
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
    validUser(state) {
      return state.validUser
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
    toggleValidUser(state, bool) {
      state.validUser = bool
    }
  },
  actions: {
    // Global actions
    setAuth({commit}, payload) {
      if(payload) {
        commit('setAuth', payload)
        if(payload.role == 'admin') {
          commit('toggleValidUser', true)
        }
      } else {
        var emptyAuth = {
          id: null,
          role: 'public'
        }
        commit('setAuth', emptyAuth)
        commit('toggleValidUser', false)
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
    checkValidUser({commit, state}, id) {
      if(state.authUser.role == 'admin') {
        commit('toggleValidUser', true)
      } else if (state.authUser.role == 'contact') {
        if(state.authUser.id == id) {
          commit('toggleValidUser', true)
        } else {
          commit('toggleValidUser', false)
        }
      } else {
        commit('toggleValidUser', false)
      }
    }
  }
})
