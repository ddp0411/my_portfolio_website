import { Column } from "@once-ui-system/core";
import { HeroA } from "../heroes";

export const metadata = { title: "Hero A — preview" };

export default function Page() {
  return (
    <Column maxWidth="m" paddingTop="24" horizontal="center" fillWidth>
      <HeroA />
    </Column>
  );
}
