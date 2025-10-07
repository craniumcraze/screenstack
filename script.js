// ScreenStack - Main Application Logic
// Privacy-first, zero-backend iframe dashboard

const STORAGE_KEY = 'screenstack_layout';
const DEFAULT_LAYOUT = {
    grid: { cols: 2, rows: 2 },
    frames: [
        { url: '', sandbox: true, gridArea: '1 / 1 / 2 / 2', zoom: 1 },
        { url: '', sandbox: true, gridArea: '1 / 2 / 2 / 3', zoom: 1 },
        { url: '', sandbox: true, gridArea: '2 / 1 / 3 / 2', zoom: 1 },
        { url: '', sandbox: true, gridArea: '2 / 2 / 3 / 3', zoom: 1 }
    ]
};

const LAYOUT_TEMPLATES = {
    '2x2': {
        grid: { cols: 2, rows: 2 },
        frames: [
            { url: '', sandbox: true, gridArea: '1 / 1 / 2 / 2' },
            { url: '', sandbox: true, gridArea: '1 / 2 / 2 / 3' },
            { url: '', sandbox: true, gridArea: '2 / 1 / 3 / 2' },
            { url: '', sandbox: true, gridArea: '2 / 2 / 3 / 3' }
        ]
    },
    '3x3': {
        grid: { cols: 3, rows: 3 },
        frames: [
            { url: '', sandbox: true, gridArea: '1 / 1 / 2 / 2' },
            { url: '', sandbox: true, gridArea: '1 / 2 / 2 / 3' },
            { url: '', sandbox: true, gridArea: '1 / 3 / 2 / 4' },
            { url: '', sandbox: true, gridArea: '2 / 1 / 3 / 2' },
            { url: '', sandbox: true, gridArea: '2 / 2 / 3 / 3' },
            { url: '', sandbox: true, gridArea: '2 / 3 / 3 / 4' },
            { url: '', sandbox: true, gridArea: '3 / 1 / 4 / 2' },
            { url: '', sandbox: true, gridArea: '3 / 2 / 4 / 3' },
            { url: '', sandbox: true, gridArea: '3 / 3 / 4 / 4' }
        ]
    },
    '1x1': {
        grid: { cols: 1, rows: 1 },
        frames: [
            { url: '', sandbox: true, gridArea: '1 / 1 / 2 / 2' }
        ]
    },
    '2-left-1-right': {
        grid: { cols: 2, rows: 2 },
        frames: [
            { url: '', sandbox: true, gridArea: '1 / 1 / 2 / 2' },
            { url: '', sandbox: true, gridArea: '2 / 1 / 3 / 2' },
            { url: '', sandbox: true, gridArea: '1 / 2 / 3 / 3' }
        ]
    },
    '1-left-2-right': {
        grid: { cols: 2, rows: 2 },
        frames: [
            { url: '', sandbox: true, gridArea: '1 / 1 / 3 / 2' },
            { url: '', sandbox: true, gridArea: '1 / 2 / 2 / 3' },
            { url: '', sandbox: true, gridArea: '2 / 2 / 3 / 3' }
        ]
    },
    '2-top-1-bottom': {
        grid: { cols: 2, rows: 2 },
        frames: [
            { url: '', sandbox: true, gridArea: '1 / 1 / 2 / 2' },
            { url: '', sandbox: true, gridArea: '1 / 2 / 2 / 3' },
            { url: '', sandbox: true, gridArea: '2 / 1 / 3 / 3' }
        ]
    },
    '1-top-2-bottom': {
        grid: { cols: 2, rows: 2 },
        frames: [
            { url: '', sandbox: true, gridArea: '1 / 1 / 2 / 3' },
            { url: '', sandbox: true, gridArea: '2 / 1 / 3 / 2' },
            { url: '', sandbox: true, gridArea: '2 / 2 / 3 / 3' }
        ]
    }
};

class ScreenStack {
    constructor() {
        this.gridContainer = document.getElementById('grid-container');
        this.layout = this.loadLayout();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadFromURL();
        this.render();
    }

