import { CONFIG } from 'src/config-global';
import ContactMessagePage from '../sections/contact-message';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Coupon - ${CONFIG.appName}`}</title>

      <ContactMessagePage />
    </>
  );
}
