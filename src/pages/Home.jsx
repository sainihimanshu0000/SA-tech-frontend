import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { 
  IoArrowForward, IoLeaf, IoFlask, IoSpeedometer, IoCart,
  IoChevronForward, IoStar, IoTime, IoShield,
  IoArrowUp, IoSearch, IoCheckmarkCircle,
  IoRocket, IoPeople, IoBag, IoCall,
  IoMail, IoLogoWhatsapp, IoClose,
  IoSunny, IoWater, IoFlash, IoCalculator,
  IoDocument, IoCheckbox, IoGift,
  IoCash, IoTrendingUp, IoHappy, IoCloud,
  IoEarth, IoLeafOutline, IoNutrition, IoWifi,
  IoHardwareChip, IoNewspaper, IoVideocam,
  IoPlay, IoPause, IoArrowBack, IoArrowForwardCircle,
  IoLocation, IoBusiness, IoHome, IoLogoFacebook,
  IoLogoTwitter, IoLogoInstagram, IoGrid, IoHeart,
  IoShare, IoBookmark, IoNotifications, IoMenu,
  IoApps, IoOptions, IoFilter, IoDownload,
  IoPrint, IoCopy, IoLink, IoQrCode,
  IoCamera, IoImage, IoVideocamOutline,
  // IoMusicalNotes, IoVolumeHigh, IoVolumeMute,
  // IoVolumeOff, IoMic, IoMicOff, IoHeadset,
  // IoHeadsetOutline, IoRadio, IoRadioOutline,
  // IoVideocamOff, IoVideocamOutline, IoCameraOff,
  // IoCameraOutline, IoImageOutline, IoImagesOutline,
  // IoAlbums, IoAlbumsOutline, IoLibrary, IoLibraryOutline
} from 'react-icons/io5'
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion'
import { toast } from 'react-hot-toast'
import API from '../api/axios'
import { getAllProducts, getFeaturedProducts } from '../api/productsAPI'
import { getAllCategories } from '../api/categoriesAPI'
import { getAllBlogPosts } from '../api/blogAPI'
import { useAuth } from '../hooks/useAuth'

// Font Family Configuration
const fontFamily = {
  heading: "'Poppins', sans-serif",
  body: "'Inter', sans-serif"
}

const fallbackProductImage = 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
const fallbackBlogImage = 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'

const getImageUrl = (image) => {
  if (!image) return ''
  if (typeof image === 'string') return image
  return image.url || image.secure_url || ''
}

const getProductImage = (product) => {
  const primary = getImageUrl(product.images?.primary)
  const thumbnail = Array.isArray(product.images?.thumbnails)
    ? getImageUrl(product.images.thumbnails[0])
    : ''
  return product.image || primary || thumbnail || fallbackProductImage
}

const getCategoryValue = (category) => {
  if (!category) return ''
  if (typeof category === 'string') return category
  return category.slug || category._id || category.id || category.name || ''
}

const normalizeProduct = (product) => {
  const categoryValue = getCategoryValue(product.category)
  return {
    ...product,
    id: product._id || product.id,
    image: getProductImage(product),
    category: categoryValue,
    categoryName: product.category?.name || categoryValue,
    rating: Math.round(product.avgRating || product.rating || 0),
    reviews: product.totalReviews || product.reviews?.length || product.reviews || 0,
    discount: product.discountPercentage > 0
      ? Math.round(product.discountPercentage)
      : product.discount || 0,
    productUrl: `/product/${product._id || product.id || product.slug}`,
  }
}

const normalizeCategory = (category) => ({
  id: category.slug || category._id || category.id || category.name,
  name: category.name || category.label || 'Category',
})

const normalizeBlogPost = (post) => ({
  ...post,
  id: post.slug || post._id || post.id,
  image: post.image || fallbackBlogImage,
  date: post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    : post.date || '',
  readTime: post.readTime || Math.max(3, Math.ceil((post.content?.split(/\s+/).length || 600) / 200)),
})

// ==================== SKELETON LOADER COMPONENT ====================
const SkeletonLoader = ({ count = 4, type = 'product' }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
          {type === 'product' ? (
            <>
              <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2 mb-4"></div>
              <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 rounded"></div>
            </>
          ) : (
            <>
              <div className="h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-4"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-1/2"></div>
            </>
          )}
        </div>
      ))}
    </>
  )
}

// ==================== CATEGORY CARD COMPONENT ====================
const CategoryCard = ({ icon: Icon, title, color, onClick, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -10, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white rounded-xl shadow-lg p-6 cursor-pointer group relative overflow-hidden"
    style={{ borderBottom: `4px solid ${color}` }}
  >
    <motion.div
      className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity"
      style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)` }}
    />
    <div className="flex flex-col items-center text-center relative z-10">
      <motion.div 
        className={`w-20 h-20 rounded-full bg-opacity-10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
        style={{ backgroundColor: `${color}20` }}
        whileHover={{ rotate: 360 }}
        transition={{ duration: 0.6 }}
      >
        <Icon className="text-4xl" style={{ color }} />
      </motion.div>
      <h3 className="font-semibold text-gray-800 text-lg" style={{ fontFamily: fontFamily.heading }}>{title}</h3>
      <motion.div
        initial={{ width: 0 }}
        whileHover={{ width: '50%' }}
        className="h-0.5 bg-gradient-to-r mt-2"
        style={{ background: `linear-gradient(90deg, ${color} 0%, ${color}80 100%)` }}
      />
    </div>
  </motion.div>
)

// ==================== PRODUCT CARD COMPONENT ====================
const ProductCard = ({ product, index, onAddToCart, onToggleWishlist, onShare, onQuickView }) => {
  const [imageError, setImageError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-xl shadow-lg overflow-hidden group relative"
    >
      {/* Like Button */}
      <motion.button
        type="button"
        initial={{ scale: 0 }}
        animate={{ scale: isHovered ? 1 : 0 }}
        whileHover={{ scale: 1.1 }}
        onClick={async () => {
          const toggled = await onToggleWishlist(product)
          if (toggled) setIsLiked(prev => !prev)
        }}
        className="absolute top-2 right-2 z-20 bg-white p-2 rounded-full shadow-lg"
      >
        <IoHeart className={`text-xl ${isLiked ? 'text-red-500 fill-current' : 'text-gray-400'}`} />
      </motion.button>

      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        {!imageError ? (
          <motion.img 
            src={product.image || fallbackProductImage} 
            alt={product.name}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.4 }}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <IoLeaf className="text-6xl text-white" />
            </motion.div>
          </div>
        )}
        
        {/* Badges */}
        <AnimatePresence>
          {product.discount > 0 && (
            <motion.span
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              exit={{ x: -100 }}
              className="absolute top-2 left-2 bg-red-500 text-white text-xs px-3 py-1 rounded-full font-semibold"
            >
              {product.discount}% OFF
            </motion.span>
          )}
          {product.isNew && (
            <motion.span
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              exit={{ x: 100 }}
              className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold"
            >
              New
            </motion.span>
          )}
        </AnimatePresence>

        {/* Quick View Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2"
        >
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onQuickView(product)}
            className="bg-white p-3 rounded-full"
          >
            <IoSearch className="text-gray-800" />
          </motion.button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onShare(product)}
            className="bg-white p-3 rounded-full"
          >
            <IoShare className="text-gray-800" />
          </motion.button>
        </motion.div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1 text-lg" style={{ fontFamily: fontFamily.heading }}>{product.name}</h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
            >
              <IoStar 
                className={`text-sm ${i < (product.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            </motion.div>
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviews || 0})</span>
        </div>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xl font-bold text-green-600">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-sm text-gray-400 line-through ml-2">₹{product.mrp}</span>
            )}
          </div>
        </div>
        
        {/* Add to Cart Button */}
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onAddToCart(product)}
          disabled={product.stock === 0}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 rounded-lg hover:from-green-700 hover:to-green-600 transition flex items-center justify-center gap-2 font-semibold relative overflow-hidden group"
        >
          <motion.div
            className="absolute inset-0 bg-white"
            initial={{ x: '-100%' }}
            whileHover={{ x: 0 }}
            transition={{ duration: 0.3 }}
            style={{ opacity: 0.2 }}
          />
          <IoCart className="text-xl" />
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </motion.button>
      </div>
    </motion.div>
  )
}

