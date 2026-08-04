import { Column, Heading, Meta, Schema, Text, Row } from "@once-ui-system/core";
import { baseURL, about, person, work } from "@/resources";
import React from "react";

export async function generateMetadata() {
  return Meta.generate({
    title: work.title,
    description: work.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(work.title)}`,
    path: work.path,
  });
}

export default function Work() {
  return (
    <Column maxWidth="m" paddingTop="24">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={work.path}
        title={work.title}
        description={work.description}
        image={`/api/og/generate?title=${encodeURIComponent(work.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column maxWidth="s" horizontal="center" align="center" gap="12" marginBottom="xl">
        <Heading variant="heading-strong-xl">Experience</Heading>
        <Text onBackground="neutral-weak" variant="body-default-l">
          My professional and academic journey — the roles I've held and where I've studied.
        </Text>
      </Column>

      {about.work.display && (
        <>
          <Heading as="h2" variant="display-strong-s" marginBottom="m">
            {about.work.title}
          </Heading>
          <Column fillWidth gap="l" marginBottom="xl">
            {about.work.experiences.map((experience, index) => (
              <Column key={`${experience.company}-${experience.role}-${index}`} fillWidth>
                <Row fillWidth horizontal="between" vertical="end" marginBottom="4">
                  <Text variant="heading-strong-l">{experience.company}</Text>
                  <Text variant="heading-default-xs" onBackground="neutral-weak">
                    {experience.timeframe}
                  </Text>
                </Row>
                <Text variant="body-default-s" onBackground="brand-weak" marginBottom="m">
                  {experience.role}
                </Text>
                <Column as="ul" gap="16">
                  {experience.achievements.map((achievement: React.ReactNode, idx: number) => (
                    <Text as="li" variant="body-default-m" key={`${experience.company}-${idx}`}>
                      {achievement}
                    </Text>
                  ))}
                </Column>
              </Column>
            ))}
          </Column>
        </>
      )}

      {about.studies.display && (
        <>
          <Heading as="h2" variant="display-strong-s" marginBottom="m">
            {about.studies.title}
          </Heading>
          <Column fillWidth gap="l">
            {about.studies.institutions.map((institution, index) => (
              <Column key={`${institution.name}-${index}`} fillWidth gap="4">
                <Text variant="heading-strong-l">{institution.name}</Text>
                <Text variant="heading-default-xs" onBackground="neutral-weak">
                  {institution.description}
                </Text>
              </Column>
            ))}
          </Column>
        </>
      )}
    </Column>
  );
}
