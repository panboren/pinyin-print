import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/page1/page1.vue')
    },
    {
      path: '/page1',
      name: 'page1',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/page1/page1.vue')
    },
    {
      path: '/page2',
      name: 'page2',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/page2/page2.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

router.beforeEach(async (to, from, next) => {
  if (import.meta.env.MODE !== 'production') {
    next()
    return
  }
  /* let userInfo = sessionStorage.getItem('userInfo');
  userInfo = userInfo ? JSON.parse(userInfo) : {};
  const store = useMeStore();
  if (userInfo?.userid) {
    next();
    return;
  }
  const url = window.location.href;
  const params = getCode(url) ?? {};
  if (params?.code) {
    const data = (await getCodeHttp(params?.code)) ?? {};
    if (data?.userid) {
      sessionStorage.setItem('userInfo', JSON.stringify(data));
      localStorage.setItem('userInfo', JSON.stringify(data));
      store.userInfo.value = data;
      return next();
    }
    showFailToast(`没有权限！${params} ${url} ${userInfo}`);
    return next(false);
  }
  window.open(wxUrl, '_self');*/
  return next(false)
})

export default router
