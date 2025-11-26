<template>
  <el-card>
    <h4>Developer Report</h4>
    <el-form :model="form" label-position="top">
      <el-form-item label="Issue Type">
        <el-input v-model="form.issue_type" />
      </el-form-item>

      <el-form-item label="Root Cause">
        <el-input type="textarea" v-model="form.root_cause" :rows="4" />
      </el-form-item>

      <el-form-item label="Self-test report (text)">
        <el-input type="textarea" v-model="form.self_test_report" :rows="4" />
      </el-form-item>

      <el-form-item label="Self-test screenshot">
        <el-upload
          class="upload"
          action=""
          :auto-upload="false"
          :file-list="uploadList"
          list-type="picture-card"
          :on-change="onFileChange"
          :on-remove="onRemove"
          :on-preview="handlePreview"
          accept="image/*"
        >
          <i class="el-icon-plus"></i>
        </el-upload>

        <el-image-viewer
          v-if="previewUrl"
          :url-list="[previewUrl]"
          @close="previewUrl = null"
        />
      </el-form-item>

      <el-form-item label="Regression Version">
        <el-input v-model="form.regression_version" />
      </el-form-item>

      <el-form-item label="Module">
        <el-input v-model="form.module" />
      </el-form-item>

      <el-form-item label="GitHub PR URL">
        <el-input v-model="form.github_pr_url" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSubmit"
          >Submit to QA</el-button
        >
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";

const props = defineProps({});
const emits = defineEmits(["submit"]);

const form = reactive({
  issue_type: "",
  root_cause: "",
  self_test_report: "",
  regression_version: "",
  module: "",
  github_pr_url: "",
});
const uploadList = ref<any[]>([]);
const screenshotFile = ref<File | null>(null);
const previewUrl = ref<string | null>(null);

function onFileChange(file: any) {
  screenshotFile.value = file.raw; // only keep 1 file
  uploadList.value = [file]; // UI display
}

function onRemove() {
  screenshotFile.value = null;
  uploadList.value = [];
}
function handlePreview(file: any) {
  // file.url may be empty, so construct preview URL from raw
  previewUrl.value = file.url || URL.createObjectURL(file.raw);
}
async function onSubmit() {
  const files: File[] = [];
  if (screenshotFile.value) {
    files.push(screenshotFile.value);
  }

  emits("submit", form, files);
}

</script>
