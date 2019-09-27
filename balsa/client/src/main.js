import './assets/sass/main.scss';
import './assets/sass/element-variables.scss';
import 'element-ui/lib/theme-chalk/reset.css';
import './assets/balsa.css';
import './assets/dark-theme.css';
import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import router from './router';
import svgSpriteLoader from './helpers/svg-sprite-loader';
import VueApollo from 'vue-apollo';
import apolloClient from './apollo.client';
import Vuex from 'vuex';
import storeOptions from './store';
import VueClipboard from 'vue-clipboard2';
import locale from 'element-ui/lib/locale/lang/en';
import VueHtmlToPaper from 'vue-html-to-paper';

const __svg__ = {
  path: './assets/images/icons/*.svg',
  name: 'assets/images/[hash].sprite.svg',
};
svgSpriteLoader(__svg__.filename);
const options = {
  name: '_blank',
  specs: ['fullscreen=yes', 'titlebar=yes', 'scrollbars=yes'],
  styles: [
    'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css',
    'https://unpkg.com/kidlat-css/css/kidlat.css',
  ],
};
Vue.use(VueHtmlToPaper, options);
Vue.use(VueApollo);
Vue.use(ElementUI, { locale });
Vue.use(Vuex);
Vue.use(VueClipboard);
const store = new Vuex.Store(storeOptions);
Vue.config.productionTip = false;

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
});

new Vue({
  router,
  store,
  apolloProvider,
  render: h => h(App),
}).$mount('#app');
