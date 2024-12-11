<template>
  <div class="flex items-center justify-center h-screen overflow-hidden">
    <div class="div2">
      <el-form class="p-10" :model="form" ref="formRef" label-width="100px">
        <div class="flex justify-center mb-10">
          <el-image class="ml-6 w-40 object-cover" src="src/assets/images/logo/logo.png">
          </el-image>
        </div>
        <!-- Email Input -->
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" type="email" placeholder="Enter your email"> </el-input>
        </el-form-item>

        <!-- Password Input -->
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            placeholder="6+ Characters, 1 Capital letter"
          >
          </el-input>
        </el-form-item>

        <!-- Submit Button -->
        <el-form-item>
          <el-button type="primary" class="w-full" @click="submitForm"> Sign In </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElForm, ElMessage } from 'element-plus'
import { useAppStore } from '@/stores/app'
import router from '@/router'

const form = reactive({
  email: '',
  password: ''
})

const formRef = ref<InstanceType<typeof ElForm>>()
const appStore = useAppStore()

const submitForm = () => {
  formRef.value?.validate(async (valid) => {
    if (valid) {
      console.log('Form Submitted:', form)
      await appStore.login(form)
    } else {
      console.log('Validation Failed')
    }
  })
}

const signInWithGoogle = () => {
  console.log('Redirecting to Google Sign-In...')
}
</script>

<style scoped>
/* Add any custom styling here */

.el-input {
  width: 250px;
}

.parent {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
}

.div1 {
  grid-area: 1 / 1 / 2 / 4;
}
.div2 {
  grid-area: 1 / 4 / 2 / 6;
  display: flex;
  align-items: center;
}
</style>
