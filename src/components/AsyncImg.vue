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
  <div :class="'placeholder-glow crop ' + props.class">
    <span class="placeholder col-12" />
    <img :src="loadedSrc" class="img-fluid" />
  </div>
</template>

<style scoped>
.crop {
  min-height: 215px;
  height: inherit;
  overflow: hidden;
  position: relative;
}
.crop img {
  position: absolute;
  left: -100%;
  right: -100%;
  top: -100%;
  bottom: -100%;
  margin: auto;
  min-height: 100%;
  min-width: 100%;
}
.placeholder {
  height: 215px;
}
</style>
