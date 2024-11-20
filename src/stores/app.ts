import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useStorage } from '@vueuse/core'
import authRequest from '@/request/auth'
export const useAppStore = defineStore('app-store', () => {
  const isLoggedIn = useStorage('isLoggedIn', ref(false))

  const login = async () => {
    try {
      await authRequest.login({ email: 'thanhn1x@kaopiz.com', password: 'thanhnx' })

      isLoggedIn.value = true
    } catch (e) {
      console.error(e)
    }
    return
  }

  return { isLoggedIn, login }
})
