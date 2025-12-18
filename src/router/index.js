import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/home/home.vue')
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('../views/home/home.vue')
    },
    {
      path: '/print',
      name: 'print',
      component: () => import('../views/print/print.vue')
    },
    {
      path: '/page1',
      name: 'page1',
      component: () => import('../views/page1/page1.vue')
    },
    {
      path: '/page2',
      name: 'page2',
      component: () => import('../views/page2/page2.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// 添加全局前置守卫
router.beforeEach(async (to, from, next) => {
  // 非生产环境直接放行
  if (import.meta.env.MODE !== 'production') {
    next()
    return
  }

  // 检查是否存在匹配的路由
  const matched = router.resolve(to).matched
  if (matched.length === 0) {
    // 如果没有匹配的路由，则重定向到首页
    next({ name: 'home' })
    return
  }

  /* 原有的权限验证逻辑 */
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
