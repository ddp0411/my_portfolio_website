import { Column, Heading, Text } from "@once-ui-system/core";
import { Meta, Schema } from "@/components/seo";
import { Mailchimp } from "@/components";
import { Posts } from "@/components/blog/Posts";
import { baseURL, blog, person } from "@/resources";

// Search-facing title and description. The on-page heading keeps blog.title.
const seoTitle = `Blog on data engineering, RAG & AI – ${person.name}`;
const seoDescription = `Notes by ${person.name} on RAG systems, AI agents, computer vision and data engineering: lessons from building real projects.`;

export async function generateMetadata() {
  return Meta.generate({
    title: seoTitle,
    description: seoDescription,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(seoTitle)}`,
    path: blog.path,
  });
}

export default function Blog() {
  return (
    <Column maxWidth="m" paddingTop="24" horizontal="center">
      <Schema
        as="blog"
        baseURL={baseURL}
        title={seoTitle}
        description={seoDescription}
        path={blog.path}
        image={`/api/og/generate?title=${encodeURIComponent(seoTitle)}`}
        author={{
          name: person.name,
          url: `${baseURL}/blog`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Column maxWidth="s" horizontal="center" align="center" gap="12" marginBottom="l">
        <Heading variant="heading-strong-xl">{blog.title}</Heading>
        <Text onBackground="neutral-weak" variant="body-default-l">
          {blog.description}
        </Text>
      </Column>
      <Column fillWidth flex={1} gap="40">
        <Posts columns="2" thumbnail direction="column" />
        <Mailchimp marginBottom="l" />
      </Column>
    </Column>
  );
}
