"use client";

import { mailchimp, newsletter } from "@/resources";
import { Button, Heading, Input, Text, Background, Column, Row } from "@once-ui-system/core";
import { opacity, SpacingToken } from "@once-ui-system/core";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export const Mailchimp: React.FC<React.ComponentProps<typeof Column>> = ({ ...flex }) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [touched, setTouched] = useState<boolean>(false);
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");
  const [honeypot, setHoneypot] = useState<string>("");

  const validateEmail = (value: string): boolean => {
    if (value === "") return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setError(validateEmail(value) ? "" : "Please enter a valid email address.");
    if (status === "error") setStatus("idle");
  };

  const handleBlur = () => {
    setTouched(true);
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!email || !validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setServerMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("success");
      } else {
        setStatus("error");
        setServerMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setServerMessage("Something went wrong. Please try again.");
    }
  };

  if (newsletter.display === false) return null;

  return (
    <Column
      overflow="hidden"
      fillWidth
      padding="xl"
      radius="l"
      marginBottom="m"
      horizontal="center"
      align="center"
      background="surface"
      border="neutral-alpha-weak"
      {...flex}
    >
      <Background
        top="0"
        position="absolute"
        mask={{
          x: mailchimp.effects.mask.x,
          y: mailchimp.effects.mask.y,
          radius: mailchimp.effects.mask.radius,
          cursor: mailchimp.effects.mask.cursor,
        }}
        gradient={{
          display: mailchimp.effects.gradient.display,
          opacity: mailchimp.effects.gradient.opacity as opacity,
          x: mailchimp.effects.gradient.x,
          y: mailchimp.effects.gradient.y,
          width: mailchimp.effects.gradient.width,
          height: mailchimp.effects.gradient.height,
          tilt: mailchimp.effects.gradient.tilt,
          colorStart: mailchimp.effects.gradient.colorStart,
          colorEnd: mailchimp.effects.gradient.colorEnd,
        }}
        dots={{
          display: mailchimp.effects.dots.display,
          opacity: mailchimp.effects.dots.opacity as opacity,
          size: mailchimp.effects.dots.size as SpacingToken,
          color: mailchimp.effects.dots.color,
        }}
        grid={{
          display: mailchimp.effects.grid.display,
          opacity: mailchimp.effects.grid.opacity as opacity,
          color: mailchimp.effects.grid.color,
          width: mailchimp.effects.grid.width,
          height: mailchimp.effects.grid.height,
        }}
        lines={{
          display: mailchimp.effects.lines.display,
          opacity: mailchimp.effects.lines.opacity as opacity,
          size: mailchimp.effects.lines.size as SpacingToken,
          thickness: mailchimp.effects.lines.thickness,
          angle: mailchimp.effects.lines.angle,
          color: mailchimp.effects.lines.color,
        }}
      />
      <Column maxWidth="xs" horizontal="center">
        <Heading marginBottom="s" variant="display-strong-xs">
          {newsletter.title}
        </Heading>
        <Text wrap="balance" marginBottom="l" variant="body-default-l" onBackground="neutral-weak">
          {newsletter.description}
        </Text>
      </Column>

      {status === "success" ? (
        <Column maxWidth={24} horizontal="center" align="center" gap="4">
          <Heading variant="heading-strong-m" onBackground="brand-weak">
            You're subscribed 🎉
          </Heading>
          <Text variant="body-default-s" onBackground="neutral-weak" align="center">
            Thanks for joining — I'll be in touch.
          </Text>
        </Column>
      ) : (
        <form
          style={{ width: "100%", display: "flex", justifyContent: "center" }}
          onSubmit={handleSubmit}
          noValidate
        >
          <Row fillWidth maxWidth={24} s={{ direction: "column" }} gap="8" vertical="center">
            <Input
              id="newsletter-email"
              name="email"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
              errorMessage={touched ? error : undefined}
            />
            {/* Honeypot — hidden from real users; bots that fill it are dropped */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              style={{ position: "absolute", left: "-5000px", width: 1, height: 1, opacity: 0 }}
            />
            <Button
              type="submit"
              size="m"
              fillWidth
              disabled={status === "loading" || !email || !!error}
            >
              {status === "loading" ? "Subscribing…" : "Subscribe"}
            </Button>
          </Row>
        </form>
      )}

      {status === "error" && serverMessage && (
        <Text marginTop="12" variant="body-default-s" onBackground="accent-weak" align="center">
          {serverMessage}
        </Text>
      )}
    </Column>
  );
};
