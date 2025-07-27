# Cyberpunk Theme Installation Guide

Your cyberpunk theme has been successfully installed! Here's what was added:

## What's New

### 1. Cyberpunk Theme Colors
- Dark, high-contrast background with neon accents (WCAG AA compliant)
- Improved contrast ratios for better readability
- Bright cyan and magenta highlights with sufficient luminance
- Monospace font preference for that terminal aesthetic
- Subtle, accessible glow effects and gentle animations

### 2. Theme Switcher Component
- Located at `/src/components/theme-switcher.tsx`
- Dropdown menu with Light, Dark, and Cyberpunk options
- Icons change based on the current theme

### 3. Updated Components
- **Theme Provider**: Now supports the cyberpunk theme
- **App Sidebar**: Uses the new theme switcher
- **Layout**: Updated to include all three themes

## How to Use

### Quick Start
1. The theme switcher is already added to your sidebar
2. Click the theme icon in the top-right of the sidebar
3. Select "Cyberpunk" from the dropdown

### Manual Theme Setting
```typescript
import { useTheme } from "next-themes"

const { setTheme } = useTheme()
setTheme("cyberpunk")
```

### Adding the Theme Switcher Elsewhere
```tsx
import { ThemeSwitcher } from "@/components/theme/theme-switcher"

// Use anywhere in your app
<ThemeSwitcher />
```

## Customization

### Color Scheme
The cyberpunk theme uses these main colors with improved accessibility:
- **Primary**: Bright magenta with increased luminance for better contrast
- **Accent**: Neon green optimized for readability
- **Background**: Slightly lighter dark blue-gray for better text visibility
- **Text**: High-contrast light cyan (98% lightness) for optimal readability
- **Focus States**: Clear, high-contrast outlines for keyboard navigation

### Accessibility Features

#### Visual Accessibility
- **High Contrast**: All text meets WCAG AA standards (4.5:1 contrast ratio minimum)
- **Color Independence**: Information isn't conveyed by color alone
- **Focus Indicators**: Clear, visible focus states for keyboard navigation
- **Reduced Motion**: Gentle animations that respect `prefers-reduced-motion`

#### Cognitive Accessibility
- **Readable Fonts**: JetBrains Mono chosen for clarity and dyslexia-friendliness
- **Consistent Patterns**: UI elements behave predictably
- **Clear Hierarchy**: Proper heading structure and semantic markup
- **Sufficient Spacing**: Adequate white space between interactive elements

#### Motor Accessibility
- **Large Touch Targets**: Minimum 44px for touch interfaces
- **Keyboard Navigation**: Full keyboard accessibility maintained
- **No Time Limits**: Static interface without time-based interactions

### Modify Colors
Edit `/src/app/globals.css` and look for the `.cyberpunk` class to customize colors:

```css
.cyberpunk {
  --primary: oklch(0.75 0.25 320); /* Accessible magenta */
  --accent: oklch(0.82 0.28 140); /* High-contrast green */
  --background: oklch(0.12 0.02 240); /* Readable dark blue */
  --foreground: oklch(0.98 0.05 180); /* High-contrast text */
  /* ... other colors optimized for accessibility */
}
```

### Add More Effects
The theme includes accessible visual effects. You can enhance it by adding:
- Subtle animations (avoid rapid flashing)
- Gentle text shadows
- Soft border glows
- Background patterns with sufficient contrast
- **Note**: Always test additions for accessibility compliance

## Font Recommendation

For the full cyberpunk experience, consider installing these fonts:
- **JetBrains Mono** (already included)
- **Fira Code**
- **Courier Prime**

The theme will automatically use monospace fonts when available.

## Browser Support

The theme uses modern CSS features:
- CSS Custom Properties (variables)
- OKLCH color space for better color mixing
- CSS animations

Supported browsers: Chrome 88+, Firefox 113+, Safari 15+

## Troubleshooting

### Theme Not Switching
- Make sure you're using the `next-themes` package
- Verify the theme provider is wrapping your app
- Check that JavaScript is enabled

### Colors Look Wrong
- Ensure your browser supports OKLCH colors
- Try refreshing the page
- Clear browser cache if needed

### Accessibility Concerns
- Use browser accessibility tools to verify contrast ratios
- Test with keyboard navigation only
- Check with screen readers if possible
- Verify the theme works with browser zoom up to 200%

### Performance Issues
- The glow effects use CSS filters, which can impact performance on older devices
- Consider reducing effects on mobile devices

## Next Steps

Want to take it further? Consider adding:
- Sound effects for theme switching
- Matrix-style background animations
- Custom cursor effects
- Neon border animations for interactive elements

Enjoy your new cyberpunk theme! 🚀✨
