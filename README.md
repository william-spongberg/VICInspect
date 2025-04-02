# VICInspect

Track and report Public Transport Victoria inspectors in real-time to help commuters avoid unfair treatment.

[![Next.js](https://img.shields.io/badge/Next.js-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![HeroUI](https://img.shields.io/badge/HeroUI-5E35B1?style=for-the-badge&logo=react&logoColor=white)](https://www.heroui.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=leaflet&logoColor=white)](https://leafletjs.com/)

## About

Due to concerns about how Public Transport Victoria inspectors have been treating passengers, this website serves as a platform for reporting the precise locations of inspectors at all times and allow users to readjust their trips accordingly. It will forever remain a free, highly accessible and useful tool for all Melbourne commuters.

## Features

### Current Features

- 🗺️ **Interactive Map**: Real-time inspector locations using Leaflet and OpenStreetMap
- 🔄 **Real-Time Updates**: Immediate updates on inspector reports from community users
- 📱 **Push Notifications**: Subscribe to receive alerts about inspectors in your area
- 📊 **Statistics Dashboard**: View report counts and danger levels
- 🔒 **Authentication**: Secure sign-in with GitHub and Google

### Coming Soon

- 🚆 **PTV API Integration**: Track trams, trains, and buses with inspector reports attached
- 📊 **Leaderboard System**: View top contributors and most upvoted reports
- 📝 **Report Descriptions**: Add detailed descriptions and facebook post links to inspector reports
- 🔑 **Additional Authentication Methods**

## Tech Stack

- **Frontend**: Next.js, React, HeroUI component library
- **Backend**: Next.js API routes with Edge Runtime
- **Database**: Supabase for fast and secure data storage
- **Authentication**: Supabase Auth with OAuth providers
- **Mapping**: Leaflet with OpenStreetMap
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Supabase account and project

### Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/ptv-inspector-tracker.git
cd ptv-inspector-tracker
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory with your Supabase credentials

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Database Setup

Create the following tables in your Supabase instance:

1. `inspector_reports` table:

```sql
CREATE TABLE inspector_reports (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  votes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

2. `subscriptions` table:

```sql
CREATE TABLE subscriptions (
  device_id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  endpoint TEXT NOT NULL,
  keys JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## How to Contribute

We welcome contributions from the community to improve PTV Inspector Tracker!

### Contribution Process

1. **Fork the Repository**
   - Click the "Fork" button at the top right of the repository page

2. **Clone Your Fork**

   ```bash
   git clone https://github.com/your-username/ptv-inspector-tracker.git
   cd ptv-inspector-tracker
   ```

3. **Create a Branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Make Your Changes**
   - Add features, fix bugs, or improve documentation
   - Follow the existing code style and patterns

5. **Test Your Changes**
   - Ensure your changes don't break existing functionality
   - Add tests for new features if applicable

6. **Commit Your Changes**

   ```bash
   git commit -m "Add a descriptive commit message"
   ```

7. **Push to Your Fork**

   ```bash
   git push origin feature/your-feature-name
   ```

8. **Submit a Pull Request**
   - Go to the original repository and click "New Pull Request"
   - Select your fork and branch
   - Provide a clear description of your changes

### Contribution Guidelines

- Follow the project's coding style and conventions
- Update documentation when necessary
- Keep pull requests focused on a single feature or bug fix
- Be respectful and constructive in discussions

### Development Roadmap Items

Interested contributors can help with these planned features:

- PTV API integration for vehicle tracking
- Leaderboard system development
- Report description functionality
- Push notification improvements

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please contact: <william@spongberg.dev>
