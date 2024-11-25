<script setup lang="ts">
import Project from '@/components/Project/Project.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
</script>

<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="'Create Task'" />
    <!-- Breadcrumb End -->
    <Project></Project>
  </DefaultLayout>
</template>
