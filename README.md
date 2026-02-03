# Joe-pardy!

A Jeopardy-style trivia game board creator and player built with Next.js 16, TypeScript, Tailwind CSS, and PostgreSQL.

## Features

- **Game Board**: Classic 6-column Jeopardy board with customizable point values
- **Game Sessions**: Start multiple games per board with persistent state
- **Player Management**: Add players, track scores, edit scores manually
- **Score Persistence**: Players, scores, and answered clues are saved automatically
- **Multi-player Scoring**: Mark multiple players correct/incorrect on the same question before confirming
- **Board Creator**: Full CRUD operations for creating and editing game boards
- **Game History**: Resume in-progress games or review completed ones
- **Slick UI**: Animated transitions, gradients, and a polished dark theme
- **Persistent Storage**: PostgreSQL database for storing boards, games, and player data

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Database**: PostgreSQL
- **ORM**: Prisma 7

## Project Structure

```
joepardy/
├── app/
│   ├── admin/
│   │   ├── page.tsx           # Board management dashboard
│   │   └── [id]/
│   │       └── page.tsx       # Board editor
│   ├── api/
│   │   └── boards/
│   │       ├── route.ts       # GET all boards, POST new board
│   │       └── [id]/
│   │           └── route.ts   # GET, PUT, DELETE single board
│   ├── components/
│   │   ├── ClueModal.tsx      # Question/answer modal with scoring
│   │   ├── GameBoard.tsx      # Main game board grid
│   │   └── PlayerPanel.tsx    # Player scores and management
│   ├── data/
│   │   └── dummy-board.ts     # Sample board data for home page
│   ├── lib/
│   │   ├── api.ts             # Frontend API client functions
│   │   └── prisma.ts          # Prisma client singleton
│   ├── play/
│   │   └── [id]/
│   │       ├── page.tsx       # Game selection for a board
│   │       └── game/
│   │           └── [gameId]/
│   │               └── page.tsx  # Play a specific game
│   ├── globals.css            # Global styles and animations
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page with demo board
│   └── types.ts               # TypeScript interfaces
├── prisma/
│   └── schema.prisma          # Database schema
├── prisma.config.ts           # Prisma configuration
├── .env                       # Environment variables (DATABASE_URL)
└── package.json
```

## Database Schema

