# Fertility Optimization App

A 90-day fertility optimization program web app for couples trying to conceive. All data is stored locally in the browser with client-side encryption.

## Features

- **Personalized Timeline**: 74-day cycle for males, 90-day cycle for females
- **Daily Check-ins**: Track supplements, sleep, exercise, and more
- **Partner Pairing**: Share progress with your partner via 6-digit codes
- **Milestone Tracking**: Celebrate streaks at 7, 14, 30, 60, and 90 days
- **Educational Content**: Contextual tips and information
- **Progress Visualization**: Charts and calendars showing your journey
- **Data Export**: Download your data as JSON
- **PWA Support**: Install as an app, works offline
- **Privacy-First**: All data encrypted and stored locally

## Tech Stack

- React + Vite
- Tailwind CSS
- IndexedDB via Dexie.js
- Web Crypto API for encryption
- React Router for navigation
- Canvas Confetti for celebrations
- PWA with offline support

## Getting Started

### Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment

### Deploy to Vercel

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Vercel will automatically detect the Vite configuration
4. Click "Deploy"

### Deploy to Netlify

1. Push this repository to GitHub
2. Go to [netlify.com](https://netlify.com) and click "Add new site"
3. Select your repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy site"

### Manual Deployment

```bash
# Build the app
npm run build

# The dist/ folder contains the static files
# Upload the contents of dist/ to any static hosting service
```

## User Flow

1. **Sign Up**: Email, password, basic health questions
2. **Onboarding**: 5-screen flow to set up your profile
3. **Dashboard**: View your progress and timeline
4. **Daily Check-in**: Mark completed habits each day
5. **Partner Pairing**: Connect with your partner
6. **Progress Tracking**: View detailed stats and milestones

## Data Privacy

- All data is stored locally in your browser (IndexedDB)
- Sensitive health data is encrypted with your password using AES-GCM
- No backend server - everything runs client-side
- Export your data anytime as JSON
- No data is sent to any external servers

## Legal Disclaimer

This app is for educational purposes only. It is not medical advice and should not replace consultation with a qualified healthcare provider. Always consult with your doctor before making health decisions.

## Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

## License

MIT License - Feel free to modify and use for your own purposes.

## Support

For issues or questions, please open an issue on GitHub.
