---
title: "Four things I got wrong running analytics and automation for a SaaS"
subtitle: "Every n8n run was green. None of the four mistakes threw an error."
slug: "analytics-automation-mistakes-saas"
date: 2026-11-18
category: "Data Engineering"
format: "short-opinion"
reading_time: "4 min"
canonical_url: "https://www.devanshupatil.blog/blog/analytics-automation-mistakes-saas"
cover_image: "https://www.devanshupatil.blog/images/blog/analytics-automation/cover.jpg"
cover_caption: "Green across the board. Not a single PDF."
medium_topics: ["Data Engineering", "Automation", "n8n", "SQL", "Data Analytics"]
devto_tags: ["dataengineering", "automation", "sql", "analytics"]
status: final
# Medium: import from the live URL (medium.com/p/import) or paste the body below.
# Medium has no tables, so "How each one hid" is a list here.
---

![Every n8n node green, and an empty PDF at the end](https://www.devanshupatil.blog/images/blog/analytics-automation/cover.jpg)
*Green across the board. Not a single PDF.*

I had turned a 2 to 3 hour report into one button click. Then, during testing, that button did nothing for a few client orgs.

I opened n8n expecting red, and every execution in the log was green. As far as n8n knew, the workflow had worked. The users still had no PDF.

That was at one of my previous jobs, where I owned the analytics and automation layer of a SaaS platform for interior design studios: 30+ dashboards in Apache Superset and Metabase, plus the n8n automations. I made four mistakes there that never threw an error. Here is how each one hid, and what I check now.

> **The stack:** Superset and Metabase for dashboards, n8n for automation, APITemplate.io for branded PDFs, webhooks from the platform to start it all. Names, tables, and columns here are changed.

## 1. I trusted a green run

The report flow: a user clicks a button, a webhook fires, n8n runs that org's SQL through the Metabase node, and APITemplate.io renders the org's branded PDF.

The bug was an ID filter plus an IF node that checked the org ID with an "is true" condition. Most orgs passed. A few didn't, took the other branch, and that branch ended without doing anything, which n8n counts as a success.

We caught it in testing within hours, before any client saw it. Now the workflow checks the data and the response at each step, and any path that doesn't end in a PDF raises an alert.

> **The failure mode to watch for:** n8n calls a run green when no node errors, and a branch that ends early isn't an error. If a path can finish without producing what the user asked for, make it fail loudly.

## 2. I let nulls disappear inside filters

The data was messy: unstructured, stored inconsistently, full of empty fields. Cleaning it was a big part of the job, but the nulls that hurt most hid in the dashboard filters.

Filter by a field, and every row with a null in that field drops out. No error, and a missing row doesn't look like anything on a chart.

```sql
-- Filtering by status silently drops tasks with no status
select status, count(*)
from tasks
where status in ('Open', 'Done')
group by status;

-- Give the missing rows their own bucket
select coalesce(status, 'Missing') as status, count(*)
from tasks
group by 1;
```

The second query has no filter. The missing rows become their own bar, so nobody has to remember they exist.

![Same task data: the filtered chart shows Open 42 and Done 58; with a Missing bucket a third bar shows 23](https://www.devanshupatil.blog/images/blog/analytics-automation/null-filter-missing-bucket.png)
*Same data. The filtered chart silently drops 23 tasks with no status.*

## 3. I joined my way into bigger numbers

Two dashboards disagreed on the same metric. A one-to-many join had multiplied the rows: a project with ten tasks had its budget counted ten times.

```sql
-- Inflated: each project repeats once per task
select sum(p.budget)
from projects p
join tasks t on t.project_id = p.id;

-- The check that caught it: same number, raw table, no join
select sum(budget)
from projects;
```

If the two differ, the join is fanning out. I now run this check on every new metric before it reaches a dashboard.

![One project with budget 100000 joined to three tasks sums to 300000](https://www.devanshupatil.blog/images/blog/analytics-automation/join-fan-out.png)
*One project row joined to three tasks: the budget is counted three times.*

## 4. I built a chain that could trigger itself

The task automation removed the most repetitive work on the platform. Completing a task created the next one, and completing an activity triggered the following one.

Once, a single completion triggered the chain twice. n8n showed two clean runs, and the duplicate task sat in the project like any other.

The fix was a guard before every create: if the next task or activity already exists for that parent, stop. With chained automations, I now assume every trigger will arrive twice eventually.

![Before: one completion creates a duplicate task. After: an "already exists?" check stops it](https://www.devanshupatil.blog/images/blog/analytics-automation/task-chain-guard.png)
*Before: one completion, two tasks. After: check before creating.*

## How each one hid

- **Green run.** Looked like: every execution green. Really was: an IF node sent some orgs to a dead end. Now I: check each step and alert when there's no PDF.
- **Null filters.** Looked like: no error at all. Really was: filters dropped null rows. Now I: add a "Missing" bucket.
- **Join fan-out.** Looked like: dashboards disagreed. Really was: a one-to-many join repeated rows. Now I: compare against the raw table.
- **Chain trigger.** Looked like: a duplicate task. Really was: one completion fired twice. Now I: check before creating.

## What I'd tell myself on day one

**Green means nothing crashed.** It doesn't mean the user got their PDF.

**Every metric needs a raw count beside it.** When they disagree, believe the raw count.

**Make the missing visible.** A row that drops out of a filter becomes a number someone trusts by mistake.

What's the sneakiest silent failure you've shipped, and how did you catch it?

Related: [Five things I got wrong building an offline RAG system](https://www.devanshupatil.blog/blog/five-things-i-got-wrong-building-an-offline-rag-system) and [Setting up Claude Code properly: what I wish I'd known](https://www.devanshupatil.blog/blog/setting-up-claude-code-properly)

---

*Originally published at [devanshupatil.blog](https://www.devanshupatil.blog/blog/analytics-automation-mistakes-saas).*

*I write one of these whenever something breaks in an interesting way. Get the next one by email at [devanshupatil.blog](https://www.devanshupatil.blog), or find me on [LinkedIn](https://www.linkedin.com/in/devanshu-patil-8618b3222/). More of my code is on [GitHub](https://github.com/ddp0411).*
