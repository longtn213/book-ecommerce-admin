import { CONFIG } from 'src/config-global';
import OrderPage from '../sections/order';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Order - ${CONFIG.appName}`}</title>
      <OrderPage/>
    </>
  );
}
