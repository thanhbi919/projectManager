import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorage, useStorage } from '@vueuse/core'
import authRequest from '@/request/auth'
import router from '@/router'
import { ElMessage } from 'element-plus'
import { useWaitAppBooted } from '@/composable/useBooted'
import { useSidebarStore } from '@/stores/sidebar'
export const useAppStore = defineStore({
  id: 'app-store',
  state: () => {
    return {
      userData: {},
      isLoggedIn: false,
      booted: false
    }
  },
  actions: {
    async login(payload: { email: string; password: string }) {
      try {
        const user = (await authRequest.login(payload)).data
        console.log(user.data)
        if (user) this.userData = user.data
        this.isLoggedIn = true
        localStorage.setItem('isLoggedIn', true)
        localStorage.setItem('department', user.data.department.name)
        this.booted = true
        router.push('/')
      } catch (e) {
        console.log(e)
        ElMessage({
          type: 'error',
          message: 'Login Failed'
        })
      }
      return
    },
    async logout() {
      try {
        await authRequest.logout()
        localStorage.setItem('isLoggedIn', false)
        localStorage.setItem('department', undefined)
        this.$reset()
        const sideBar = useSidebarStore()
        sideBar.reset()
        router.push('/')
      } catch (e) {
        console.error(e)
      }
    },
    isAdmin() {
      let isAmdin = false
      useWaitAppBooted(() => {
        isAmdin = this.userData.department.name === 'admin'
      })
      return isAmdin
    },
    isPm() {
      let isPm = false
      useWaitAppBooted(() => {
        isPm = this.userData.department.name === 'pm' || this.userData.department.name === 'admin'
      })
      return isPm
    },
    isTester() {
      let isTester = false
      useWaitAppBooted(() => {
        isTester =
          this.userData.department.name === 'pm' ||
          this.userData.department.name === 'admin' ||
          this.userData.department.name === 'test'
      })
      return isTester
    }
  }
})
