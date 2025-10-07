# ScreenStack

A lightweight, privacy-first web app that lets you open and arrange multiple web pages in resizable, grid-snapped iframes — all within one browser window.

## What It Does

ScreenStack creates a minimalist browser dashboard where you can:
- View multiple websites side-by-side in a flexible grid layout
- Resize and arrange frames to compare or monitor content
- Save layouts locally and share them via encoded URLs
- Control sandbox settings and frame options per iframe

## Key Features

- **Zero Backend**: Fully static, runs entirely in your browser
- **Privacy First**: No sign-ups, no tracking, no data sent anywhere
- **Local Storage**: Layouts persist automatically using localStorage
- **Shareable**: Export layouts as encoded URL parameters
- **Lightweight**: Under 100 KB total with no dependencies

## Technical Details

Built with vanilla HTML, CSS, and JavaScript. Deployable as a static site via GitHub Pages.

**Important Limitation**: Many sites prevent embedding via `X-Frame-Options` or CSP headers. ScreenStack works best with:
- Internal tools and dashboards
- Publicly embeddable pages (YouTube, GitHub Pages, documentation)
- Sites that allow iframe embedding

## Usage

Visit [https://screenstack.craniumcraze.net](https://screenstack.craniumcraze.net) to start using ScreenStack. No installation required.

## Development

This is a static site with no build process:
- `index.html` - Main application structure
- `style.css` - Grid layout and styling
- `script.js` - Frame management and persistence logic

## Privacy

ScreenStack follows a zero-access philosophy:
- No user data collection
- No analytics or trackers
- No cookies
- Everything stays local or is shared by explicit user choice

## License

See [LICENSE](LICENSE) for details.

---

Part of the [CraniumCraze](https://craniumcraze.net) family of privacy-first tools.
