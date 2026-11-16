import { Heading, Text, Button, RevealFx, Column, Row, IconButton, SmartLink } from "@once-ui-system/core";
import { Schema, Meta } from "@/components/seo";
import { home, about, person, baseURL, social } from "@/resources";
import { Mailchimp, Hero } from "@/components";
import { Projects } from "@/components/work/Projects";
import { Posts } from "@/components/blog/Posts";
import React from "react";

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

      {/* Hero — full-bleed, breaks out of this column's width */}
      <Hero />

      {/* Featured work — top 2 projects */}
      <RevealFx translateY="16" delay={0.6} fillWidth>
        <Column fillWidth gap="l">
          <Row fillWidth horizontal="between" vertical="end">
            <Heading as="h2" variant="display-strong-xs">
              Featured work
            </Heading>
            <SmartLink href="/projects" suffixIcon="arrowRight">
              <Text variant="body-default-s">All projects</Text>
            </SmartLink>
          </Row>
          <Projects include={["neurorag", "advanced-overspeed-detection-system"]} columns="2" />
        </Column>
      </RevealFx>

      {/* Latest writing — two newest posts */}
      <RevealFx translateY="16" delay={0.65} fillWidth>
        <Column fillWidth gap="l">
          <Row fillWidth horizontal="between" vertical="end">
            <Heading as="h2" variant="display-strong-xs">
              Latest writing
            </Heading>
            <SmartLink href="/blog" suffixIcon="arrowRight">
              <Text variant="body-default-s">All posts</Text>
            </SmartLink>
          </Row>
          <Posts range={[1, 2]} columns="2" thumbnail direction="column" />
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
