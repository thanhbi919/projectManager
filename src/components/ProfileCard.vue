<template>
  <div
    class="overflow-hidden rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark px-4 py-12"
  >
    <el-form
      ref="userForm"
      :model="formData"
      :rules="rules"
      label-width="120px"
      class="user-form flex"
    >
      <div class="">
        <el-image class="w-40 object-cover" :src="formData.image"></el-image>
      </div>
      <div class="flex-1">
        <!-- Name -->
        <el-form-item label="Name" prop="name">
          <el-input v-model="formData.name" placeholder="Enter name"></el-input>
        </el-form-item>

        <!-- Email -->
        <el-form-item label="Email" prop="email">
          <el-input v-model="formData.email" placeholder="Enter email"></el-input>
        </el-form-item>

        <!-- Department -->
        <el-form-item label="Department" prop="department_id">
          <el-select
            :disabled="!appStore.isAdmin()"
            v-model="formData.department_id"
            placeholder="Select department"
          >
            <el-option
              v-for="department in departments"
              :key="department.id"
              :label="department.name"
              :value="department.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- Image -->
        <el-form-item label="Image" prop="image">
          <el-upload :auto-upload="false" @change="handleImageChange">
            <el-button type="primary">Upload Image</el-button>
          </el-upload>
        </el-form-item>
        <!-- Phone Number -->
        <el-form-item label="Phone Number" prop="phone_number">
          <el-input v-model="formData.phone_number" placeholder="Enter phone number"></el-input>
        </el-form-item>
      </div>
    </el-form>
    <div class="flex justify-end">
      <el-button class="block mr-0" type="primary" @click="submitForm">Save</el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { departmentRequest, imageRequest, userRequest } from '@/request'
import { useAppStore } from '@/stores/app'
import { useWaitAppBooted } from '@/composable/useBooted'

// Reactive form data
const formData = ref({
  name: undefined,
  email: undefined,
  department_id: undefined,
  image: undefined,
  phone_number: undefined
})
const fileInput = ref()
const appStore = useAppStore()

// Departments data
const departments = ref([])

// Validation rules
const rules = {
  name: [{ required: true, message: 'Name is required', trigger: 'blur' }],
  email: [
    { required: true, message: 'Email is required', trigger: 'blur' },
    { type: 'email', message: 'Invalid email format', trigger: 'blur' }
  ],
  department_id: [{ required: true, message: 'Please select a department', trigger: 'change' }],
  phone_number: [{ pattern: /^[0-9]+$/, message: 'Invalid phone number', trigger: 'blur' }]
}

// Fetch departments from API
const fetchDepartments = async () => {
  try {
    const response = await departmentRequest.list()
    departments.value = response.data.data
  } catch (error) {
    ElMessage.error('Failed to load departments.')
  }
}

// Handle image upload
const handleImageChange = async (file) => {
  const formImage = new FormData()
  formImage.append('image', file.raw)

  formData.value.image = (await imageRequest.create(formImage, true))?.data?.url
  // fileInput.value = file.raw || null // Save raw file for manual submission
}

const beforeUpload = (file) => {
  console.log(1, file)
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('The file must be an image!')
  }

  if (!isLt2M) {
    ElMessage.error('The file size must be less than 2MB!')
  }

  return isImage && isLt2M
}

// Submit the form
const userForm = ref(null)

const submitForm = () => {
  userForm.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await userRequest.update(formData.value, appStore.userData.id)
        ElMessage.success('User created successfully!')
      } catch (error) {
        console.log(error)
        ElMessage.error('An error occurred while creating the user.')
      }
    } else {
      ElMessage.error('Please complete the form before submitting.')
    }
  })
}

const getProfile = async () => {
  formData.value = (await userRequest.show(appStore.userData.id)).data.data
  delete formData.value.department
}

useWaitAppBooted(() => {
  fetchDepartments()
  getProfile()
})

// Fetch departments when the component is mounted
onMounted(() => {})
</script>

<style scoped>
:deep(img) {
  width: 200px;
  height: 200px;
  object-fit: cover !important;
}
</style>
