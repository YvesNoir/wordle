# 🎮 CLAUDE.md - Wordle Amigos Project

## 📋 Project Overview

**Wordle Amigos** - A multiplayer Wordle game built for friends to compete daily with ranking system.

**Repository**: https://github.com/YvesNoir/wordle
**Local Path**: `/Users/sebastianfente/Documents/Development/wordle`
**Server**: http://localhost:3000

## 🏗️ Architecture & Stack

### Frontend
- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Theme**: Custom dark theme based on reference image

### Backend
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with credentials provider
- **API**: Next.js API Routes

### Database Connection
```env
DATABASE_URL="postgresql://app_noirplayground:Noirplayground1666.@72.60.240.4:5432/db_noirplayground?schema=noirplayground"
NEXTAUTH_SECRET="tu-secreto-super-seguro-aqui"
NEXTAUTH_URL="http://localhost:3000"
```

## 🗂️ Project Structure

```
wordle/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts    # NextAuth configuration
│   │   │   │   └── signup/route.ts           # User registration
│   │   │   ├── game/
│   │   │   │   ├── today/route.ts           # Get today's word/game
│   │   │   │   └── save/route.ts            # Save game progress
│   │   │   └── leaderboard/route.ts         # Ranking API
│   │   ├── auth/
│   │   │   ├── signin/page.tsx              # Login page
│   │   │   └── signup/page.tsx              # Registration page
│   │   ├── game/page.tsx                    # Main game page
│   │   ├── leaderboard/page.tsx             # Ranking page
│   │   ├── layout.tsx                       # Root layout
│   │   └── page.tsx                         # Landing page (redirects)
│   ├── components/
│   │   ├── Providers.tsx                    # NextAuth session provider
│   │   ├── WordleGrid.tsx                   # Game grid component
│   │   └── WordleKeyboard.tsx               # Virtual keyboard
│   ├── lib/
│   │   ├── prisma.ts                        # Prisma client configuration
│   │   └── words.ts                         # 300+ Spanish words list
│   └── types/
│       └── next-auth.d.ts                   # NextAuth type definitions
├── prisma/
│   └── schema.prisma                        # Database schema
├── references-images/
│   ├── img.png                              # Original design reference
│   └── img_1.png                            # GitHub repo screenshot
├── .env                                     # Environment variables
└── package.json                             # Dependencies
```

## 📊 Database Schema

### Users
- `id`: String (cuid)
- `username`: String (unique)
- `password`: String (hashed with bcrypt)
- `createdAt`, `updatedAt`: DateTime

### Words
- `id`: String (cuid)
- `word`: String (5 chars, unique)
- `date`: DateTime (unique, one per day)
- `createdAt`: DateTime

### Games
- `id`: String (cuid)
- `userId`, `wordId`: String (foreign keys)
- `attempts`: Int (number of tries)
- `completed`, `won`: Boolean
- `startTime`, `endTime`: DateTime
- `guesses`: Json (array of guesses)
- Unique constraint: `userId + wordId` (one game per user per day)

## 🎯 Key Features Implemented

### ✅ Authentication System
- User registration with validation
- Login with username/password
- Session management with NextAuth
- Protected routes

### ✅ Game Logic
- One word per day (shared across all users)
- 6 attempts maximum
- 5-letter Spanish words
- Real-time validation
- Visual feedback (green=correct, yellow=wrong position, gray=not in word)

### ✅ Leaderboard System
- Ranking by win percentage
- Detailed statistics: games played/won, average attempts, best time
- Current streak tracking
- User identification in rankings

### ✅ UI/UX
- Dark theme matching reference design
- Mobile-responsive layout
- QWERTY keyboard layout
- Smooth animations and transitions
- Loading states

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Code linting

# Database
npx prisma generate  # Generate Prisma client
npx prisma db push   # Push schema to database
npx prisma studio    # Database browser

# Git
git add .
git commit -m "message"
git push origin main
```

## 🎨 Design Implementation

The UI follows the exact design from `references-images/img.png`:

### Layout
- **Header**: Hamburger menu, "Wordle" title, settings/stats icons
- **Game Grid**: 6x5 grid with proper spacing and colors
- **Keyboard**: QWERTY layout (no Ñ), compact design
- **Footer**: Action icons

### Colors
- **Background**: Pure black (`#000000`)
- **Correct**: Green (`bg-green-600`)
- **Wrong Position**: Yellow (`bg-yellow-500`)
- **Not in word**: Gray (`bg-gray-600`)
- **Empty/Current**: Gray borders (`border-gray-600`)

