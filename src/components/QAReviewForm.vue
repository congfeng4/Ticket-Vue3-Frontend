
<template>
  <el-card>
    <h4>QA Review</h4>
    <el-form :model="form" label-position="top">
      <el-form-item label="Approve release?">
        <el-switch v-model="form.agree_to_release" active-text="Approve" inactive-text="Request changes" />
      </el-form-item>

      <el-form-item v-if="form.agree_to_release" label="Designate Tester">
        <el-select v-model="form.designated_tester" placeholder="Select tester">
          <el-option v-for="u in testers" :key="u.id" :label="u.fullName || u.username" :value="u.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="Comments">
        <el-input type="textarea" v-model="form.comment" rows="4" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="$emit('submit', form)">Submit Review</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '../services/api'
import type { User } from '../types'

const emits = defineEmits(['submit'])

const form = ref({
  agree_to_release: true,
  designated_tester: null as User | null,
  comment: ''
})

const testers = ref<User[]>([])
onMounted(async () => {
  const users = await api.listUsers()
  testers.value = users.filter((u: User) => u.role === 'TESTER')
})
</script>
