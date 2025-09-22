<h1 align="center">FineTrack</h1>

<p align="center">
    <img 
        src="./public/logo_image.png" 
        alt="FineTrack App Logo"
        width="250"
        height="250"
        />
</p></br>


A Progressive Web App (PWA) for tracking vehicle fines, charges, MOT, insurance and other vehicle-related expenses. Keep all your vehicle penalties and deadlines in one place with helpful payment links and notifications.

## Features

- 📱 **Cross-platform** - Works on Android, iOS, and desktop
- 💾 **Offline storage** - Data stored locally in your browser
- 🔔 **Smart notifications** - Get alerts before deadlines
- 💳 **Organized payment links** - Categorized links to official payment portals
- 📊 **Dashboard overview** - See all your fines at a glance
- �️ **Categorized resources** - Organized sections for Fines, Charges, Insurance, and MOT
- ✅ **Success feedback** - Clear confirmation when adding new fines

## Supported Fine Types

- Parking fines
- Speeding fines
- Dartford Crossing charges
- Congestion charges
- MOT renewals
- Insurance renewals
- Custom fines/charges

## Technology Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for responsive design
- **PWA** with service worker for offline functionality
- **Local Storage** for data persistence
- **Lucide React** for beautiful icons
- **date-fns** for date handling

## Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/FineTrack.git
cd FineTrack
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Installing as PWA

When you visit the app in a modern browser, you'll see an install prompt. Click "Install" to add FineTrack to your home screen for a native app experience.

## Usage

1. **Add a Fine**: Click "Add Fine" to record a new penalty or charge with success confirmation
2. **View Dashboard**: See overdue and upcoming fines at a glance
3. **Access Resources**: Click category buttons (Fines, Charges, Insurance, MOT) to access organized payment links and resources
4. **Manage Fines**: Update status, view details, and delete old records in the "All Fines" section
5. **Settings**: Configure notifications and preferences

## Data Privacy

- All data is stored locally in your browser
- No personal information is sent to external servers
- Your data remains completely private and under your control

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE.md) file for details.

## Roadmap

- [ ] Email/SMS notifications
- [ ] Data export functionality
- [ ] Vehicle management
- [ ] Receipt photo uploads
- [ ] Multiple user profiles
- [ ] Cloud synchronization option