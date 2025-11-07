import { CONFIG } from 'src/config-global';
import AuthorPage from '../sections/author';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Publisher - ${CONFIG.appName}`}</title>

      <AuthorPage/>
    </>
  );
}
