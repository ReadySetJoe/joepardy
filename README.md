# Joe-pardy!

A Jeopardy-style trivia game board creator and player built with Next.js 16, TypeScript, Tailwind CSS, and PostgreSQL.

## Features

- **Game Board**: Classic 6-column Jeopardy board with customizable point values
- **Player Management**: Add players, track scores, edit scores manually
- **Multi-player Scoring**: Mark multiple players correct/incorrect on the same question before confirming
- **Board Creator**: Full CRUD operations for creating and editing game boards
- **Slick UI**: Animated transitions, gradients, and a polished dark theme
- **Persistent Storage**: PostgreSQL database for storing boards, categories, and clues

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
│   │       └── page.tsx       # Play a saved board
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
└── categories[] -> Category

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
└── categoryId (string, FK)
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

### Play Mode (/play/[id])

- Play any saved board
- Same functionality as home page but with your custom board

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

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/boards` | List all boards |
| POST | `/api/boards` | Create a new board |
| GET | `/api/boards/[id]` | Get a single board |
| PUT | `/api/boards/[id]` | Update a board |
| DELETE | `/api/boards/[id]` | Delete a board |

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

## License

MIT
