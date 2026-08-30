import { Column, Heading, Text } from "@once-ui-system/core";
import { HeroA, HeroB, HeroC } from "./heroes";
import styles from "./hero.module.scss";

export const metadata = { title: "Homepage hero — three directions" };

const options = [
  {
    name: "A · Editorial band",
    note: "Dark ground, figure standing at the baseline, warm photo against cyan accents.",
    node: <HeroA />,
  },
  {
    name: "B · Portrait column",
    note: "Keeps the light page. Photo in a soft container, melting into the background at its base.",
    node: <HeroB />,
  },
  {
    name: "C · Duotone poster",
    note: "Photo recoloured into the site palette and treated as a graphic block.",
    node: <HeroC />,
  },
];

export default function PreviewIndex() {
  return (
    <Column maxWidth="m" paddingTop="24" horizontal="center" fillWidth gap="xl">
      <Column maxWidth="s" horizontal="center" align="center" gap="12">
        <Heading variant="heading-strong-xl">Three homepage directions</Heading>
        <Text onBackground="neutral-weak" variant="body-default-l">
          Same words in all three, so what differs is the treatment.
        </Text>
      </Column>
      {options.map((o) => (
        <Column key={o.name} fillWidth gap="8">
          <div className={styles.label}>
            <span className={styles.labelName}>{o.name}</span>
            <span className={styles.labelNote}>{o.note}</span>
          </div>
          {o.node}
        </Column>
      ))}
    </Column>
  );
}
