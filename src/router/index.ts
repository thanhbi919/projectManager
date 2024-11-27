import { createRouter, createWebHistory } from 'vue-router'

import SigninView from '@/views/Authentication/SigninView.vue'
import SignupView from '@/views/Authentication/SignupView.vue'
import CalendarView from '@/views/CalendarView.vue'
import BasicChartView from '@/views/Charts/BasicChartView.vue'
import ECommerceView from '@/views/Dashboard/ECommerceView.vue'
import FormElementsView from '@/views/Forms/FormElementsView.vue'
import FormLayoutView from '@/views/Forms/FormLayoutView.vue'
import SettingsView from '@/views/Pages/SettingsView.vue'
import ProfileView from '@/views/ProfileView.vue'
import TablesView from '@/views/TablesView.vue'
import AlertsView from '@/views/UiElements/AlertsView.vue'
import ButtonsView from '@/views/UiElements/ButtonsView.vue'
import TaskDetail from '@/views/Tasks/TaskDetail.vue'
import TaskList from '@/views/Tasks/TaskList.vue'
import ProjectList from '@/views/Project/ProjectList.vue'
import CreateProject from '@/views/Project/CreateProject.vue'
import EditProject from '@/views/Project/EditProject.vue'
import WorkLogsView from '@/views/WorkLogs/WorkLogsView.vue'
import TaskCreate from '@/views/Tasks/TaskCreate.vue'
import TaskEdit from '@/views/Tasks/TaskEdit.vue'
import Login from '@/views/Login.vue'

const routes = [
  {
    path: '/login',
    component: Login,
    name: 'login'
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
      auth: true
    }
  },
  {
    path: '/projects/:id',
    component: EditProject,
    name: 'editProject',
    props: true,
    meta: {
      title: 'Edit Project',
      auth: true
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
    path: '/work-logs',
    name: 'workLogs',
    component: WorkLogsView,
    meta: {
      title: 'Work Logs'
    }
  },

  {
    path: '/calendar',
    name: 'calendar',
    component: CalendarView,
    meta: {
      title: 'Calendar'
    }
  },
  {
    path: '/profile',
    name: 'profile',
    component: ProfileView,
    meta: {
      title: 'Profile'
    }
  },
  {
    path: '/forms/form-elements',
    name: 'formElements',
    component: FormElementsView,
    meta: {
      title: 'Form Elements'
    }
  },
  {
    path: '/forms/form-layout',
    name: 'formLayout',
    component: FormLayoutView,
    meta: {
      title: 'Form Layout'
    }
  },
  {
    path: '/tables',
    name: 'tables',
    component: TablesView,
    meta: {
      title: 'Tables'
    }
  },
  {
    path: '/pages/settings',
    name: 'settings',
    component: SettingsView,
    meta: {
      title: 'Settings'
    }
  },
  {
    path: '/charts/basic-chart',
    name: 'basicChart',
    component: BasicChartView,
    meta: {
      title: 'Basic Chart'
    }
  },
  {
    path: '/ui-elements/alerts',
    name: 'alerts',
    component: AlertsView,
    meta: {
      title: 'Alerts'
    }
  },
  {
    path: '/ui-elements/buttons',
    name: 'buttons',
    component: ButtonsView,
    meta: {
      title: 'Buttons'
    }
  },
  {
    path: '/auth/signin',
    name: 'signin',
    component: SigninView,
    meta: {
      title: 'Signin'
    }
  },
  {
    path: '/auth/signup',
    name: 'signup',
    component: SignupView,
    meta: {
      title: 'Signup'
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

  if (to.matched.some((record) => record.meta.auth)) {
    console.log(isLoggedIn)
    if (isLoggedIn !== 'true') {
      next('/login')
    } else next()
  } else {
    next()
  }
})

export default router
