<template>
</template>

<script>
  import NotificationMixin from './Mixins/NotificationMixin';

  export default {
  name: 'LogoutRouter',
  mixins: [NotificationMixin],
  mounted() {
    localStorage.removeItem('TOKEN');
    this.notifySuccess('Logged out successfully.');
    this.$router.push({ name: 'login' });
  },
};
</script>

