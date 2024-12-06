<template>
  <DefaultLayout>
    <!-- Breadcrumb Start -->
    <BreadcrumbDefault :pageTitle="'Users'" />
    <!-- Breadcrumb End -->
    <div v-if="appStore.booted && appStore.isPm()">
      <el-button @click="$router.push('users/create')" class="mb-5" type="primary">
        Create User
      </el-button>
    </div>
    <div class="text-black">
      <el-table :data="filterTableData" border>
        <el-table-column min-width="50" label="ID" prop="id"></el-table-column>
        <el-table-column min-width="250" label="Name" prop="name"></el-table-column>
        <el-table-column label="Email" min-width="200" prop="email"></el-table-column>
        <el-table-column label="Department" min-width="200" prop="department">
          <template #default="scope">{{ scope.row.department.name }}</template>
        </el-table-column>
        <el-table-column label="Created at" min-width="150" prop="created_at">
          <template #default="scope">{{
            moment(scope.row.created_at).format('YYYY-MM-DD')
          }}</template>
        </el-table-column>
        <el-table-column label="Updated at" min-width="150" prop="updated_at">
          <template #default="scope">{{
            moment(scope.row.update_at).format('YYYY-MM-DD')
          }}</template>
        </el-table-column>
        <el-table-column min-width="200" align="right">
          <template #header>
            <el-input v-model="search" size="small" placeholder="Type to search" />
          </template>
          <template #default="scope">
            <el-button
              size="small"
              @click="
                $router.push({
                  name: 'userDetail',
                  params: {
                    id: scope.row.id
                  }
                })
              "
            >
              Edit
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">
              Delete
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </DefaultLayout>
</template>

<script setup lang="ts">
import router from '@/router'
import DefaultLayout from '@/layouts/DefaultLayout.vue'
import BreadcrumbDefault from '@/components/Breadcrumbs/BreadcrumbDefault.vue'
import { useWaitAppBooted } from '@/composable/useBooted'
import { userRequest } from '@/request'
import { ref, computed } from 'vue'
import moment from 'moment'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAppStore } from '@/stores/app'

const tableData = ref([])

const getListUsers = async () => {
  tableData.value = (await userRequest.list()).data
}

const filterTableData = computed(() =>
  tableData.value.filter((data) => {
    // Nếu không có giá trị tìm kiếm, trả về tất cả dữ liệu
    if (!search.value) return true

    // Tìm kiếm theo name hoặc email
    const searchTerm = search.value.toLowerCase()
    return (
      (data.name && data.name.toLowerCase().includes(searchTerm)) ||
      (data.email && data.email.toLowerCase().includes(searchTerm)) ||
      (data.department?.name && data.department?.name.toLowerCase().includes(searchTerm))
    )
  })
)

const search = ref('')

useWaitAppBooted(async () => {
  await getListUsers()
})
const appStore = useAppStore()

const handleDelete = (id: number) => {
  ElMessageBox.confirm('Are you sure?', '', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    type: 'warning'
  })
    .then(async () => {
      if (id !== appStore.userData?.id) {
        try {
          await userRequest.delete(id)
          ElMessage({
            type: 'success',
            message: 'Delete success'
          })
          await getListUsers()
        } catch (e) {
          ElMessage({
            type: 'error',
            message: e
          })
        }
      } else {
        ElMessage({
          type: 'error',
          message: 'Cannot delete current user'
        })
      }
    })
    .catch(() => {})
}
</script>

<style scoped></style>
