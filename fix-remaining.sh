#!/bin/bash

# 修复 suits/index.vue - 合并script标签
sed -i '' '/<script setup lang="ts">/,/<\/script>/d' src/views/workspace/suits/index.vue
sed -i '' '1s/^/<script setup lang="ts">\nimport { ref, reactive } from "vue"\nimport { ElMessage, ElMessageBox } from "element-plus"\nimport type { FormInstance, FormRules } from "element-plus"\nimport { Search, Refresh, Plus, Download, Printer } from "@element-plus\/icons-vue"\n/' src/views/workspace/suits/index.vue

# 修复 processes/index.vue - 合并script标签
sed -i '' '/<script setup lang="ts">/,/<\/script>/d' src/views/workspace/processes/index.vue
sed -i '' '1s/^/<script setup lang="ts">\nimport { ref, reactive } from "vue"\nimport { ElMessage } from "element-plus"\nimport { useRoute } from "vue-router"\nimport { Search, Refresh, Plus, VideoPlay, VideoPause, CloseBold, Download, Printer } from "@element-plus\/icons-vue"\n/' src/views/workspace/processes/index.vue

echo "剩余文件已修复"