### Typography
- **Title**: 18px, semibold, white
- **Grid**: 16px, bold, uppercase
- **Keyboard**: 14px, semibold

## 📝 Game Rules

1. **Daily Word**: Same 5-letter word for all players each day
2. **Attempts**: Maximum 6 guesses
3. **Feedback**:
   - Green: Letter in correct position
   - Yellow: Letter in word but wrong position
   - Gray: Letter not in word
4. **Validation**: Only valid Spanish words accepted
5. **Timing**: Tracked from start to completion for leaderboard

## 🏆 Leaderboard Algorithm

Ranking order:
1. **Win Percentage** (descending)
2. **Games Won** (descending)
3. **Average Attempts** (ascending)
4. **Average Time** (ascending)

Statistics calculated:
- Win rate: `(gamesWon / gamesPlayed) * 100`
- Current streak: Consecutive wins from latest games
- Best time: Fastest completion time
- Average attempts: Mean attempts for won games only

## 🚀 Deployment Notes

### Environment Setup
1. Create PostgreSQL database
2. Set environment variables in `.env`
3. Run `npx prisma db push` to create tables
4. Install dependencies with `npm install`
5. Start with `npm run dev`

### Production Checklist
- [ ] Update `NEXTAUTH_URL` for production domain
- [ ] Set secure `NEXTAUTH_SECRET`
- [ ] Configure database connection
- [ ] Run build process
- [ ] Test authentication flow
- [ ] Verify daily word generation

## 🔍 Troubleshooting

### Common Issues

1. **Database Connection**: Verify PostgreSQL credentials and network access
2. **Authentication**: Check `NEXTAUTH_SECRET` and URL configuration
3. **Build Errors**: Run `npm run build` to catch TypeScript issues
4. **Word Generation**: Ensure words table has entries for current date

### Debug Commands
```bash
# Check database connection
npx prisma db pull

# Verify environment
cat .env

# Test build
npm run build

# Check logs
npm run dev
```

## 📚 Word List

The game uses 300+ carefully selected Spanish words from `src/lib/words.ts`:
- All 5 letters long
- Common Spanish vocabulary
- No proper nouns or abbreviations
- Manually curated for gameplay

## 🔄 Daily Word Logic

- New word generated automatically when accessing game
- Same word for all users on same date (UTC)
- Stored in `words` table with unique date constraint
- Random selection from valid words array

## 👥 User Management

### Registration
- Username uniqueness validation
- Password hashing with bcrypt (12 rounds)
- Automatic session creation

### Session Management
- JWT tokens with NextAuth
- Persistent sessions across browser restarts
- Secure credential validation

---

## 📋 Development Context for Claude

### Project History
1. **Setup**: Created Next.js 16 project with TypeScript + Tailwind
2. **Database**: Configured PostgreSQL with Prisma ORM
3. **Auth**: Implemented NextAuth with credentials provider
4. **Game Logic**: Built Wordle mechanics with daily words
5. **UI**: Designed dark theme matching reference image
6. **Features**: Added leaderboard with competitive ranking
7. **Structure**: Reorganized from nested folder to clean structure
8. **Documentation**: Created comprehensive README and this CLAUDE.md

### Key Decisions Made
- **Spanish words**: 300+ curated list for better gameplay
- **Dark theme**: Based on mobile Wordle design reference
- **PostgreSQL**: Reliable database for user/game persistence
- **NextAuth**: Standard authentication solution for Next.js
- **Prisma**: Type-safe database operations
- **One game per day**: Maintains competitive fairness

### Future Enhancement Ideas
- Social features (share results)
- Custom word lists
- Multiplayer rooms
- Achievement system
- Progressive Web App (PWA)
- Email notifications for new words
- Admin panel for word management

### Performance Notes
- Game state managed in React state
- Database queries optimized with Prisma
- Static generation where possible
- Minimal bundle size with tree shaking

---

*Generated by Claude Code - Last updated: 2025-11-07*