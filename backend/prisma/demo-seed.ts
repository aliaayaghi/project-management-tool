import * as bcrypt from 'bcrypt';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { ListStatus, PrismaClient } from '../generated/prisma/client';
import { getSqliteFilePath } from '../src/prisma/sqlite-url';

const prisma = new PrismaClient({
  adapter: new PrismaBetterSqlite3({ url: getSqliteFilePath() }),
});

const EMAIL = 'aliaa@boards.demo';
const PASSWORD = 'Demo@Boards#9Kx!';

async function main() {
  const passwordHash = bcrypt.hashSync(PASSWORD, 10);

  const user = await prisma.user.upsert({
    where: { email: EMAIL },
    update: { passwordHash },
    create: { name: 'Aliaa', email: EMAIL, passwordHash },
  });

  // ── Board 1: Product Roadmap ──────────────────────────────────────────────
  const roadmap = await prisma.board.create({
    data: {
      title: 'Product Roadmap',
      description: 'Feature planning and delivery across quarters',
      visibility: 'shared',
      ownerId: user.id,
    },
  });

  const [r1, r2, r3] = await Promise.all([
    prisma.projectList.create({ data: { boardId: roadmap.id, title: 'Backlog', status: 'todo', position: 1 } }),
    prisma.projectList.create({ data: { boardId: roadmap.id, title: 'In Progress', status: ListStatus.in_progress, position: 2 } }),
    prisma.projectList.create({ data: { boardId: roadmap.id, title: 'Shipped', status: 'done', position: 3 } }),
  ]);

  await prisma.card.createMany({
    data: [
      { boardId: roadmap.id, listId: r1.id, title: 'Dark mode for mobile app', description: 'Match the web theme on iOS and Android', position: 1 },
      { boardId: roadmap.id, listId: r1.id, title: 'Notification preferences', description: 'Let users choose which alerts they receive', position: 2 },
      { boardId: roadmap.id, listId: r1.id, title: 'CSV export for boards', description: 'Download all cards as a spreadsheet', position: 3 },
      { boardId: roadmap.id, listId: r1.id, title: 'Public board sharing', description: 'Read-only link anyone can view without signing in', position: 4 },
      { boardId: roadmap.id, listId: r2.id, title: 'Drag-and-drop list reordering', description: 'Let users move columns left and right', position: 1 },
      { boardId: roadmap.id, listId: r2.id, title: 'Card due dates', description: 'Attach a deadline to any card and highlight overdue ones', position: 2 },
      { boardId: roadmap.id, listId: r2.id, title: 'Board search', description: 'Find cards across all lists with a single query', position: 3 },
      { boardId: roadmap.id, listId: r3.id, title: 'User registration and login', description: 'JWT-based auth with bcrypt hashing', position: 1 },
      { boardId: roadmap.id, listId: r3.id, title: 'Board dashboard', description: 'Grid view of all boards with search and filters', position: 2 },
      { boardId: roadmap.id, listId: r3.id, title: 'Card drag between lists', description: 'HTML5 drag-and-drop for card movement', position: 3 },
    ],
  });

  // ── Board 2: Marketing Sprint ─────────────────────────────────────────────
  const marketing = await prisma.board.create({
    data: {
      title: 'Marketing Sprint',
      description: 'Q3 campaign planning and execution',
      visibility: 'shared',
      ownerId: user.id,
    },
  });

  const [m1, m2, m3] = await Promise.all([
    prisma.projectList.create({ data: { boardId: marketing.id, title: 'To Do', status: 'todo', position: 1 } }),
    prisma.projectList.create({ data: { boardId: marketing.id, title: 'In Progress', status: ListStatus.in_progress, position: 2 } }),
    prisma.projectList.create({ data: { boardId: marketing.id, title: 'Done', status: 'done', position: 3 } }),
  ]);

  await prisma.card.createMany({
    data: [
      { boardId: marketing.id, listId: m1.id, title: 'Write 3 blog posts for launch', description: 'Topics: onboarding tips, team productivity, and case study', position: 1 },
      { boardId: marketing.id, listId: m1.id, title: 'Set up email drip campaign', description: 'Welcome sequence — 5 emails over 2 weeks', position: 2 },
      { boardId: marketing.id, listId: m1.id, title: 'Design social media assets', description: 'Cover images and post templates for LinkedIn and X', position: 3 },
      { boardId: marketing.id, listId: m2.id, title: 'Landing page copy', description: 'Hero, features, pricing, and FAQ sections', position: 1 },
      { boardId: marketing.id, listId: m2.id, title: 'Analytics dashboard setup', description: 'Connect GA4 and build a conversion funnel report', position: 2 },
      { boardId: marketing.id, listId: m3.id, title: 'Brand guidelines document', description: 'Colors, typography, logo usage, and tone of voice', position: 1 },
      { boardId: marketing.id, listId: m3.id, title: 'SEO keyword research', description: 'Identified 40 target keywords across 3 content clusters', position: 2 },
      { boardId: marketing.id, listId: m3.id, title: 'Competitor analysis', description: 'Reviewed 6 direct competitors and mapped their positioning', position: 3 },
    ],
  });

  // ── Board 3: Bug Tracker ──────────────────────────────────────────────────
  const bugs = await prisma.board.create({
    data: {
      title: 'Bug Tracker',
      description: 'Open issues and fixes across web and API',
      visibility: 'private',
      ownerId: user.id,
    },
  });

  const [b1, b2, b3, b4] = await Promise.all([
    prisma.projectList.create({ data: { boardId: bugs.id, title: 'Reported', status: 'todo', position: 1 } }),
    prisma.projectList.create({ data: { boardId: bugs.id, title: 'Reproducing', status: 'todo', position: 2 } }),
    prisma.projectList.create({ data: { boardId: bugs.id, title: 'Fixing', status: ListStatus.in_progress, position: 3 } }),
    prisma.projectList.create({ data: { boardId: bugs.id, title: 'Closed', status: 'done', position: 4 } }),
  ]);

  await prisma.card.createMany({
    data: [
      { boardId: bugs.id, listId: b1.id, title: 'Login redirect broken on mobile Safari', description: 'After login the app stays on /login instead of going to /', position: 1 },
      { boardId: bugs.id, listId: b1.id, title: 'Pagination breaks when search is active', description: 'Page 2 returns 0 results while page 1 has fewer than the limit', position: 2 },
      { boardId: bugs.id, listId: b1.id, title: 'Board count badge shows stale number', description: 'Deleting a board does not decrement the sidebar counter', position: 3 },
      { boardId: bugs.id, listId: b2.id, title: 'Dark mode flicker on hard refresh', description: 'Theme flashes light before the saved preference is read', position: 1 },
      { boardId: bugs.id, listId: b2.id, title: 'Drag ghost image offset on high-DPI screens', description: 'Cursor is misaligned from the ghost by ~20px on Retina displays', position: 2 },
      { boardId: bugs.id, listId: b3.id, title: 'Card position wrong after quick reorder', description: 'Rapid back-to-back moves produce duplicate position values', position: 1 },
      { boardId: bugs.id, listId: b3.id, title: 'Memory leak in drag event listeners', description: 'dragover listener not cleaned up when column unmounts mid-drag', position: 2 },
      { boardId: bugs.id, listId: b4.id, title: 'CORS error on staging API', description: 'OPTIONS preflight was missing Access-Control-Allow-Headers', position: 1 },
      { boardId: bugs.id, listId: b4.id, title: 'JWT expiry not propagated to frontend', description: 'Token expired silently — added 401 interceptor to redirect to login', position: 2 },
    ],
  });

  // ── Board 4: Personal ─────────────────────────────────────────────────────
  const personal = await prisma.board.create({
    data: {
      title: 'Personal',
      description: 'Side projects, learning, and life tasks',
      visibility: 'private',
      ownerId: user.id,
    },
  });

  const [p1, p2, p3] = await Promise.all([
    prisma.projectList.create({ data: { boardId: personal.id, title: 'Someday', status: 'todo', position: 1 } }),
    prisma.projectList.create({ data: { boardId: personal.id, title: 'This Week', status: ListStatus.in_progress, position: 2 } }),
    prisma.projectList.create({ data: { boardId: personal.id, title: 'Done', status: 'done', position: 3 } }),
  ]);

  await prisma.card.createMany({
    data: [
      { boardId: personal.id, listId: p1.id, title: 'Read Shape Up by Basecamp', description: 'Focus on the betting table and appetite concepts', position: 1 },
      { boardId: personal.id, listId: p1.id, title: 'Learn TypeScript generics deeply', description: 'Work through the handbook section and write 5 real examples', position: 2 },
      { boardId: personal.id, listId: p1.id, title: 'Set up home server with Proxmox', description: 'Run a small NAS and self-host Nextcloud', position: 3 },
      { boardId: personal.id, listId: p2.id, title: 'Build REST API for side project', description: 'NestJS + Prisma scaffold with auth — aim for MVP by end of month', position: 1 },
      { boardId: personal.id, listId: p2.id, title: 'Update portfolio site', description: 'Add new projects and refresh the about section', position: 2 },
      { boardId: personal.id, listId: p3.id, title: 'Complete Vue 3 Composition API course', description: 'Finished all 12 modules including Pinia and Vue Router', position: 1 },
      { boardId: personal.id, listId: p3.id, title: 'Set up dotfiles repo', description: 'zsh, neovim, and tmux configs synced via GitHub', position: 2 },
      { boardId: personal.id, listId: p3.id, title: 'Switch to pnpm workspace', description: 'Migrated monorepo from npm — build times dropped by 40%', position: 3 },
    ],
  });

  console.log('\n✓ Demo account created\n');
  console.log(`  Email    : ${EMAIL}`);
  console.log(`  Password : ${PASSWORD}`);
  console.log(`  Boards   : Product Roadmap · Marketing Sprint · Bug Tracker · Personal\n`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