// ==================== SERVICE CARD COMPONENT ====================
const ServiceCard = ({ icon: Icon, title, features, color, link, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ y: -10 }}
    viewport={{ once: true }}
    className="bg-white rounded-xl shadow-lg overflow-hidden group"
  >
    <motion.div 
      className="h-40 flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: `${color}15` }}
      whileHover={{ scale: 1.1 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-20"
        style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}80 100%)` }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <Icon className="text-6xl relative z-10" style={{ color }} />
    </motion.div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: fontFamily.heading }}>{title}</h3>
      <ul className="space-y-2 mb-4">
        {features.map((feature, i) => (
          <motion.li 
            key={i} 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex items-center gap-2 text-sm text-gray-600"
            style={{ fontFamily: fontFamily.body }}
          >
            <IoCheckmarkCircle className="text-green-600 text-sm flex-shrink-0" />
            <span>{feature}</span>
          </motion.li>
        ))}
      </ul>
      <motion.div
        whileHover={{ x: 10 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Link 
          to={link}
          className="inline-flex items-center gap-2 font-semibold"
          style={{ color, fontFamily: fontFamily.body }}
        >
          Learn More <IoArrowForward />
        </Link>
      </motion.div>
    </div>
  </motion.div>
)

// ==================== TESTIMONIAL CARD COMPONENT ====================
const TestimonialCard = ({ name, location, content, rating, image, index }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-lg p-6"
  >
    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <IoStar className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
        </motion.div>
      ))}
    </div>
    <motion.p 
      className="text-gray-600 mb-4 italic" 
      style={{ fontFamily: fontFamily.body }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      "{content}"
    </motion.p>
    <div className="flex items-center gap-3">
      <motion.div 
        className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden"
        whileHover={{ scale: 1.1, rotate: 10 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {image ? (
          <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <IoHappy className="text-2xl" />
        )}
      </motion.div>
      <div>
        <h4 className="font-semibold text-gray-800" style={{ fontFamily: fontFamily.heading }}>{name}</h4>
        <p className="text-sm text-gray-500" style={{ fontFamily: fontFamily.body }}>{location}</p>
      </div>
    </div>
  </motion.div>
)

// ==================== WHATSAPP BUTTON COMPONENT ====================
const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.a
      href="https://wa.me/919876543210?text=Hello%20I%20need%20help%20with%20AgroMart"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-green-600 text-white p-4 rounded-full shadow-lg z-50 hover:from-green-600 hover:to-green-700 transition-all"
    >
      <motion.div
        animate={{ rotate: isHovered ? 360 : 0 }}
        transition={{ duration: 0.5 }}
      >
        <IoLogoWhatsapp className="text-2xl" />
      </motion.div>
    </motion.a>
  )
}

// ==================== ANIMATION VARIANTS ====================
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: { opacity: 1, x: 0 }
}

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: { opacity: 1, x: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
}

const rotateIn = {
  hidden: { rotate: -180, opacity: 0 },
  visible: { rotate: 0, opacity: 1 }
}

// ==================== ANIMATED SECTION WRAPPER ====================
const AnimatedSection = ({ children, className, delay = 0, direction = 'up' }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

  const variants = {
    up: fadeInUp,
    left: fadeInLeft,
    right: fadeInRight,
    scale: scaleIn,
    rotate: rotateIn
  }

  useEffect(() => {
    if (inView) {
      controls.start('visible')
    }
  }, [controls, inView])

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={variants[direction]}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ==================== STATS COUNTER ====================
const Counter = ({ end, duration = 2, suffix = '' }) => {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (inView) {
      let start = 0
      const increment = end / (duration * 60)
      const timer = setInterval(() => {
        start += increment
        if (start >= end) {
          setCount(end)
          clearInterval(timer)
        } else {
          setCount(Math.floor(start))
        }
      }, 1000 / 60)
      return () => clearInterval(timer)
    }
  }, [inView, end, duration])

  return (
    <motion.span 
      ref={ref} 
      className="text-4xl font-bold"
      initial={{ scale: 0.5 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {count.toLocaleString()}{suffix}
    </motion.span>
  )
}

// ==================== MARQUEE ====================
const Marquee = ({ items, speed = 30 }) => {
  return (
    <div className="overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-green-600 py-4">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -2000]
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {items.concat(items).concat(items).map((item, index) => (
          <motion.div 
            key={index} 
            className="flex items-center mx-8"
            whileHover={{ scale: 1.1 }}
          >
            <item.icon className="text-white text-xl mr-2" />
            <span className="text-white font-medium">{item.text}</span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

// ==================== VIDEO BACKGROUND SECTION ====================
const VideoSection = () => {
  const [isPlaying, setIsPlaying] = useState(true)
  const videoRef = useRef(null)

  const toggleVideo = () => {
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="relative h-[600px] overflow-hidden">
      <motion.video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        initial={{ scale: 1.2 }}
        animate={{ scale: 1 }}
        transition={{ duration: 20 }}
      >
        <source src="https://player.vimeo.com/external/370331467.sd.mp4?s=90c2c13b7d5fdb5c27c5a3c6d3e0b8b7f9e8d7c6f&profile_id=164" type="video/mp4" />
      </motion.video>
      
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 flex items-center justify-center">
        <div className="text-center text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-6xl font-bold mb-4"
            style={{ fontFamily: fontFamily.heading }}
          >
            Modern Farming Starts Here
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto"
          >
            See how technology is transforming agriculture
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleVideo}
            className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition flex items-center gap-2 mx-auto shadow-xl"
          >
            <motion.div
              animate={{ rotate: isPlaying ? 0 : 360 }}
              transition={{ duration: 0.5 }}
            >
              {isPlaying ? <IoPause /> : <IoPlay />}
            </motion.div>
            {isPlaying ? 'Pause' : 'Play'} Video
          </motion.button>
        </div>
      </div>

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 w-20 h-20 bg-white/20 rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 w-32 h-32 bg-white/20 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
    </section>
  )
}

// ==================== TESTIMONIAL SLIDER ====================
const TestimonialSlider = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  const next = () => {
    setDirection(1)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setDirection(-1)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  }

  return (
    <div className="relative px-4">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <motion.div 
              className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0"
              whileHover={{ scale: 1.1, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src={testimonials[currentIndex].image} 
                alt={testimonials[currentIndex].name}
                className="w-full h-full object-cover"
              />
            </motion.div>
            <div className="flex-1">
              <motion.div 
                className="flex items-center gap-1 mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <IoStar className={i < testimonials[currentIndex].rating ? 'text-yellow-400 fill-current text-xl' : 'text-gray-300 text-xl'} />
                  </motion.div>
                ))}
              </motion.div>
              <motion.p 
                className="text-gray-700 text-lg mb-4 italic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                "{testimonials[currentIndex].content}"
              </motion.p>
              <motion.h4 
                className="font-bold text-xl text-gray-800"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {testimonials[currentIndex].name}
              </motion.h4>
              <motion.p 
                className="text-gray-500"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {testimonials[currentIndex].location}
              </motion.p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1, x: -5 }}
        whileTap={{ scale: 0.9 }}
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 z-10"
      >
        <IoArrowBack size={24} />
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.1, x: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-3 shadow-lg hover:bg-gray-50 z-10"
      >
        <IoArrowForward size={24} />
      </motion.button>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className={`rounded-full transition-all ${
              index === currentIndex ? 'w-8 h-2 bg-green-600' : 'w-2 h-2 bg-gray-300'
            }`}
            whileHover={{ scale: 1.2 }}
          />
        ))}
      </div>
    </div>
  )
}

// ==================== BLOG CARD ====================
const BlogCard = ({ post, index }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -10 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-xl shadow-lg overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <motion.img 
          src={post.image || fallbackBlogImage} 
          alt={post.title}
          className="w-full h-full object-cover"
          animate={{ scale: isHovered ? 1.1 : 1 }}
          transition={{ duration: 0.4 }}
        />
        <motion.div 
          className="absolute top-4 left-4 bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold"
          whileHover={{ scale: 1.1 }}
        >
          {post.category}
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="bg-white p-3 rounded-full"
          >
            <IoSearch className="text-gray-800" />
          </motion.div>
        </motion.div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
          <IoTime />
          <span>{post.date}</span>
          <span>•</span>
          <span>{post.readTime} min read</span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
        <motion.div
          whileHover={{ x: 10 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Link 
            to={`/blog/${post.slug || post.id}`}
            className="inline-flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all"
          >
            Read More <IoArrowForward />
          </Link>
        </motion.div>
      </div>
    </motion.article>
  )
}

// ==================== STATS SECTION ====================
const StatsSection = () => {
  const stats = [
    { icon: IoPeople, value: 25000, label: 'Happy Farmers', suffix: '+', color: '#2E7D32' },
    { icon: IoLeaf, value: 1500, label: 'Products Available', suffix: '+', color: '#FBC02D' },
    { icon: IoFlash, value: 5000, label: 'Solar Installations', suffix: '+', color: '#0288D1' },
    { icon: IoCash, value: 10, label: 'Crore Subsidy', suffix: 'Cr+', color: '#81C784' }
  ]

  return (
    <section className="py-20 bg-gradient-to-r from-green-700 via-green-600 to-green-500 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full transform -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-48 translate-y-48"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              whileHover={{ scale: 1.05 }}
              className="text-center"
            >
              <motion.div 
                className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <stat.icon className="text-4xl" />
              </motion.div>
              <div className="text-4xl font-bold mb-2">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <div className="text-lg opacity-90">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ==================== PARTNERS SECTION ====================
const PartnersSection = () => {
  const partners = [
    { name: 'Government of India', logo: 'https://via.placeholder.com/150x50?text=GOI' },
    { name: 'NABARD', logo: 'https://via.placeholder.com/150x50?text=NABARD' },
    { name: 'IFFCO', logo: 'https://via.placeholder.com/150x50?text=IFFCO' },
    { name: 'Kisan Credit Card', logo: 'https://via.placeholder.com/150x50?text=KCC' },
    { name: 'PM-KUSUM', logo: 'https://via.placeholder.com/150x50?text=PM-KUSUM' },
    { name: 'FPO', logo: 'https://via.placeholder.com/150x50?text=FPO' }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Our Partners & Certifications</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Trusted by leading agricultural organizations
          </p>
        </AnimatedSection>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              variants={scaleIn}
              whileHover={{ scale: 1.1 }}
              className="opacity-50 hover:opacity-100 transition grayscale hover:grayscale-0 cursor-pointer"
            >
              <img src={partner.logo} alt={partner.name} className="w-full h-auto" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ==================== FEATURES GRID ====================
const FeaturesGrid = () => {
  const features = [
    { icon: IoShield, title: 'Quality Assured', desc: 'All products tested and certified', color: '#2E7D32' },
    { icon: IoRocket, title: 'Fast Delivery', desc: 'Delivery within 3-5 days', color: '#FBC02D' },
    { icon: IoPeople, title: 'Expert Support', desc: '24/7 farmer assistance', color: '#0288D1' },
    { icon: IoCash, title: 'Best Prices', desc: 'Direct from manufacturers', color: '#81C784' },
    { icon: IoEarth, title: 'Sustainable', desc: 'Eco-friendly farming', color: '#2E7D32' },
    { icon: IoWifi, title: 'Smart Farming', desc: 'IoT enabled solutions', color: '#FBC02D' },
    { icon: IoHardwareChip, title: 'Modern Tech', desc: 'Latest agricultural tech', color: '#0288D1' },
    { icon: IoNutrition, title: 'Organic Options', desc: '100% organic products', color: '#81C784' }
  ]

  return (
    <section className="py-20 bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-64 h-64 bg-green-600 rounded-full transform -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600 rounded-full transform translate-x-48 translate-y-48"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection direction="up">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">
            Why Farmers Love Us
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
            We provide end-to-end solutions for modern farming needs
          </p>
        </AnimatedSection>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -10, scale: 1.02 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center group cursor-pointer"
            >
              <motion.div 
                className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors relative overflow-hidden"
                style={{ backgroundColor: `${feature.color}15` }}
                whileHover={{ scale: 1.1 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100"
                  style={{ background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}80 100%)` }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <feature.icon 
                  className="text-3xl relative z-10 transition-colors group-hover:text-white" 
                  style={{ color: feature.color }}
                />
              </motion.div>
              <h3 className="font-bold text-gray-800 mb-2 text-lg">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

