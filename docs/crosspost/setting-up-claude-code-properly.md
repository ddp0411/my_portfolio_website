---
title: "Setting up Claude Code properly: what I wish I'd known"
published: false
description: "CLAUDE.md, rules, skills, hooks, MCP and memory — what each one is for, what I got wrong about them, and the setup I'd build again from scratch."
tags: ai, productivity, devtools, claude
canonical_url: https://www.devanshupatil.blog/blog/setting-up-claude-code-properly
cover_image: https://www.devanshupatil.blog/images/blog/claude-code-setup/cover.jpg
---

The first week I used an AI coding agent seriously, I treated it like a very fast
autocomplete. Type a request, read the diff, move on. It worked, and I assumed
that was all there was.

The second week I started hitting the same walls repeatedly. It kept forgetting
conventions I'd explained the day before. It rebuilt things that already existed.
It occasionally did something I'd have blocked if I'd been watching.

None of those are model problems. They're setup problems, and the setup is a
genuinely separate skill from prompting. This post is what I'd tell myself at the
start — written so you can follow it whether this is day one or you've been
living in the terminal for months.

> ⚠️ **Check this against the docs**
>
> This tooling moves fast, and a lot of the setup advice circulating online — including some I followed — describes behaviour that has since changed. I've verified everything here against the official documentation at the time of writing, but verify before you copy.

## The mental model that made it click

There are three different things people lump together as "configuring Claude
Code," and they fail in different ways:

| You want | Use | Because |
| --- | --- | --- |
| Claude to know something, always | CLAUDE.md | Loaded every session. Context, not enforcement |
| Claude to know something, sometimes | Rules or skills | Loaded only when relevant. Saves context |
| Something to happen, every time | Hooks | Shell scripts at fixed lifecycle points. Deterministic |

That third row is the one that took me longest to internalise. **Instructions are
requests; hooks are guarantees.** If something must hold every single time — no
secrets in commits, formatting applied, a dangerous command blocked — writing it
in CLAUDE.md is the wrong tool. The model reads your instructions and genuinely
tries to follow them, but "usually" is not the standard you want for a policy.

## 1. CLAUDE.md — start here

A markdown file Claude reads at the start of every session. This is the single
highest-leverage thing you can set up, and it takes ten minutes.

Run `/init` and it generates a starting file by scanning your codebase. Then
refine it with what it couldn't discover on its own.

Where it can live, roughly broadest to most specific:

- `~/.claude/CLAUDE.md` — your personal preferences, every project
- `./CLAUDE.md` or `./.claude/CLAUDE.md` — the project, committed and shared
- `./CLAUDE.local.md` — your own project notes, gitignored
- Subdirectory `CLAUDE.md` files — loaded on demand when Claude works in there

That last one is worth knowing about if you have a monorepo. A `CLAUDE.md` inside
a subdirectory loads when Claude reads files there, not at launch — so backend
conventions don't consume context during frontend work.

### What I got wrong

**I wrote mine too long.** My first version was comprehensive and close to
useless. The guidance is to target **under 200 lines**, and the reason isn't just
token cost: a long file dilutes the instructions that matter. The rule that
mattered was sitting in a wall of text that was 90% irrelevant to whatever I was
doing.

**I wrote it vaguely.** "Format code properly" does nothing. "Use 2-space
indentation" works. The test I use now: *could someone else verify whether this
was followed?* If not, rewrite it.

> 💡 **When to add something**
>
> A good trigger: you've corrected the same thing twice. If you're typing a clarification you also typed last session, that belongs in CLAUDE.md. If it's a multi-step procedure rather than a fact, it belongs in a skill instead.

## 2. Rules — for instructions that only sometimes apply

Once CLAUDE.md starts straining against that 200-line target, the next move is
`.claude/rules/`. Each file covers one topic:

```text
.claude/rules/
├── code-style.md
├── testing.md
├── security.md
└── api-design.md
```

The feature that makes this worth doing is **path scoping**. Add frontmatter and
the rule only loads when Claude touches matching files:

```markdown
---
paths:
  - "src/api/**/*.ts"
---

# API conventions

- Every endpoint validates its input
- Errors use the standard response envelope
```

Rules without a `paths` field load every session, same as CLAUDE.md. Rules with
one load when Claude reads, writes or edits a matching file.

