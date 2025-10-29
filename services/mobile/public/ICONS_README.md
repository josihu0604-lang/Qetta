# PWA Icons Guide

## Required Icons

For full PWA support, you need to add the following icon files to this directory:

### Icon Sizes

1. **icon-192.png** (192x192 pixels)
   - Used for PWA app icon on Android
   - Required by manifest.json

2. **icon-512.png** (512x512 pixels)
   - Used for high-resolution displays
   - Required by manifest.json
   - Also used for splash screens

3. **apple-touch-icon.png** (180x180 pixels) [Optional]
   - Used for iOS home screen icon
   - Recommended for better iOS experience

### Design Guidelines

- **Background**: Use the Hephaitos primary blue (#3b82f6) as background
- **Logo**: White or light-colored Hephaitos logo in center
- **Padding**: Leave 10-15% padding around the logo
- **Format**: PNG with transparency (if applicable)
- **Style**: Simple, recognizable, works at small sizes

### Quick Generation

You can generate icons using:
- **Figma/Sketch**: Export at exact sizes
- **ImageMagick**: Resize from a larger source
- **Online tools**: Use PWA icon generators

Example using ImageMagick:
\`\`\`bash
# From a 1024x1024 source
convert source.png -resize 192x192 icon-192.png
convert source.png -resize 512x512 icon-512.png
\`\`\`

### Current Status

⚠️ **Icons not yet added** - Add your icons here before deploying to production.

For now, the manifest.json references these paths, but the actual image files need to be created by the design team.
