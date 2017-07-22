import Vue from 'vue'
import Axios from 'axios'
import bus from '../bus'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// Import Components

import ProjectIndex from '../projects/list.vue'
import ProjectForm from '../projects/form.vue'
import ProjectShow from '../projects/show.vue'

// const authRequest = function(to, from, next) {
//   Axios.get('/authenticate.json')
//   .then(function (response) {
//     if (response.data.user.id || response.data.contact.id) {
//       next()
//     } else {
//       bus.$emit('setRedirect', from, to)
//       next()
//       // bus.$emit('setRedirect', from)
//       // window.location.href = "/contact/login"
//     }
//   }).catch(function (error) {
//     window.location.href = "/"
//   })
// }

const router = new VueRouter ({
  mode: 'history',
  routes: [
  {
    name: 'list',
    path:'/projects/',
    component: ProjectIndex,
    meta: {title: 'Projects'},
    // beforeEnter: (to, from, next) => {
    //   authRequest(to, from, next)
    // }
  },
  {
    name: 'edit',
    path:'/projects/:id/edit',
    component: ProjectForm,
    meta: {title: 'Edit Project'},
  },
  {
    name: 'new',
    path:'/projects/new',
    component: ProjectForm,
    meta: {title: 'New Project'}
  },
  {
    name: 'show',
    path:'/project/:id',
    component: ProjectShow,
  }]
})

// Set Document Title
router.beforeEach((to, from, next) => {
  // Set Auth
  Axios.get('/authenticate.json')
  .then(function (response) {
    if (response.data.user.id) {
      bus.$emit('authEmit', response.data.user.id)
    }
  }).catch(function (error) {
    console.log('Trouble authneticating user')
  })

  bus.$emit('contactSessionEmit')

  // Set Title
  var vueTitle = to.meta.title
  // if page has a set title do
  if (vueTitle) {
    console.log(to.meta.title)
    document.title = vueTitle + " | Collateral Express"
  }

  next()
})

export default router
