import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
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
  IoLogoTwitter, IoLogoInstagram
} from 'react-icons/io5'
import { motion, useAnimation, useInView, AnimatePresence } from 'framer-motion'

// Font Family Configuration
const fontFamily = {
  heading: "'Poppins', sans-serif",
  body: "'Inter', sans-serif"
}

// ==================== SKELETON LOADER COMPONENT ====================
const SkeletonLoader = ({ count = 4 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div key={i} className="bg-white rounded-xl p-4 animate-pulse">
          <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded"></div>
        </div>
      ))}
    </>
  )
}

// ==================== CATEGORY CARD COMPONENT ====================
const CategoryCard = ({ icon: Icon, title, color, onClick }) => (
  <motion.div
    whileHover={{ y: -5 }}
    onClick={onClick}
    className="bg-white rounded-xl shadow-lg p-6 cursor-pointer group"
    style={{ borderBottom: `4px solid ${color}` }}
  >
    <div className="flex flex-col items-center text-center">
      <div className={`w-16 h-16 rounded-full bg-opacity-10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
           style={{ backgroundColor: `${color}20` }}>
        <Icon className="text-3xl" style={{ color }} />
      </div>
      <h3 className="font-semibold text-gray-800" style={{ fontFamily: fontFamily.heading }}>{title}</h3>
    </div>
  </motion.div>
)

// ==================== PRODUCT CARD COMPONENT ====================
const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false)
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        {!imageError ? (
          <img 
            src={product.image || product.images?.[0] || 'https://images.unsplash.com/photo-1592982537447-6f2a6a0c7e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'} 
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
            <IoLeaf className="text-6xl text-white" />
          </div>
        )}
        {product.discount > 0 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
            {product.discount}% OFF
          </span>
        )}
        {product.isNew && (
          <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            New
          </span>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1" style={{ fontFamily: fontFamily.heading }}>{product.name}</h3>
        
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <IoStar 
              key={i} 
              className={`text-sm ${i < (product.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({product.reviews || 0})</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-xl font-bold text-green-600">₹{product.price}</span>
            {product.mrp > product.price && (
              <span className="text-sm text-gray-400 line-through ml-2">₹{product.mrp}</span>
            )}
          </div>
        </div>
        
        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition flex items-center justify-center gap-2">
          <IoCart /> Add to Cart
        </button>
      </div>
    </motion.div>
  )
}

// ==================== SERVICE CARD COMPONENT ====================
const ServiceCard = ({ icon: Icon, title, features, color, link }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-xl shadow-lg overflow-hidden"
  >
    <div className="h-32 flex items-center justify-center" style={{ backgroundColor: `${color}15` }}>
      <Icon className="text-5xl" style={{ color }} />
    </div>
    <div className="p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-3" style={{ fontFamily: fontFamily.heading }}>{title}</h3>
      <ul className="space-y-2 mb-4">
        {features.map((feature, i) => (
          <li key={i} className="flex items-center gap-2 text-sm text-gray-600" style={{ fontFamily: fontFamily.body }}>
            <IoCheckmarkCircle className="text-green-600 text-sm" />
            {feature}
          </li>
        ))}
      </ul>
      <Link 
        to={link}
        className="inline-flex items-center gap-2 font-semibold"
        style={{ color, fontFamily: fontFamily.body }}
      >
        Learn More <IoArrowForward />
      </Link>
    </div>
  </motion.div>
)

// ==================== TESTIMONIAL CARD COMPONENT ====================
const TestimonialCard = ({ name, location, content, rating, image }) => (
  <div className="bg-white rounded-xl shadow-lg p-6">
    <div className="flex items-center gap-1 mb-3">
      {[...Array(5)].map((_, i) => (
        <IoStar key={i} className={i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'} />
      ))}
    </div>
    <p className="text-gray-600 mb-4 italic" style={{ fontFamily: fontFamily.body }}>"{content}"</p>
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-400 rounded-full flex items-center justify-center text-white font-bold text-lg overflow-hidden">
        {image ? (
          <img src={image} alt={name} className="w-full h-full rounded-full object-cover" />
        ) : (
          <IoHappy className="text-2xl" />
        )}
      </div>
      <div>
        <h4 className="font-semibold text-gray-800" style={{ fontFamily: fontFamily.heading }}>{name}</h4>
        <p className="text-sm text-gray-500" style={{ fontFamily: fontFamily.body }}>{location}</p>
      </div>
    </div>
  </div>
)

// ==================== WHATSAPP BUTTON COMPONENT ====================
const WhatsAppButton = () => {
  return (
    <motion.a
      href="https://wa.me/919876543210?text=Hello%20I%20need%20help%20with%20AgroMart"
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.1 }}
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg z-50 hover:bg-green-600 transition"
    >
      <IoLogoWhatsapp className="text-2xl" />
    </motion.a>
  )
}

// ==================== ANIMATION VARIANTS ====================
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const scaleIn = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1 }
}

