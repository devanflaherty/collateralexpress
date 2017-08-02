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

const authRequest = function(to, from, next) {
  Axios.get('/api/v1/authenticate.json')
  .then(function (response) {
    if (response.data.user) {
      bus.$emit('authEmit', response.data.user.id, response.data.role)
      if(response.data.role == 'contact') {
        bus.$emit('contactSessionEmit', response.data.user.id)
      }

      bus.$emit('updateLinks')
      // Redirects

      if(response.data.role == 'admin' && to.name == 'login') {
        router.push({name: 'account'})
      } else if(response.data.role != 'admin') {
        if(
          to.name == 'account' ||
          to.name == 'edit-admin' ||
          to.name == 'list-admin' ||
          to.name == 'new-admin'
        ) {
          router.push({name: 'login'})
        }
      } else {
        next()
      }
    } else {
      if(
        to.name == 'account' ||
        to.name == 'edit-admin' ||
        to.name == 'list-admin' ||
        to.name == 'new-admin'
      ) {
        router.push({name: 'login'})
      }
    }
  }).catch(function (error) {
    console.log('Trouble authentication user.')
    next()
  })
}

const router = new VueRouter ({
  mode: 'history',
  linkExactActiveClass: 'is-active',
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
        meta: {title: 'Projects'}
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
      },
      {
        name: 'edit',
        path:':id/edit',
        component: ProjectForm,
        meta: {title: 'Edit Project'}
      }
    ]
  },
  {
    name: 'contact-edit',
    path:'/contacts/:id/edit',
    component: ContactEdit,
    meta: {title: 'Edit Contact'}
  },
  {
    name: 'contact-profile',
    path:'/profile',
    component: ContactEdit,
    meta: {title: 'Profile'}
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
        meta: {title: 'Update Account'}
      },
      {
        name: 'login',
        component: AdminLogin,
        path:'login',
        meta: {title: 'Login'}
      },
      {
        name: 'edit-admin',
        component: AdminAccount,
        path:':id/edit',
        meta: {title: 'Edit User'}
      },
      {
        name: 'new-admin',
        component: AdminCreate,
        path:'new',
        meta: {title: 'Add an Admin'}
      },
      {
        name: 'list-admin',
        component: AdminList,
        path:'list',
        meta: {title: 'All Users'}
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
