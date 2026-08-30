import styles from "./hero.module.scss";

// Copy is held identical across the three directions on purpose, so what
// you are comparing is the layout and treatment, not the words.
const EYEBROW = "Data Engineer · Synthesys Solutions · Pune";
const TITLE_A = "Transforming data";
const TITLE_B = "into decisions";
const SUB =
  "I'm Devanshu, a data engineer who turns complex datasets into clear, actionable insights — through machine learning, NLP, and generative AI, from data pipeline to deployed interface.";

export function HeroA() {
  return (
    <section className={styles.aBand}>
      <div className={styles.aGlow} />
      <div className={styles.aFigure}>
        <img src="/images/hero/portrait.jpg" alt="Devanshu Vijay Patil" />
        <div className={styles.aFade} />
      </div>
      <div className={styles.aInner}>
        <div className={styles.aRule} />
        <span className={`${styles.mono} ${styles.aEyebrow}`}>{EYEBROW}</span>
        <h1 className={styles.aTitle}>
          {TITLE_A}
          <br />
          <em>{TITLE_B}</em>
        </h1>
        <p className={styles.aSub}>{SUB}</p>
        <div className={styles.aCtas}>
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

export function HeroB() {
  return (
    <section className={styles.bWrap}>
      <div className={styles.bCopy}>
        <span className={`${styles.mono} ${styles.bEyebrow}`}>{EYEBROW}</span>
        <h1 className={styles.bTitle}>
          {TITLE_A} {TITLE_B}
        </h1>
        <p className={styles.bSub}>{SUB}</p>
        <div className={styles.aCtas}>
          <a className={`${styles.btn} ${styles.btnPrimary}`} href="/work">
            View work experience
          </a>
          <a
            className={styles.btn}
            style={{ border: "1px solid rgba(0,0,0,0.12)" }}
            href="/projects"
          >
            See projects
          </a>
        </div>
      </div>
      <div className={styles.bFigure}>
        <div className={styles.bHalo} />
        <img src="/images/hero/portrait.jpg" alt="Devanshu Vijay Patil" />
        <div className={styles.bBadge}>
          <span className={styles.bDot} />
          <span className={styles.mono}>Open to collaboration</span>
        </div>
      </div>
    </section>
  );
}

export function HeroC() {
  const meta = [
    { v: "2", l: "Published papers" },
    { v: "5", l: "Roles" },
    { v: "5+", l: "ML & AI projects" },
  ];
  return (
    <section className={styles.cWrap}>
      <div className={styles.cFigure}>
        <img src="/images/hero/portrait-duotone.jpg" alt="Devanshu Vijay Patil" />
        <div className={styles.cGrid} />
        <div className={styles.cFade} />
      </div>
      <div className={styles.cCopy}>
        <span className={`${styles.mono} ${styles.cEyebrow}`}>{EYEBROW}</span>
        <h1 className={styles.cTitle}>
          {TITLE_A} <em>{TITLE_B}</em>
        </h1>
        <p className={styles.cSub}>{SUB}</p>
        <div className={styles.cMeta}>
          {meta.map((m) => (
            <div key={m.l}>
              <span className={styles.cMetaV}>{m.v}</span>
              <span className={`${styles.mono} ${styles.cMetaL}`}>{m.l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
