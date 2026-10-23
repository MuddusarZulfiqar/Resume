'use client';

import {
  Database,
  Rows3,
  ListTree,
  TreePine,
  Gauge,
  HardDrive,
  Zap,
  Terminal,
  BrainCog,
  KeyRound,
} from 'lucide-react';
import BlogShell from '@/components/blog/BlogShell';
import ScanAnimation from '@/components/blog/ScanAnimation';
import TreeLookupAnimation, { type TreeStep } from '@/components/blog/TreeLookupAnimation';
import { H2, P, UL, LI, Code, Callout, StatRow, CompareGrid } from '@/components/blog/Prose';

const MORE = [
  { href: '/blog/how-redis-caching-works', title: 'How Redis Caching Works', icon: Zap },
  { href: '/blog/how-to-use-redis-in-nodejs', title: 'Use Redis in a Node.js API', icon: Terminal },
  { href: '/blog/how-rag-works', title: 'How RAG Works', icon: BrainCog },
  { href: '/blog/how-jwt-works', title: 'How JWT Works', icon: KeyRound },
];

// Honest, small, fully-visualizable numbers: a 60-row table, target at row 54.
// The scan has to check up to 54 rows; the tree finds the same row in 5 comparisons.
const SCAN_TOTAL = 60;
const SCAN_MATCH_INDEX = 53; // 0-indexed → "row 54"

const TREE_STEPS: TreeStep[] = [
  {
    label: 'Root → 30',
    detail: '54 is greater than 30, so the entire left half of the table — everything below 30 — is ruled out in a single comparison.',
  },
  {
    label: '45',
    detail: '54 is greater than 45 too — another half of what was left just got discarded, without looking at a single row.',
  },
  {
    label: '53',
    detail: '54 is greater than 53 — down to a tiny sliver of the original 60 rows, in three comparisons.',
  },
  {
    label: '57',
    detail: '54 is less than 57 this time, so the lookup follows the other branch — one step from the leaf.',
  },
  {
    label: 'Row 54 — found',
    detail: 'Found it, in 5 comparisons total — against checking up to 54 rows one by one to get the exact same answer without an index.',
  },
];