// ==================== ANIMATED SECTION WRAPPER ====================
const AnimatedSection = ({ children, className, delay = 0 }) => {
  const controls = useAnimation()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.3 })

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
      variants={fadeInUp}
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
    <span ref={ref} className="text-3xl font-bold">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// ==================== MARQUEE ====================
const Marquee = ({ items, speed = 30 }) => {
  return (
    <div className="overflow-hidden bg-white py-3 border-y border-gray-200">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{
          x: [0, -1000]
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {items.concat(items).map((item, index) => (
          <div key={index} className="flex items-center mx-8">
            <item.icon className="text-[#2E7D32] text-xl mr-2" />
            <span className="text-gray-700 font-medium">{item.text}</span>
          </div>
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
    <section className="relative h-[500px] overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://player.vimeo.com/external/370331467.sd.mp4?s=90c2c13b7d5fdb5c27c5a3c6d3e0b8b7f9e8d7c6f&profile_id=164" type="video/mp4" />
      </video>
      
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-4"
            style={{ fontFamily: fontFamily.heading }}
          >
            Modern Farming Starts Here
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl mb-8 max-w-2xl mx-auto"
          >
            See how technology is transforming agriculture
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onClick={toggleVideo}
            className="bg-white text-[#2E7D32] px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition flex items-center gap-2 mx-auto"
          >
            {isPlaying ? <IoPause /> : <IoPlay />} {isPlaying ? 'Pause' : 'Play'} Video
          </motion.button>
        </div>
      </div>
    </section>
  )
}

// ==================== TESTIMONIAL SLIDER ====================
const TestimonialSlider = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src={testimonials[currentIndex].image} 
                alt={testimonials[currentIndex].name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <IoStar key={i} className={i < testimonials[currentIndex].rating ? 'text-yellow-400 fill-current text-xl' : 'text-gray-300 text-xl'} />
                ))}
              </div>
              <p className="text-gray-700 text-lg mb-4 italic">"{testimonials[currentIndex].content}"</p>
              <h4 className="font-bold text-xl text-gray-800">{testimonials[currentIndex].name}</h4>
              <p className="text-gray-500">{testimonials[currentIndex].location}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={prev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
      >
        <IoArrowBack size={24} />
      </button>
      <button
        onClick={next}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50"
      >
        <IoArrowForward size={24} />
      </button>

      <div className="flex justify-center gap-2 mt-6">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? 'w-8 bg-[#2E7D32]' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// ==================== BLOG CARD ====================
const BlogCard = ({ post, index }) => {
  return (
    <motion.article
      variants={fadeInUp}
      whileHover={{ y: -10 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden group"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={post.image} 
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 bg-[#2E7D32] text-white px-3 py-1 rounded-full text-sm">
          {post.category}
        </div>
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
        <Link 
          to={`/blog/${post.id}`}
          className="inline-flex items-center gap-2 text-[#2E7D32] font-semibold hover:gap-3 transition-all"
        >
          Read More <IoArrowForward />
        </Link>
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
    <section className="py-16 bg-gradient-to-r from-[#2E7D32] to-[#81C784] text-white">
      <div className="container mx-auto px-4">
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
              className="text-center"
            >
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <stat.icon className="text-4xl" />
              </div>
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Our Partners & Certifications</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              className="opacity-50 hover:opacity-100 transition grayscale hover:grayscale-0"
            >
              <img src={partner.logo} alt={partner.name} className="w-full h-auto" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ==================== FEATURES GRID ====================
const FeaturesGrid = () => {
  const features = [
    { icon: IoShield, title: 'Quality Assured', desc: 'All products tested and certified' },
    { icon: IoRocket, title: 'Fast Delivery', desc: 'Delivery within 3-5 days' },
    { icon: IoPeople, title: 'Expert Support', desc: '24/7 farmer assistance' },
    { icon: IoCash, title: 'Best Prices', desc: 'Direct from manufacturers' },
    { icon: IoEarth, title: 'Sustainable', desc: 'Eco-friendly farming' },
    { icon: IoWifi, title: 'Smart Farming', desc: 'IoT enabled solutions' },
    { icon: IoHardwareChip, title: 'Modern Tech', desc: 'Latest agricultural tech' },
    { icon: IoNutrition, title: 'Organic Options', desc: '100% organic products' }
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center text-gray-800 mb-4"
        >
          Why Farmers Love Us
        </motion.h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          We provide end-to-end solutions for modern farming needs
        </p>

        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={fadeInUp}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center group"
            >
              <div className="w-16 h-16 bg-[#2E7D32]/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2E7D32] transition-colors">
                <feature.icon className="text-2xl text-[#2E7D32] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{feature.title}</h3>
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
      increase: '+120%'
    },
    {
      farmer: 'Lakshmi Devi',
      location: 'Tamil Nadu',
      before: 'High electricity costs',
      after: 'Solar pump saved 80% costs',
      image: 'https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      increase: '₹50K/year'
    },
    {
      farmer: 'Gurpreet Singh',
      location: 'Punjab',
      before: 'Chemical farming',
      after: 'Organic certification achieved',
      image: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      increase: '+200%'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-4">Success Stories</h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Real farmers, real results with AgroMart
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -10 }}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#2E7D32]/10 rounded-bl-full"></div>
              
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={story.image} 
                  alt={story.farmer}
                  className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <h3 className="font-bold text-lg">{story.farmer}</h3>
                  <p className="text-sm text-gray-600">{story.location}</p>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Before</p>
                  <p className="font-medium">{story.before}</p>
                </div>
                <div className="bg-white/50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">After</p>
                  <p className="font-medium text-[#2E7D32]">{story.after}</p>
                </div>
              </div>

              <div className="text-center">
                <span className="inline-block bg-[#2E7D32] text-white px-4 py-2 rounded-full font-bold">
                  {story.increase} Growth
                </span>
              </div>
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
    <section className="py-16 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 bg-yellow-500 text-white rounded-full text-sm font-semibold mb-4">
            PM Surya Ghar: Muft Bijli Yojana
          </span>
          <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: fontFamily.heading }}>
            Solar Subsidy Guide: City by City Breakdown
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Launched in February 2024, this flagship scheme aims to install rooftop solar in 1 crore households by 2027, adding 30 GW capacity.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - National Scheme */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1 space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <IoHome className="text-green-600" /> Central Financial Assistance
              </h3>
              <div className="space-y-4">
                {subsidyTable.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
                    <p className="text-sm text-gray-500">Monthly Consumption: {item.consumption}</p>
                    <p className="font-semibold">System Size: {item.size}</p>
                    <p className="text-green-600 font-bold">Subsidy: {item.subsidy}</p>
                  </div>
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
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <IoBusiness className="text-green-600" /> How to Get Started
              </h3>
              <div className="space-y-3">
                <a 
                  href="https://www.pmsuryaghar.gov.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition text-center font-semibold"
                >
                  Visit National Portal →
                </a>
                <p className="text-sm text-gray-600 text-center">
                  Register, apply for subsidies, and select vendors at www.pmsuryaghar.gov.in
                </p>
                <p className="text-xs text-gray-500 text-center mt-2">
                  Check with your local DISCOM for net metering approvals
                </p>
              </div>
            </div>
          </motion.div>

          {/* Middle Column - City Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <IoLocation className="text-green-600" /> City-Wise Success Stories
              </h3>
              
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                {cities.map(city => (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city.id)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                      selectedCity === city.id
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <city.icon className="inline mr-1" /> {city.name}
                  </button>
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
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <p className="text-2xl font-bold text-blue-600">{cityData.pune.installations}</p>
                          <p className="text-xs text-gray-600">Installations</p>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <p className="text-2xl font-bold text-green-600">{cityData.pune.capacity}</p>
                          <p className="text-xs text-gray-600">Capacity</p>
                        </div>
                        <div className="bg-yellow-50 p-3 rounded-lg text-center">
                          <p className="text-2xl font-bold text-yellow-600">{cityData.pune.subsidy}</p>
                          <p className="text-xs text-gray-600">Subsidy</p>
                        </div>
                      </div>
                      {cityData.pune.details.map((area, idx) => (
                        <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-semibold">{area.area}</p>
                          <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                            <span>{area.projects} projects</span>
                            <span>{area.capacity}</span>
                            <span className="text-green-600">{area.subsidy}</span>
                          </div>
                        </div>
                      ))}
                    </>
                  )}

                  {selectedCity === 'raipur' && (
                    <div className="text-center p-4">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="bg-green-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Monthly Savings</p>
                          <p className="text-2xl font-bold text-green-600">{cityData.raipur.savings}</p>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <p className="text-sm text-gray-600">Payback Period</p>
                          <p className="text-2xl font-bold text-blue-600">{cityData.raipur.payback}</p>
                        </div>
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
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Net Metering</p>
                        <p className="font-bold">{cityData.delhi.netMetering}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Compensation</p>
                        <p className="font-bold">{cityData.delhi.compensation}</p>
                      </div>
                      {cityData.delhi.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <IoCheckmarkCircle className="text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {selectedCity === 'ahmedabad' && (
                    <div className="space-y-3">
                      <p className="font-semibold text-green-600">{cityData.ahmedabad.policy}</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Net Metering</p>
                        <p className="font-bold">{cityData.ahmedabad.netMetering}</p>
                      </div>
                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-gray-600">Rate</p>
                        <p className="font-bold">{cityData.ahmedabad.rate}</p>
                      </div>
                      {cityData.ahmedabad.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <IoCheckmarkCircle className="text-green-600" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Right Column - State Policies */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-xl p-6 h-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <IoEarth className="text-green-600" /> State-Wide Policies
                </h3>
                <button
                  onClick={() => setShowStateTable(!showStateTable)}
                  className="text-sm text-green-600 hover:text-green-700 font-semibold"
                >
                  {showStateTable ? 'Show Less' : 'View All'}
                </button>
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
                      <tr key={idx} className="border-b hover:bg-gray-50">
                        <td className="p-2 font-medium">{policy.state}</td>
                        <td className="p-2 text-xs">{policy.netMetering}</td>
                        <td className="p-2 text-xs text-green-600">{policy.rate}</td>
                      </tr>
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
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link
            to="/subsidy"
            className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition shadow-lg hover:shadow-xl"
          >
            <IoCalculator /> Calculate Your Subsidy
            <IoArrowForward />
          </Link>
        </motion.div>
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
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Frequently Asked Questions</h2>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50"
              >
                <span className="font-semibold text-gray-800">{faq.question}</span>
                <span className={`transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>
              
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

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubscribed(true)
    setTimeout(() => setSubscribed(false), 3000)
  }

  return (
    <section className="py-20 bg-gradient-to-r from-[#2E7D32] to-[#81C784]">
      <div className="container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-green-50 mb-8">
            Get latest farming tips, subsidy news, and product updates
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              required
            />
            <button
              type="submit"
              className="bg-white text-[#2E7D32] px-8 py-3 rounded-lg font-semibold hover:bg-green-50 transition"
            >
              Subscribe
            </button>
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
        </motion.div>
      </div>
    </section>
  )
}

// ==================== MAIN HOME COMPONENT ====================
export default function Home() {
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

  // Marquee items
  const marqueeItems = [
    { icon: IoLeaf, text: 'Organic Certified Products' },
    { icon: IoFlash, text: '90% Subsidy Available' },
    { icon: IoCash, text: 'Best Price Guarantee' },
    { icon: IoRocket, text: 'Free Delivery on ₹1000+' },
    { icon: IoShield, text: 'Quality Assured' },
    { icon: IoTime, text: '24/7 Support' }
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
        // Simulate API calls with sample data
        setTimeout(() => {
          setFeaturedProducts([])
          setBlogPosts(sampleBlogs)
          setCategories([])
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Error fetching home data:', error)
        setFeaturedProducts([])
        setBlogPosts(sampleBlogs)
        setCategories([])
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

  return (
    <div className="min-h-screen bg-[#F1F8E9]" style={{ fontFamily: fontFamily.body }}>
      {/* Marquee */}
      <Marquee items={marqueeItems} speed={25} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#2E7D32] via-[#81C784] to-[#FBC02D] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
            alt="Wheat field"
            className="absolute top-10 left-10 w-24 h-24 rounded-full object-cover"
          />
          <img 
            src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
            alt="Solar panels"
            className="absolute bottom-20 right-20 w-32 h-32 rounded-full object-cover"
          />
          <img 
            src="https://images.unsplash.com/photo-1592982537447-6f2a6a0c7e5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
            alt="Tractor"
            className="absolute top-1/3 right-1/4 w-28 h-28 rounded-full object-cover"
          />
          <img 
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
            alt="Sunflower field"
            className="absolute bottom-10 left-1/3 w-36 h-36 rounded-full object-cover"
          />
        </div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ fontFamily: fontFamily.heading }}>
                Empowering Farmers with Smart Agriculture & Solar Solutions
              </h1>
              <p className="text-xl text-green-50 mb-8 max-w-lg" style={{ fontFamily: fontFamily.body }}>
                Quality seeds, fertilizers, solar pumps, and government subsidy support. 
                Trusted by 10,000+ farmers across India.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-white text-[#2E7D32] px-8 py-3 rounded-lg font-semibold hover:bg-green-50 shadow-lg flex items-center gap-2 text-lg"
                    style={{ fontFamily: fontFamily.heading }}
                  >
                    <IoLeaf /> Shop Agriculture Products
                  </motion.button>
                </Link>
                <Link to="/solar-services">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-[#FBC02D] text-gray-800 px-8 py-3 rounded-lg font-semibold hover:bg-yellow-500 shadow-lg flex items-center gap-2 text-lg"
                    style={{ fontFamily: fontFamily.heading }}
                  >
                    <IoSunny /> Explore Solar Solutions
                  </motion.button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-6 mt-12">
                <div className="text-center">
                  <div className="text-3xl font-bold">10K+</div>
                  <div className="text-sm opacity-90">Happy Farmers</div>
                </div>
                <div className="text-center border-x border-white/20">
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-sm opacity-90">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">24/7</div>
                  <div className="text-sm opacity-90">Support</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="hidden md:block relative"
            >
              <div className="absolute inset-0 bg-white/10 rounded-full blur-3xl"></div>
              <div className="relative grid grid-cols-2 gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Agriculture field"
                  className="rounded-2xl shadow-2xl h-64 w-full object-cover transform hover:scale-105 transition-transform duration-500"
                />
                <img 
                  src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Solar panels"
                  className="rounded-2xl shadow-2xl h-64 w-full object-cover mt-8 transform hover:scale-105 transition-transform duration-500"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Quick Services Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: fontFamily.heading }}>Quick Services</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto" style={{ fontFamily: fontFamily.body }}>
              Everything you need for modern farming at your fingertips
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <CategoryCard 
              icon={IoLeaf}
              title="Buy Seeds"
              color="#2E7D32"
              onClick={() => window.location.href = '/products?category=seeds'}
            />
            <CategoryCard 
              icon={IoFlask}
              title="Fertilizers & Bio Waste"
              color="#FBC02D"
              onClick={() => window.location.href = '/products?category=fertilizers'}
            />
            <CategoryCard 
              icon={IoSunny}
              title="Solar Pump Installation"
              color="#0288D1"
              onClick={() => window.location.href = '/solar-services'}
            />
            <CategoryCard 
              icon={IoGift}
              title="Government Subsidy Help"
              color="#81C784"
              onClick={() => window.location.href = '/subsidy'}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <StatsSection />

      {/* Features Grid */}
      <FeaturesGrid />

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-800 mb-2" style={{ fontFamily: fontFamily.heading }}>Featured Products</h2>
              <p className="text-gray-600" style={{ fontFamily: fontFamily.body }}>Hand-picked products for your farm</p>
            </motion.div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2E7D32] outline-none"
                style={{ fontFamily: fontFamily.body }}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              
              <Link to="/products">
                <button className="text-[#2E7D32] font-semibold hover:underline flex items-center gap-1" style={{ fontFamily: fontFamily.body }}>
                  View All <IoArrowForward />
                </button>
              </Link>
            </div>
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredProducts.length > 0 ? filteredProducts.map(product => (
                <motion.div key={product.id} variants={fadeInUp}>
                  <ProductCard product={product} />
                </motion.div>
              )) : (
                <p className="text-center text-gray-500 col-span-3">No products found</p>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Solar Solutions Section */}
      <section className="py-16 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-4" style={{ fontFamily: fontFamily.heading }}>Solar Solutions</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto" style={{ fontFamily: fontFamily.body }}>
              Power your farm with clean energy. Save up to 80% on electricity bills.
            </p>
          </motion.div>

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
              link="/solar-services/on-grid"
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
              link="/solar-services/off-grid"
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
              link="/solar-services/pumps"
            />
          </div>

          <div className="bg-[#FBC02D] bg-opacity-10 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <span className="flex items-center gap-2 text-[#FBC02D] font-semibold" style={{ fontFamily: fontFamily.body }}>
                <IoCalculator /> EMI Available
              </span>
              <span className="flex items-center gap-2 text-[#FBC02D] font-semibold" style={{ fontFamily: fontFamily.body }}>
                <IoGift /> Govt Subsidy Up to 90%
              </span>
            </div>
            <Link to="/solar-services/consultation">
              <button className="bg-[#FBC02D] text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition" style={{ fontFamily: fontFamily.heading }}>
                Get Free Consultation
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Solar Subsidy Guide Section */}
      <SolarSubsidyGuide />

      {/* Government Subsidy Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
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
                  <div key={item.step} className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#2E7D32] text-white font-bold flex items-center justify-center flex-shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800" style={{ fontFamily: fontFamily.heading }}>{item.title}</h4>
                      <p className="text-sm text-gray-600" style={{ fontFamily: fontFamily.body }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/subsidy">
                <button className="bg-[#2E7D32] text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 transition" style={{ fontFamily: fontFamily.heading }}>
                  Check Eligibility
                </button>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-blue-50 p-8 rounded-2xl"
            >
              <div className="text-center mb-6">
                <IoCash className="text-5xl text-[#2E7D32] mx-auto mb-2" />
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
                    className="w-full accent-[#2E7D32]"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-500" style={{ fontFamily: fontFamily.body }}>Subsidy Amount</p>
                    <p className="text-xl font-bold text-[#2E7D32]" style={{ fontFamily: fontFamily.heading }}>₹4,50,000</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg">
                    <p className="text-sm text-gray-500" style={{ fontFamily: fontFamily.body }}>Your Cost</p>
                    <p className="text-xl font-bold text-[#FBC02D]" style={{ fontFamily: fontFamily.heading }}>₹50,000</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 text-center" style={{ fontFamily: fontFamily.body }}>
                  *Based on 90% subsidy for 5HP pump
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <VideoSection />

      {/* Success Stories */}
      <SuccessStories />

      {/* Testimonial Slider */}
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">What Farmers Say About Us</h2>
          <TestimonialSlider testimonials={testimonials} />
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-[#2E7D32] text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4" style={{ fontFamily: fontFamily.heading }}>Why Choose AgroMart?</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto" style={{ fontFamily: fontFamily.body }}>
              We're committed to your farming success
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: IoShield, title: 'Trusted Vendors', desc: 'Verified sellers' },
              { icon: IoRocket, title: 'Fast Delivery', desc: 'Within 3-5 days' },
              { icon: IoPeople, title: 'Expert Installation', desc: 'Certified team' },
              { icon: IoTime, title: '24/7 Support', desc: 'Always here to help' }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="text-3xl" />
                </div>
                <h3 className="font-bold text-lg mb-1" style={{ fontFamily: fontFamily.heading }}>{item.title}</h3>
                <p className="text-sm opacity-80" style={{ fontFamily: fontFamily.body }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-800 mb-2">Latest from Blog</h2>
              <p className="text-gray-600">Farming tips, news, and updates</p>
            </div>
            <Link to="/blog" className="text-[#2E7D32] font-semibold flex items-center gap-1">
              View All Posts <IoArrowForward />
            </Link>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            className="grid md:grid-cols-3 gap-8"
          >
            {blogPosts.slice(0, 3).map((post, index) => (
              <BlogCard key={post.id} post={post} index={index} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <PartnersSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Newsletter Section */}
      <NewsletterSection />

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#2E7D32] to-[#81C784] text-white text-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: fontFamily.heading }}>Ready to Transform Your Farm?</h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto" style={{ fontFamily: fontFamily.body }}>
              Join thousands of farmers using AgroMart for better yields and sustainable farming.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register">
                <button className="bg-white text-[#2E7D32] px-8 py-3 rounded-lg font-semibold hover:bg-green-50 shadow-lg text-lg" style={{ fontFamily: fontFamily.heading }}>
                  Get Started Today
                </button>
              </Link>
              <Link to="/contact">
                <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 text-lg" style={{ fontFamily: fontFamily.heading }}>
                  Contact Sales
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Scroll to top button */}
      {showScrollTop && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={scrollToTop}
          className="fixed bottom-6 left-6 bg-[#2E7D32] text-white p-3 rounded-full shadow-lg hover:bg-green-700 transition-all z-40"
        >
          <IoArrowUp className="text-xl" />
        </motion.button>
      )}
    </div>
  )
}