import {
  MdDashboard as DashboardIcon,
  MdPerson as PersonIcon,
} from 'react-icons/lib/md';
import {
  FaCreditCard as DealsIcon,
  FaClipboard as InvoicesIcon,
} from 'react-icons/lib/fa';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import UsersIcon from '@material-ui/icons/Contacts';
import AgentsIcon from '@material-ui/icons/SupervisorAccount';
import AdminsIcon from '@material-ui/icons/RecentActors';
import ListingsIcon from '@material-ui/icons/Assignment';

export const adminSideLinks = [
  { name: 'Admin Dashboard', route: 'admin-dashboard', icon: DashboardIcon },
  /*
  {
    name: 'Profile',
    route: 'profile',
    icon: PersonIcon,
    iconFontSize: 28,
    iconLeft: '12px',
    iconLeftSmall: '5px',
  },
  */
  {
    name: 'The Vault',
    route: 'view-deals',
    icon: DealsIcon,
  },
  /*
  {
    name: 'Invoices',
    route: 'view-invoices',
    icon: InvoicesIcon,
    iconFontSize: 20,
  },
  */
  {
    name: 'Agents',
    route: 'view-agents',
    icon: AgentsIcon,
    iconFontSize: 24,
  },
  {
    name: 'Listings',
    route: 'admin-view-listings',
    icon: ListingsIcon,
    id: 'listings',
  },
  {
    name: 'New Developments',
    route: 'admin-view-developments',
    icon: ListingsIcon,
    id: 'newdevelopments',
  },
  /*
  {
    name: 'Customers',
    route: 'view-customers',
    icon: UsersIcon,
    iconFontSize: 24,
  },
  */
  {
    name: 'Admin',
    route: 'view-admin',
    icon: AdminsIcon,
    iconFontSize: 24,
  },
  {
    name: 'Log Out',
    icon: ExitToAppIcon,
    id: 'logout',
  },
];

export default adminSideLinks;
