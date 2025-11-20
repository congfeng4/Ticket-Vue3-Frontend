
<template>
<el-collapse accordion v-if="ticket.regression_tests && ticket.regression_tests.length > 0">
    <el-collapse-item
      v-for="regression in ticket.regression_tests"
      :key="regression.id"
      :name="regression.id"
    >
      <!-- Header -->
      <template #title>
        <el-space alignment="center">
          <div style="font-weight: 600">{{ regression.tester.fullName }}</div>
          <div style="color: #666; font-size: 13px; margin-top: 2px">
            · Submitted: {{ new Date(regression.created_at).toLocaleString() }} · 
            <el-tag :type="regression?.passed ? 'success' : 'danger'" size="small">
              {{ regression?.passed ? "Approved" : "Rejected" }}
            </el-tag>
          </div>
        </el-space>
      </template>

      <!-- Content -->
      <el-card shadow="never" class="mb-2">
        <h4 style="margin-top: 2px; margin-bottom: 8px;">Test Report</h4>
          <el-card shadow="never" style=" height: 200px; background: var(--el-fill-color-light); border-radius: 6px; " >
            <el-scrollbar style="height: 100%">
              <pre
                style="
                  margin: 0;
                  white-space: pre-wrap;
                  font-family: var(--el-font-family);
                  font-size: 13px;
                  line-height: 1.6;
                  color: var(--el-text-color-primary);
                "
                >{{ regression?.report || "No comment" }}</pre
              >
            </el-scrollbar>
        </el-card>
      </el-card>
    </el-collapse-item>
  </el-collapse>
</template>
<script setup lang="ts">
import type { Ticket } from '../types'
const props = defineProps<{ ticket: Ticket }>()

</script>