This was the change that most improved my setup. Before it, every session carried
every convention for every part of the codebase. After it, a frontend task loads
frontend rules and nothing else — which leaves more room for the thing that
actually matters, the code.

## 3. Skills — your own commands

This is where the biggest change has happened, and where most of the advice
floating around is out of date.

**Custom commands have been merged into skills.** The older format — a markdown
file at `.claude/commands/deploy.md` giving you `/deploy` — still works. But the
current format is a directory:

```text
.claude/skills/deploy/SKILL.md
```

Both give you `/deploy`. The skill version adds frontmatter options, the ability
for Claude to invoke it automatically when relevant, and a directory for
supporting files.

A minimal one:

```yaml
---
name: pr-checklist
description: Run the pre-PR review checklist against the current changes.
disable-model-invocation: true
---

Check each item and report PASS or FAIL:

1. No `any` types in changed files
2. No secrets or API keys committed
3. Tests exist for new business logic
4. Loading and error states handled in UI
5. Migrations reviewed for safety

Print a clear verdict per item, then an overall result.
```

Then `/pr-checklist` before you open a PR.

### Arguments

`$ARGUMENTS` captures everything after the command name. Positional access works
too — `$ARGUMENTS[0]` or the shorthand `$0`, `$1`, `$2`:

```yaml
---
name: migrate-component
description: Migrate a component from one language to another
---

Migrate the $0 component from $1 to $2.
Preserve all existing behaviour and tests.
```

Run `/migrate-component SearchBar JavaScript TypeScript` and the placeholders
fill in order. Multi-word values need quotes.

### The feature I didn't know existed

This one genuinely changed how I write skills. The `` !`command` `` syntax runs a
shell command *before* the skill content reaches Claude, and substitutes the
output in place:

```yaml
---
name: summarize-changes
description: Summarize uncommitted changes and flag anything risky.
---

## Current changes

!`git diff HEAD`

## Instructions

Summarize the above in three bullets, then list risks you notice.
```

Claude doesn't receive the instruction to run `git diff`. It receives the diff,
already inlined. The difference in output quality is larger than you'd expect,
because the model is reasoning over real data rather than deciding whether to go
and fetch it.

> 🚫 **One sharp edge**
>
> A failed injected command aborts the entire skill invocation — Claude never sees the content at all. If you inject something that legitimately exits non-zero, such as a check script that returns 1 when it finds problems, append || true.

### Controlling who can invoke what

Two frontmatter fields, and the distinction matters:

- `disable-model-invocation: true` — only you can run it. Use this for anything
  with side effects. You don't want Claude deciding to deploy because the code
  looked ready.
- `user-invocable: false` — only Claude can invoke it. Use this for background
  knowledge that isn't a meaningful command.

## 4. Hooks — the part I got most wrong

Hooks are shell commands that fire automatically at fixed points in the
lifecycle. They're configured in `.claude/settings.json` for a project or
`~/.claude/settings.json` for everything.

Three nesting levels: the **event**, a **matcher** that filters when it fires,
and the **handler** that runs.

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "${CLAUDE_PROJECT_DIR}/.claude/hooks/format.sh",
            "args": []
          }
        ]
      }
    ]
  }
}
```

### My first hook silently did nothing

I copied a config that read the edited file's path from an environment variable
called `$CLAUDE_TOOL_INPUT_FILE_PATH`. My linter ran against an empty string
every time and exited cleanly. Nothing in the interface suggested a problem.

**That variable doesn't exist.** Hooks receive a JSON object on **stdin**, and
you parse it:

```bash
#!/bin/bash
input=$(cat)
file_path=$(jq -r '.tool_input.file_path' <<<"$input")

[[ -n "$file_path" ]] || exit 0
npx prettier --write "$file_path" 2>/dev/null || true
```

The real path placeholders are `${CLAUDE_PROJECT_DIR}` for the project root and
`${CLAUDE_PLUGIN_ROOT}` inside a plugin. Use those to reference your scripts, and
read everything else from stdin.

### Exit codes are not what you'd guess

This is the detail I'd most want a beginner to know, because it's genuinely
counterintuitive:

| Exit code | What happens |
| --- | --- |
| 0 | Success. Print JSON to stdout for structured control |
| 2 | Blocking error. Blocks the action; stderr becomes the reason |
| 1 or anything else | Non-blocking error. The action proceeds anyway |

Exit **1** — the conventional Unix failure code — does not block. If your hook is
meant to enforce a policy and you exit 1, it fails open and you'll likely never
notice. Use `exit 2`.

A guard that blocks destructive commands:

```bash
#!/bin/bash
input=$(cat)
command=$(jq -r '.tool_input.command' <<<"$input")

