
<template>
<el-card v-for="review in ticket.qa_reviews" :key="review?.id" style="margin-bottom:6px;">
  <div style="display:flex; justify-content:space-between; gap:12px;">
    <div>
      <div style="font-weight:600;">{{ review.reviewer.fullName }}</div>
      <div style="color:#666; font-size:13px; margin-top:2px;">
        Submitted:{{ new Date(review.created_at).toLocaleString() }}
      </div>
      <div style="margin-top:8px; color:#444;">{{ review?.comment || "No comment" }}</div>
    </div>

    <div style="text-align:right;">
      <el-tag
        :type="review?.agree_to_release ? 'success' : 'danger'"
        size="small"
      >
        {{ review?.agree_to_release ? "Approved" : "Rejected" }}
      </el-tag>
    </div>
  </div>
</el-card>
</template>

<script setup lang="ts">
import type { Ticket } from '../types'
const props = defineProps<{ ticket: Ticket }>()

</script>
