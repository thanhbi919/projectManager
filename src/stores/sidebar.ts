import { useStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSidebarStore = defineStore('sidebar', () => {
  const isSidebarOpen = ref(false)
  const selected = useStorage('selected', ref('eCommerce'))
  const page = useStorage('page', ref('Dashboard'))

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  function reset() {
    isSidebarOpen.value = false
    page.value = useStorage('page', ref('Dashboard'))
    selected.value = useStorage('selected', ref('eCommerce'))
  }

  return { isSidebarOpen, toggleSidebar, selected, reset }
})