if echo "$command" | grep -q 'rm -rf'; then
  echo "Blocked: destructive command" >&2
  exit 2
fi
exit 0
```

### Events worth knowing

There are many more than the handful usually listed. The ones I actually use:

**PreToolUse — before a tool runs**

Can block. This is where policy lives: dangerous commands, protected paths, anything that must not happen. Matches on tool name, and the optional `if` field narrows further, like `Bash(git *)`.

**PostToolUse — after a tool succeeds**

Can't block, the action already happened. Auto-format, lint, type-check. Exit 2 here shows your stderr to Claude so it can react.

**SessionStart — when a session begins**

Load current branch, open issues, recent CI results into context. Keep it fast — it runs every session.

**Stop and Notification — turn finished, input needed**

Desktop notifications so you can step away. Hooks run without a controlling terminal, so return a `terminalSequence` field rather than writing escape codes directly.

Run `/hooks` to see everything currently configured and where each one comes
from. I'd have found my broken hook a week earlier if I'd known that.

## 5. MCP servers — giving Claude real tools

MCP servers let Claude query your database, hit your API, or read live library
docs instead of guessing from training data. They're configured in `.mcp.json` at
your project root.

```json
{
  "mcpServers": {
    "fetch": {
      "command": "python3",
      "args": ["-m", "mcp_server_fetch"]
    }
  }
}
```

Their tools appear as `mcp__<server>__<tool>`, so you can write hooks that match
them — `mcp__.*__write.*` to catch any write operation from any server, for
instance.

> 🚫 **Learn this one from my mistake, not yours**
>
> I put a database connection string with its password directly into a committed .mcp.json, in a public repository. It sat there for weeks. Put credentials in environment variables, reference them as ${VAR}, commit a .mcp.json.example with the values blanked, and gitignore the real one. Removing a secret from the current files does not remove it from git history.

That mistake is also the cleanest argument for the hooks section above. A
five-line `PreToolUse` check catches a committed secret every single time. A
paragraph of instructions catches it sometimes.

## 6. Memory — two systems, not one

**CLAUDE.md** is what you write. **Auto memory** is what Claude writes: your
preferences, corrections you've given it, project context it can't derive from
the code.

Auto memory lives at `~/.claude/projects/<project>/memory/` — on your machine,
outside the repo, not committed. A `MEMORY.md` index plus topic files. The first
200 lines of the index load every session; topic files are read on demand.

Run `/memory` to browse it, edit it, or toggle it. It's plain markdown. I'd
recommend actually looking at what it has saved at least once — mine had
accumulated a preference I'd stated offhandedly months earlier and no longer
agreed with.

Two related commands worth knowing: `/context` shows which instruction files
loaded in the current session, which is the first thing to check when Claude
ignores a rule you're sure you wrote. And `/doctor` gives you a setup checkup.

## The setup I'd build on day one

Not all of it at once. In this order:

1. **Run `/init`**, then trim the result to the facts that matter. Ten minutes.
2. **Add one `PreToolUse` hook** that blocks commits containing credentials.
   Before you need it, not after.
3. **Write one skill** for the thing you type most often. Mine was a pre-PR
   checklist.
4. **Split rules by path** once CLAUDE.md passes 200 lines.
5. **Add a `PostToolUse` formatter** so you stop reviewing whitespace diffs.
6. **Add MCP servers** when you notice yourself pasting data in manually.

Everything beyond that is refinement.

## The thing underneath all of this

Each session starts with no memory of the last one. Every mechanism above exists
to compensate for that single fact — CLAUDE.md carries conventions forward, rules
carry them selectively, skills carry procedures, hooks carry guarantees the model
can't be relied on to remember, memory carries what you corrected.

Once that clicked, choosing between them stopped being guesswork. The question is
just: does this need to be known, known sometimes, or enforced?

---

*Written against the official Claude Code documentation as of October 2026.
Behaviour changes between versions — `/doctor` and `/hooks` will tell you what
your installation is actually doing, which beats trusting any blog post,
including this one.*

---

*Originally published at [devanshupatil.blog](https://www.devanshupatil.blog/blog/setting-up-claude-code-properly). I write about data engineering, RAG and AI there.*
