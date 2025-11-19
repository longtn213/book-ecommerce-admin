import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'User',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Coupon',
    path: '/coupon',
    icon: icon('ic-coupon'),
  },
  {
    title: 'Category',
    path: '/category',
    icon: icon('ic-category'),
  },
  {
    title: 'Publisher',
    path: '/publisher',
    icon: icon('ic-publisher'),
  },
  {
    title: 'Author',
    path: '/author',
    icon: icon('ic-author'),
  },
  {
    title: 'Order',
    path: '/order',
    icon: icon('ic-order'),
  },
  {
    title: 'Book',
    path: '/book',
    icon: icon('ic-book'),
  },
  {
    title: 'Message',
    path: '/message',
    icon: icon('ic-message'),
  },
];
