import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from "../views/LoginView.vue"
import SignupView from "../views/SignupView.vue"
import StudentView from "../views/StudentView.vue"
import TutorView from "../views/TutorView.vue"
import TAView from "../views/TAView.vue"
import AdminView from "../views/AdminView.vue"
import Convenor from "../views/Convenor.vue"

const routes = [
  {
    path: '/',
    name: 'default',
    component: LoginView
  },
  {
    path: '/signup',
    name: 'signup',
    component: SignupView
  },
  {
    path: '/student',
    name: 'student',
    component: StudentView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/tutor',
    name: 'tutor',
    component: TutorView
  },
  {
    path: '/ta',
    name: 'ta',
    component: TAView
  },
  {
    path: '/admin',
    name: 'admin',
    component: AdminView
  },
  {
    path: '/convenor',
    name: 'convenor',
    component: Convenor
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
