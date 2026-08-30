import {
  Button,
  Card,
  Column,
  Heading,
  Icon,
  Meta,
  Row,
  Schema,
  Text,
} from "@once-ui-system/core";
import { baseURL, about, person, publications } from "@/resources";

const papers = [
  {
    title:
      "Design and Implementation of a Real-Time Vehicle Overspeed Detection System Using YOLOv8, Optical Character Recognition, and Dual-Camera Analytics",
    date: "June 2025",
    href: "/publications.pdf",
  },
  {
    title:
      "Advanced Over-Speeding Detection System based on Time, Distance & Tyre Circumference",
    date: "October 2024",
    href: "/publications.pdf",
  },
];

export async function generateMetadata() {
  return Meta.generate({
    title: publications.title,
    description: publications.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(publications.title)}`,
    path: publications.path,
  });
}

export default function PublicationsPage() {
  return (
    <Column maxWidth="m" paddingTop="24" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={publications.path}
        title={publications.title}
        description={publications.description}
        image={`/api/og/generate?title=${encodeURIComponent(publications.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column maxWidth="s" horizontal="center" align="center" gap="12" marginBottom="xl">
        <Heading variant="heading-strong-xl">Publications</Heading>
        <Text onBackground="neutral-weak" variant="body-default-l">
          Peer-reviewed research on real-time vehicle overspeed detection systems.
        </Text>
      </Column>

      <Column fillWidth gap="16" marginBottom="l">
        {papers.map((paper, index) => (
          <Card
            key={index}
            href={paper.href}
            fillWidth
            direction="column"
            padding="l"
            gap="12"
            radius="l"
            background="surface"
            border="neutral-alpha-weak"
            transition="micro-medium"
          >
            <Row fillWidth horizontal="between" vertical="center" gap="12" wrap>
              <Text variant="label-strong-s" onBackground="brand-weak">
                Peer-reviewed paper
              </Text>
              <Text variant="body-default-s" onBackground="neutral-weak">
                {paper.date}
              </Text>
            </Row>
            <Heading as="h2" variant="heading-strong-m" wrap="balance">
              {paper.title}
            </Heading>
            <Row gap="8" vertical="center">
              <Icon name="document" onBackground="brand-weak" size="s" />
              <Text variant="body-default-s" onBackground="brand-weak">
                Read paper (PDF)
              </Text>
            </Row>
          </Card>
        ))}
      </Column>

      <Row horizontal="center">
        <Button
          href="/publications.pdf"
          prefixIcon="document"
          label="Download all papers (PDF)"
          variant="secondary"
          size="m"
        />
      </Row>
    </Column>
  );
}
