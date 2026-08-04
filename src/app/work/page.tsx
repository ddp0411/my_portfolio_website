import { Column, Flex, Heading, Meta, Schema, Tag, Text, Row } from "@once-ui-system/core";
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

const dotStyle: React.CSSProperties = {
  position: "absolute",
  left: "-7px",
  top: "4px",
  width: "12px",
  height: "12px",
  borderRadius: "9999px",
  background: "var(--brand-background-strong)",
};

export default function Work() {
  const experiences = about.work.experiences;
  const institutions = about.studies.institutions;

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
          <Heading as="h2" variant="display-strong-s" marginBottom="l">
            {about.work.title}
          </Heading>
          <Column fillWidth marginBottom="xl">
            {experiences.map((experience, index) => {
              const isLast = index === experiences.length - 1;
              return (
                <Column
                  key={`${experience.company}-${experience.role}-${index}`}
                  fillWidth
                  paddingLeft="32"
                  paddingBottom={isLast ? undefined : "xl"}
                  style={{
                    position: "relative",
                    borderLeft: `2px solid ${isLast ? "transparent" : "var(--neutral-alpha-medium)"}`,
                  }}
                >
                  <Flex style={dotStyle} />
                  <Row
                    fillWidth
                    horizontal="between"
                    vertical="end"
                    gap="12"
                    marginBottom="4"
                    s={{ direction: "column", horizontal: "start", align: "start" }}
                  >
                    <Text variant="heading-strong-l">{experience.role}</Text>
                    <Text
                      variant="heading-default-xs"
                      onBackground="neutral-weak"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {experience.timeframe}
                    </Text>
                  </Row>
                  <Text variant="body-default-s" onBackground="brand-weak" marginBottom="m">
                    {experience.company}
                  </Text>
                  <Column as="ul" gap="12">
                    {experience.achievements.map((achievement: React.ReactNode, idx: number) => (
                      <Text as="li" variant="body-default-m" key={`${experience.company}-${idx}`}>
                        {achievement}
                      </Text>
                    ))}
                  </Column>
                  {experience.tech && experience.tech.length > 0 && (
                    <Row wrap gap="8" paddingTop="16">
                      {experience.tech.map((item, idx) => (
                        <Tag key={`${experience.company}-tech-${idx}`} size="s">
                          {item}
                        </Tag>
                      ))}
                    </Row>
                  )}
                </Column>
              );
            })}
          </Column>
        </>
      )}

      {about.studies.display && (
        <>
          <Heading as="h2" variant="display-strong-s" marginBottom="l">
            {about.studies.title}
          </Heading>
          <Column fillWidth>
            {institutions.map((institution, index) => {
              const isLast = index === institutions.length - 1;
              return (
                <Column
                  key={`${institution.name}-${index}`}
                  fillWidth
                  paddingLeft="32"
                  paddingBottom={isLast ? undefined : "l"}
                  gap="4"
                  style={{
                    position: "relative",
                    borderLeft: `2px solid ${isLast ? "transparent" : "var(--neutral-alpha-medium)"}`,
                  }}
                >
                  <Flex style={dotStyle} />
                  <Text variant="heading-strong-l">{institution.name}</Text>
                  <Text variant="heading-default-xs" onBackground="neutral-weak">
                    {institution.description}
                  </Text>
                </Column>
              );
            })}
          </Column>
        </>
      )}
    </Column>
  );
}
