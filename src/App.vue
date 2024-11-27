<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { onMounted } from 'vue'
import { authRequest } from '@/request'

const appStore = useAppStore()
onMounted(async () => {
  try {
    const res = (await authRequest.currentUser()).data
    appStore.isLoggedIn = true
    appStore.userData = res
    localStorage.setItem('isLoggedIn', true)
  } catch (e) {
    // await appStore.login()
  } finally {
    appStore.booted = true
  }
})
</script>

<template>
  <RouterView />
</template>
