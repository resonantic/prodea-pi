<script setup lang="ts">
import { onMounted, ref } from "vue";

const props = defineProps<{
  class?: string;
  src: () => Promise<string>;
}>();

const loadedSrc = ref<string>("");

onMounted(async () => {
  const src = await props.src();
  loadedSrc.value = src;
});
</script>

<template>
  <img :src="loadedSrc" :class="props.class" />
</template>