```
Board
├── id (string, cuid)
├── name (string)
├── createdAt (datetime)
├── updatedAt (datetime)
├── categories[] -> Category
└── games[] -> Game

Category
├── id (string, cuid)
├── name (string)
├── order (int)
├── boardId (string, FK)
└── clues[] -> Clue

Clue
├── id (string, cuid)
├── value (int)
├── question (string)
├── answer (string)
├── order (int)
├── categoryId (string, FK)
└── clueResults[] -> ClueResult

Game
├── id (string, cuid)
├── name (string, optional)
├── status (IN_PROGRESS | COMPLETED)
├── createdAt (datetime)
├── updatedAt (datetime)
├── boardId (string, FK)
├── players[] -> GamePlayer
└── clueResults[] -> ClueResult

GamePlayer
├── id (string, cuid)
├── name (string)
├── score (int)
├── order (int)
├── gameId (string, FK)
└── clueResults[] -> ClueResult

ClueResult
├── id (string, cuid)
├── result (CORRECT | INCORRECT | SKIPPED)
├── createdAt (datetime)
├── clueId (string, FK)
├── gameId (string, FK)
└── playerId (string, FK, optional)
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- PostgreSQL 14+ (or Docker)

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up PostgreSQL

#### Option A: Using Docker (Recommended)

```bash
docker run --name joepardy-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=joepardy -p 5432:5432 -d postgres:16
```

The default `.env` is already configured for this setup.

#### Option B: Local PostgreSQL Installation

1. Download and install PostgreSQL from https://www.postgresql.org/download/windows/
2. During installation, set a password for the `postgres` user
3. Create the database:
   ```bash
   psql -U postgres
   CREATE DATABASE joepardy;
   \q
   ```
4. Update `.env` with your password:
   ```
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/joepardy?schema=public"
   ```

### 3. Run Database Migrations

```bash
npx prisma migrate dev --name init
```

### 4. Generate Prisma Client

```bash
npx prisma generate
```

### 5. Start Development Server

```bash
npm run dev
```

Visit http://localhost:3000

## Usage

### Home Page (/)

- Displays a demo board with sample categories
- Click "Manage Boards" to go to the admin section
- Add players using the + button
- Click dollar values to reveal clues
- Mark players correct (+points) or incorrect (-points)
- Click player scores to edit them manually

### Admin (/admin)

- View all saved boards
- Create new boards
- Edit existing boards
- Delete boards
- Play boards directly

### Board Editor (/admin/[id])

- Edit board name
- Add/remove categories
- Add/remove clues per category
- Edit clue values, questions, and answers
- Changes are saved when you click "Save Changes"

### Game Selection (/play/[id])

- View all games for a board (in-progress and completed)
- Start a new game with optional name
- Resume an in-progress game
- Delete games

### Play Game (/play/[id]/game/[gameId])

- Play a specific game session
- Add players, answer clues, track scores
- All progress is automatically saved
- End the game when finished

## Game Flow

1. **Setup**: Add players using the + button
2. **Select Clue**: Click a dollar value on the board
3. **Read Clue**: The question is displayed
4. **Players Answer**: Players buzz in and answer verbally
5. **Score**: Click +$X for correct or -$X for incorrect on each player who answered
6. **Reveal Answer**: Click "Reveal Answer" to show the answer
7. **Continue**: Click "Confirm & Continue" to apply scores and close
8. **Repeat**: Continue until all clues are revealed

## API Endpoints

### Boards

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | List all boards |
| POST | `/api/boards` | Create a new board |
| GET | `/api/boards/[id]` | Get a single board |
| PUT | `/api/boards/[id]` | Update a board |
| DELETE | `/api/boards/[id]` | Delete a board |

### Games

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/games?boardId=X` | List games for a board |
| POST | `/api/games` | Create a new game |
| GET | `/api/games/[id]` | Get a single game |
| PUT | `/api/games/[id]` | Update game (name, status) |
| DELETE | `/api/games/[id]` | Delete a game |
| POST | `/api/games/[id]/players` | Add a player |
| PUT | `/api/games/[id]/players` | Update player scores |
| POST | `/api/games/[id]/clues/[clueId]` | Record clue results |

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Prisma Commands

```bash
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations (development)
npx prisma studio        # Open Prisma Studio (database GUI)
npx prisma db push       # Push schema changes without migration
```

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:postgres@localhost:5432/joepardy?schema=public` |

## Quick Start After Restart

After restarting and installing Docker:

```bash
# 1. Start PostgreSQL container
docker run --name joepardy-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=joepardy -p 5432:5432 -d postgres:16

# 2. Run database migrations
npx prisma migrate dev --name init

# 3. Start the app
npm run dev
```

If the container already exists but is stopped:
```bash
docker start joepardy-db
```

## Customization

### Changing Default Point Values

Edit the clue values in the board editor, or modify the default values in `/app/api/boards/route.ts` (POST handler creates default clues with values 100-500).

### Styling

- Global styles and animations: `/app/globals.css`
- Component styles use Tailwind CSS classes
- Color scheme uses Jeopardy blue (`#060CE9`) and gold (`#ffcc00`)

## Production Deployment

### Environment Variables

Set the following environment variable in your deployment platform:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/joepardy` |

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add the `DATABASE_URL` environment variable pointing to your PostgreSQL database
4. Deploy

Vercel will automatically run `npm run build` which includes Prisma client generation.

### Deploy to Other Platforms

```bash
# 1. Set DATABASE_URL environment variable

# 2. Install dependencies
npm install

# 3. Run database migrations
npm run db:migrate

# 4. Build the application
npm run build

# 5. Start the server
npm run start
```

### Database Providers

The app works with any PostgreSQL database. Recommended providers:

- **[Neon](https://neon.tech)** - Serverless PostgreSQL (free tier available)
- **[Supabase](https://supabase.com)** - PostgreSQL with extras (free tier available)
- **[Railway](https://railway.app)** - Simple PostgreSQL hosting
- **[PlanetScale](https://planetscale.com)** - MySQL-compatible (requires schema changes)

## License

MIT
