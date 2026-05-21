# AgroMart UI Design Documentation

## Design System

### Color Palette

```
Primary Green: #2E7D32 (Deep Green)
Primary Light: #81C784 (Light Green)
Accent Yellow: #FBC02D (Sunflower)
Background: #F1F8E9 (Very Light Green)
Dark Text: #1B5E20
Neutral Gray: #F5F5F5
Error Red: #D32F2F
```

### Typography

- **Font Family**: Poppins (Google Fonts)
- **Headings**: Bold (700, 800)
- **Body**: Regular (400, 500)
- **Hierarchy**: H1 (4xl), H2 (3xl), H3 (xl)

### Spacing System

- Base unit: 4px
- Spacing scale: 2, 4, 6, 8, 12, 16, 24, 32

### Shadows & Effects

- **Soft**: `shadow-soft` - subtle card shadows
- **Card**: `shadow-card` - medium elevation
- **Hover**: `shadow-hover` - interactive feedback
- **Border Radius**: Rounded-lg (8px), Rounded-xl (12px), Rounded-full

### Animations

- **Float**: Items gently float up/down
- **Slide In**: Elements slide in from left
- **Fade In**: Elements fade in smoothly
- **Pulse Soft**: Skeleton loaders pulse gently

---

## Component Library

### Buttons

**Variants**: primary, secondary, accent, outline, ghost

```jsx
import { Button } from './components/UI'

<Button variant="primary" size="md">Click me</Button>
<Button variant="outline" size="sm">Small outline</Button>
```

### Cards

Hover-enabled cards with shadows and transitions.

```jsx
import { Card } from './components/UI'

<Card hover>
  Content here
</Card>
```

### Input Fields

With labels and error states.

```jsx
import { Input } from './components/UI'

<Input label="Email" error="Invalid email" placeholder="your@email.com" />
```

### Badges

Color-coded status indicators.

```jsx
import { Badge } from './components/UI'

<Badge color="primary">Plants</Badge>
<Badge color="accent">On Sale</Badge>
```

### Skeleton Loaders

Animated placeholders for loading states.

```jsx
import { SkeletonLoader } from './components/UI'

<SkeletonLoader count={6} />
```

---

## Pages & Features

### 1. Landing Page (Home)
- **Hero Section**: Gradient background with floating emojis
- **Categories**: 5 category cards with hover animations
- **Featured Products**: Grid of top-selling products
- **Why Choose Us**: 3-column feature highlight
- **CTA Section**: Call-to-action for signup

### 2. Product Listing
- **Sidebar Filters**: Category, search, price range
- **Mobile Filter Toggle**: Responsive drawer menu
- **Product Grid**: 1-3 columns responsive layout
- **Pagination**: Button-based pagination
- **Loading State**: Skeleton loaders for cards

### 3. Product Details
- **Image Gallery**: Large product image display
- **Product Info**: Name, price, stock, category
- **Quantity Selector**: +/- buttons
- **Add to Cart**: Call-to-action button
- **Reviews Section**: Customer ratings and comments
- **Review Form**: Add new review with rating

### 4. Shopping Cart
- **Cart Items List**: Product cards with quantity controls
- **Item Actions**: Update quantity, remove from cart
- **Order Summary**: Subtotal, tax, shipping, total
- **Checkout CTA**: Proceed to checkout button
- **Empty State**: Friendly message with shop link

### 5. Checkout (Multi-step)

**Step 1 - Shipping**: Address, city, ZIP code
**Step 2 - Payment**: Payment method selection (Stripe/Razorpay)
**Step 3 - Review**: Order summary confirmation
**Success**: Order confirmation with redirect

### 6. Authentication

**Login Page**: Email, password inputs with validation
**Register Page**: Name, email, password confirmation
**Features**: Error messages, loading states, links to other forms

### 7. Admin Dashboard

**Tabs**: Dashboard, Orders, Add Product

**Dashboard Tab**:
- Total sales card
- Total orders card
- Total products card
- Average order value
- Conversion rate

**Orders Tab**:
- Orders table with customer, amount, status
- Status badges (delivered, processing, etc.)
- Update action button

**Products Tab**:
- Form to add new product
- Fields: name, description, price, category, stock, image
- Submit button with loading state

---

## Responsive Design

### Breakpoints

- Mobile: <768px (single column)
- Tablet: 768px-1024px (2 columns)
- Desktop: >1024px (3-4 columns)

### Mobile Optimizations

- Hamburger menu navigation
- Drawer-style sidebars
- Full-width cards
- Larger touch targets (44px minimum)
- Vertical stack layouts

---

## Accessibility

- Semantic HTML (button, nav, section)
- Proper heading hierarchy
- Focus states on interactive elements
- ARIA labels where needed
- Color contrast ratio ≥ 4.5:1

---

## Browser Support

- Chrome/Edge: Latest 2 versions
- Firefox: Latest 2 versions
- Safari: Latest 2 versions
- Mobile: iOS 12+, Android 8+

---

## Setup & Installation

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000`

---

## Customization

### Change Primary Color

Edit `tailwind.config.cjs`:

```javascript
colors: {
  'agro': {
    'primary': '#your-color',
    'primary-light': '#light-shade',
    ...
  }
}
```

### Add New Component

1. Create file in `src/components/`
2. Export component as default
3. Import and use in pages

### Modify Page Layout

All pages are in `src/pages/` - edit directly to customize layout and content.

---

## Performance Tips

- Images are lazy-loaded
- Use `SkeletonLoader` for API calls
- Optimize images before upload (Cloudinary)
- Implement code-splitting for routes

---

## Future Enhancements

- Dark mode toggle
- Wishlist functionality
- Product recommendations
- Advanced filters (price, ratings)
- Live chat support
- Order tracking
- Subscription products
