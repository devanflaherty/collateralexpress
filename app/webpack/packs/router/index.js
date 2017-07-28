import Vue from 'vue'
import Axios from 'axios'
import bus from '../bus'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// Import Components

import Home from '../views/pages/home.vue'
import How from '../views/pages/how-it-works.vue'
import Faq from '../views/pages/faq.vue'
import Gallery from '../views/pages/gallery.vue'
import FourOhFour from '../views/pages/404.vue'
import ProjectIndex from '../views/projects/list.vue'
import ProjectForm from '../views/projects/form.vue'
import ProjectShow from '../views/projects/show.vue'
import ContactEdit from '../views/contacts/index.vue'

const authRequest = function(to, from, next) {
  Axios.get('/authenticate.json')
  .then(function (response) {
    if (response.data.user.id) {
      bus.$emit('authEmit', response.data.user.id)
      next()
    } else if(response.data.contact.id) {
      bus.$emit('contactSessionEmit', response.data.contact.id)
      next()
    } else {
      next()
    }
  }).catch(function (error) {
    console.log('Trouble authentication user.')
    next()
  })
}

const router = new VueRouter ({
  mode: 'history',
  routes: [
  {
    name: 'home',
    path:'/',
    component: Home,
    meta: {title: 'Home'}
  },
  {
    name: 'how',
    path:'/how-it-works',
    component: How,
    meta: {title: 'How It Works'}
  },
  {
    name: 'faq',
    path:'/faq',
    component: Faq,
    meta: {title: 'FAQ'}
  },
  {
    name: 'gallery',
    path:'/gallery',
    component: Gallery,
    meta: {title: 'Gallery'}
  },
  {
    name: 'contact',
    path:'/contact',
    component: Home,
    meta: {title: 'Home'}
  },
  {
    name: 'list',
    path:'/projects/',
    component: ProjectIndex,
    meta: {title: 'Projects'}
  },
  {
    name: 'edit',
    path:'/projects/:id/edit',
    component: ProjectForm,
    meta: {title: 'Edit Project'}
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
    component: ProjectShow
  },
  {
    name: 'edit-contact',
    path:'/contacts/:id/edit',
    component: ContactEdit,
    meta: {title: 'Edit Contact'}
  },
  {
    name: 'account',
    path:'/account',
    component: ContactEdit,
    meta: {title: 'Account'}
  },
  {
    name: 'admin-account',
    path:'/account/edit',
    meta: {title: 'Account'}
  },
  {
    name: '404',
    path:'*',
    component: FourOhFour,
    meta: {title: '404'}
  }]
})

// Set Document Title
router.beforeEach((to, from, next) => {
  authRequest(to, from, next)

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
