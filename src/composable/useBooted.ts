import { useAppStore } from '@/stores/app'
import { watch } from 'vue'

export const useWaitAppBooted = (func: () => void) => {
  const appStore = useAppStore()

  watch(
    () => appStore.booted,
    (done) => {
      if (done) {
        func()
      }
    },
    { immediate: true }
  )
}
