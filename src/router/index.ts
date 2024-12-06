import { createRouter, createWebHistory } from 'vue-router'

import ECommerceView from '@/views/Dashboard/ECommerceView.vue'
import ProfileView from '@/views/ProfileView.vue'
import TaskDetail from '@/views/Tasks/TaskDetail.vue'
import TaskList from '@/views/Tasks/TaskList.vue'
import ProjectList from '@/views/Project/ProjectList.vue'
import CreateProject from '@/views/Project/CreateProject.vue'
import EditProject from '@/views/Project/EditProject.vue'
import TaskCreate from '@/views/Tasks/TaskCreate.vue'
import TaskEdit from '@/views/Tasks/TaskEdit.vue'
import Login from '@/views/Login.vue'
import { useAppStore } from '@/stores/app'
import TaskOverview from '@/views/Tasks/TaskOverview.vue'
import UserList from '@/views/Users/UserList.vue'
import UserDetail from '@/views/Users/UserDetail.vue'
import UserCreate from '@/views/Users/UserCreate.vue'

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/',
    component: ECommerceView,
    name: 'dashboard',
    meta: {
      title: 'Dashboard',
      auth: true
    }
  },
  {
    path: '/users',
    component: UserList,
    name: 'userList',
    meta: {
      title: 'User List',
      auth: true,
      permissions: ['admin']
    }
  },
  {
    path: `/users/:id`,
    component: UserDetail,
    name: 'userDetail',
    meta: {
      title: 'User Detail',
      auth: true,
      permissions: ['admin', 'pm']
    }
  },
  {
    path: `/users/create`,
    component: UserCreate,
    name: 'userCreate',
    meta: {
      title: 'Create User',
      auth: true,
      permissions: ['admin']
    }
  },
  {
    path: '/projects',
    component: ProjectList,
    name: 'projectList',
    meta: {
      title: 'Project List',
      auth: true
    }
  },
  {
    path: '/projects/create',
    component: CreateProject,
    name: 'createProject',
    meta: {
      title: 'Create Project',
      auth: true,
      permissions: ['admin']
    }
  },
  {
    path: '/projects/:id',
    component: EditProject,
    name: 'editProject',
    props: true,
    meta: {
      title: 'Project Detail',
      auth: true,
      permissions: ['pm']
    }
  },
  {
    path: '/tasks',
    component: TaskList,
    name: 'taskList',
    meta: {
      title: 'Task List',
      auth: true
    }
  },
  {
    path: '/tasks/overview',
    component: TaskOverview,
    name: 'taskOverview',
    meta: {
      title: 'Task Overview',
      auth: true
    }
  },
  {
    path: '/tasks/create',
    component: TaskCreate,
    name: 'taskCreate',
    meta: {
      title: 'eCommerce Dashboard',
      auth: true
    }
  },
  { path: '/tasks/:id', component: TaskDetail, name: 'taskDetail' },
  { path: '/tasks/edit/:id', component: TaskEdit, name: 'TaskEdit' },
  {
    path: '/',
    name: 'eCommerce',
    component: ECommerceView,
    meta: {
      title: 'eCommerce Dashboard',
      auth: true
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: 'Profile'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  }
})

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  const permission = localStorage.getItem('department')
  if (to.matched.some((record) => record.meta.auth)) {
    if (isLoggedIn !== 'true') {
      next('/login')
    } else if (to.meta.permissions?.includes(permission) || !to.meta?.permissions) {
      next()
    } else {
      next('/')
    }
  } else {
    next()
  }
})

export default router
