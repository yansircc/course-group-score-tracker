# Offline Course Group Score Tracker

A real-time score tracking system designed for offline course group competitions, featuring admin controls and persistent data storage.

## Features

- **Real-time Score Management**

  - Track scores for multiple groups simultaneously
  - Visual score comparison with animated charts
  - Automatic highest score highlighting

- **Admin System**

  - Secure admin access via URL parameter
  - Persistent admin authentication
  - Protected score modification controls

- **Data Persistence**

  - Permanent data storage with Upstash Redis
  - Data remains until explicit admin reset
  - Secure data management

- **User Interface**
  - Clean, responsive design
  - Animated transitions and interactions
  - Mobile-friendly layout

## Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Database**: [Upstash Redis](https://upstash.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Charts**: [Recharts](https://recharts.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Package Manager**: [Bun](https://bun.sh/)

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- [Upstash](https://upstash.com/) account

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/offline-course-score-tracker.git
cd offline-course-score-tracker
```

2. Install dependencies:

```bash
bun install
```

3. Create a `.env.local` file and set the following environment variables:

```bash
cp .env.example .env.local
```

4. Start the development server:

```bash
bun dev
```

## Usage

### Admin Access

1. Visit `http://localhost:3000?user=admin`
2. Admin status persists across sessions
3. Admin features include:
   - Creating and editing groups
   - Modifying scores
   - Resetting all data (with confirmation)

### Score Management

- Create groups with names and descriptions
- Add scores using predefined increments
- View real-time score comparisons
- Track highest scoring group

### Data Reset

- Only available to admin users
- Requires typing "确认删除" for confirmation
- Completely resets scores and admin permissions

## Project Structure

```bash
src/
├── app/ # Next.js app router
│ ├── api/ # API routes
│ └── page.tsx # Main page
├── components/ # React components
│ ├── score-tracker/ # Score tracking components
│ └── ui/ # UI components
├── hooks/ # Custom React hooks
├── lib/ # Utility functions
└── store/ # Zustand store
```

## API Routes

- `GET /api/scores` - Retrieve all group scores
- `POST /api/scores` - Update group scores
- `GET /api/admin/check` - Verify admin status
- `POST /api/admin/check` - Register admin access
- `POST /api/killall` - Reset all data (admin only)

## Environment Variables

- `KV_URL` - Upstash Redis URL
- `KV_REST_API_URL` - Upstash REST API URL
- `KV_REST_API_TOKEN` - Upstash REST API token
- `KV_REST_API_READ_ONLY_TOKEN` - Upstash REST API read-only token
