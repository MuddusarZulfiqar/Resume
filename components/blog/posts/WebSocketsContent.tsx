'use client';

import {
  Radio,
  User,
  Server,
  Users,
  ShieldCheck,
  Link2,
  Repeat,
  RefreshCw,
  ArrowLeftRight,
  ArrowRight,
  Gauge,
  Hash,
  Timer,
  BrainCog,
  KeyRound,
  Cookie,
  GitBranch,
  Zap,
  Terminal,
} from 'lucide-react';
import BlogShell from '@/components/blog/BlogShell';
import SequenceDiagram, { type SeqStep } from '@/components/blog/SequenceDiagram';
import { H2, P, UL, LI, Code, Callout, StatRow, CompareGrid } from '@/components/blog/Prose';

const MORE = [
  { href: '/blog/how-redis-caching-works', title: 'How Redis Caching Works', icon: Zap },
  { href: '/blog/how-to-use-redis-in-nodejs', title: 'Use Redis in a Node.js API', icon: Terminal },
  { href: '/blog/how-sessions-work', title: 'How Sessions Work', icon: Cookie },
  { href: '/blog/how-jwt-works', title: 'How JWT Works', icon: KeyRound },
];

const HANDSHAKE_ACTORS = [
  { label: 'Client', icon: User },
  { label: 'Server', icon: Server },
];

const HANDSHAKE_STEPS: SeqStep[] = [
  {
    kind: 'arrow',
    from: 0,
    to: 1,
    tone: 'request',
    label: 'GET /chat  Upgrade: websocket, Sec-WebSocket-Key: dGhlIHNhbXBsZQ==',
    detail: 'It starts as a completely normal HTTP request — just with extra headers asking the server to switch protocols instead of returning a page.',
  },
  {
    kind: 'self',
    actor: 1,
    icon: ShieldCheck,
    label: 'Confirm the upgrade is valid',
    detail: 'The server checks the Sec-WebSocket-Key header and computes the matching accept value — proof that both sides are deliberately opting into this, not a confused proxy.',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 0,
    tone: 'response',
    label: '101 Switching Protocols  Sec-WebSocket-Accept: s3pPLMBi...',
    detail: 'HTTP status 101 means exactly what it says: "agreed, we are no longer speaking HTTP on this connection."',
  },
  {
    kind: 'self',
    actor: 0,
    icon: Link2,
    label: 'Same TCP socket — now a WebSocket, and it stays open',
    detail: 'No new connection was made. The exact same TCP socket that carried the HTTP request keeps running, just speaking a different, much simpler framing from here on.',
  },
];

const BROADCAST_ACTORS = [
  { label: 'Client A', icon: User },
  { label: 'Server', icon: Server },
  { label: 'Client B', icon: Users },
];

const BROADCAST_STEPS: SeqStep[] = [
  {
    kind: 'arrow',
    from: 0,
    to: 1,
    tone: 'request',
    label: 'send("hey room, I\'m here")',
    detail: 'Client A sends a message over the already-open socket. No new request, no headers, no URL — just a frame of data.',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 2,
    tone: 'push',
    label: 'message: "hey room, I\'m here"',
    detail: "The server relays it straight to Client B. Client B never asked for this — it just arrives, over a socket that's been sitting idle.",
  },
  {
    kind: 'arrow',
    from: 2,
    to: 1,
    tone: 'request',
    label: 'send("typing…")',
    detail: 'Client B can send at any moment too — there is no "my turn" in a WebSocket connection, either side can speak whenever it wants.',
  },
  {
    kind: 'arrow',
    from: 1,
    to: 0,
    tone: 'push',
    label: 'message: "Client B is typing…"',
    detail: "Pushed straight to Client A. This is the entire point of WebSockets: the server can hand you data the instant it exists, not the instant you ask.",
  },
  {
    kind: 'self',
    actor: 1,
    icon: Repeat,
    label: 'No new connection, no new handshake — same open socket',
    detail: 'Every message above traveled over the one connection opened in the handshake. That is what makes this fast: zero per-message connection overhead.',
  },
];

