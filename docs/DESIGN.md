# Design Guidelines - Chakra UI v3

This document explains how to use and customize Chakra UI v3 in this project.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Using Components](#using-components)
3. [Customizing the Theme](#customizing-the-theme)
4. [Creating Custom Components](#creating-custom-components)
5. [Color Mode (Dark/Light)](#color-mode-darklight)
6. [Best Practices](#best-practices)

---

## Architecture Overview

### The Component Structure

```
src/
├── theme/
│   └── system.ts           # Theme configuration
├── components/
│   └── ui/                 # Reusable UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── dialog.tsx
│       ├── tabs.tsx
│       └── ...
└── context/
    └── index.tsx           # Chakra Provider setup
```

### How It Works

1. **Theme System** ([src/theme/system.ts](src/theme/system.ts))
   - Uses Chakra's `defaultConfig` which includes all default recipes, tokens, and styling
   - Can be extended with custom colors, breakpoints, and design tokens

2. **UI Components** ([src/components/ui/](src/components/ui/))
   - Wrapper components that re-export or enhance Chakra components
   - Provides a single place to customize component behavior
   - Makes it easy to swap implementations without changing imports

3. **Provider Setup** ([src/context/index.tsx](src/context/index.tsx))
   - Wraps the app with `ChakraProvider` and `ColorModeProvider`
   - Manages global theme state

---

## Using Components

### Basic Import Pattern

Instead of importing directly from `@chakra-ui/react`:

```tsx
// ❌ Don't do this
import { Button, Input } from '@chakra-ui/react'

// ✅ Do this
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
```

### Available UI Components

All components in [src/components/ui/](src/components/ui/) are available:

```tsx
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { IconButton } from '@/components/ui/icon-button'
import { Badge } from '@/components/ui/badge'
import { Code } from '@/components/ui/code'
import { Skeleton } from '@/components/ui/skeleton'
import { Field } from '@/components/ui/field'
import { ListRoot, ListItem } from '@/components/ui/list'
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from '@/components/ui/dialog'
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from '@/components/ui/menu'
import { toaster } from '@/components/ui/toaster'
```

### Using Chakra Props

All Chakra styling props work as expected:

```tsx
<Button
  colorScheme="blue"
  size="lg"
  variant="solid"
  _hover={{ bg: 'blue.600' }}
>
  Click me
</Button>

<Box
  p={4}
  bg="gray.800"
  borderRadius="md"
  _hover={{ transform: 'scale(1.05)' }}
>
  Content
</Box>
```

### Layout Components

For layout components (Box, Flex, Container, etc.), import directly from Chakra:

```tsx
import { Box, Flex, Container, VStack, HStack } from '@chakra-ui/react'
```

---

## Customizing the Theme

### 1. Modify the Theme System

Edit [src/theme/system.ts](src/theme/system.ts) to customize your design tokens:

```typescript
import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  ...defaultConfig,

  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#e3f2f9' },
          100: { value: '#c5e4f3' },
          500: { value: '#0088cc' },
          900: { value: '#003f5e' },
        },
      },
      fonts: {
        heading: { value: 'Inter, sans-serif' },
        body: { value: 'Inter, sans-serif' },
      },
    },
    semanticTokens: {
      colors: {
        'bg-primary': {
          value: { _light: '{colors.white}', _dark: '{colors.gray.900}' },
        },
      },
    },
  },

  globalCss: {
    'html, body': {
      bg: 'bg-primary',
      color: 'gray.50',
    },
  },
})

export const system = createSystem(config)
```

### 2. Available Customizations

#### Colors

```typescript
theme: {
  tokens: {
    colors: {
      brand: {
        50: { value: '#your-color' },
        // ... 100-900
      },
      accent: {
        // Custom color palette
      },
    },
  },
}
```

#### Typography

```typescript
theme: {
  tokens: {
    fonts: {
      heading: { value: 'Your Font, sans-serif' },
      body: { value: 'Your Font, sans-serif' },
      mono: { value: 'Fira Code, monospace' },
    },
    fontSizes: {
      xs: { value: '0.75rem' },
      sm: { value: '0.875rem' },
      // ... customize sizes
    },
  },
}
```

#### Spacing

```typescript
theme: {
  tokens: {
    spacing: {
      xs: { value: '0.5rem' },
      sm: { value: '0.75rem' },
      // ... customize spacing
    },
  },
}
```

#### Breakpoints

```typescript
theme: {
  breakpoints: {
    sm: '320px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
}
```

---

## Creating Custom Components

### Method 1: Wrap and Customize

Create a custom component that wraps a Chakra component with your defaults:

```typescript
// src/components/ui/primary-button.tsx
import { Button } from '@chakra-ui/react'
import { forwardRef } from 'react'

export const PrimaryButton = forwardRef<HTMLButtonElement, Button.RootProps>(
  function PrimaryButton(props, ref) {
    return (
      <Button
        ref={ref}
        colorScheme="brand"
        size="lg"
        _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
        {...props}
      />
    )
  }
)
```

### Method 2: Create a Recipe

Define reusable component variants in your theme:

```typescript
// src/theme/system.ts
import { defineRecipe } from '@chakra-ui/react'

const buttonRecipe = defineRecipe({
  base: {
    fontWeight: 'bold',
    borderRadius: 'md',
  },
  variants: {
    visual: {
      primary: {
        bg: 'brand.500',
        color: 'white',
        _hover: { bg: 'brand.600' },
      },
      secondary: {
        bg: 'gray.200',
        color: 'gray.800',
        _hover: { bg: 'gray.300' },
      },
    },
    size: {
      sm: { fontSize: 'sm', px: 3, py: 2 },
      md: { fontSize: 'md', px: 4, py: 2 },
      lg: { fontSize: 'lg', px: 6, py: 3 },
    },
  },
  defaultVariants: {
    visual: 'primary',
    size: 'md',
  },
})

const config = defineConfig({
  ...defaultConfig,
  theme: {
    recipes: {
      button: buttonRecipe,
    },
  },
})
```

### Method 3: Component Composition

Build complex components from simpler ones:

```tsx
// src/components/ui/card.tsx
import { Box, Heading, Text } from '@chakra-ui/react'
import { forwardRef } from 'react'

interface CardProps {
  title: string
  description?: string
  children: React.ReactNode
}

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { title, description, children, ...props },
  ref
) {
  return (
    <Box
      ref={ref}
      p={6}
      bg="gray.800"
      borderRadius="lg"
      borderWidth="1px"
      borderColor="gray.700"
      _hover={{ borderColor: 'brand.500', transform: 'translateY(-2px)' }}
      transition="all 0.2s"
      {...props}
    >
      <Heading size="md" mb={2}>
        {title}
      </Heading>
      {description && (
        <Text fontSize="sm" color="gray.400" mb={4}>
          {description}
        </Text>
      )}
      {children}
    </Box>
  )
})
```

---

## Color Mode (Dark/Light)

### Using Color Mode

The project uses `next-themes` for color mode management:

```tsx
import { useColorMode } from '@/components/ui/color-mode'

function MyComponent() {
  const { colorMode, setColorMode, toggleColorMode } = useColorMode()

  return (
    <Button onClick={toggleColorMode}>
      Switch to {colorMode === 'light' ? 'dark' : 'light'} mode
    </Button>
  )
}
```

### Color Mode Values

Use semantic tokens that adapt to color mode:

```tsx
<Box
  bg="gray.800" // Static - always gray.800
  color="fg" // Semantic - adapts to light/dark
>
  Content
</Box>
```

### Defining Semantic Tokens

```typescript
// src/theme/system.ts
theme: {
  semanticTokens: {
    colors: {
      'bg-canvas': {
        value: { _light: '{colors.white}', _dark: '{colors.gray.900}' },
      },
      'text-primary': {
        value: { _light: '{colors.gray.900}', _dark: '{colors.gray.50}' },
      },
    },
  },
}
```

### Color Mode Button

A pre-built color mode toggle button is available:

```tsx
import { ColorModeButton } from '@/components/ui/color-mode'

function Header() {
  return (
    <nav>
      {/* ... other nav items */}
      <ColorModeButton />
    </nav>
  )
}
```

---

## Best Practices

### 1. Component Organization

```
✅ Good Structure:
src/components/
├── ui/              # Reusable, generic UI components
│   ├── button.tsx
│   ├── input.tsx
│   └── dialog.tsx
└── features/        # Feature-specific components
    ├── UserProfile.tsx
    └── AuthForm.tsx
```

### 2. Consistent Imports

```tsx
// ✅ Do this - consistent pattern
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Box, Flex } from '@chakra-ui/react'

// ❌ Don't mix patterns
import { Button } from '@chakra-ui/react'
import { Input } from '@/components/ui/input'
```

### 3. Use Design Tokens

```tsx
// ✅ Use design tokens
<Box p={4} bg="gray.800" color="gray.50" />

// ❌ Avoid hardcoded values
<Box padding="16px" backgroundColor="#1a202c" color="#f7fafc" />
```

### 4. Leverage Responsive Props

```tsx
// ✅ Responsive design with Chakra
<Box p={{ base: 4, md: 6, lg: 8 }} fontSize={{ base: 'sm', md: 'md' }}>
  Responsive content
</Box>
```

### 5. Component Composition

```tsx
// ✅ Compose components
<VStack gap={4}>
  <Heading>Title</Heading>
  <Text>Description</Text>
  <Button>Action</Button>
</VStack>

// ❌ Don't recreate functionality
<div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
  {/* ... */}
</div>
```

### 6. Toast Notifications

```tsx
import { toaster } from '@/components/ui/toaster'

// Show a toast
toaster.create({
  title: 'Success!',
  description: 'Your action completed successfully',
  type: 'success',
  duration: 3000,
})
```

### 7. Form Fields

```tsx
import { Field } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
;<Field label="Email" required invalid={hasError}>
  <Input type="email" placeholder="Enter your email" />
  {hasError && <Field.ErrorText>Email is required</Field.ErrorText>}
</Field>
```

---

## Common Patterns

### Modal Dialog

```tsx
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogBody,
  DialogFooter,
  DialogCloseTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

function MyModal({ isOpen, onClose }) {
  return (
    <DialogRoot open={isOpen} onOpenChange={e => (e.open ? null : onClose())}>
      <DialogContent>
        <DialogHeader>Modal Title</DialogHeader>
        <DialogCloseTrigger />
        <DialogBody>
          <Text>Modal content goes here</Text>
        </DialogBody>
        <DialogFooter>
          <Button onClick={onClose}>Cancel</Button>
          <Button colorScheme="blue">Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </DialogRoot>
  )
}
```

### Tabs

```tsx
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
;<TabsRoot defaultValue="tab1">
  <TabsList>
    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
    <TabsTrigger value="tab2">Tab 2</TabsTrigger>
  </TabsList>
  <TabsContent value="tab1">Content 1</TabsContent>
  <TabsContent value="tab2">Content 2</TabsContent>
</TabsRoot>
```

### Menu

```tsx
import { MenuRoot, MenuTrigger, MenuContent, MenuItem } from '@/components/ui/menu'
import { Button } from '@/components/ui/button'
;<MenuRoot>
  <MenuTrigger asChild>
    <Button>Options</Button>
  </MenuTrigger>
  <MenuContent>
    <MenuItem value="edit">Edit</MenuItem>
    <MenuItem value="delete">Delete</MenuItem>
  </MenuContent>
</MenuRoot>
```

---

## Resources

- [Chakra UI v3 Documentation](https://www.chakra-ui.com)
- [Chakra UI Recipes](https://www.chakra-ui.com/docs/styling/recipes)
- [Chakra UI Tokens](https://www.chakra-ui.com/docs/theming/tokens)
- [Next Themes Documentation](https://github.com/pacocoursey/next-themes)

---

## Need Help?

If you encounter issues or need clarification:

1. Check the [Chakra UI v3 docs](https://www.chakra-ui.com)
2. Look at existing component usage in [src/components/](src/components/)
3. Review the theme configuration in [src/theme/system.ts](src/theme/system.ts)

Happy coding! 🎨
