import Vue from 'vue';
import Router from 'vue-router';
import HomeRouter from './components/HomeRouter.vue';
//import FileFolderRouter from './components/FileFolderRouter.vue';
import EditorRouter from './components/EditorRouter.vue';
import ProfileRouter from './components/ProfileRouter.vue';
import SettingsRouter from './components/SettingsRouter.vue';
import TeamSettingsRouter from './components/TeamSettingsRouter.vue';
import LoginRouter from './components/LoginRouter.vue';
import LogoutRouter from './components/LogoutRouter.vue';
import SignUpRouter from './components/SignUpRouter.vue';
import ForgotPasswordRouter from './components/ForgotPasswordRouter.vue';
import ForgotPasswordSetRouter from './components/ForgotPasswordSetRouter.vue';
//import AnalyticsRouter from './components/AnalyticsRouter.vue';
import SystemRouter from './components/SystemRouter.vue';
import NotesRouter from './components/NotesRouter.vue';
import ConfigurationsRouter from './components/ConfigurationsRouter.vue';
import InviteSignUpRouter from './components/InviteSignUpRouter';
import Activities from './components/ActivitiesRouter.vue';
Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/profile',
      name: 'profile',
      component: ProfileRouter,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsRouter,
    },
    {
      path: '/team-settings',
      name: 'team-settings',
      component: TeamSettingsRouter,
      meta: {
        requiredAdmin: true,
      },
    },
    {
      path: '/login',
      name: 'login',
      component: LoginRouter,
    },
    {
      path: '/sign-up',
      name: 'sign-up',
      component: SignUpRouter,
    },
    {
      path: '/invite/:inviteCode',
      name: 'invite-sign-up',
      component: InviteSignUpRouter,
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutRouter,
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: ForgotPasswordRouter,
    },
    {
      path: '/forgot-password/:code',
      name: 'forgot-password-set',
      component: ForgotPasswordSetRouter,
    },
    // {
    //   path: '/analytics',
    //   name: 'analytics',
    //   component: AnalyticsRouter,
    // },
    {
      path: '/system',
      name: 'system',
      component: SystemRouter,
      meta: {
        requiredAdmin: true,
      },
    },
    {
      path: '/configurations',
      name: 'configurations',
      component: ConfigurationsRouter,
      meta: {
        requiredAdmin: true,
      },
    },
    {
      path: '/activities',
      name: 'activities',
      component: Activities,
    },
    {
      path: '/editor/:id',
      name: 'editor',
      component: EditorRouter,
    },
    {
      path: '/editor/:id/:inviteCode',
      name: 'anonEditor',
      component: EditorRouter,
    },
    {
      path: '/editor/:id/view/:publicViewCode',
      name: 'readOnlyEditor',
      component: EditorRouter,
    },
    {
      path: '/notes',
      name: 'Notes',
      component: NotesRouter,
    },
    {
      path: '/:id?',
      name: 'home',
      component: HomeRouter,
    },
  ],
});
