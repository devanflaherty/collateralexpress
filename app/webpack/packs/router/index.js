import Vue from 'vue'
import axios from 'axios'
import {store} from '../store'

import bus from '../bus'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// Import Components

import Home from '../views/pages/home.vue'
import How from '../views/pages/how-it-works.vue'
import Faq from '../views/pages/faq.vue'
import Gallery from '../views/pages/gallery.vue'
import FourOhFour from '../views/pages/404.vue'
import Projects from '../views/projects/index.vue'
import ProjectList from '../views/projects/list.vue'
import ProjectForm from '../views/projects/form.vue'
import ProjectShow from '../views/projects/show.vue'
import ContactEdit from '../views/contacts/index.vue'
import Admin from '../views/admin/index.vue'
import AdminLogin from '../views/admin/login.vue'
import AdminAccount from '../views/admin/edit.vue'
import AdminCreate from '../views/admin/new.vue'
import AdminList from '../views/admin/list.vue'

const router = new VueRouter ({
  mode: 'history',
  linkExactActiveClass: 'is-active',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  routes: [
  {
    name: 'home',
    path:'/',
    component: Home,
    meta: {title: 'Home', header:true}
  },
  {
    name: 'how',
    path:'/how-it-works',
    component: How,
    meta: {title: 'How It Works', header:true}
  },
  {
    name: 'faq',
    path:'/faq',
    component: Faq,
    meta: {title: 'FAQ', header:true}
  },
  {
    name: 'gallery',
    path:'/gallery',
    component: Gallery,
    meta: {title: 'Gallery', header:true}
  },
  {
    name: 'contact',
    path:'/contact',
    component: Home,
    meta: {title: 'Home'}
  },
  {
    path:'/projects/',
    component: Projects,
    meta: {title: 'Projects'},
    children: [
      {
        name: 'list',
        path:'',
        component: ProjectList,
        meta: {
          title: 'Projects',
          auth: true
        }
      },
      {
        name: 'new',
        path:'new',
        component: ProjectForm,
        meta: {title: 'New Project'}
      },
      {
        name: 'show',
        path:':id',
        component: ProjectShow,
        meta: {
          // auth: true
        }
      },
      {
        name: 'edit',
        path:':id/edit',
        component: ProjectForm,
        meta: {
          title: 'Edit Project',
          auth: 'admin'
        }
      }
    ]
  },
  {
    name: 'contact-edit',
    path:'/contacts/:id/edit',
    component: ContactEdit,
    meta: {
      title: 'Edit Contact',
      auth: 'admin'
    }
  },
  {
    component: Admin,
    path:'/account/',
    meta: {title: 'Login'},
    children: [
      {
        name: 'account',
        component: AdminAccount,
        path:'',
        meta: {
          title: 'Update Account',
          auth: true
        }
      },
      {
        name: 'login',
        component: AdminLogin,
        path:'login',
        meta: {
          title: 'Login'
        },
         beforeEnter: (to, from, next) => {
          if(store.getters.authUser.id != null) {
            next({name: 'account'})
          } else {
            next()
          }
        }
      },
      {
        name: 'edit-admin',
        component: AdminAccount,
        path:':id/edit',
        meta: {
          title: 'Edit User',
          auth: 'admin'
        }
      },
      {
        name: 'new-admin',
        component: AdminCreate,
        path:'new',
        meta: {
          title: 'Add an Admin',
          auth: 'admin'
        }
      },
      {
        name: 'list-admin',
        component: AdminList,
        path:'list',
        meta: {
          title: 'All Users',
          auth: 'admin'
        }
      }
    ]
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
  store.dispatch('setContactSession')

  if (localStorage.getItem('default_auth_token')) {
    var token = localStorage.getItem('default_auth_token')
    store.dispatch('setAuthViaToken', token)
  }
  // else if(store.getters.contactSession && store.getters.authUser.role != 'admin'){
  //   store.dispatch({
  //     type: 'setAuth',
  //     id: store.getters.contactSession,
  //     role: 'contact'
  //   })
  // }
  else {
    store.dispatch('setAuth', '')
  }

  if(store.getters.mobileNav == true) {
    store.dispatch('toggleMobileNav', false)
  }

  next()
})

export default router
