
<template>
  <el-card>
    <div style="display:flex; justify-content:space-between; gap:12px;">
      <div>
        <div style="font-weight:600;">{{ ticket.title }}</div>
        <div style="color:#666; font-size:13px;">{{ ticket.software_name }} · {{ ticket.software_version }} · Module: {{ ticket.module || '-' }}</div>
        <div style="margin-top:8px; color:#444;">{{ ticket.description }}</div>
      </div>

      <div style="text-align:right;">
        <el-tag :type="severityToType(ticket.severity)">{{ ticket.severity }}</el-tag>
        <div style="margin-top:8px; font-size:13px;">{{ ticket.current_status }}</div>
        <el-button size="small" style="margin-top:8px;" @click="$router.push({ name: 'TicketDetail', params: { id: ticket.id }})">Open</el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import type { Ticket } from '../types'
const props = defineProps<{ ticket: Ticket }>()

function severityToType(s: string) {
  switch (s) {
    case "HINT":
      return "info";
    case "NORMAL":
      return "primary";
    case "CRITICAL":
      return "danger";
    case "SEVERE":
      return "warning";
    default:
      return undefined;
  }
}
</script>
