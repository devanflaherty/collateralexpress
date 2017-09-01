import axios from 'axios'
import router from '../router'

export const projectModule = {
  namespaced: false,
  state: {
    project: {
      id: null,
      title: null,
      slug: null,
      user_id: 1,
      contact_id: null,
      status: "",
      description: null,
      reference: null,
      tactic: [],
      due_date: null,
      existing: false,
      translation: false,
      business_unit: null,
      deliverables: "",
      target: null,
      flag: false,
      archive: false
    },
    projectMedia: [],
    availableTactics:[]
  },
  getters: {
    project(state) {
      return state.project
    },
    projectMedia(state) {
      return state.projectMedia
    },
    availableTactics(state) {
      return state.availableTactics
    }
  },
  mutations: {
    setProject(state, payload) {
      state.project = payload
    },
    setProjectProperty(state, payload) {
      if(payload.project) {
        for (var key in payload.project) {
          state.project[key] = payload.project[key]
        }
      } else if(payload.set){
        var key = payload.set[0]
        var val = payload.set[1]
        state.project[key] = val
      }
    },
    setProjectMedia(state, medias) {
      state.projectMedia = medias
    },
    pushProjectMedia(state, media) {
      state.projectMedia.push(media)
    },
    setAvailableTactics(state, tactics) {
      state.availableTactics = tactics
    },
    pushTactic(state, tactic) {
      state.project.tactics.push(tactic)
    }
  },
  actions: {
    setProject({commit}, payload) {
      commit('setProject', payload)
    },
    setProjectProperty({commit}, payload) {
      commit('setProjectProperty', payload)
    },
    setAvailableTactics({commit}) {
      axios.get('/api/v1/projects/new.json').then(response => {
        commit('setAvailableTactics', response.data.tactics)
      }).catch(error => {
        console.log(error)
      })
    },
    pushTactic({commit, state}, tactic) {
      var tactics = state.project.tactic.filter(tactic => {
        if (state.availableTactics.includes(tactic)) return tactic
      })
      tactics.push(tactic)

      commit({
        type: 'setProjectProperty',
        set: ['tactic', tactics]
      })
    },
    setProjectMedia({commit}, medias) {
      commit('setProjectMedia', medias)
    },
    pushProjectMedia({commit}, media) {
      commit('pushProjectMedia', media)
    },
    deleteProject(context, id) {
      axios.delete('/projects/' + id)
      .then(response => {
        context.dispatch('closeReveal', null, { root: true })
        context.dispatch('setFlash', response.data.flash[0][1], { root: true })

        // If Delete is succesfull we route to the list page
        router.push({ name: 'list' })
      })
      .catch(error => {
        // if it fails we just console log an error for now
        console.log(error)
      })
    },

    postProject(context, payload) {
      var token = document.getElementsByName('csrf-token')[0].getAttribute('content')

      var axiosConfig = {
        utf8 : "✓",
        authenticity_token: token,
        project : context.getters.project
      }
      if(context.getters.authUser.id) {
        axiosConfig.headers = {
          'Authorization' : 'Bearer' + context.getters.validToken
        }
      }
      if(!context.getters.project.id) {
        return new Promise((resolve, reject) => {
          axios.post('/api/v1/projects/', axiosConfig).then(response => {
            resolve(response)
          }).catch(error => {
            reject(error)
          })
        })
      } else if(context.getters.project.id) {
        return new Promise((resolve, reject) => {
          axios.patch('/api/v1/projects/' + context.getters.project.id, axiosConfig).then(response => {
            resolve(response)
          }).catch(error => {
            reject(error)
          })
        })
      }
    }
  }
}
