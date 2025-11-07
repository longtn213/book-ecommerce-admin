import { CONFIG } from 'src/config-global';
import CouponsPage from '../sections/coupon';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Coupon - ${CONFIG.appName}`}</title>

      <CouponsPage />
    </>
  );
}
