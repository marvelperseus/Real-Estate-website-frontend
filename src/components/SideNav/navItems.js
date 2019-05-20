import {
  MdDashboard as DashboardIcon,
  MdPerson as PersonIcon,
} from 'react-icons/lib/md';
import {
  FaCreditCard as DealsIcon,
  FaClipboard as InvoicesIcon,
} from 'react-icons/lib/fa';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import AgentsIcon from '@material-ui/icons/SupervisorAccount';
import ListingsIcon from '@material-ui/icons/Assignment';

export const agentSideLinks = [
  { name: 'Dashboard', route: 'dashboard', icon: DashboardIcon },
  {
    name: 'Profile',
    route: 'profile',
    icon: PersonIcon,
    iconFontSize: 28,
    iconLeft: '12px',
  },
  { name: 'The Vault', route: 'deals', icon: DealsIcon },
  { name: 'Invoices', route: 'invoices', icon: InvoicesIcon, iconFontSize: 20 },
  { name: 'Agents', route: 'agents', icon: AgentsIcon, iconFontSize: 24 },
  { name: 'Listings',route: 'view-listings', icon: ListingsIcon, id: 'listings' },
  { name: 'Log Out', icon: ExitToAppIcon, id: 'logout' },
];

export default agentSideLinks;
