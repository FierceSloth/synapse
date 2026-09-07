import { Header } from '@/widgets/header';
import { NewDirective } from '@/widgets/new-directive';
import { Sidebar } from '@/widgets/sidebar';
import styles from './workspace-page.module.scss';

export function WorkspacePage() {
  return (
    <div className={styles.page}>
      <Sidebar />

      <main className={styles.main}>
        <Header />
        <div className={styles.content}>
          <NewDirective />
        </div>
      </main>
    </div>
  );
}
