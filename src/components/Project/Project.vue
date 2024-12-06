<template>
  <div class="flex flex-col gap-9">
    <!-- Contact Form Start -->
    <DefaultCard cardTitle="Project">
      <el-form
        label-position="top"
        :model="formData"
        label-width="120px"
        ref="formRef"
        :rules="formRules"
        class="p-6.5"
      >
        <el-row :gutter="20">
          <!-- Project Title -->
          <el-col :span="12">
            <el-form-item label="Project Title" prop="title">
              <el-input :disabled="!appStore.isPm()" v-model="formData.title"></el-input>
            </el-form-item>
          </el-col>

          <!-- Project Type -->
          <el-col :span="12">
            <el-form-item label="Project Type" prop="type_id">
              <el-select
                :disabled="!appStore.isPm()"
                v-model="formData.type_id"
                placeholder="Select Type"
              >
                <el-option
                  v-for="type in typeData"
                  :key="type.id"
                  :value="type.id"
                  :label="type.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <!-- Start Date -->
          <el-col :span="12">
            <el-form-item label="Start Date" prop="start_date">
              <el-date-picker
                :disabled="!appStore.isPm()"
                type="date"
                placeholder="Pick a date"
                v-model="formData.start_date"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                class="w-full"
              ></el-date-picker>
            </el-form-item>
          </el-col>

          <!-- End Date -->
          <el-col :span="12">
            <el-form-item label="End Date" prop="end_date">
              <el-date-picker
                :disabled="!appStore.isPm()"
                type="date"
                placeholder="Pick a date"
                v-model="formData.end_date"
                value-format="YYYY-MM-DD"
                format="YYYY-MM-DD"
                class="w-full"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- Project Status -->
        <el-form-item label="Project Status" prop="status_id">
          <el-select
            :disabled="!appStore.isPm()"
            v-model="formData.status_id"
            placeholder="Select Status"
          >
            <el-option
              v-for="status in projectStatusData"
              :key="status.id"
              :value="status.id"
              :label="status.name"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- Project Description -->
        <el-form-item label="Project Description" prop="description">
          <el-input
            :disabled="!appStore.isPm()"
            type="textarea"
            v-model="formData.description"
            rows="4"
            placeholder="Project Description"
          ></el-input>
        </el-form-item>

        <!-- Members -->
        <el-form-item label="Project Members" prop="members">
          <div
            v-for="(member, index) in formData.members"
            :key="index"
            class="mb-4 flex gap-3.5 w-full"
          >
            <!-- User -->
            <el-form-item class="flex-1" prop="members">
              <el-select
                :disabled="!appStore.isPm()"
                v-model="member.user_id"
                placeholder="Select Member"
                class="w-full"
              >
                <el-option
                  v-for="user in memberData"
                  :key="user.id"
                  :value="user.id"
                  :label="user.name"
                  :disabled="formData.members.filter((item) => item.user_id === user.id).length"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- Role -->
            <el-form-item class="flex-1" prop="role_id">
              <el-select
                :disabled="!appStore.isPm()"
                v-model="member.role_id"
                placeholder="Select Role"
              >
                <el-option
                  v-for="role in roleData"
                  :key="role.id"
                  :value="role.id"
                  :label="role.name"
                ></el-option>
              </el-select>
            </el-form-item>

            <!-- Delete Button -->
            <el-button
              v-if="formData.members.length > 1 && appStore.isPm()"
              @click="deleteMember(index)"
              type="danger"
              ><el-icon><Delete /></el-icon
            ></el-button>
          </div>
          <el-button v-if="appStore.isPm()" type="primary" plain @click.prevent="addMember"
            >Add Member</el-button
          >
        </el-form-item>

        <!-- Buttons -->
        <div class="flex justify-end gap-4">
          <el-button v-if="appStore.isPm()" plain type="success" @click="submitForm(formRef)">
            {{ route.params.id ? 'Update' : 'Create' }}
          </el-button>
        </div>
      </el-form>
    </DefaultCard>
    <!-- Contact Form End -->
  </div>
