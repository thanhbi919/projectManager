import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorage, useStorage } from '@vueuse/core'
import authRequest from '@/request/auth'
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
    async login() {
      try {
        const user = (
          await authRequest.login({ email: 'ngocanh_dev@gmail.com', password: 'ngocanh' })
        ).data

        if (user) {
          userData.value = user
        }

        isLoggedIn.value = true
        localStorage.setItem('isLoggedIn', true)
      } catch (e) {
        userData.value = undefined
        isLoggedIn.value = false
        localStorage.setItem('isLoggedIn', false)

        console.error(e)
      }
      return
    }
  }
})