export default function DatabaseIndexContent() {
  return (
    <BlogShell
      category="Databases"
      icon={Database}
      title={
        <>
          How database indexes <span className="text-accent">actually work.</span>
        </>
      }
      subtitle="Why the same query can take 400ms on one table and 2ms on another — traced through an actual table scan and an actual tree lookup."
      readTime="8 min read"
      more={MORE}
    >
      <P>
        A query that returns instantly on a 500-row table can take seconds once that table has 50
        million rows — and the usual instinct is to blame the server and reach for more CPU. Most of
        the time the real fix costs nothing extra: an{' '}
        <strong className="text-primary">index</strong>. It&rsquo;s the single change that turns
        &ldquo;check every row&rdquo; into &ldquo;jump straight to the answer,&rdquo; and it&rsquo;s
        worth actually understanding instead of adding by habit.
      </P>

      <Callout type="idea" title="The one-sentence version">
        An index is a separate, sorted copy of one column that lets the database jump straight to a
        row instead of checking every single one to find it.
      </Callout>

      <H2 id="scan">What happens without one — the table scan</H2>
      <P>
        No index means no shortcut. The database has exactly one option: look at every row, in
        order, until it finds what it&rsquo;s looking for. Here&rsquo;s that search happening on a
        small, honest table — 60 rows, with the match sitting near the end — so you can actually
        watch every check happen. Press play, or step through it yourself.
      </P>

      <ScanAnimation total={SCAN_TOTAL} matchIndex={SCAN_MATCH_INDEX} />

      <H2 id="index">What an index changes — a tree, not a table</H2>
      <P>
        Same table, same target row — but now there&rsquo;s a second structure sitting alongside it,
        built specifically to make this exact lookup fast. Watch how few comparisons it actually
        takes to land on the same row 54 the scan above had to crawl toward one by one.
      </P>

      <TreeLookupAnimation steps={TREE_STEPS} autoPlayMs={1300} />

      <H2 id="btree">Wait — what is a B-tree, really?</H2>
      <P>
        Think of a sorted phone book. To find &ldquo;Zulfiqar,&rdquo; you don&rsquo;t start at page 1
        and read every name — you flip to roughly the right section, see you&rsquo;re too early or
        too late, and narrow
        in from there. A B-tree is that same idea formalized: each node holds a handful of sorted
        values, and comparing against them tells you exactly which branch to follow next, discarding
        everything else in one comparison. Most relational databases build and rebalance this
        structure automatically — nobody hand-maintains it.
      </P>

      <StatRow
        stats={[
          { icon: Gauge, label: 'Without an index', value: 'O(n) — scales with rows' },
          { icon: TreePine, label: 'With a B-tree index', value: 'O(log n) — barely scales' },
          { icon: HardDrive, label: 'Typical storage cost', value: '+10–20% table size' },
        ]}
      />

      <H2 id="tradeoff">The tradeoff nobody mentions</H2>
      <P>
        An index isn&rsquo;t free — it&rsquo;s a second structure that has to stay in sync with the table, which
        means every write pays for it.
      </P>

      <CompareGrid
        left={{
          title: 'No index',
          icon: Rows3,
          points: [
            'Reads are slow and get slower as the table grows',
            'Writes are as fast as possible — nothing extra to update',
            'Zero additional storage',
            'Fine for small tables or columns rarely queried',
          ],
        }}
        right={{
          title: 'With an index',
          icon: ListTree,
          points: [
            'Reads stay fast almost regardless of table size',
            'Every INSERT / UPDATE / DELETE also updates the index',
            'Extra disk space — roughly 10–20% per indexed column',
            'Worth it the moment a column is queried often',
          ],
        }}
      />

      <Callout type="warning" title="Common mistake">
        Indexing every column &ldquo;just in case.&rdquo; Each extra index slows down every write a little more
        and burns disk space, often for a column nobody filters or sorts by. Indexes should match{' '}
        <em>real</em> query patterns — columns that show up in <Code>WHERE</Code>,{' '}
        <Code>JOIN</Code>, or <Code>ORDER BY</Code> clauses — not every column that looks important.
      </Callout>

      <H2 id="when">When to actually add one</H2>
      <UL>
        <LI>
          <strong className="text-primary">Columns filtered on often</strong> — anything that
          regularly shows up after <Code>WHERE</Code> in a hot query path.
        </LI>
        <LI>
          <strong className="text-primary">Foreign keys and join columns</strong> — lookups across
          tables lean on indexes constantly, and most databases don&rsquo;t add these automatically.
        </LI>
        <LI>
          <strong className="text-primary">High-cardinality columns</strong> — an index on{' '}
          <Code>email</Code> (mostly unique values) narrows the search fast. An index on a boolean{' '}
          <Code>is_active</Code> column barely narrows anything, since half the table shares each
          value.
        </LI>
        <LI>
          <strong className="text-primary">Columns used in ORDER BY</strong> — a matching index can
          let the database return rows already sorted, skipping a separate sort step entirely.
        </LI>
      </UL>

      <Callout type="tip" title="In practice">
        Don&rsquo;t guess — ask the database. Running <Code>EXPLAIN ANALYZE</Code> in front of a slow
        query shows exactly whether it used an index or fell back to a full scan, and how many rows
        it actually touched. It turns &ldquo;this query feels slow&rdquo; into a real, specific answer.
      </Callout>

      <H2 id="vs-caching">Indexing vs. caching, in one line</H2>
      <P>
        These solve the same underlying problem — reads being slow — from two different angles. An
        index makes the database itself faster at finding a row. A cache, like the Redis posts in
        this series cover, skips the database entirely for data that&rsquo;s been asked for recently.
        Mature systems lean on both: a well-indexed database as the source of truth, and Redis in
        front of it for the requests that don&rsquo;t need to touch the database at all.
      </P>
    </BlogShell>
  );
}
