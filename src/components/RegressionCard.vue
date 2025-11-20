
<template>
<el-card v-for="regression in ticket.regression_tests" :key="regression?.id" style="margin-bottom:6px;">
  <div style="display:flex; justify-content:space-between; gap:12px;">
    <div>
      <div style="font-weight:600;">{{ regression.tester.fullName }}</div>
      <div style="color:#666; font-size:13px; margin-top:2px;">
        Regression Version: {{ regression.regression_version }} <br> Submitted:
        {{ new Date(regression.created_at).toLocaleString() }}
      </div>
      <div style="margin-top:8px; color:#444;">{{ regression?.report || "No Regression Report" }}</div>
    </div>

    <div style="text-align:right;">
      <el-tag
        :type="regression?.passed ? 'success' : 'danger'"
        size="small"
      >
        {{ regression?.passed ? "Approved" : "Rejected" }}
      </el-tag>
    </div>
  </div>
</el-card>
</template>
<script setup lang="ts">
import type { Ticket } from '../types'
const props = defineProps<{ ticket: Ticket }>()

</script>
