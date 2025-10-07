# ScreenStack

A lightweight, privacy-first web app that lets you open and arrange multiple web pages in customizable grid layouts — all within one browser window.

## What It Does

ScreenStack creates a minimalist browser dashboard where you can:
- View multiple websites side-by-side in flexible grid layouts
- Choose from preset layout templates (2x2, 3x3, 2-left-1-right, etc.)
- Adjust zoom levels per iframe (0.1x to 3x)
- Save layouts locally and share them via encoded URLs
- Control sandbox settings per iframe for security

## Key Features

- **Zero Backend**: Fully static, runs entirely in your browser
- **Privacy First**: No sign-ups, no tracking, no data sent anywhere
- **Local Storage**: Layouts persist automatically using localStorage
- **Shareable**: Export layouts as encoded URL parameters
- **Layout Templates**: 7 preset grid configurations
- **Individual Zoom**: Per-iframe zoom controls (10% - 300%)
- **Lightweight**: Under 100 KB total with no dependencies

## Live Demo

Visit [https://screenstack.craniumcraze.net](https://screenstack.craniumcraze.net) to start using ScreenStack. No installation required.

## How to Use

### Basic Workflow

1. **Add a Frame**: Click "+ Frame" to add a new iframe
2. **Enter URL**: Type or paste a URL in the input field
3. **Load**: Click "Load" to display the website in the iframe
4. **Choose Layout**: Select a layout template from the dropdown
5. **Adjust Zoom**: Use the "Zoom" number input to scale iframe content (0.1 - 3.0)
6. **Save**: Click "Save" to persist your layout in browser localStorage
7. **Share**: Click "Share" to copy a shareable URL to clipboard

### Toolbar Buttons

- **+ Frame**: Add a new iframe to the grid
- **Layout Template**: Dropdown with preset grid configurations
- **Save**: Save current layout to localStorage (auto-restores on page load)
- **Share**: Generate and copy a shareable URL with all settings encoded
- **Reset**: Clear all frames and return to default 2x2 grid

### Frame Controls

Each iframe has its own header with:
- **URL Input**: Enter the website address
- **Load Button**: Load/reload the URL
- **Zoom Control**: Number input (0.1 - 3.0 step 0.1) to scale iframe content
- **Sandbox Checkbox**: Enable/disable iframe sandbox security (enabled by default)
- **× Button**: Remove this frame from the layout

### Layout Templates

- **2x2 Grid**: Standard 4-frame grid
- **3x3 Grid**: 9-frame grid for monitoring dashboards
- **Single Frame**: One full-screen iframe
- **2 Left + 1 Right**: Two stacked frames on left, one spanning frame on right
- **1 Left + 2 Right**: One spanning frame on left, two stacked on right
- **2 Top + 1 Bottom**: Two side-by-side frames on top, one spanning bottom
- **1 Top + 2 Bottom**: One spanning frame on top, two side-by-side on bottom

When switching templates, existing URLs and zoom settings are preserved where possible.

## Technical Details

### Architecture

ScreenStack is built with vanilla HTML, CSS, and JavaScript — no frameworks or build tools.

**Files:**
- `index.html` - Main application structure (toolbar, grid container)
- `style.css` - Dark theme styling and CSS Grid layout
- `script.js` - Application logic, state management, and persistence

### How It Works

1. **State Management**: All layout data is stored in a JavaScript object:
   ```javascript
   {
     grid: { cols: 2, rows: 2 },
     frames: [
       {
         url: 'https://example.com',
         sandbox: true,
         gridArea: '1 / 1 / 2 / 2',
         zoom: 1
       },
       // ... more frames
     ]
   }
   ```

2. **CSS Grid**: The container uses CSS Grid with dynamic column/row definitions
3. **Grid Areas**: Each frame can span multiple cells using `grid-area` CSS property
4. **Zoom**: Implemented with CSS `transform: scale()` and adjusted dimensions
5. **Persistence**: Layout saved to `localStorage` under key `screenstack_layout`
6. **Sharing**: Layout is base64-encoded and included in URL hash parameter

### Data Structure

#### Layout Object
```javascript
{
  grid: {
    cols: Number,  // Number of columns
    rows: Number   // Number of rows
  },
  frames: [
    {
      url: String,        // iframe source URL
      sandbox: Boolean,   // Enable iframe sandbox
      gridArea: String,   // CSS grid-area (e.g., '1 / 1 / 2 / 2')
      zoom: Number        // Scale factor (0.1 - 3.0)
    }
  ]
}
```

#### Share URL Format
```
https://screenstack.craniumcraze.net/#data=BASE64_ENCODED_LAYOUT
```

The layout object is JSON-stringified, then base64-encoded, and added as a URL hash parameter.

### Browser Compatibility

- Modern browsers with CSS Grid support (Chrome 57+, Firefox 52+, Safari 10.1+)
- localStorage API required for saving
- Clipboard API for share functionality (falls back to prompt dialog)

### Important Limitations

**Iframe Embedding Restrictions:**
Many sites prevent embedding via `X-Frame-Options` or Content Security Policy headers. ScreenStack works best with:
- Internal tools and dashboards
- Publicly embeddable content (YouTube, documentation sites)
- Sites you control that allow iframe embedding
- GitHub Pages, CodePen, JSFiddle, etc.

**Sites that typically block embedding:**
- Google (search, Gmail, Drive)
- Facebook, Twitter, Instagram
- Banking sites
- Most news websites

## Development

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/screenstack.git
   cd screenstack
   ```

2. Serve the files with any static server:
   ```bash
   # Python 3
   python -m http.server 8000

   # Python 2
   python -m SimpleHTTPServer 8000

   # Node.js (with npx)
   npx serve
   ```

3. Open `http://localhost:8000` in your browser

### Project Structure

```
screenstack/
├── index.html          # Main HTML structure
├── style.css           # All styling (dark theme, grid, controls)
├── script.js           # Core application logic
├── README.md           # This file
└── LICENSE             # License information
```

### Code Overview

#### script.js

**Constants:**
- `STORAGE_KEY`: localStorage key for saving layouts
- `DEFAULT_LAYOUT`: Initial 2x2 grid configuration
- `LAYOUT_TEMPLATES`: Object containing all preset layouts

**Main Class: `ScreenStack`**
- `constructor()`: Initialize app, load saved/URL layout, render
- `init()`: Setup event listeners and initial render
- `render()`: Rebuild DOM from current layout state
- `createFrameElement()`: Generate HTML for a single iframe wrapper
- `createIframe()`: Create iframe element with security and zoom settings
- `addFrame()`: Add new frame to layout
- `removeFrame()`: Remove frame from layout
- `loadFrame()`: Load URL into specific frame
- `updateFrameURL()`: Update frame URL in state
- `updateFrameOption()`: Update frame property (zoom, sandbox)
- `applyTemplate()`: Switch to a preset layout template
- `saveLayout()`: Persist layout to localStorage
- `shareLayout()`: Generate and copy shareable URL
- `resetLayout()`: Return to default layout
- `loadLayout()`: Load from localStorage
- `loadFromURL()`: Parse and apply layout from URL hash
- `showNotification()`: Display temporary notification toast

#### style.css

**Key CSS Features:**
- Dark theme (`#1e1e1e` background)
- Flexbox toolbar layout
- CSS Grid for iframe container
- Grid area positioning for spanning frames
- Transform-based zoom with adjusted dimensions
- Responsive frame headers with form controls

### Making Changes

**Adding a New Layout Template:**

Edit `script.js` and add to `LAYOUT_TEMPLATES`:
```javascript
'my-layout': {
    grid: { cols: 3, rows: 2 },
    frames: [
        { url: '', sandbox: true, gridArea: '1 / 1 / 2 / 2', zoom: 1 },
        { url: '', sandbox: true, gridArea: '1 / 2 / 3 / 4', zoom: 1 },
        // gridArea format: row-start / col-start / row-end / col-end
    ]
}
```

Then add to dropdown in `index.html`:
```html
<option value="my-layout">My Custom Layout</option>
```

**Modifying Zoom Range:**

In `script.js`, find the zoom input creation (around line 184):
```javascript
zoomInput.min = '0.1';  // Minimum zoom
zoomInput.max = '3';    // Maximum zoom
zoomInput.step = '0.1'; // Increment step
```

**Changing Color Theme:**

Edit `style.css` color variables:
```css
body {
    background: #1e1e1e;  /* Main background */
    color: #e0e0e0;       /* Text color */
}
```

**Adjusting Grid Gap:**

In `style.css`, modify the grid container:
```css
#grid-container {
    gap: 8px;  /* Space between frames */
}
```

## Contributing

Contributions are welcome! Here's how:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Contribution Guidelines

- Keep it simple: No build tools, no frameworks, no dependencies
- Maintain privacy: No analytics, tracking, or external requests
- Test in multiple browsers (Chrome, Firefox, Safari)
- Follow existing code style (vanilla JS, readable formatting)
- Update README.md if adding features

### Ideas for Contributions

- [ ] Additional layout templates
- [ ] Keyboard shortcuts for common actions
- [ ] Drag-and-drop URL support
- [ ] Import/export layouts as JSON files
- [ ] Dark/light theme toggle
- [ ] Custom grid gap settings
- [ ] Frame title/label support
- [ ] Fullscreen mode for individual frames
- [ ] History/undo functionality

## Privacy

ScreenStack follows a zero-access philosophy:
- ✅ No user data collection
- ✅ No analytics or trackers
- ✅ No cookies
- ✅ No external requests (except user-loaded iframes)
- ✅ Everything stays local or is shared by explicit user choice

**What gets stored:**
- **localStorage**: Your saved layout (stays on your device)
- **URL hash**: Shared layouts (only when you click Share)

**What doesn't get stored:**
- Nothing is sent to any server
- No usage statistics
- No user identifiers

## Deployment

### GitHub Pages

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select source branch (usually `main`)
4. Site will be live at `https://yourusername.github.io/screenstack/`

### Custom Domain

1. Add `CNAME` file with your domain
2. Configure DNS:
   ```
   CNAME record: www.yourdomain.com → yourusername.github.io
   A records for apex domain pointing to GitHub Pages IPs
   ```

### Other Static Hosts

Works on any static file host:
- Netlify: Drag and drop the folder
- Vercel: Connect GitHub repo
- Cloudflare Pages: Connect repo
- AWS S3 + CloudFront: Upload files, enable static hosting

## Security

**Iframe Sandbox:**
By default, iframes use the `sandbox` attribute with:
- `allow-scripts`: JavaScript execution
- `allow-same-origin`: Access to storage/cookies (same origin)
- `allow-forms`: Form submission
- `allow-popups`: Opening new windows

Users can disable sandbox per-frame if needed (checkbox in frame header).

**CSP Considerations:**
If deploying with strict CSP, you may need to allow:
- `frame-src *` or specific domains for iframes
- `style-src 'unsafe-inline'` for dynamic zoom styles

## License

See [LICENSE](LICENSE) for details.

---

**Built with ❤️ by [CraniumCraze](https://craniumcraze.net)**

Part of the CraniumCraze family of privacy-first, zero-backend web tools.
