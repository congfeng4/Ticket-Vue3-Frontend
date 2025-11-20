
<template>
  <el-card>
    <h4>Regression Test</h4>
    <el-form :model="form" label-position="top">
      <el-form-item label="Regression Version">
        <el-input v-model="form.regression_version" />
      </el-form-item>

      <el-form-item label="Passed?">
        <el-switch v-model="form.passed" active-text="Passed" inactive-text="Failed" />
      </el-form-item>

      <el-form-item label="Test Report">
        <el-input type="textarea" v-model="form.report" rows="4" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="$emit('submit', form)">Submit Regression</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
const emits = defineEmits(['submit'])

const form = reactive({
  regression_version: '',
  passed: true,
  report: ''
})

</script>
