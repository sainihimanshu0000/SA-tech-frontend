# Component Usage Guide

## 📦 Reusable Components

All components are in `src/components/UI.jsx`. Here's how to use them:

---

## Button Component

### Variants

```jsx
import { Button } from '../components/UI'

// Primary (default)
<Button>Click me</Button>

// Secondary
<Button variant="secondary">Secondary</Button>

// Accent (yellow)
<Button variant="accent">Accent</Button>

// Outline
<Button variant="outline">Outline</Button>

// Ghost (text only)
<Button variant="ghost">Ghost</Button>
```

### Sizes

```jsx
<Button size="sm">Small</Button>
<Button size="md">Medium (default)</Button>
<Button size="lg">Large</Button>
```

### With Icons

```jsx
import { IoCart } from 'react-icons/io5'

<Button>
  <IoCart /> Add to Cart
</Button>
```

### Disabled State

```jsx
<Button disabled>Disabled</Button>
<Button disabled loading>Loading...</Button>
```

---

## Card Component

Basic card with hover effect:

```jsx
import { Card } from '../components/UI'

<Card hover>
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</Card>
```

Without hover effect:

```jsx
<Card hover={false}>
  Content without hover animation
</Card>
```

---

## Input Component

With label and error:

```jsx
import { Input } from '../components/UI'

<Input 
  label="Email Address"
  type="email"
  placeholder="your@email.com"
  value={email}
  onChange={e => setEmail(e.target.value)}
/>
```

With error state:

```jsx
<Input 
  label="Username"
  error="Username already taken"
  value={username}
  onChange={e => setUsername(e.target.value)}
/>
```

---

## Badge Component

Color-coded status badges:

```jsx
import { Badge } from '../components/UI'

<Badge color="primary">Plants</Badge>
<Badge color="secondary">Seeds</Badge>
<Badge color="accent">On Sale</Badge>
<Badge color="success">In Stock</Badge>
```

---

## SkeletonLoader Component

Animated placeholder for loading states:

```jsx
import { SkeletonLoader } from '../components/UI'

// Load 6 skeleton cards
<SkeletonLoader count={6} />
```

Perfect for:
- Product grid loading
- List item placeholders
- Content shimmer effect

---

## Navbar Component

Sticky navigation with mobile menu:

```jsx
import Navbar from './components/Navbar'

<Navbar />
```

Features:
- Logo with icon
- Search bar (hidden on mobile)
- Cart icon with badge
- Mobile hamburger menu
- Responsive design

---

## Footer Component

Complete footer with links and social media:

```jsx
import Footer from './components/Footer'

<Footer />
```

Sections:
- Brand info
- Quick links
- Support links
- Contact info
- Social media icons

---

## ProductCard Component

Display product in grid:

```jsx
import ProductCard from './components/ProductCard'

<ProductCard 
  product={product}
  onAddToCart={(product) => handleAddToCart(product)}
/>
```

Displays:
- Product image
- Category badge
- Price
- Average rating
- Stock status
- Add to cart button

---

## Toast Component

Notification messages:

```jsx
import Toast from './components/Toast'

<Toast 
  type="success"
  message="Item added to cart!"
  onClose={() => setShowToast(false)}
/>
```

Types: `success`, `error`, `warning`, `info`

---

## Component Combination Examples

### Product Grid with Loading

```jsx
import { SkeletonLoader } from '../components/UI'
import ProductCard from './ProductCard'

{loading ? (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <SkeletonLoader count={6} />
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {products.map(p => (
      <ProductCard key={p._id} product={p} />
    ))}
  </div>
)}
```

### Form with Inputs and Button

```jsx
import { Input, Button } from '../components/UI'
import { useState } from 'react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <form>
      <Input
        label="Email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Button className="w-full">Sign In</Button>
    </form>
  )
}
```

### Status Badge with Card

```jsx
import { Card, Badge } from '../components/UI'

<Card>
  <div className="flex justify-between items-center">
    <h3>Order #12345</h3>
    <Badge color="success">Delivered</Badge>
  </div>
</Card>
```

---

## Styling Utilities

All components use Tailwind CSS classes. Customize with:

```jsx
// Add custom classes
<Button className="w-full" size="lg">
  Full Width Large Button
</Button>

<Card className="mb-6 p-8">
  Custom styled card
</Card>
```

---

## Color System in Components

### Available Colors

```
Primary Green: agro-primary
Light Green: agro-primary-light
Yellow: agro-accent
Background: agro-background
Dark: agro-dark
Gray: agro-gray
Error: agro-error
```

### Using in Custom Classes

```jsx
<div className="bg-agro-background border-agro-primary text-agro-dark">
  Custom component with color system
</div>
```

---

## Responsive Utilities

Components are responsive by default. Use Tailwind breakpoints:

```jsx
<div className="text-sm md:text-base lg:text-lg">
  Responsive text size
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  Responsive grid
</div>

<div className="hidden md:block">
  Visible only on tablet+
</div>
```

---

## Animation Classes

Pre-built animations available:

```jsx
// Float animation
<div className="animate-float">
  🌾
</div>

// Slide in
<div className="animate-slide-in">
  Slides in from left
</div>

// Fade in
<div className="animate-fade-in">
  Fades in smoothly
</div>

// Pulse (for skeletons)
<div className="animate-pulse-soft">
  Gentle pulse
</div>
```

---

## Shadow Utilities

Custom shadows for hierarchy:

```jsx
<div className="shadow-soft">Subtle shadow</div>
<div className="shadow-card">Card shadow</div>
<div className="shadow-hover">Hover shadow</div>
```

---

## Tips & Best Practices

1. **Accessibility**: Always use labels with inputs
2. **Loading States**: Show skeleton loaders while fetching
3. **Error Handling**: Display validation errors in inputs
4. **Mobile First**: Test on mobile before desktop
5. **Consistency**: Use the same button variants throughout
6. **Spacing**: Use Tailwind's spacing scale (p-4, m-6, gap-3, etc.)
7. **Colors**: Stick to the color palette defined in Tailwind config

---

## Need More?

Check `src/components/` for source code of all components.

Customize any component by editing the source files directly!
