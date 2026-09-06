import styles from './workspace-page.module.scss';

export function WorkspacePage() {
  return (
    <div className={styles.page}>
      <aside className={styles.sidebar} />

      <main className={styles.main}>
        <header className={styles.header}>
          <div>HEADER</div>
        </header>
        <div className={styles.content}>
          <div>WORKSPACE CONTENT</div>
        </div>
      </main>
    </div>
  );
}
