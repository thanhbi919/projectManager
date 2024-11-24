<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="pageTitle" />
    <!-- Breadcrumb End -->
  </DefaultLayout>
</template>

<script setup lang="ts">
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import Project from '@/components/Project/Project.vue'
import FormTask from '@/components/Task/FormTask.vue'
import { onBeforeMount, ref } from 'vue'
import { taskRequest } from '@/request'
import { useRoute } from 'vue-router'
import router from '@/router'
import { formatMinutesToTime } from '@/utils/time'
import {
  CircleCheck,
  Refresh,
  ChatLineRound,
  Upload,
  Warning,
  Close,
  Check
} from '@element-plus/icons-vue'

const formData = ref()
const getDetailTask = async () => {
  formData.value = (await taskRequest.show(route.params.id)).data
}

const pageTitle = ref('Task')
const route = useRoute()
onBeforeMount(() => {
  if (route.params.id) {
    getDetailTask()
  } else {
    router.back()
  }
})
const styleStatus = {
  open: { class: 'bg-gray-500', icon: Refresh }, // Open: Gray background with a refresh icon
  inprogress: { class: 'bg-blue-500', icon: ChatLineRound }, // In Progress: Blue background with a chat icon
  resolve: { class: 'bg-green-500', icon: Check }, // Resolved: Green background with a check icon
  deploy: { class: 'bg-purple-500', icon: Upload }, // Deployed: Purple background with an upload icon
  feedback: { class: 'bg-yellow-500', icon: Warning }, // Feedback: Yellow background with a warning icon
  reopen: { class: 'bg-red-500', icon: Close }, // Reopened: Red background with a close icon
  done: { class: 'bg-green-500', icon: CircleCheck } // Done: Teal background with a circle check icon
}

const stylePriority = {
  low: 'bg-green-500', // Low: Gray background with white text
  medium: 'bg-yellow-500', // Medium: Yellow background with white text
  high: 'bg-red-500' // High: Red background with white text
}
</script>

<style scoped></style>
