import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useLocalStorage, useStorage } from '@vueuse/core'
import authRequest from '@/request/auth'
export const useAppStore = defineStore('app-store', () => {
  const isLoggedIn = useStorage('isLoggedIn', ref(false))
  const userId = useStorage('userId', ref())

  const login = async () => {
    try {
      const user = (await authRequest.login({ email: 'thanhn1x@kaopiz.com', password: 'thanhnx' }))
        .data

      if (user?.user_id) {
        userId.value = user.user_id
      }

      console.log(user)

      isLoggedIn.value = true
    } catch (e) {
      userId.value = undefined
      isLoggedIn.value = false
      console.error(e)
    }
    return
  }

  return { isLoggedIn, login, userId }
})
