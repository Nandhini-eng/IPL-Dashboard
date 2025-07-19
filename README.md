# IPL Dashboard

A real-time Indian Premier League (IPL) dashboard built with Next.js that displays live match information, points table, and match schedules. The application scrapes data from official IPL sources to provide up-to-date information.

## Features

- **Live Match Information**: Display upcoming matches with team details and match timing
- **Points Table**: Real-time IPL standings with team statistics
- **Match Schedule**: Complete tournament schedule with match details
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Auto-refresh**: Data updates automatically every 60 seconds
- **Web Scraping**: Automated data collection from official IPL sources

## Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Git** (for cloning the repository)

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ipl-dashboard
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables** (optional)
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

## Running the Application

### Development Mode

1. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

3. **Auto-reload**
   The application will automatically reload when you make changes to the code.

### Production Build

1. **Build the application**

   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Start the production server**
   ```bash
   npm start
   # or
   yarn start
   ```

## Data Scraping

The application includes a standalone scraping script for updating the points table data:

### Running the Scraper

```bash
npm run scrape:points
# or
yarn scrape:points
```

This script will:

- Scrape the current IPL points table from the official website
- Update the `app/data/pointsTable.json` file
- Display console output with scraping status

### Manual Data Updates

If you need to update the data manually, you can run the scraper script independently:

```bash
node scripts/scrape-ipl-points-table.js
```

## Project Structure

```
ipl-dashboard/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── scrape/        # Data scraping endpoint
│   ├── components/        # React components
│   │   ├── MatchBanner.tsx
│   │   ├── PointsTable.tsx
│   │   └── ScheduleList.tsx
│   ├── data/              # Static data files
│   │   ├── matches.json
│   │   ├── pointsTable.json
│   │   └── schedule.json
│   ├── points-table/      # Points table page
│   ├── schedule/          # Schedule page
│   └── types/             # TypeScript type definitions
├── scripts/               # Utility scripts
│   └── scrape-ipl-points-table.js
└── public/                # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run scrape:points` - Update points table data

## Technologies Used

- **Next.js 15** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Puppeteer** - Web scraping
- **Cheerio** - HTML parsing
- **Axios** - HTTP client

## Troubleshooting

### Common Issues

1. **Port 3000 already in use**

   ```bash
   # Kill the process using port 3000
   npx kill-port 3000
   # or change the port
   npm run dev -- -p 3001
   ```

2. **Scraping fails**

   - Check your internet connection
   - The official IPL website might be temporarily unavailable
   - Try running the scraper script manually: `node scripts/scrape-ipl-points-table.js`

3. **Build errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

### Data Issues

If the application shows outdated data:

1. Run the scraper: `npm run scrape:points`
2. Restart the development server
3. Clear browser cache

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:

- Check the troubleshooting section above
- Review the project structure and documentation
- Create an issue in the repository
