import { home, person } from "@/resources";
import styles from "./HeroBand.module.scss";

/**
 * Home hero: the portrait blended into a dark band. The band is a fixed dark
 * surface in both light and dark mode, so the photo blend looks identical
 * either way.
 */
export function HeroBand() {
  return (
    <section className={styles.band}>
      <div className={styles.glow} />
      <div className={styles.figure}>
        <img
          src="/images/hero/portrait.jpg"
          alt={person.name}
          fetchPriority="high"
          decoding="async"
        />
        <div className={styles.fade} />
      </div>
      <div className={styles.inner}>
        <div className={styles.rule} />
        <span className={styles.eyebrow}>{person.role} · Synthesys Solutions · Pune</span>
        <h1 className={styles.title}>{home.headline}</h1>
        <p className={styles.sub}>{home.subline}</p>
        <div className={styles.ctas}>
          <a className={`${styles.btn} ${styles.btnPrimary}`} href="/work">
            View work experience
          </a>
          <a className={`${styles.btn} ${styles.btnGhost}`} href="/projects">
            See projects
          </a>
        </div>
      </div>
    </section>
  );
}
