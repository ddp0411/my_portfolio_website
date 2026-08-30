import { Avatar, Button, Row } from "@once-ui-system/core";

import { about, home, person } from "@/resources";
import styles from "./Hero.module.scss";

const stats = [
  { value: "2", label: "Papers" },
  { value: "5", label: "Roles" },
  { value: "5+", label: "Projects" },
  { value: "92%", label: "Best model accuracy" },
];

/**
 * Home hero: full-bleed band with the copy on the left and the portrait
 * blended into the right edge. The blend is an alpha mask, not a fade to a
 * fixed colour, so the photo dissolves into whatever the page background is
 * and the section works unchanged in both light and dark mode.
 */
export function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.figure}>
        <img src="/images/hero/portrait.jpg" alt={person.name} fetchPriority="high" />
      </div>
      <div className={styles.inner}>
        {home.featured.display && (
          <a className={styles.badge} href={home.featured.href}>
            {home.featured.title}
          </a>
        )}
        <h1 className={styles.title}>{home.headline}</h1>
        <p className={styles.sub}>{home.subline}</p>
        <Button
          id="about"
          data-border="rounded"
          href={about.path}
          variant="secondary"
          size="m"
          weight="default"
          arrowIcon
        >
          <Row gap="8" vertical="center" paddingRight="4">
            {about.avatar.display && (
              <Avatar
                marginRight="8"
                style={{ marginLeft: "-0.75rem" }}
                src={person.avatar}
                size="m"
              />
            )}
            {about.title}
          </Row>
        </Button>
        <ul className={styles.stats}>
          {stats.map((stat) => (
            <li key={stat.label} className={styles.stat}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
