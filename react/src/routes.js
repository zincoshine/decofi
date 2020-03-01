import Home from 'components/Home';
import Admin from 'components/Admin';
import AdminCreateSocialFund from 'components/AdminCreateSocialFund';
import AdminAddMembers from 'components/AdminAddMembers';
import AdminPickLottery from 'components/AdminPickLottery';
import UserFundStake from 'components/UserFundStake';


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
