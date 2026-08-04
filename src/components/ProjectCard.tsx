"use client";

import {
  AvatarGroup,
  Column,
  Flex,
  Heading,
  Media,
  SmartLink,
  Text,
} from "@once-ui-system/core";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  priority,
  images = [],
  title,
  content,
  description,
  avatars,
  link,
}) => {
  const cover = images?.[0];

  return (
    <Column fillWidth gap="12">
      {cover && (
        <SmartLink href={href} style={{ width: "100%" }}>
          <Media
            priority={priority}
            sizes="(max-width: 960px) 100vw, 480px"
            border="neutral-alpha-weak"
            cursor="interactive"
            radius="l"
            aspectRatio="1 / 1"
            objectFit="cover"
            src={cover}
            alt={title}
          />
        </SmartLink>
      )}
      <Column gap="8" paddingX="8" paddingBottom="8">
        {title && (
          <Heading as="h2" wrap="balance" variant="heading-strong-l">
            {title}
          </Heading>
        )}
        {avatars?.length > 0 && <AvatarGroup avatars={avatars} size="s" reverse />}
        {description?.trim() && (
          <Text wrap="balance" variant="body-default-s" onBackground="neutral-weak">
            {description}
          </Text>
        )}
        <Flex gap="16" wrap paddingTop="4">
          {content?.trim() && (
            <SmartLink
              suffixIcon="arrowRight"
              style={{ margin: "0", width: "fit-content" }}
              href={href}
            >
              <Text variant="body-default-s">Read case study</Text>
            </SmartLink>
          )}
          {link && (
            <SmartLink
              suffixIcon="arrowUpRightFromSquare"
              style={{ margin: "0", width: "fit-content" }}
              href={link}
            >
              <Text variant="body-default-s">View project</Text>
            </SmartLink>
          )}
        </Flex>
      </Column>
    </Column>
  );
};
