<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { onMounted } from 'vue'

const { login } = useAppStore()
onMounted(() => {
  login()
})
</script>

<template>
  <RouterView />
</template>
