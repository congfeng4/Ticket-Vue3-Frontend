
<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-card>
          <h3>Welcome</h3>
          <p>Technical Ticket System with AI-Insights. Use Tickets to create & manage flows.</p>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card>
          <h4>Quick actions</h4>
          <el-button type="primary" @click="$router.push({ name: 'TicketCreate' })">Create Ticket</el-button>
          <el-button @click="$router.push({ name: 'Tickets' })">View Tickets</el-button>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.container {
  max-width: 1100px;
}
</style>
