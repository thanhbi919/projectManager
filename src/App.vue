<script setup lang="ts">
import { RouterView, useRouter } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { onMounted } from 'vue'
import { authRequest } from '@/request'

const router = useRouter()
const appStore = useAppStore()
onMounted(async () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn')
  console.log(isLoggedIn)
  if (isLoggedIn === 'true') {
    try {
      const res = (await authRequest.currentUser()).data
      appStore.isLoggedIn = true
      appStore.userData = res
      localStorage.setItem('isLoggedIn', true)
      localStorage.setItem('department', res.department.name)
      appStore.booted = true
    } catch (e) {
      router.push('login')
    }
  } else {
    router.push('login')
  }
})
</script>

<template>
  <RouterView />
</template>
<style>
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #f1f1f1;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #888;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>
