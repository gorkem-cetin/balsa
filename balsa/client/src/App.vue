<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
  import gql from 'graphql-tag';

  export default {
    name: 'app',
    components: {},
    data() {
      return {
        whiteList: ['login', 'sign-up', 'anonEditor', 'forgot-password-set', 'forgot-password', 'invite-sign-up'],
      };
    },
    created() {
      const token = localStorage.getItem('TOKEN');
      const darkTheme = localStorage.getItem('balsa-dark');
      if (darkTheme) document.querySelector('body').classList.add('dark');
      if (!token && !this.whiteList.includes(this.$route.name)) {
        this.$router.push({name: 'login'});
      }
    },
    apollo: {
      checkToken: {
        query: gql`
        query checkToken {
          checkToken {
            id
            role
          }
        }
      `,
        result({data}) {
          data = data.checkToken;
          if (!data && !this.whiteList.includes(this.$route.name)) {
            localStorage.removeItem('TOKEN');
            this.$router.push({name: 'login'});
          } else if (data && this.$route.meta.requiredAdmin && data.role !== 'Admin') {
            this.$router.push({name: 'login'});
          }
        },
      },
    },
  };
</script>
<style lang='scss'>
  @import './assets/sass/color.scss';

  .editor p.is-empty:first-child::before {
    content: attr(data-empty-text);
    float: left;
    color: #aaa;
    pointer-events: none;
    height: 0;
    font-style: italic;
  }

  .pale {
    color: $--color-select;
  }

  .line-height-normal {
    line-height: normal;
  }

  .balsa-link {
    font-size: 13px;
  }

  .color-orange {
    color: #fa7047;
  }

  .full-width {
    width: 100%;
  }

  .balsa-pading-left-5 {
    padding-left: 5px;
  }

  h1 {
    font-size: 30px;
    margin-bottom: 31px;

    color: #323f50;
  }

  .profile-container {
    margin-top: 70px;
  }

  .balsa-divider {
    height: 1px;
    width: 100%;
    background-color: #f1f2f4;
  }

  @media only screen and (max-width: 600px) {
    .profile-container {
      margin-top: 0;
    }
    .balsa-select .el-input__inner {
      padding: 0;
      text-align: left;
    }
  }
</style>