    setupEventListeners() {
        document.getElementById('add-frame').addEventListener('click', () => this.addFrame());
        document.getElementById('layout-template').addEventListener('change', (e) => this.applyTemplate(e.target.value));
        document.getElementById('save-layout').addEventListener('click', () => this.saveLayout());
        document.getElementById('share-layout').addEventListener('click', () => this.shareLayout());
        document.getElementById('reset-layout').addEventListener('click', () => this.resetLayout());
    }

    loadLayout() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                return JSON.parse(saved);
            }
        } catch (e) {
            console.warn('Failed to load saved layout:', e);
        }
        return JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
    }

    loadFromURL() {
        const hash = window.location.hash.substring(1);
        if (!hash) return;

        try {
            const params = new URLSearchParams(hash);
            const data = params.get('data');
            if (data) {
                const decoded = JSON.parse(atob(data));
                if (decoded.grid && decoded.frames) {
                    this.layout = decoded;
                    this.showNotification('Layout loaded from URL');
                }
            }
        } catch (e) {
            console.warn('Failed to load layout from URL:', e);
            this.showNotification('Failed to load layout from URL');
        }
    }

    render() {
        const { cols, rows } = this.layout.grid;
        this.gridContainer.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
        this.gridContainer.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

        this.gridContainer.innerHTML = '';

        this.layout.frames.forEach((frame, index) => {
            this.gridContainer.appendChild(this.createFrameElement(frame, index));
        });

        this.setupResizeHandles();
    }

    createFrameElement(frameData, index) {
        const wrapper = document.createElement('div');
        wrapper.className = 'frame-wrapper';
        wrapper.dataset.index = index;

        // Apply grid area if specified
        if (frameData.gridArea) {
            wrapper.style.gridArea = frameData.gridArea;
        }

        // Add resize handles
        this.addResizeHandles(wrapper, index);

        // Header
        const header = document.createElement('div');
        header.className = 'frame-header';

        // URL input
        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.placeholder = 'Enter URL (e.g., https://example.com)';
        urlInput.value = frameData.url || '';
        urlInput.addEventListener('change', (e) => {
            this.updateFrameURL(index, e.target.value);
        });

        // Load button
        const loadBtn = document.createElement('button');
        loadBtn.textContent = 'Load';
        loadBtn.addEventListener('click', () => {
            this.loadFrame(index, urlInput.value);
        });

        // Zoom control
        const zoomLabel = document.createElement('label');
        zoomLabel.title = 'Zoom level';
        zoomLabel.appendChild(document.createTextNode('Zoom:'));
        const zoomInput = document.createElement('input');
        zoomInput.type = 'number';
        zoomInput.min = '0.1';
        zoomInput.max = '3';
        zoomInput.step = '0.1';
        zoomInput.value = frameData.zoom || 1;
        zoomInput.style.width = '50px';
        zoomInput.addEventListener('change', (e) => {
            this.updateFrameOption(index, 'zoom', parseFloat(e.target.value) || 1);
        });
        zoomLabel.appendChild(zoomInput);

        // Sandbox checkbox
        const sandboxLabel = document.createElement('label');
        sandboxLabel.title = 'Enable sandbox for security';
        const sandboxCheck = document.createElement('input');
        sandboxCheck.type = 'checkbox';
        sandboxCheck.checked = frameData.sandbox !== false;
        sandboxCheck.addEventListener('change', (e) => {
            this.updateFrameOption(index, 'sandbox', e.target.checked);
        });
        sandboxLabel.appendChild(sandboxCheck);
        sandboxLabel.appendChild(document.createTextNode('Sandbox'));

        // Remove button
        const removeBtn = document.createElement('button');
        removeBtn.className = 'remove-frame';
        removeBtn.textContent = '×';
        removeBtn.title = 'Remove this frame';
        removeBtn.addEventListener('click', () => {
            this.removeFrame(index);
        });

        header.appendChild(urlInput);
        header.appendChild(loadBtn);
        header.appendChild(zoomLabel);
        header.appendChild(sandboxLabel);
        header.appendChild(removeBtn);

        // Content area
        const content = document.createElement('div');
        content.className = 'frame-content';

        // Create iframe if URL exists
        if (frameData.url) {
            this.createIframe(content, frameData);
        }

        wrapper.appendChild(header);
        wrapper.appendChild(content);

        return wrapper;
    }

    createIframe(container, frameData) {
        const iframe = document.createElement('iframe');
        iframe.src = frameData.url;

        if (frameData.sandbox !== false) {
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
        }

        iframe.setAttribute('loading', 'lazy');
        iframe.setAttribute('referrerpolicy', 'no-referrer');

        // Apply zoom
        const zoom = frameData.zoom || 1;
        if (zoom !== 1) {
            iframe.style.transform = `scale(${zoom})`;
            iframe.style.transformOrigin = 'top left';
            iframe.style.width = `${100 / zoom}%`;
            iframe.style.height = `${100 / zoom}%`;
        }

        container.innerHTML = '';
        container.appendChild(iframe);
    }

    updateFrameURL(index, url) {
        this.layout.frames[index].url = url;
        this.saveLayout();
    }

    loadFrame(index, url) {
        if (!url) {
            this.showNotification('Please enter a URL');
            return;
        }

        // Ensure URL has protocol
        if (!url.match(/^https?:\/\//i)) {
            url = 'https://' + url;
        }

        this.layout.frames[index].url = url;
        this.saveLayout();
        this.render();
    }

    updateFrameOption(index, option, value) {
        this.layout.frames[index][option] = value;
        this.saveLayout();
        this.render();
    }

    addFrame() {
        const totalFrames = this.layout.frames.length;
        const cols = this.layout.grid.cols;
        const rows = this.layout.grid.rows;

        // Calculate next available position
        const newRow = Math.floor(totalFrames / cols) + 1;
        const newCol = (totalFrames % cols) + 1;

        // Expand grid if needed
        if (newRow > rows) {
            this.layout.grid.rows = newRow;
        }

        const gridArea = `${newRow} / ${newCol} / ${newRow + 1} / ${newCol + 1}`;
        this.layout.frames.push({ url: '', sandbox: true, gridArea, zoom: 1 });

        this.saveLayout();
        this.render();
    }

    removeFrame(index) {
        if (this.layout.frames.length <= 1) {
            this.showNotification('Must have at least one frame');
            return;
        }

        this.layout.frames.splice(index, 1);
        this.saveLayout();
        this.render();
    }

    saveLayout() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.layout));
            this.showNotification('Layout saved');
        } catch (e) {
            console.error('Failed to save layout:', e);
            this.showNotification('Failed to save layout');
        }
    }

    shareLayout() {
        try {
            const encoded = btoa(JSON.stringify(this.layout));
            const url = `${window.location.origin}${window.location.pathname}#data=${encoded}`;

            navigator.clipboard.writeText(url).then(() => {
                this.showNotification('Share link copied to clipboard');
            }).catch(() => {
                // Fallback: show the URL
                prompt('Copy this URL to share:', url);
            });
        } catch (e) {
            console.error('Failed to create share link:', e);
            this.showNotification('Failed to create share link');
        }
    }

    applyTemplate(templateKey) {
        if (!templateKey || !LAYOUT_TEMPLATES[templateKey]) {
            return;
        }

        const template = JSON.parse(JSON.stringify(LAYOUT_TEMPLATES[templateKey]));

        // Preserve URLs from current frames if they exist
        template.frames.forEach((frame, index) => {
            if (this.layout.frames[index]) {
                frame.url = this.layout.frames[index].url;
                frame.sandbox = this.layout.frames[index].sandbox;
            }
        });

        this.layout = template;
        this.saveLayout();
        this.render();

        // Reset dropdown
        document.getElementById('layout-template').value = '';
    }

    addResizeHandles(wrapper, index) {
        const handles = [
            'nw', 'n', 'ne',
            'w', 'e',
            'sw', 's', 'se'
        ];

        handles.forEach(direction => {
            const handle = document.createElement('div');
            handle.className = `resize-handle resize-${direction}`;

            if (direction.length === 1) {
                handle.classList.add('edge');
            } else {
                handle.classList.add('corner');
            }

            handle.addEventListener('mousedown', (e) => this.startResize(e, wrapper, index, direction));
            wrapper.appendChild(handle);
        });
    }

    startResize(e, wrapper, index, direction) {
        e.preventDefault();
        e.stopPropagation();

        const startX = e.clientX;
        const startY = e.clientY;
        const startRect = wrapper.getBoundingClientRect();
        const gridRect = this.gridContainer.getBoundingClientRect();

        const onMouseMove = (e) => {
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;

            let newRect = {
                top: startRect.top - gridRect.top,
                left: startRect.left - gridRect.left,
                width: startRect.width,
                height: startRect.height
            };

            // Apply deltas based on resize direction
            if (direction.includes('n')) {
                newRect.top += deltaY;
                newRect.height -= deltaY;
            }
            if (direction.includes('s')) {
                newRect.height += deltaY;
            }
            if (direction.includes('w')) {
                newRect.left += deltaX;
                newRect.width -= deltaX;
            }
            if (direction.includes('e')) {
                newRect.width += deltaX;
            }

            // Apply minimum sizes
            newRect.width = Math.max(200, newRect.width);
            newRect.height = Math.max(200, newRect.height);

            // Snap to grid edges
            newRect = this.snapToGrid(newRect, wrapper);

            // Apply new position and size
            wrapper.style.position = 'absolute';
            wrapper.style.left = `${newRect.left}px`;
            wrapper.style.top = `${newRect.top}px`;
            wrapper.style.width = `${newRect.width}px`;
            wrapper.style.height = `${newRect.height}px`;
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }

    snapToGrid(rect, currentWrapper) {
        const snapThreshold = 10; // pixels
        const wrappers = this.gridContainer.querySelectorAll('.frame-wrapper');
        const gridRect = this.gridContainer.getBoundingClientRect();

        wrappers.forEach(wrapper => {
            if (wrapper === currentWrapper) return;

            const otherRect = wrapper.getBoundingClientRect();
            const relativeRect = {
                top: otherRect.top - gridRect.top,
                left: otherRect.left - gridRect.left,
                right: otherRect.right - gridRect.left,
                bottom: otherRect.bottom - gridRect.top
            };

            // Snap left edge to other's right edge
            if (Math.abs(rect.left - relativeRect.right) < snapThreshold) {
                rect.left = relativeRect.right;
            }
            // Snap right edge to other's left edge
            if (Math.abs((rect.left + rect.width) - relativeRect.left) < snapThreshold) {
                rect.width = relativeRect.left - rect.left;
            }
            // Snap top edge to other's bottom edge
            if (Math.abs(rect.top - relativeRect.bottom) < snapThreshold) {
                rect.top = relativeRect.bottom;
            }
            // Snap bottom edge to other's top edge
            if (Math.abs((rect.top + rect.height) - relativeRect.top) < snapThreshold) {
                rect.height = relativeRect.top - rect.top;
            }

            // Snap to same edges (alignment)
            if (Math.abs(rect.left - relativeRect.left) < snapThreshold) {
                rect.left = relativeRect.left;
            }
            if (Math.abs((rect.left + rect.width) - relativeRect.right) < snapThreshold) {
                rect.width = relativeRect.right - rect.left;
            }
            if (Math.abs(rect.top - relativeRect.top) < snapThreshold) {
                rect.top = relativeRect.top;
            }
            if (Math.abs((rect.top + rect.height) - relativeRect.bottom) < snapThreshold) {
                rect.height = relativeRect.bottom - rect.top;
            }
        });

        return rect;
    }

    setupResizeHandles() {
        // Resize handles are now added per-frame in addResizeHandles()
    }

    resetLayout() {
        if (confirm('Reset to default layout? This will clear all frames.')) {
            this.layout = JSON.parse(JSON.stringify(DEFAULT_LAYOUT));
            this.saveLayout();
            this.render();
            window.location.hash = '';
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ScreenStack());
} else {
    new ScreenStack();
}
