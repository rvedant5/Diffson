# Diffson

**Diffson** is a lightweight web application for parsing and comparing JSON files. It allows users to upload or paste JSON data into two side-by-side panels, sort keys alphabetically, and view differences with clarity through multiple views and color-coded highlights.

![Diffson Logo](https://img.shields.io/badge/Diffson-JSON_Comparison-blue?style=for-the-badge)

## 🔑 Key Features

### 1. **Upload / Paste JSON**
- Accept `.json` files or raw JSON input
- Auto-validation with error messages
- Real-time JSON parsing

### 2. **Split-Screen Comparison**
- JSON1 on left, JSON2 on right
- Side-by-side comparison view
- Responsive layout (stacked on mobile)

### 3. **View Modes**
- **Tree View** → Collapsible JSON structure with hierarchical display
- **List View** → Flattened `key → value` pairs for easy scanning
- **Table View** → Keys with JSON1 vs JSON2 values + diff highlights

### 4. **Sorting**
- Alphabetical sorting of JSON keys (recursive)
- Sort each panel independently
- Maintains nested structure

### 5. **Difference Detection**
Three comparison modes available via dropdown:
- **Key Difference** → Detect missing/present keys
- **Data Difference** → Highlight mismatched values
- **Key + Data** → Full comparison mode (default)

### 6. **Enhanced Usability**
- 🔍 **Search & Highlight** → Find keys/values inside JSON
- ↕️ **Collapse / Expand All** → Quick navigation in Tree View
- 🎨 **Color-Coded Differences**
  - Missing keys → Red
  - Value mismatch → Yellow
  - Matching → Green
  - Search highlights → Blue
- 🔄 **Panel Swap** → Instantly switch JSON1 ↔ JSON2
- 📋 **Copy to Clipboard** → Copy JSON with one click
- 💾 **Download** → Export parsed/compared JSON
- 🔗 **Clickable Branding** → Logo and title link to main application
- ➡️ **Table Row Comparison** → Click arrows in table view to open detailed comparisons in new tabs

### 7. **Responsive Design**
- Side-by-side on desktop
- Stacked layout on mobile
- Touch-friendly interface

## ⚙️ Tech Stack

- **Frontend:** React 18
- **UI Components:** Tailwind CSS, Lucide React (icons)
- **Build Tool:** Vite
- **Utilities:** Lodash (sorting & data manipulation)
- **Deployment Ready:** Netlify / Vercel compatible

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone or navigate to the project directory:
```bash
cd diffson
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit:
```
http://localhost:3000
```

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## 📖 Usage Guide

### Uploading JSON
1. Click the "Upload" button to select a `.json` file
2. Or paste JSON directly into the textarea

### Comparing JSONs
1. Load JSON data into both panels
2. Select comparison mode from dropdown:
   - Key Difference
   - Data Difference
   - Key + Data (recommended)
3. Choose your preferred view mode:
   - Tree View (hierarchical)
   - List View (flattened)
   - Table View (side-by-side comparison)

### Sorting Keys
- Click "Sort Keys" button in either panel
- Keys will be sorted alphabetically (recursive)

### Searching
- Use the search bar to find specific keys or values
- Matching items will be highlighted in blue

### Swapping Panels
- Click the "Swap" button to instantly switch JSON1 ↔ JSON2

### Exporting
- Click "Copy" icon to copy JSON to clipboard
- Click "Download" icon to save JSON as a file

### Table Row Comparison (NEW in v2.0)
- Click the arrow button (➡️) in any table row's Status column
- Opens a new tab with detailed comparison of that specific key-value pair
- Data is automatically pre-loaded for immediate analysis
- Perfect for drilling down into complex nested differences

### Clickable Branding (NEW in v2.0)
- Click the Diffson logo or title to navigate to the main application
- Useful for bookmarking or sharing the application URL
- Maintains accessibility with keyboard navigation and screen reader support

## 🎨 Color Legend

| Color | Meaning |
|-------|---------|
| 🔴 Red | Missing key in one panel |
| 🟡 Yellow | Value mismatch between panels |
| 🟢 Green | Matching values |
| 🔵 Blue | Search highlight |

## 📁 Project Structure

```
diffson/
├── src/
│   ├── App.jsx          # Main application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global styles with Tailwind
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind CSS configuration
├── postcss.config.js    # PostCSS configuration
└── README.md            # This file
```

## 🔧 Configuration

### Vite Configuration
The project uses Vite for fast development and optimized production builds. Configuration is in `vite.config.js`.

### Tailwind CSS
Tailwind is configured in `tailwind.config.js` with custom content paths for optimal purging.

## � FWhat's New in Release 2.0

### Clickable Branding
- **Interactive Logo & Title**: Click the Diffson logo or title to navigate to the main application
- **Accessibility First**: Full keyboard navigation support with focus indicators
- **Screen Reader Friendly**: Proper ARIA labels and tooltips for assistive technologies

### Table Row Comparison
- **One-Click Detailed Analysis**: Arrow buttons (➡️) in each table row's Status column
- **New Tab Workflow**: Opens detailed comparisons in separate tabs for better multitasking
- **Auto-Population**: Data is automatically loaded using URL parameters - no manual copying required
- **Smart URL Generation**: Works seamlessly in both development and production environments
- **Universal Data Support**: Handles all JSON data types (strings, numbers, objects, arrays, null)

### Enhanced User Experience
- **Seamless Navigation**: Maintain your current work while exploring detailed comparisons
- **Visual Feedback**: Hover effects and focus states provide clear interaction cues
- **Error Handling**: Graceful fallbacks ensure the application remains stable
- **Cross-Browser Compatible**: Tested across modern browsers with consistent behavior

## 🎯 Features in Detail

### Tree View
- Hierarchical display of JSON structure
- Collapsible/expandable nodes
- Visual indentation for nested objects
- Color-coded differences at each level

### List View
- Flattened key-value pairs
- Dot notation for nested keys (e.g., `user.address.city`)
- Easy scanning for specific keys
- Border highlights for differences

### Table View
- Comprehensive comparison table
- Four columns: Key, JSON1, JSON2, Status
- Status indicators with emojis
- Sticky header for easy reference
- **NEW**: Clickable arrow buttons in Status column for detailed row comparisons
- **NEW**: Opens new tabs with pre-loaded data for focused analysis

## 🚢 Deployment

### Deploy to Netlify

1. Build the project:
```bash
npm run build
```

2. Deploy the `dist` folder to Netlify via:
   - Drag & drop in Netlify dashboard
   - Netlify CLI: `netlify deploy --prod --dir=dist`
   - Connect GitHub repo for automatic deployments

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to complete deployment

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎯 Goal

Provide a simple, fast, and intuitive way to **parse, view, and compare JSON files** with multiple visualization modes, color-coded differences, and enhanced usability for personal productivity.

## 🐛 Known Issues

- Very large JSON files (>10MB) may cause performance issues
- Circular references in JSON are not supported

## 🗺️ Roadmap

### ✅ Completed in v2.0
- [x] Clickable branding with navigation to main application
- [x] Table row comparison with new tab functionality
- [x] URL parameter auto-population for seamless data transfer

### 🚧 Upcoming Features
- [ ] Add JSON beautification/minification
- [ ] Support for JSON Schema validation
- [ ] Export comparison report as PDF/HTML
- [ ] Dark mode theme
- [ ] Custom color themes
- [ ] Keyboard shortcuts
- [ ] History of compared JSONs
- [ ] Merge/patch generation

## 📧 Contact

For questions or feedback, please open an issue on the project repository.

---

**Made with ❤️ for JSON enthusiasts**
