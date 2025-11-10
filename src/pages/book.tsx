import { CONFIG } from 'src/config-global';
import BookPage from '../sections/book/BookPage';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Book - ${CONFIG.appName}`}</title>

      <BookPage />
    </>
  );
}
