import Home from 'pages/Home';
import Admin from 'pages/Admin';
import AdminCreateSocialFund from 'pages/AdminCreateSocialFund';
import AdminAddMembers from 'pages/AdminAddMembers';
import AdminPickLottery from 'pages/AdminPickLottery';
import UserFundStake from 'pages/UserFundStake';


const routes = [
    {
        name: 'Home',
        path: '/',
        exact: true,
        component: Home,
    },
    {
        component: UserFundStake,
        name: 'User Stake Page',
        path: '/user/stake',
    },
    {
        component: AdminPickLottery,
        name: 'Pick Lottery Winner',
        path: '/admin/lottery',
    },
    {
        component: AdminAddMembers,
        name: 'Add Member Addresses',
        path: '/admin/addmembers',
    },
    {
        component: AdminCreateSocialFund,
        name: 'Create Social Fund',
        path: '/admin/createfund',
    },
    {
        name: 'Admin',
        path: '/admin/',
        component: Admin,
    },
];

export default routes;
