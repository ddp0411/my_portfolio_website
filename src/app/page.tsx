import {
  Heading,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
  Grid,
  IconButton,
  SmartLink,
  Schema,
  Meta,
} from "@once-ui-system/core";
import { home, about, person, baseURL, social } from "@/resources";
import { Mailchimp } from "@/components";
import { Projects } from "@/components/work/Projects";
import React from "react";

const highlights = [
  { value: "2", label: "Published papers" },
  { value: "5", label: "Internships & roles" },
  { value: "5+", label: "ML & AI projects" },
  { value: "92%", label: "Best model accuracy" },
];

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />

      {/* Hero */}
      <Column fillWidth horizontal="center" gap="m">
        <Column maxWidth="s" horizontal="center" align="center">
          {home.featured.display && (
            <RevealFx
              fillWidth
              horizontal="center"
              paddingTop="16"
              paddingBottom="32"
              paddingLeft="12"
            >
              <Badge
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2">{home.featured.title}</Row>
              </Badge>
            </RevealFx>
          )}
          <RevealFx translateY="4" fillWidth horizontal="center" paddingBottom="16">
            <Heading wrap="balance" variant="display-strong-l">
              {home.headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="center" paddingBottom="32">
            <Text wrap="balance" onBackground="neutral-weak" variant="heading-default-xl">
              {home.subline}
            </Text>
          </RevealFx>
          <RevealFx paddingTop="12" delay={0.4} horizontal="center" paddingLeft="12">
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
          </RevealFx>
        </Column>
      </Column>

      {/* Highlights strip */}
      <RevealFx translateY="8" delay={0.5} fillWidth>
        <Grid columns="4" s={{ columns: 2 }} fillWidth gap="12">
          {highlights.map((item) => (
            <Column
              key={item.label}
              fillWidth
              horizontal="center"
              align="center"
              gap="4"
              padding="l"
              radius="l"
              background="surface"
              border="neutral-alpha-weak"
            >
              <Heading variant="display-strong-s" onBackground="brand-medium">
                {item.value}
              </Heading>
              <Text variant="body-default-s" onBackground="neutral-weak" align="center">
                {item.label}
              </Text>
            </Column>
          ))}
        </Grid>
      </RevealFx>

      {/* Selected work — top 2 projects */}
      <RevealFx translateY="16" delay={0.6} fillWidth>
        <Column fillWidth gap="l">
          <Row fillWidth horizontal="between" vertical="end">
            <Heading as="h2" variant="display-strong-xs">
              Selected work
            </Heading>
            <SmartLink href="/projects" suffixIcon="arrowRight">
              <Text variant="body-default-s">All projects</Text>
            </SmartLink>
          </Row>
          <Projects include={["neurorag", "advanced-overspeed-detection-system"]} columns="2" />
        </Column>
      </RevealFx>

      {/* Newsletter */}
      <RevealFx translateY="16" delay={0.7} fillWidth>
        <Mailchimp />
      </RevealFx>

      {/* Contact */}
      <RevealFx translateY="16" delay={0.8} fillWidth>
        <Column
          fillWidth
          horizontal="center"
          align="center"
          gap="m"
          padding="xl"
          radius="l"
          background="surface"
          border="neutral-alpha-weak"
        >
          <Heading variant="display-strong-xs" wrap="balance" align="center">
            Let's work together
          </Heading>
          <Text
            onBackground="neutral-weak"
            variant="body-default-l"
            wrap="balance"
            align="center"
          >
            Have a role, project, or idea in mind? I'm open to data science and AI opportunities.
          </Text>
          <Button
            href={`mailto:${person.email}`}
            prefixIcon="email"
            label="Get in touch"
            variant="primary"
            size="m"
          />
          {social.length > 0 && (
            <Row gap="8" wrap horizontal="center" paddingTop="8" data-border="rounded">
              {social
                .filter((item) => item.essential)
                .map(
                  (item) =>
                    item.link && (
                      <React.Fragment key={item.name}>
                        <IconButton
                          href={item.link}
                          icon={item.icon}
                          size="l"
                          variant="secondary"
                          tooltip={item.name}
                        />
                      </React.Fragment>
                    ),
                )}
            </Row>
          )}
        </Column>
      </RevealFx>
    </Column>
  );
}
