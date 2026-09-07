import { Header } from '@/widgets/header';
import { Sidebar } from '@/widgets/sidebar';
import styles from './workspace-page.module.scss';

export function WorkspacePage() {
  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <Header />
        <div className={styles.content}>
          <div>WORKSPACE CONTENT</div>
        </div>
      </main>
    </div>
  );
}
