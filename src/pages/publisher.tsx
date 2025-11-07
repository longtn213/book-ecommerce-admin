import { CONFIG } from 'src/config-global';
import PublisherPage from '../sections/publisher';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Publisher - ${CONFIG.appName}`}</title>

      <PublisherPage/>
    </>
  );
}