<script>
  /*
  A wrapper for Element UI's notification.
   */
  export default {
    name: "NotificationMixin",
    methods: {
      notifyError(errorMessage, additionalData) {
        let msg;
        if (errorMessage instanceof Error) {
          msg = errorMessage.message;
        } else {
          msg = errorMessage;
        }
        if (msg.toLocaleLowerCase().includes('graphql')) {
          msg = msg.split(':')[1]
        }
        this._showMessage(msg, 'error', additionalData)
      },
      notifySuccess(successMessage, additionalData) {
        this._showMessage(successMessage, 'success', additionalData)
      },
      notifyWarning(warningMessage, additionalData) {
        this._showMessage(warningMessage, 'warning', additionalData)
      },
      _showMessage(message, type, additionalData) {
        this.$message({
          showClose: true,
          duration: '3000',
          type,
          ...additionalData,
          message: message,
        });
      }
    }
  }
</script>

<style scoped>

</style>
