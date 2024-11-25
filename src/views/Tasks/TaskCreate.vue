<script setup lang="ts">
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import FormTask from '@/components/Task/FormTask.vue'
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="'Task Create'" />
    <!-- Breadcrumb End -->
    <FormTask></FormTask>
  </DefaultLayout>
</template>
