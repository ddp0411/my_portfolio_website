import { Column } from "@once-ui-system/core";
import { HeroB } from "../heroes";

export const metadata = { title: "Hero B — preview" };

export default function Page() {
  return (
    <Column maxWidth="m" paddingTop="24" horizontal="center" fillWidth>
      <HeroB />
    </Column>
  );
}
