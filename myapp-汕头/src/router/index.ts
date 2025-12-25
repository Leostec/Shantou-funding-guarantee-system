import { createRouter, createWebHistory} from 'vue-router'
import axios from 'axios'
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
const ExpertReview = ()=>import('../views/ExpertReview/expertReview.vue')
const StaffEntries = ()=>import('../views/StaffEntries/staffEntries.vue')

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
        path:'/expert-review',
        name:'expertReview',
        component:ExpertReview,
      },
      {
        path:'/staff-entries',
        name:'staffEntries',
        component:StaffEntries,
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

const clearAuth = () => {
  localStorage.removeItem('authRole');
  localStorage.removeItem('authToken');
  localStorage.removeItem('username');
  localStorage.removeItem('department_name');
};

router.beforeEach(async (to, from, next) => {
  const authRole = localStorage.getItem('authRole');
  const authToken = localStorage.getItem('authToken');
  const isLoggedIn = !!authRole && !!authToken;
  if (to.path === '/') {
    next();
    return;
  }
  // 未登录统一跳转登录
  if (!isLoggedIn) {
    clearAuth();
    next({ path: '/' });
    return;
  }

  // 强化校验：需要携带令牌，并向后端校验有效性
  if (to.path.startsWith('/admin')) {
    try {
      const resp = await axios.get('http://127.0.0.1:5000/auth-check', {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (authRole !== 'admin' || resp.data?.role !== 'admin') {
        clearAuth();
        next({ path: '/' });
        return;
      }
    } catch (e) {
      clearAuth();
      next({ path: '/' });
      return;
    }
  }
  next();
});

export default router
