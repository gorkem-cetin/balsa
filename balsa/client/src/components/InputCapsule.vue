<template>
  <div class="Balsacapsule" :class="size">
    <slot></slot>
  </div>
</template>

<script>
export default {
  props: {
    size: {
      type: String,
      required: false
    }
  }
};
</script>

<style>
.mid {
  width: 317px;
}
</style>