</template>

<style scoped>
:deep(.el-input.el-date-editor) {
  width: 100%;
}

:deep(.el-form-item__label) {
  font-weight: 700;
}
</style>

<script setup lang="ts">
import DefaultCard from '@/components/Forms/DefaultCard.vue'
import { onBeforeMount, reactive, ref } from 'vue'
import { useAppStore } from '@/stores/app'
import {
  authRequest,
  projectRequest,
  projectStatusRequest,
  roleRequest,
  typeRequest,
  userRequest
} from '@/request'
import { useRoute } from 'vue-router'
import { ElMessage, type FormInstance, vLoading } from 'element-plus'
import router from '@/router'

const route = useRoute()
const appStore = useAppStore()

const formRef = ref<FormInstance>()
const pageTitle = ref('Form Layout')

const listMember = ref([{}])

const memberData = ref([])

const roleData = ref([])

const typeData = ref([])

const projectStatusData = ref([])

const formData = ref({
  name: '123123',
  title: '',
  type_id: 1,
  description: '',
  members: [{}],
  status_id: 1,
  start_date: '',
  end_date: ''
})

const formRules = reactive({
  title: [
    { required: true, message: 'Please input project title', trigger: 'blur' },
    { max: 50, message: 'Project title cannot be longer than 50 characters', trigger: 'blur' }
  ],
  type_id: [{ required: true, message: 'Please select project type', trigger: 'change' }],
  start_date: [
    { required: true, message: 'Please select start date', trigger: 'change' },
    { type: 'date', message: 'Please select a valid date', trigger: 'blur' }
  ],
  end_date: [
    { required: true, message: 'Please select end date', trigger: 'change' },
    { type: 'date', message: 'Please select a valid date', trigger: 'blur' }
  ],
  status_id: [{ required: true, message: 'Please select project status', trigger: 'change' }],
  description: [{ required: true, message: 'Please input project description', trigger: 'blur' }],
  members: [
    { required: true, message: 'Please add project members', trigger: 'change' },
    { type: 'array', message: 'At least one member is required', trigger: 'blur' }
  ]
})

const addMember = () => {
  formData.value.members.push({})
}

const deleteMember = (index: number) => {
  formData.value.members.splice(index, 1)
}

const { login } = useAppStore()

const logout = () => {
  const b = authRequest.logout()
  appStore.$reset()
}

const getListType = async () => {
  typeData.value = (await typeRequest.list()).data
}

const getListUser = async () => {
  memberData.value = (await userRequest.list()).data
}

const getListRole = async () => {
  roleData.value = (await roleRequest.list()).data
}

const getDetailProject = async () => {
  formData.value = (await projectRequest.show(+route.params.id)).data.data
}

const getListProjectStatus = async () => {
  projectStatusData.value = (await projectStatusRequest.list()).data
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (isValid, invalidFields) => {
    if (isValid) {
      console.log('Submit Form')
      try {
        if (route.params.id) {
          formData.value.name = '123'
          await projectRequest.update(formData.value, route.params.id)
          ElMessage({
            type: 'success',
            message: `Update project ${route.params.id} success`
          })
        } else {
          await projectRequest.create(formData.value)
          ElMessage({
            type: 'success',
            message: 'Create project success'
          })
          formEl.resetFields()
          router.push('/projects')
        }
      } catch (e) {
        console.error(error)
        ElMessage({
          type: 'success',
          message: error
        })
      }
    } else {
      console.error(invalidFields)
    }
  })
}

onBeforeMount(async () => {
  // await login()
  try {
    await Promise.all([getListRole(), getListUser(), getListType(), getListProjectStatus()])

    if (route.params.id) {
      //
      await getDetailProject()
    }
  } catch (e) {
    console.log(e)
  }
})
</script>
