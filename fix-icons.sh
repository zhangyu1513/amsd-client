#!/bin/bash

# 修复 suits/index.vue
sed -i '' "1s/^/<script setup lang=\"ts\">\nimport { Search, Refresh, Plus, Download, Printer } from '@element-plus\/icons-vue'\n<\/script>\n/" src/views/workspace/suits/index.vue

# 修复 orders/index.vue  
sed -i '' "1s/^/<script setup lang=\"ts\">\nimport { Search, Refresh, Plus, Operation, Download, Printer } from '@element-plus\/icons-vue'\n<\/script>\n/" src/views/workspace/orders/index.vue

# 修复 processes/index.vue
sed -i '' "1s/^/<script setup lang=\"ts\">\nimport { Search, Refresh, Plus, VideoPlay, VideoPause, CloseBold, Download, Printer } from '@element-plus\/icons-vue'\n<\/script>\n/" src/views/workspace/processes/index.vue

echo "图标导入已修复"
