import { Column } from "@once-ui-system/core";
import { HeroC } from "../heroes";

export const metadata = { title: "Hero C — preview" };

export default function Page() {
  return (
    <Column maxWidth="m" paddingTop="24" horizontal="center" fillWidth>
      <HeroC />
    </Column>
  );
}
