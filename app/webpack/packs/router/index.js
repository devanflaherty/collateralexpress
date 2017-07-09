import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

// Import Components
import ProjectIndex from '../projects/list.vue'
import ProjectForm from '../projects/form.vue'
import ProjectShow from '../projects/show.vue'

const router = new VueRouter ({
  mode: 'history',
  routes: [
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
  }, {
    name: 'show',
    path:'/project/:id',
    component: ProjectShow
  }]
})

// Set Document Title
router.beforeEach((to, from, next) => {
  var vueTitle = to.meta.title
  // if page has a set title do
  if (vueTitle) {
    console.log(to.meta.title)
    document.title = vueTitle + " | Collateral Express"
  }
  next()
})

export default router
