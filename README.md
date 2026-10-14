# TeamFlow Pro — Full-stack project management

Next.js 15 + React 19 + TypeScript + Prisma + PostgreSQL. A responsive professional workspace with login, registration, secure cookie sessions, first-user admin, team directory, role changes, member deletion, project creation/deletion, task assignment, status board, priorities, and overview metrics.

## Local setup (Windows PowerShell)

1. Install Node.js 20+ and create a free Neon PostgreSQL database.
2. Extract ZIP and open terminal in `teamflow-source`.
3. Run `npm install`.
4. Copy `.env.example` to `.env` using `Copy-Item .env.example .env`.
5. Edit `.env`: paste Neon PostgreSQL connection string as `DATABASE_URL`; set `JWT_SECRET` to a long random string (32+ characters). Do not commit it.
6. Run `npx prisma db push` to create database tables.
7. Run `npm run dev` and open http://localhost:3000.
8. Register your first user; first user becomes ADMIN. Register other users as MEMBER or add them as admin.

## Deploy to Vercel

1. Push code to GitHub, excluding `.env` and `node_modules`.
2. Import repository at https://vercel.com/new.
3. Add `DATABASE_URL` and `JWT_SECRET` in Vercel Project Settings > Environment Variables (Production, Preview if needed).
4. Create tables once against production DB using `npx prisma db push` locally with production DB connection string (or use reviewed Prisma migrations with `npm run db:deploy`).
5. Deploy. `npm run build` automatically runs `prisma generate`.

## Roles and security

- The first successfully registered user is ADMIN; all later public registrations are MEMBER.
- ADMIN can add/remove members and change roles. Users cannot delete themselves or change their own role.
- Passwords are bcrypt-hashed; sessions are signed JWTs in HttpOnly SameSite cookies; protected API routes verify sessions and roles server-side.
- All signed-in users can view projects/tasks and create tasks/projects. Project owners or admins can delete projects/tasks.

## Production hardening before public launch

This is a portfolio MVP, not an audited multi-tenant SaaS. Add workspace isolation, invitation-only onboarding, email verification, password resets, audit logs, rate limiting, CSRF/origin protections, and database transactions for first-admin bootstrap before opening it to untrusted users. Never use a production database for experiments.

## API error troubleshooting

If the browser says `Unexpected token '<' ... is not valid JSON`, it means Next.js returned an HTML page rather than JSON. This version displays the HTTP status and endpoint instead of crashing on JSON parsing.

1. Run `npm install` then `npx prisma generate` and `npx prisma db push` (after setting `.env`).
2. Start `npm run dev` from the extracted `teamflow-source` folder (not its parent).
3. Visit `http://localhost:3000/api/health`. A working setup returns `{"ok":true,"database":"connected"}`. HTTP 503 means the database or JWT configuration needs attention; a 404/HTML page means the wrong app or port is running, or the server did not compile.
4. Recheck the terminal output; restart `npm run dev` after editing `.env`.
5. If port 3000 was already occupied, Next.js may use 3001: open the exact Local URL printed in the terminal.

Do not share your `.env` contents or database connection string publicly.


## Fix: Prisma Client did not initialize yet

If `/api/auth` returns HTTP 500 with `@prisma/client did not initialize yet`, stop the development server and run:

```powershell
npm install
npx prisma generate
npx prisma db push
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

Make sure `.env` contains a working `DATABASE_URL` connection string from Neon and a sufficiently long `JWT_SECRET`. In this release `npm install` and `npm run dev` will also trigger Prisma Client generation automatically. Do not paste your database password or JWT secret into support messages.
