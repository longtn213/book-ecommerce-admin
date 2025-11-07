import { CONFIG } from 'src/config-global';
import CategoryPage from '../sections/category';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Category - ${CONFIG.appName}`}</title>

      <CategoryPage />
    </>
  );
}
