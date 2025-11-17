# cl1p - Internet Clipboard Clone

A Next.js clone of cl1p.net - an internet clipboard service that allows you to share text and files across devices using unique URLs.

## Features

- Create clips with custom slugs at `yourapp.com/<slug>`
- Paste arbitrary text/code
- Upload files (up to 10MB)
- Destroy-on-read by default (configurable)
- Configurable TTL: 1 min, 10 min, 1 hour, 1 day, 1 week, 1 month
- Clean, modern UI with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite with Prisma ORM
- **File Storage**: Vercel Blob Storage (production) or local filesystem (development)
- **Styling**: Tailwind CSS
- **Validation**: Zod
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cl1p
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL`: SQLite database path (default: `file:./dev.db`)
- `BLOB_READ_WRITE_TOKEN`: Vercel Blob Storage token (optional for local dev)
- `NEXT_PUBLIC_APP_URL`: Your app URL (default: `http://localhost:3000`)

4. Initialize the database:
```bash
npx prisma db push
```

5. Generate Prisma client:
```bash
npx prisma generate
```

6. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to Vercel

1. Push your code to GitHub

2. Import your project in Vercel

3. Configure environment variables in Vercel:
   - `DATABASE_URL`: For production, consider using Vercel Postgres or an external database service (SQLite has limitations on Vercel's serverless functions)
   - `BLOB_READ_WRITE_TOKEN`: Get this from your Vercel Blob Storage settings
   - `NEXT_PUBLIC_APP_URL`: Your production URL

4. Deploy!

### Important Notes for Vercel Deployment

- **SQLite Limitations**: SQLite may not work well on Vercel's serverless functions due to read-only filesystem. For production, consider:
  - Using Vercel Postgres (recommended)
  - Using an external database service (PlanetScale, Supabase, etc.)
  - Using Vercel KV for simple key-value storage

- **File Storage**: For production, Vercel Blob Storage is recommended. For local development, files are stored in `/public/uploads`.

## Usage

1. **Create a clip**: 
   - Enter a custom slug (e.g., `my-clip`)
   - Add text content and/or upload a file
   - Optionally set TTL and destroy-on-read settings
   - Click "Create Clip"

2. **View a clip**: 
   - Visit `yourapp.com/<slug>` on any device
   - The clip will be displayed or available for download
   - If destroy-on-read is enabled, the clip is deleted after viewing

## Project Structure

```
cl1p/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                 # Home page
│   ├── [slug]/
│   │   └── page.tsx             # Clip viewer page
│   └── api/
│       └── clips/
│           ├── route.ts         # POST: Create clip
│           └── [slug]/
│               └── route.ts     # GET: Retrieve clip
├── components/
│   ├── ClipForm.tsx             # Create clip form
│   ├── ClipViewer.tsx           # Display clip
│   └── FileDownload.tsx         # File download component
├── lib/
│   ├── db.ts                    # Prisma client
│   ├── storage.ts                # File storage utilities
│   └── validation.ts             # Validation schemas
└── prisma/
    └── schema.prisma            # Database schema
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio

## License

MIT

