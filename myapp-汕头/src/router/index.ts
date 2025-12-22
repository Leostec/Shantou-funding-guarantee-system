import { createRouter, createWebHistory} from 'vue-router'
import Layout from '../views/Layout/layout.vue'
import Login from '../views/login/login.vue'
import Information from '../views/Information/information.vue'

const Standard = ()=>import('../views/Standard/standard.vue')
const Result = ()=>import('../views/Result/order.vue')
const JikuListPackage = ()=>import('../views/Result/JikuList/jikupackage.vue')
const JikuIm = ()=>import('../views/Result/JikuList/jikuim.vue')
const LangqiaoPackage = ()=>import('../views/Result/LqList/Lqpackage.vue')
const Fjjyk = ()=>import('../views/Result/FjjykList/Fjjyk.vue')
const MyEntries = ()=>import('../views/MyEntries/myEntries.vue')
const ModelEvaluate = ()=>import('../views/ModelEvaluate/modelEvaluate.vue')

const routes = [
  {
    path:'/user',
    component:Layout,
    redirect:'/vis',
    children:[
      {
        path:'/user',
        name:'home',
        component:Information,
      },
      {
        path:'/standard',
        name:'standard',
        component:Standard,
      },
      {
        path:'/vis',
        name:'vis',
        component:()=>import('../views/Vis/vis.vue'),
      },
      {
        path:'/my-entries',
        name:'myEntries',
        component:MyEntries,
      },
      {
        path:'/model-evaluate',
        name:'modelEvaluate',
        component:ModelEvaluate,
      },
      {
        path:'/jiku',
        name:'jiku',
        component:Result,
        redirect:'/jiku/jiku-package',
        children:[
          {
            path:'jiku-package',
            component:JikuListPackage
          },
          {
            path:'jiku-im',
            component:JikuIm
          }
        ]
      },
      {
        path:'/lq',
        name:'廊桥',
        component:Result,
        children:[
          {
            path:'lq-package',
            component:LangqiaoPackage,
          }
        ]
      },
      {
        path:'/pqcj',
        name:'喷漆车间',
        component:Result,
        children:[{
          path:'pqcj-package',
          component:()=>import('../views/Result/PqcjList/Pqcjpackage.vue')
        }]
      },
      {
        path:'/fjjyk',
        name:'飞机加油口',
        component:Result,
        children:[
          {
            path:'fjjyk',
            component:Fjjyk,
          }
        ]
      },
      {
        path:'/hzl',
        name:'航站楼',
        component:Result,
        children:[
          {
            path:'hzl',
            component:()=>import('../views/Result/HzlList/Hzl.vue')
          },
        ]
      },
    ]
  },
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path:'/admin',
    name:'管理员界面',
    component:()=>import('../views/Admin/Admin.vue'),
  },
  {
    path:'/zcpg/:reportNumber',
    name:'Zcpg',
    component:()=>import('../views/Admin/zcpg.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const authRole = localStorage.getItem('authRole');
  const isLoggedIn = !!authRole;
  if (to.path === '/') {
    next();
    return;
  }
  // 未登录统一跳转登录
  if (!isLoggedIn) {
    next({ path: '/' });
    return;
  }
  // 非 admin 拒绝访问 admin 路由
  if (to.path.startsWith('/admin') && authRole !== 'admin') {
    next({ path: '/' });
    return;
  }
  next();
});

export default router