// ==================== SUCCESS STORIES ====================
const SuccessStories = () => {
  const stories = [
    {
      farmer: 'Ramesh Singh',
      location: 'Uttar Pradesh',
      before: 'Traditional farming with low yield',
      after: 'Doubled yield with our solutions',
      image: 'https://images.unsplash.com/photo-1621905252507-bf92d5afff8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      increase: '+120%',
      color: '#2E7D32'
    },
    {
      farmer: 'Lakshmi Devi',
      location: 'Tamil Nadu',
      before: 'High electricity costs',
      after: 'Solar pump saved 80% costs',
      image: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      increase: '₹50K/year',
      color: '#FBC02D'
    },
    {
      farmer: 'Gurpreet Singh',
      location: 'Punjab',
      before: 'Chemical farming',
      after: 'Organic certification achieved',
      image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      increase: '+200%',
      color: '#0288D1'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <AnimatedSection direction="up">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Success Stories</h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto text-lg">
            Real farmers, real results with AgroMart
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 relative overflow-hidden group"
            >
              <motion.div 
                className="absolute top-0 right-0 w-32 h-32 rounded-bl-full"
                style={{ background: `linear-gradient(135deg, ${story.color} 0%, ${story.color}80 100%)` }}
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <motion.div 
                  className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 10 }}
                >
                  <img 
                    src={story.image} 
                    alt={story.farmer}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <div>
                  <h3 className="font-bold text-lg">{story.farmer}</h3>
                  <p className="text-sm text-gray-600">{story.location}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4 relative z-10">
                <motion.div 
                  className="bg-white/50 p-3 rounded-lg"
                  whileHover={{ x: 5 }}
                >
                  <p className="text-sm text-gray-500">Before</p>
                  <p className="font-medium">{story.before}</p>
                </motion.div>
                <motion.div 
                  className="bg-white/50 p-3 rounded-lg"
                  whileHover={{ x: 5 }}
                >
                  <p className="text-sm text-gray-500">After</p>
                  <p className="font-medium text-green-600">{story.after}</p>
                </motion.div>
              </div>

              <motion.div 
                className="text-center relative z-10"
                whileHover={{ scale: 1.05 }}
              >
                <span 
                  className="inline-block text-white px-4 py-2 rounded-full font-bold"
                  style={{ backgroundColor: story.color }}
                >
                  {story.increase} Growth
                </span>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== SOLAR SUBSIDY GUIDE SECTION ====================
const SolarSubsidyGuide = () => {
  const [selectedCity, setSelectedCity] = useState('pune')
  const [showStateTable, setShowStateTable] = useState(false)

  const cities = [
    { id: 'pune', name: 'Pune, Maharashtra', icon: IoLocation },
    { id: 'raipur', name: 'Raipur, Chhattisgarh', icon: IoLocation },
    { id: 'delhi', name: 'Delhi', icon: IoLocation },
    { id: 'ahmedabad', name: 'Ahmedabad, Gujarat', icon: IoLocation }
  ]

  const cityData = {
    pune: {
      installations: 18694,
      capacity: '90.62 MW',
      subsidy: '₹151 Crore',
      details: [
        { area: 'Ganeshkhind', projects: 7312, capacity: '38.21 MW', subsidy: '₹62.4 Cr' },
        { area: 'Rasta Peth', projects: 6236, capacity: '31.34 MW', subsidy: '₹52.58 Cr' },
        { area: 'Pune Rural', projects: 5146, capacity: '21.07 MW', subsidy: '₹36.4 Cr' }
      ]
    },
    raipur: {
      savings: '₹2,500-3,000/month',
      payback: '3-4 years',
      systemSize: '3-5 kW',
      description: 'Ideal for households with monthly electricity bills of ₹2,500-3,000'
    },
    delhi: {
      policy: 'Most consumer-friendly',
      netMetering: 'Up to 1 MW',
      compensation: 'Full retail rate credits',
      features: ['Capital subsidy for residents', 'Best net metering policy']
    },
    ahmedabad: {
      policy: 'Streamlined approvals',
      netMetering: 'Up to 1 MW',
      rate: '₹2.25/unit (first 5 years)',
      features: ['Active utility support', 'Capital subsidy for residents']
    }
  }

  const statePolicies = [
    { state: 'Delhi', netMetering: 'Up to 1 MW', rate: 'Full retail rate credits', incentives: 'Capital subsidy' },
    { state: 'Gujarat', netMetering: 'Up to 1 MW', rate: '₹2.25/unit (first 5 years)', incentives: 'Active utility support' },
    { state: 'Maharashtra', netMetering: '1 kW to 1 MW', rate: '₹2.90/unit', incentives: 'Fully online process' },
    { state: 'Rajasthan', netMetering: 'Up to 500 kW', rate: '₹2.87 - ₹3.00/unit', incentives: 'State incentives' },
    { state: 'Uttar Pradesh', netMetering: 'Varies', rate: '₹2.98/unit + 25%', incentives: 'Capital subsidy' },
    { state: 'Kerala', netMetering: 'Up to 500 kW', rate: '₹3.15/unit', incentives: 'Generation-based incentive' },
    { state: 'Tamil Nadu', netMetering: 'Up to 999 kW', rate: '₹3.10 - ₹3.61/unit', incentives: 'Limited to residential' },
    { state: 'Madhya Pradesh', netMetering: 'Varies', rate: '₹2.14/unit', incentives: 'Lowest tariff' }
  ]

  const subsidyTable = [
    { consumption: '0-150 units', size: '1-2 kW', subsidy: '₹30,000 - ₹60,000' },
    { consumption: '150-300 units', size: '2-3 kW', subsidy: '₹60,000 - ₹78,000' },
    { consumption: 'Above 300 units', size: '3-10 kW', subsidy: '₹78,000 (fixed)' }
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400 rounded-full transform -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-600 rounded-full transform translate-x-48 translate-y-48"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <AnimatedSection direction="up">
          <div className="text-center mb-12">
            <motion.span 
              className="inline-block px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-semibold mb-4"
              whileHover={{ scale: 1.05 }}
            >
              PM Surya Ghar: Muft Bijli Yojana
            </motion.span>
            <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: fontFamily.heading }}>
              Solar Subsidy Guide: City by City Breakdown
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Launched in February 2024, this flagship scheme aims to install rooftop solar in 1 crore households by 2027, adding 30 GW capacity.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - National Scheme */}
          <AnimatedSection direction="left" className="lg:col-span-1 space-y-6">
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-6"
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <IoHome className="text-green-600" /> Central Financial Assistance
              </h3>
              <div className="space-y-4">
                {subsidyTable.map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="border-b border-gray-100 last:border-0 pb-3 last:pb-0"
                    whileHover={{ x: 5 }}
                  >
                    <p className="text-sm text-gray-500">Monthly Consumption: {item.consumption}</p>
                    <p className="font-semibold">System Size: {item.size}</p>
                    <p className="text-green-600 font-bold">Subsidy: {item.subsidy}</p>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-bold">Easy Financing:</span> Collateral-free loans up to ₹2 lakh at ~6.75% through public sector banks
                </p>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800">
                  <span className="font-bold">Impact:</span> Over 20.85 lakh rooftop solar systems installed, benefiting 26+ lakh households
                </p>
              </div>
            </motion.div>

            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-6"
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <IoBusiness className="text-green-600" /> How to Get Started
              </h3>
              <div className="space-y-3">
                <motion.a 
                  href="https://www.pmsuryaghar.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="block p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-center font-semibold"
                >
                  Visit National Portal →
                </motion.a>
                <p className="text-sm text-gray-600 text-center">
                  Register, apply for subsidies, and select vendors at www.pmsuryaghar.gov.in
                </p>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Check with your local DISCOM for net metering approvals
                </p>
              </div>
            </motion.div>
          </AnimatedSection>

          {/* Middle Column - City Examples */}
          <AnimatedSection direction="up" className="lg:col-span-1">
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-6 h-full"
              whileHover={{ y: -5 }}
            >
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <IoLocation className="text-green-600" /> City-Wise Success Stories
              </h3>
              
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {cities.map(city => (
                  <motion.button
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                      selectedCity === city.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <city.icon className="inline mr-1" /> {city.name}
                  </motion.button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedCity}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-4"
                >
                  {selectedCity === 'pune' && (
                    <>
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        <motion.div 
                          className="bg-blue-50 p-3 rounded-lg text-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <p className="text-2xl font-bold text-blue-600">{cityData.pune.installations}</p>
                          <p className="text-xs text-gray-600">Installations</p>
                        </motion.div>
                        <motion.div 
                          className="bg-green-50 p-3 rounded-lg text-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <p className="text-2xl font-bold text-green-600">{cityData.pune.capacity}</p>
                          <p className="text-xs text-gray-600">Capacity</p>
                        </motion.div>
                        <motion.div 
                          className="bg-yellow-50 p-3 rounded-lg text-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <p className="text-2xl font-bold text-yellow-600">{cityData.pune.subsidy}</p>
                          <p className="text-xs text-gray-600">Subsidy</p>
                        </motion.div>
                      </div>
                      {cityData.pune.details.map((area, idx) => (
                        <motion.div 
                          key={idx} 
                          className="p-3 bg-gray-50 rounded-lg"
                          whileHover={{ x: 5 }}
                        >
                          <p className="font-semibold">{area.area}</p>
                          <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                            <span>{area.projects} projects</span>
                            <span>{area.capacity}</span>
                            <span className="text-green-600">{area.subsidy}</span>
                          </div>
                        </motion.div>
                      ))}
                    </>
                  )}

                  {selectedCity === 'raipur' && (
                    <div className="text-center p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <motion.div 
                          className="bg-green-50 p-4 rounded-lg"
                          whileHover={{ scale: 1.05 }}
                        >
                          <p className="text-sm text-gray-600">Monthly Savings</p>
                          <p className="text-2xl font-bold text-green-600">{cityData.raipur.savings}</p>
                        </motion.div>
                        <motion.div 
                          className="bg-blue-50 p-4 rounded-lg"
                          whileHover={{ scale: 1.05 }}
                        >
                          <p className="text-sm text-gray-600">Payback Period</p>
                          <p className="text-2xl font-bold text-blue-600">{cityData.raipur.payback}</p>
                        </motion.div>
                      </div>
                      <p className="text-gray-600">{cityData.raipur.description}</p>
                      <p className="text-sm text-gray-500 mt-4">
                        Recommended System: {cityData.raipur.systemSize}
                      </p>
                    </div>
                  )}

                  {selectedCity === 'delhi' && (
                    <div className="space-y-3">
                      <p className="font-semibold text-green-600">{cityData.delhi.policy}</p>
                      <motion.div 
                        className="bg-blue-50 p-3 rounded-lg"
                        whileHover={{ x: 5 }}
                      >
                        <p className="text-sm text-gray-600">Net Metering</p>
                        <p className="font-bold">{cityData.delhi.netMetering}</p>
                      </motion.div>
                      <motion.div 
                        className="bg-green-50 p-3 rounded-lg"
                        whileHover={{ x: 5 }}
                      >
                        <p className="text-sm text-gray-600">Compensation</p>
                        <p className="font-bold">{cityData.delhi.compensation}</p>
                      </motion.div>
                      {cityData.delhi.features.map((feature, idx) => (
                        <motion.div 
                          key={idx} 
                          className="flex items-center gap-2"
                          whileHover={{ x: 5 }}
                        >
                          <IoCheckmarkCircle className="text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}

                  {selectedCity === 'ahmedabad' && (
                    <div className="space-y-3">
                      <p className="font-semibold text-green-600">{cityData.ahmedabad.policy}</p>
                      <motion.div 
                        className="bg-blue-50 p-3 rounded-lg"
                        whileHover={{ x: 5 }}
                      >
                        <p className="text-sm text-gray-600">Net Metering</p>
                        <p className="font-bold">{cityData.ahmedabad.netMetering}</p>
                      </motion.div>
                      <motion.div 
                        className="bg-green-50 p-3 rounded-lg"
                        whileHover={{ x: 5 }}
                      >
                        <p className="text-sm text-gray-600">Rate</p>
                        <p className="font-bold">{cityData.ahmedabad.rate}</p>
                      </motion.div>
                      {cityData.ahmedabad.features.map((feature, idx) => (
                        <motion.div 
                          key={idx} 
                          className="flex items-center gap-2"
                          whileHover={{ x: 5 }}
                        >
                          <IoCheckmarkCircle className="text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </AnimatedSection>

          {/* Right Column - State Policies */}
          <AnimatedSection direction="right" className="lg:col-span-1">
            <motion.div 
              className="bg-white rounded-2xl shadow-xl p-6 h-full"
              whileHover={{ y: -5 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <IoEarth className="text-green-600" /> State-Wide Policies
                </h3>
                <motion.button
                  onClick={() => setShowStateTable(!showStateTable)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-green-600 hover:text-green-700 font-semibold"
                >
                  {showStateTable ? 'Show Less' : 'View All'}
                </motion.button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="p-2 text-left">State</th>
                      <th className="p-2 text-left">Net Metering</th>
                      <th className="p-2 text-left">Rate/Unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(showStateTable ? statePolicies : statePolicies.slice(0, 4)).map((policy, idx) => (
                      <motion.tr 
                        key={idx} 
                        className="border-b hover:bg-gray-50 cursor-pointer"
                        whileHover={{ x: 5 }}
                      >
                        <td className="p-2 font-medium">{policy.state}</td>
                        <td className="p-2 text-xs">{policy.netMetering}</td>
                        <td className="p-2 text-xs text-green-600">{policy.rate}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!showStateTable && (
                <p className="text-xs text-gray-500 mt-4 text-center">
                  *Rates and rules subject to change by state electricity regulatory commissions
                </p>
              )}

              <div className="mt-6 p-4 bg-yellow-50 rounded-xl">
                <p className="text-sm text-gray-700">
                  <span className="font-bold">Note:</span> Installation data and local incentives change constantly. Visit the national portal or contact your local DISCOM for the most up-to-date information.
                </p>
              </div>
            </motion.div>
          </AnimatedSection>
        </div>

        {/* Bottom CTA */}
        <AnimatedSection direction="up" className="text-center mt-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/subsidy"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-600 transition shadow-lg hover:shadow-xl"
            >
              <IoCalculator /> Calculate Your Subsidy
              <IoArrowForward />
            </Link>
          </motion.div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ==================== FAQ SECTION ====================
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: 'How do I apply for subsidy?',
      answer: 'You can apply through our Subsidy portal. We help with complete documentation and follow-up with government departments.'
    },
    {
      question: 'What is the delivery time for products?',
      answer: 'We deliver within 3-5 business days across India. Express delivery available in select cities.'
    },
    {
      question: 'Are your products certified?',
      answer: 'Yes, all our products are government certified and quality tested.'
    },
    {
      question: 'How does solar installation work?',
      answer: 'Our expert team visits your farm, assesses requirements, and handles complete installation with government approvals.'
    }
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <AnimatedSection direction="up">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Frequently Asked Questions</h2>
          <p className="text-center text-gray-600 mb-12">Got questions? We've got answers!</p>
        </AnimatedSection>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <motion.button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
                whileHover={{ x: 5 }}
              >
                <span className="font-semibold text-gray-800">{faq.question}</span>
                <motion.span 
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  ▼
                </motion.span>
              </motion.button>
              
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-4 text-gray-600"
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== NEWSLETTER SECTION ====================
const NewsletterSection = () => {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await API.post('/newsletter/subscribe', { email })
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 3000)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Subscription failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="py-20 bg-gradient-to-r from-green-700 via-green-600 to-green-500 relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full transform -translate-x-32 -translate-y-32"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-48 translate-y-48"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <AnimatedSection direction="up">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-xl text-green-50 mb-8">
              Get latest farming tips, subsidy news, and product updates
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <motion.input
                whileFocus={{ scale: 1.02 }}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <motion.button
                type="submit"
                disabled={submitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition shadow-lg disabled:opacity-70"
              >
                {submitting ? 'Subscribing...' : 'Subscribe'}
              </motion.button>
            </form>

            <AnimatePresence>
              {subscribed && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-4 bg-white/20 text-white px-4 py-2 rounded-lg"
                >
                  ✓ Thanks for subscribing!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ==================== MAIN HOME COMPONENT ====================
export default function Home() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showScrollTop, setShowScrollTop] = useState(false)

  const filteredProducts = selectedCategory === 'all' 
    ? featuredProducts 
    : featuredProducts.filter(p => p.category === selectedCategory)

  // Sample blog posts
  const sampleBlogs = [
    {
      id: 1,
      title: '10 Tips for Organic Farming',
      excerpt: 'Learn how to transition to organic farming with these expert tips...',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'Farming Tips',
      date: 'Mar 15, 2024',
      readTime: 5
    },
    {
      id: 2,
      title: 'Understanding PM-KUSUM Scheme',
      excerpt: 'Complete guide to solar pump subsidy under PM-KUSUM...',
      image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'Subsidy',
      date: 'Mar 12, 2024',
      readTime: 7
    },
    {
      id: 3,
      title: 'Smart Irrigation Systems',
      excerpt: 'How IoT is revolutionizing farm irrigation...',
      image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80',
      category: 'Technology',
      date: 'Mar 10, 2024',
      readTime: 4
    }
  ]

  // Sample products
  const sampleProducts = [
    {
      id: 1,
      name: 'Organic Wheat Seeds',
      price: 499,
      mrp: 599,
      rating: 4.5,
      reviews: 128,
      discount: 20,
      isNew: true,
      category: 'seeds',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 2,
      name: 'NPK Fertilizer 50kg',
      price: 1299,
      mrp: 1599,
      rating: 4,
      reviews: 89,
      discount: 15,
      isNew: false,
      category: 'fertilizers',
      image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 3,
      name: 'Solar Water Pump 5HP',
      price: 45000,
      mrp: 90000,
      rating: 5,
      reviews: 56,
      discount: 50,
      isNew: true,
      category: 'solar',
      image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 4,
      name: 'Organic Pesticide',
      price: 299,
      mrp: 399,
      rating: 4,
      reviews: 234,
      discount: 25,
      isNew: false,
      category: 'pesticides',
      image: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 5,
      name: 'Drip Irrigation Kit',
      price: 2499,
      mrp: 2999,
      rating: 4.5,
      reviews: 167,
      discount: 10,
      isNew: true,
      category: 'irrigation',
      image: 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    },
    {
      id: 6,
      name: 'Greenhouse Film',
      price: 5999,
      mrp: 7999,
      rating: 4,
      reviews: 45,
      discount: 25,
      isNew: false,
      category: 'greenhouse',
      image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
    }
  ]

  // Sample categories
  const sampleCategories = [
    { id: 'seeds', name: 'Seeds' },
    { id: 'fertilizers', name: 'Fertilizers' },
    { id: 'solar', name: 'Solar' },
    { id: 'pesticides', name: 'Pesticides' },
    { id: 'irrigation', name: 'Irrigation' },
    { id: 'greenhouse', name: 'Greenhouse' }
  ]

  // Marquee items
  const marqueeItems = [
    { icon: IoSunny, text: 'Solar Pumps & Panels' },
    { icon: IoFlash, text: 'Up to 90% Solar Subsidy' },
    { icon: IoCash, text: 'Cut Electricity Bills by 80%' },
    { icon: IoRocket, text: 'Free Site Survey' },
    { icon: IoShield, text: 'Warranty & Maintenance' },
    { icon: IoTime, text: 'Fast Installation (3-5 days)' }
  ]

  // Testimonials for slider
  const testimonials = [
    {
      name: 'Rajesh Kumar',
      location: 'Punjab',
      content: 'The solar pump installation saved me 80% on electricity bills. Best investment for my farm!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1621905252507-bf92d5afff8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Priya Sharma',
      location: 'Maharashtra',
      content: 'Quality seeds and fertilizers. My yield increased by 30% this season. Highly recommended!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    },
    {
      name: 'Suresh Patel',
      location: 'Gujarat',
      content: 'Got 90% subsidy on solar pump through their help. Excellent support throughout the process.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
    }
  ]

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true)
        const [productsRes, latestProductsRes, blogsRes, categoriesRes] = await Promise.allSettled([
          getFeaturedProducts(6),
          getAllProducts(1, 6, { sortBy: 'newest' }),
          getAllBlogPosts({ page: 1, limit: 3 }),
          getAllCategories(),
        ])

        const featured = productsRes.status === 'fulfilled'
          ? (Array.isArray(productsRes.value) ? productsRes.value : productsRes.value?.products || productsRes.value?.data || [])
          : []
        const latest = latestProductsRes.status === 'fulfilled'
          ? (latestProductsRes.value?.products || latestProductsRes.value?.data || [])
          : []
        const products = (featured.length > 0 ? featured : latest).map(normalizeProduct)
        const blogs = blogsRes.status === 'fulfilled'
          ? (blogsRes.value?.data || blogsRes.value?.posts || []).map(normalizeBlogPost)
          : []
        const apiCategories = categoriesRes.status === 'fulfilled'
          ? (categoriesRes.value?.data || categoriesRes.value?.categories || []).map(normalizeCategory)
          : []

        setFeaturedProducts(products.length > 0 ? products : sampleProducts.map(normalizeProduct))
        setBlogPosts(blogs.length > 0 ? blogs : sampleBlogs.map(normalizeBlogPost))
        setCategories(apiCategories.length > 0 ? apiCategories : sampleCategories)
      } catch (error) {
        console.error('Error fetching home data:', error)
        setFeaturedProducts(sampleProducts.map(normalizeProduct))
        setBlogPosts(sampleBlogs.map(normalizeBlogPost))
        setCategories(sampleCategories)
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const requireLogin = (nextPath) => {
    if (isAuthenticated) return false
    toast.error('Please login to continue')
    navigate('/login', { state: { from: nextPath || '/' } })
    return true
  }

  const handleAddToCart = async (product) => {
    if (requireLogin(product.productUrl)) return
    try {
      await API.post('/cart', { productId: product.id, quantity: 1 })
      toast.success(`${product.name} added to cart`)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add product to cart')
    }
  }

  const handleToggleWishlist = async (product) => {
    if (requireLogin(product.productUrl)) return false
    try {
      await API.post(`/wishlist/${product.id}`)
      toast.success('Wishlist updated')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update wishlist')
      return false
    }
  }

  const handleShareProduct = async (product) => {
    const url = `${window.location.origin}${product.productUrl}`
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: product.description || 'Check this product on AgroMart', url })
      } else {
        await navigator.clipboard.writeText(url)
        toast.success('Product link copied')
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        toast.error('Unable to share product')
      }
    }
  }

  const handleQuickView = (product) => {
    navigate(product.productUrl)
  }

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: fontFamily.body }}>
      {/* Marquee */}
      <Marquee items={marqueeItems} speed={25} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-700 via-green-600 to-yellow-500 min-h-[700px] flex items-center overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, 30, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full"
            animate={{
              scale: [1, 1.3, 1],
              x: [0, -50, 0],
              y: [0, -30, 0]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-1/2 left-1/3 w-48 h-48 bg-white/10 rounded-full"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 90, 0]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        {/* Floating Images */}
        <motion.div
          className="absolute top-10 left-10 w-24 h-24 rounded-full overflow-hidden shadow-2xl"
          animate={{
            y: [0, -20, 0],
            rotate: [0, 10, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
            alt="Wheat field"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          className="absolute bottom-20 right-20 w-32 h-32 rounded-full overflow-hidden shadow-2xl"
          animate={{
            y: [0, 20, 0],
            rotate: [0, -10, 0]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
            alt="Solar panels"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          className="absolute top-1/3 right-1/4 w-28 h-28 rounded-full overflow-hidden shadow-2xl"
          animate={{
            y: [0, -15, 0],
            x: [0, 15, 0]
          }}
          transition={{
            duration: 4.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
        >
          <img 
            src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c7e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
            alt="Tractor"
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <motion.h1 
                className="text-5xl md:text-7xl font-bold mb-6 leading-tight" 
                style={{ fontFamily: fontFamily.heading }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Power Your Farm with Solar — Pumps, Panels & Subsidies
              </motion.h1>
              <motion.p 
                className="text-xl text-green-50 mb-8 max-w-lg" 
                style={{ fontFamily: fontFamily.body }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                Solar pumps, high-efficiency panels, and subsidy support — trusted by 10,000+ farmers. Save up to 90% on energy costs.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <Link to="/solar-services">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-yellow-500 text-gray-800 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-400 shadow-xl flex items-center gap-2 text-lg"
                    style={{ fontFamily: fontFamily.heading }}
                  >
                    <IoSunny /> Explore Solar Solutions
                  </motion.button>
                </Link>
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 shadow-xl flex items-center gap-2 text-lg"
                    style={{ fontFamily: fontFamily.heading }}
                  >
                    <IoLeaf /> Shop Agriculture Products
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div 
                className="grid grid-cols-3 gap-6 mt-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              >
                {[
                  { value: '10K+', label: 'Happy Farmers' },
                  { value: '500+', label: 'Products' },
                  { value: '24/7', label: 'Support' }
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="text-center"
                    whileHover={{ scale: 1.1 }}
                  >
                    <div className="text-3xl font-bold">{item.value}</div>
                    <div className="text-sm opacity-90">{item.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden md:block relative"
            >
              <motion.div 
                className="absolute inset-0 bg-white/20 rounded-full blur-3xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="relative grid grid-cols-2 gap-4">
                <motion.img 
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Agriculture field"
                  className="rounded-2xl shadow-2xl h-64 w-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.img 
                  src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Solar panels"
                  className="rounded-2xl shadow-2xl h-64 w-full object-cover mt-8"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* All Options Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <AnimatedSection direction="up">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3" style={{ fontFamily: fontFamily.heading }}>All Options</h2>
              <p className="text-gray-600 text-lg max-w-3xl mx-auto" style={{ fontFamily: fontFamily.body }}>
                Quick links to the main sections — shop, services, solar, subsidies and guides.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-6">
            <CategoryCard icon={IoSunny} title="Solar Solutions" color="#FBBF24" delay={0.05} onClick={() => navigate('/solar-services')} />
            <CategoryCard icon={IoWater} title="Solar Pumps" color="#0284C7" delay={0.1} onClick={() => navigate('/solar-services')} />
            <CategoryCard icon={IoGift} title="Subsidy Help" color="#10B981" delay={0.15} onClick={() => navigate('/subsidy')} />
            <CategoryCard icon={IoPeople} title="Install & Maintain" color="#2E7D32" delay={0.2} onClick={() => navigate('/services')} />
            <CategoryCard icon={IoHardwareChip} title="IoT Monitoring" color="#8B5CF6" delay={0.25} onClick={() => navigate('/iot')} />
            <CategoryCard icon={IoCalculator} title="EMI Calculator" color="#F59E0B" delay={0.3} onClick={() => navigate('/emi-calculator')} />
            <CategoryCard icon={IoNewspaper} title="Guides & Blog" color="#6D28D9" delay={0.35} onClick={() => navigate('/blog')} />
            <CategoryCard icon={IoCall} title="Support" color="#EF4444" delay={0.4} onClick={() => navigate('/contact')} />
          </div>
        </div>
      </section>

      {/* Solar Highlight Section */}
      <section className="py-12 bg-gradient-to-r from-yellow-50 to-yellow-100">
        <div className="container mx-auto px-4">
          <AnimatedSection direction="up">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Solar Solutions For Your Farm</h2>
                <p className="text-gray-700 mb-6">Switch to solar pumps and panels with subsidy support, free site survey and professional installation. Save up to 80% on energy costs and reduce your farm's carbon footprint.</p>
                <div className="flex gap-4">
                  <Link to="/solar-services">
                    <motion.button whileHover={{ scale: 1.03 }} className="bg-yellow-500 text-gray-900 px-6 py-3 rounded-lg font-semibold">Explore Solar Solutions</motion.button>
                  </Link>
                  <Link to="/subsidy">
                    <motion.button whileHover={{ scale: 1.03 }} className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold border">Check Subsidy</motion.button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow">
                  <h4 className="font-semibold">Solar Pumps</h4>
                  <p className="text-sm text-gray-600">High-efficiency pumps with up to 90% subsidy and low maintenance.</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow">
                  <h4 className="font-semibold">Solar Panels</h4>
                  <p className="text-sm text-gray-600">Monocrystalline panels with long-term warranty and performance guarantee.</p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
      

      {/* Stats Section */}
      <StatsSection />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Featured Products Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-12">
            <AnimatedSection direction="left">
              <h2 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: fontFamily.heading }}>Featured Products</h2>
              <p className="text-gray-600" style={{ fontFamily: fontFamily.body }}>Hand-picked products for your farm</p>
            </AnimatedSection>
            
            <AnimatedSection direction="right">
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                <motion.select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-green-600 outline-none"
                  style={{ fontFamily: fontFamily.body }}
                  whileHover={{ scale: 1.02 }}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </motion.select>
                
                <Link to="/products">
                  <motion.button 
                    className="text-green-600 font-semibold hover:underline flex items-center gap-1" 
                    style={{ fontFamily: fontFamily.body }}
                    whileHover={{ x: 5 }}
                  >
                    View All <IoArrowForward />
                  </motion.button>
                </Link>
              </div>
            </AnimatedSection>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <SkeletonLoader count={6} />
            </div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.length > 0 ? filteredProducts.slice(0, 6).map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  onAddToCart={handleAddToCart}
                  onToggleWishlist={handleToggleWishlist}
                  onShare={handleShareProduct}
                  onQuickView={handleQuickView}
                />
              )) : (
                <p className="text-center text-gray-500 col-span-3">No products found</p>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Solar Solutions Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4">
          <AnimatedSection direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: fontFamily.heading }}>Solar Solutions</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto" style={{ fontFamily: fontFamily.body }}>
                Power your farm with clean energy. Save up to 80% on electricity bills.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <ServiceCard
              icon={IoSunny}
              title="On-Grid Solar"
              color="#FBC02D"
              features={[
                'Net metering facility',
                'Sell excess power',
                '5-100 kW systems'
              ]}
              link="/solar-services"
              index={0}
            />
            <ServiceCard
              icon={IoFlash}
              title="Off-Grid Solar"
              color="#FBC02D"
              features={[
                'Complete independence',
                'Battery storage',
                '24/7 power supply'
              ]}
              link="/solar-services"
              index={1}
            />
            <ServiceCard
              icon={IoWater}
              title="Solar Pumps"
              color="#FBC02D"
              features={[
                '1 HP to 25 HP capacity',
                '90% subsidy available',
                'Free maintenance'
              ]}
              link="/solar-services"
              index={2}
            />
          </div>

          <motion.div 
            className="bg-yellow-100 bg-opacity-50 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4"
            whileHover={{ y: -5 }}
          >
            <div className="flex flex-wrap gap-4">
              <motion.span 
                className="flex items-center gap-2 text-yellow-600 font-semibold" 
                style={{ fontFamily: fontFamily.body }}
                whileHover={{ scale: 1.05 }}
              >
                <IoCalculator /> EMI Available
              </motion.span>
              <motion.span 
                className="flex items-center gap-2 text-yellow-600 font-semibold" 
                style={{ fontFamily: fontFamily.body }}
                whileHover={{ scale: 1.05 }}
              >
                <IoGift /> Govt Subsidy Up to 90%
              </motion.span>
            </div>
            <Link to="/solar-services">
              <motion.button 
                className="bg-yellow-500 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition" 
                style={{ fontFamily: fontFamily.heading }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Free Consultation
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Solar Subsidy Guide Section */}
      <SolarSubsidyGuide />

      {/* Government Subsidy Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <AnimatedSection direction="left">
              <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: fontFamily.heading }}>
                Government Subsidy Support
              </h2>
              <p className="text-gray-600 text-lg mb-6" style={{ fontFamily: fontFamily.body }}>
                Get up to 90% subsidy on solar pumps under PM-KUSUM scheme. 
                We help you with complete documentation and approval process.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { step: 1, title: 'Check Eligibility', desc: 'Verify your eligibility for subsidy' },
                  { step: 2, title: 'Submit Documents', desc: 'We help with all paperwork' },
                  { step: 3, title: 'Installation & Approval', desc: 'Quick installation and subsidy approval' }
                ].map((item) => (
                  <motion.div 
                    key={item.step} 
                    className="flex gap-4"
                    whileHover={{ x: 5 }}
                  >
                    <motion.div 
                      className="w-10 h-10 rounded-full bg-green-600 text-white font-bold flex items-center justify-center flex-shrink-0"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {item.step}
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-gray-800" style={{ fontFamily: fontFamily.heading }}>{item.title}</h4>
                      <p className="text-sm text-gray-600" style={{ fontFamily: fontFamily.body }}>{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Link to="/subsidy">
                <motion.button 
                  className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-600 transition shadow-lg" 
                  style={{ fontFamily: fontFamily.heading }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Check Eligibility
                </motion.button>
              </Link>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <motion.div 
                className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl shadow-xl"
                whileHover={{ y: -5 }}
              >
                <div className="text-center mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <IoCash className="text-5xl text-green-600 mx-auto mb-2" />
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-800 mt-2" style={{ fontFamily: fontFamily.heading }}>Subsidy Calculator</h3>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2" style={{ fontFamily: fontFamily.body }}>System Cost (₹)</label>
                    <input
                      type="range"
                      min="100000"
                      max="1000000"
                      step="50000"
                      defaultValue="500000"
                      className="w-full accent-green-600"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="bg-white p-3 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="text-sm text-gray-500" style={{ fontFamily: fontFamily.body }}>Subsidy Amount</p>
                      <p className="text-xl font-bold text-green-600" style={{ fontFamily: fontFamily.heading }}>₹4,50,000</p>
                    </motion.div>
                    <motion.div 
                      className="bg-white p-3 rounded-lg"
                      whileHover={{ scale: 1.05 }}
                    >
                      <p className="text-sm text-gray-500" style={{ fontFamily: fontFamily.body }}>Your Cost</p>
                      <p className="text-xl font-bold text-yellow-500" style={{ fontFamily: fontFamily.heading }}>₹50,000</p>
                    </motion.div>
                  </div>
                  
                  <p className="text-sm text-gray-600 text-center" style={{ fontFamily: fontFamily.body }}>
                    *Based on 90% subsidy for 5HP pump
                  </p>
                </div>
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection />

      {/* Success Stories */}
      <SuccessStories />

      {/* Testimonial Slider */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <AnimatedSection direction="up">
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">What Farmers Say About Us</h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Real experiences from our valued farmers
            </p>
          </AnimatedSection>
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gradient-to-r from-green-700 to-green-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full transform -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-48 translate-y-48"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection direction="up">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: fontFamily.heading }}>Why Choose AgroMart?</h2>
              <p className="text-xl opacity-90 max-w-2xl mx-auto" style={{ fontFamily: fontFamily.body }}>
                We're committed to your farming success
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: IoShield, title: 'Trusted Vendors', desc: 'Verified sellers' },
              { icon: IoRocket, title: 'Fast Delivery', desc: 'Within 3-5 days' },
              { icon: IoPeople, title: 'Expert Installation', desc: 'Certified team' },
              { icon: IoTime, title: '24/7 Support', desc: 'Always here to help' }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <motion.div 
                  className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <item.icon className="text-3xl" />
                </motion.div>
                <h3 className="font-bold text-lg mb-1" style={{ fontFamily: fontFamily.heading }}>{item.title}</h3>
                <p className="text-sm opacity-80" style={{ fontFamily: fontFamily.body }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <AnimatedSection direction="left">
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Latest from Blog</h2>
              <p className="text-gray-600">Farming tips, news, and updates</p>
            </AnimatedSection>
            <AnimatedSection direction="right">
              <Link to="/blog" className="text-green-600 font-semibold flex items-center gap-1">
                View All Posts <IoArrowForward />
              </Link>
            </AnimatedSection>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              <SkeletonLoader count={3} type="blog" />
            </div>
          ) : (
            <motion.div 
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-8"
            >
              {blogPosts.slice(0, 3).map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} />
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Partners Section */}
      <PartnersSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-700 via-green-600 to-yellow-500 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full transform -translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full transform translate-x-48 translate-y-48"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection direction="up">
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: fontFamily.heading }}>Ready to Transform Your Farm?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto" style={{ fontFamily: fontFamily.body }}>
              Join thousands of farmers using AgroMart for better yields and sustainable farming.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register">
                <motion.button 
                  className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-green-50 shadow-xl text-lg" 
                  style={{ fontFamily: fontFamily.heading }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Today
                </motion.button>
              </Link>
              <Link to="/contact">
                <motion.button 
                  className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 text-lg" 
                  style={{ fontFamily: fontFamily.heading }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Contact Sales
                </motion.button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Scroll to top button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 bg-gradient-to-r from-green-600 to-green-500 text-white p-4 rounded-full shadow-lg hover:from-green-700 hover:to-green-600 transition-all z-40"
          >
            <IoArrowUp className="text-xl" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}