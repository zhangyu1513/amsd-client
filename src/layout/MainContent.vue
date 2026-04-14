<script setup lang="ts">
interface Props {
  padding?: string
  background?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  padding: 'p-1',
  background: '',
  class: '',
})
</script>

<template>
  <main :class="['overflow-auto min-w-0', props.padding, props.background, props.class]" class="w-full h-full">
    <slot>
      <!-- 默认插槽，用于放置路由视图或其他内容 -->
      <router-view />
    </slot>
  </main>
</template>
