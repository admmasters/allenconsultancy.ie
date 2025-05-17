# Allen Consultancy Website Style Guide

This document outlines the styling approach used in the Allen Consultancy website.

## Style Architecture

The website uses Astro's component-based structure to maintain a consistent visual identity while allowing for page-specific customizations.

### Global Styles

Global styles are provided through the `GlobalStyles.astro` component, which uses `is:global` to apply styles across the entire site. This includes:

- CSS Variables for colors, fonts, etc.
- Base element styling
- Layout containers
- Navigation styling
- Basic typography

```astro
<!-- Example of how global styles are implemented -->
<style is:global>
  :root {
    --color-primary: #e67e22;
    --color-text: #ffffff;
  }
  
  body {
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    color: var(--color-text);
    line-height: 1.5;
  }
</style>
```

### Utility Styles

Common utility classes are defined in `UtilityStyles.astro`:

- Animation classes
- Spacing utilities
- Button styles
- Hover effects

```astro
<!-- Example of utility styles -->
<style is:global>
  .animate-item {
    opacity: 0;
    animation: fadeInUp 0.6s ease forwards;
  }
  
  .hover-translate {
    transition: transform 0.3s ease;
  }
  
  .hover-translate:hover {
    transform: translateX(5px);
  }
</style>
```

### Page Styles

The `PageStyles.astro` component provides consistent page structure:

- Page containers
- Page headers
- Content areas
- CTA sections

This component uses scoped styles for its own elements but also exports some global styles using `:global()` for components that need them.

```astro
<!-- Example of page styles -->
<style>
  .page-container {
    padding: 2rem 0;
  }

  :global(.cta-button) {
    display: inline-block;
    background-color: var(--color-primary);
    color: var(--color-text);
  }
</style>
```

### Component-Specific Styles

Components like `ServiceCard.astro` and `Button.astro` have their own scoped styles, maintaining clean organization and preventing style conflicts.

## How to Use

1. Import global styles in the Layout component:
   ```astro
   import GlobalStyles from "../components/GlobalStyles.astro";
   import UtilityStyles from "../components/UtilityStyles.astro";
   
   // In the <head> section
   <GlobalStyles />
   <UtilityStyles />
   ```

2. Include page styles in each page:
   ```astro
   import PageStyles from "../components/PageStyles.astro";
   
   <PageStyles />
   ```

3. Use utility classes in your markup:
   ```html
   <div class="animate-item hover-translate">
     <h1>Title</h1>
   </div>
   ```

4. For page-specific styles, add a style block at the end of the page file:
   ```astro
   <style>
     /* Page-specific styles */
     .about-container p {
       margin-bottom: 1.5rem;
     }
   </style>
   ```

5. Use components with their own scoped styles:
   ```astro
   <Button text="Inquire About Services" href="/contact" variant="primary" />
   ```

## Best Practices

1. Use global styles sparingly - limit to truly global elements
2. Prefer scoped styles for components
3. Use utility classes for common patterns
4. Use CSS variables for consistent colors, spacing, etc.
5. Use `:global()` selector only when necessary to style children of a component
