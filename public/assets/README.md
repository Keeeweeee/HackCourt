# HackCourt Assets

## Background Image System

### Courtroom Background Image
- **File**: `courtroom-placeholder.jpg`
- **Purpose**: Main background image for the courtroom interface
- **Requirements**:
  - High resolution (minimum 1920x1080)
  - Professional courtroom or legal setting
  - Suitable for desaturation (will be filtered to 70% saturation)
  - Works well with dark overlay (70% opacity)

### Usage
The background image is referenced via CSS custom property:
```css
--court-bg-image: url("/assets/courtroom-placeholder.jpg");
```

### Swapping Images
To change the background image:
1. Replace `courtroom-placeholder.jpg` with your desired image
2. Keep the same filename, or update the CSS variable in `style.css`
3. Ensure the new image meets the requirements above

### Current Status
- **Placeholder**: Currently references a placeholder file
- **Fallback**: System gracefully falls back to marble texture if image is missing
- **Overlay**: Dark gradient overlay ensures text readability regardless of image content