export default function WebSocketsContent() {
  return (
    <BlogShell
      category="Real-Time"
      icon={Radio}
      title={
        <>
          How WebSockets <span className="text-accent">actually work.</span>
        </>
      }
      subtitle="What changes when a connection stops being request/response and stays open — traced through the handshake, and a message neither side asked for."
      readTime="8 min read"
      more={MORE}
    >
      <P>
        Every post in this series so far has shared one assumption: the client asks, the server
        answers, the connection closes. That model breaks down the moment you need a chat message,
        a live score, or another user&rsquo;s cursor to show up the instant it happens, not the next time
        someone thinks to ask. <strong className="text-primary">WebSockets</strong> fix this by
        turning the connection itself into something that just stays open — so the server can hand
        you data whenever it wants, not only when you request it.
      </P>

      <Callout type="idea" title="The one-sentence version">
        A WebSocket is one TCP connection that never hangs up after the first exchange — so either
        side can send a message at any moment, with no new request required.
      </Callout>

      <H2 id="the-problem">The problem: how do you get updates without asking?</H2>
      <P>
        Before WebSockets existed, the only tool was HTTP, and HTTP only moves in one direction per
        exchange — client asks, server answers, done. The workaround was{' '}
        <strong className="text-primary">polling</strong>: have the browser ask &ldquo;anything
        new?&rdquo; every few seconds, forever, whether or not the answer has changed. It works, but
        almost every request comes back empty, and real-time starts to mean{' '}
        <em>whatever your polling interval is</em>, not actually real-time.
      </P>

      <CompareGrid
        left={{
          title: 'Polling',
          icon: RefreshCw,
          points: [
            'Client repeatedly asks "anything new?" on a timer',
            'Most requests come back with nothing changed',
            'Update latency = however long you wait between polls',
            'A new HTTP request/response cycle, every single time',
          ],
        }}
        right={{
          title: 'WebSocket',
          icon: ArrowLeftRight,
          points: [
            'One connection, opened once, left open',
            'Server sends the instant there is something to send',
            'Update latency ≈ network latency, not a polling interval',
            'Zero connection overhead after the handshake',
          ],
        }}
      />

      <H2 id="handshake">Step one — the handshake that upgrades HTTP</H2>
      <P>
        A WebSocket connection is born as an ordinary HTTP request. The magic is in a few headers
        that ask the server to switch protocols on this same connection instead of responding
        normally.
      </P>

      <SequenceDiagram actors={HANDSHAKE_ACTORS} steps={HANDSHAKE_STEPS} autoPlayMs={2600} />

      <H2 id="whats-in-the-headers">Wait — is any of that encrypted?</H2>
      <P>
        No, and that trips people up. <Code>Sec-WebSocket-Key</Code> and{' '}
        <Code>Sec-WebSocket-Accept</Code> aren&rsquo;t security — they&rsquo;re a handshake ritual
        that stops a plain HTTP server (or a cache sitting in between) from accidentally treating a
        WebSocket upgrade as a normal request it doesn&rsquo;t understand. Actual encryption comes
        from running the handshake over HTTPS, which upgrades it to{' '}
        <Code>wss://</Code> instead of <Code>ws://</Code> — the exact same relationship as{' '}
        <Code>http://</Code> and <Code>https://</Code>.
      </P>

      <H2 id="broadcast">Step two — now either side can just talk</H2>
      <P>
        This is the part that has no real equivalent in a request/response world. Once the socket
        is open, a message can originate from the server with nothing from the client prompting it
        — and in a chat room, a message from one client gets relayed to another through the server.
      </P>

      <SequenceDiagram actors={BROADCAST_ACTORS} steps={BROADCAST_STEPS} autoPlayMs={2500} />

      <StatRow
        stats={[
          { icon: Hash, label: 'Handshake status', value: '101 Switching Protocols' },
          { icon: Timer, label: 'Typical heartbeat', value: 'Every ~30s' },
          { icon: Gauge, label: 'Per-message overhead', value: 'As little as 2 bytes' },
        ]}
      />

      <H2 id="heartbeats">Keeping the connection honest</H2>
      <P>
        An open socket can go quietly dead — a laptop sleeps, a phone switches networks, a corporate
        proxy silently drops idle connections — without either side getting a clean &ldquo;closed&rdquo;
        signal. The fix is a <strong className="text-primary">heartbeat</strong>: small ping/pong
        frames sent every 20–30 seconds. No pong back in time, and the server treats the connection
        as dead and cleans it up.
      </P>

      <Callout type="warning" title="Common mistake">
        Treating a WebSocket as something that just stays connected forever on its own. Networks
        drop connections constantly — mobile especially. Production code needs reconnection logic
        (with backoff) on the client and a heartbeat on the server, or you end up with UIs that
        silently stop updating and nobody notices until a user complains.
      </Callout>

      <H2 id="vs-sse">WebSocket vs. Server-Sent Events</H2>
      <P>
        If data only ever needs to flow server → client — a live feed, a progress bar, a notification
        stream — a full bidirectional WebSocket can be more than the job needs.{' '}
        <strong className="text-primary">Server-Sent Events (SSE)</strong> cover that narrower case
        over plain HTTP, with automatic reconnection built into the browser for free.
      </P>

      <CompareGrid
        left={{
          title: 'WebSocket',
          icon: ArrowLeftRight,
          points: [
            'True two-way — either side sends anytime',
            'Binary or text frames',
            'Needs its own reconnection logic',
            'Right fit: chat, multiplayer, collaborative editing',
          ],
        }}
        right={{
          title: 'Server-Sent Events',
          icon: ArrowRight,
          points: [
            'One-way — server to client only',
            'Plain text over a regular HTTP connection',
            'Browser reconnects automatically',
            'Right fit: notifications, live feeds, progress updates',
          ],
        }}
      />

      <H2 id="real-world">Where you&rsquo;ve already used this</H2>
      <UL>
        <LI>
          <strong className="text-primary">Chat and collaborative tools</strong> — messages,
          typing indicators, and live cursors (Google Docs, Figma) all ride on an open socket.
        </LI>
        <LI>
          <strong className="text-primary">Live data</strong> — stock tickers, sports scores, and
          multiplayer game state all need updates faster than any reasonable poll interval.
        </LI>
        <LI>
          <strong className="text-primary">Notifications</strong> — the little badge that updates
          without a page refresh is almost always a push over a persistent connection.
        </LI>
      </UL>

      <Callout type="tip" title="In practice">
        Most teams don&rsquo;t hand-roll the raw WebSocket API — libraries like Socket.IO add
        automatic reconnection, fallback transports, and room/broadcast helpers on top. And the
        moment you run more than one server instance, a message from a client on server A needs a
        way to reach a client connected to server B — which is exactly the Redis pub/sub problem
        from the caching posts in this series, repurposed as a message bus between servers.
      </Callout>
    </BlogShell>
  );
}
