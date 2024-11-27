import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorage, useStorage } from '@vueuse/core'
import authRequest from '@/request/auth'
import router from '@/router'
import { ElMessage } from 'element-plus'
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
        router.push('/')
      } catch (e) {
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
        router.push('/')
      } catch (e) {
        console.error(e)
      }
    }
  }
})
