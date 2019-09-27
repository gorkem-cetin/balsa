<template>

</template>

<script>
  import {CONFIGURATIONS_QUERY} from "../../queries";

  export default {
    name: "ConfigurationAwareMixin",
    apollo: {
      configurations: {
        query: CONFIGURATIONS_QUERY
      },
    },
  }
</script>

<style scoped>

</style>
