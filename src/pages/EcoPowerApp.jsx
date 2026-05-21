import React, { useState } from 'react';
import { 
  Sun, Wind, Battery, Zap, Wrench, ShieldCheck, 
  LineChart, Phone, Mail, MapPin, ChevronRight, 
  Menu, X, Calculator, Leaf, Home as HomeIcon, Settings, Target
} from 'lucide-react';

// --- COMPONENTS ---

const Navbar = ({ activeTab, setActiveTab, openQuoteModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = ['Home', 'Products', 'Services', 'Projects', 'Contact'];

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center cursor-pointer" onClick={() => setActiveTab('Home')}>
            <div className="bg-emerald-500 p-2 rounded-lg mr-3">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-slate-800 tracking-tight">Eco<span className="text-emerald-600">Power</span></span>
          </div>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map(item => (
              <button 
                key={item}
                onClick={() => setActiveTab(item)}
                className={`${activeTab === item ? 'text-emerald-600 font-semibold border-b-2 border-emerald-500' : 'text-slate-600 hover:text-emerald-500'} transition-colors duration-200 py-2`}
              >
                {item}
              </button>
            ))}
            <button 
              onClick={openQuoteModal}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-full font-medium transition-all transform hover:scale-105 shadow-md"
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600">
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map(item => (
              <button 
                key={item}
                onClick={() => { setActiveTab(item); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-4 text-base font-medium text-slate-700 hover:text-emerald-600 hover:bg-emerald-50"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => { openQuoteModal(); setIsMobileMenuOpen(false); }}
              className="block w-full text-center mt-4 bg-emerald-600 text-white px-4 py-3 rounded-md font-medium"
            >
              Get a Quote
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Footer = () => (
  <footer className="bg-slate-900 text-slate-300 py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center mb-4">
          <Leaf className="h-6 w-6 text-emerald-500 mr-2" />
          <span className="font-bold text-xl text-white">EcoPower</span>
        </div>
        <p className="text-sm text-slate-400">Your trusted partner in renewable energy solutions, installations, and maintenance.</p>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Solutions</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li><a href="#" className="hover:text-emerald-400">Solar Panels</a></li>
          <li><a href="#" className="hover:text-emerald-400">Inverters & Batteries</a></li>
          <li><a href="#" className="hover:text-emerald-400">EV Chargers</a></li>
          <li><a href="#" className="hover:text-emerald-400">Domestic Windmills</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Services</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li><a href="#" className="hover:text-emerald-400">Installation</a></li>
          <li><a href="#" className="hover:text-emerald-400">AMC Maintenance</a></li>
          <li><a href="#" className="hover:text-emerald-400">Energy Audits</a></li>
          <li><a href="#" className="hover:text-emerald-400">Consultation</a></li>
        </ul>
      </div>
      <div>
        <h4 className="text-white font-semibold mb-4">Contact Us</h4>
        <ul className="space-y-2 text-sm text-slate-400">
          <li className="flex items-center"><Phone className="h-4 w-4 mr-2" /> 1-800-ECO-PWR</li>
          <li className="flex items-center"><Mail className="h-4 w-4 mr-2" /> hello@ecopower.com</li>
          <li className="flex items-center"><MapPin className="h-4 w-4 mr-2" /> 123 Green Avenue, NY</li>
        </ul>
      </div>
    </div>
  </footer>
);

const QuoteModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800">
          <X className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Request a Quote</h2>
        <p className="text-slate-600 mb-6 text-sm">Tell us about your energy needs and we'll get back to you with a personalized plan.</p>
        
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Quote requested successfully!"); onClose(); }}>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
            <input type="text" required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input type="email" required className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Interested In</label>
            <select className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
              <option>Residential Solar Setup</option>
              <option>Domestic Windmill</option>
              <option>EV Charger Installation</option>
              <option>Commercial Energy Audit</option>
              <option>Maintenance / AMC</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Message (Optional)</label>
            <textarea rows="3" className="w-full border border-slate-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" placeholder="Any specific requirements..."></textarea>
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white rounded-lg px-4 py-3 font-semibold hover:bg-emerald-700 transition-colors">
            Submit Request
          </button>
        </form>
      </div>
    </div>
  );
};

// --- VIEWS ---

const ProjectEstimator = () => {
  const [bill, setBill] = useState(150);
  
  // Simple estimation logic
  const systemSize = (bill / 25).toFixed(1); // Rough estimate: $25 bill = 1kW system
  const estimatedCost = Math.round(systemSize * 2500); // Rough estimate: $2500 per kW
  const annualSavings = Math.round(bill * 12 * 0.9); // Assume 90% bill offset

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-100">
      <div className="flex items-center mb-6">
        <div className="bg-emerald-100 p-3 rounded-full mr-4">
          <Calculator className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-slate-800">Quick Savings Estimator</h3>
          <p className="text-slate-500 text-sm">Calculate your potential solar savings</p>
        </div>
      </div>

      <div className="mb-8">
        <label className="flex justify-between text-sm font-medium text-slate-700 mb-4">
          <span>Average Monthly Electric Bill</span>
          <span className="text-emerald-600 font-bold">${bill}</span>
        </label>
        <input 
          type="range" 
          min="50" max="500" step="10" 
          value={bill} 
          onChange={(e) => setBill(e.target.value)}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
        />
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>$50</span>
          <span>$500+</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-100">
          <div className="text-sm text-slate-500 mb-1">Recommended System</div>
          <div className="text-2xl font-bold text-slate-800">{systemSize} <span className="text-base font-medium">kW</span></div>
        </div>
        <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100">
          <div className="text-sm text-emerald-700 mb-1">Annual Savings</div>
          <div className="text-2xl font-bold text-emerald-700">${annualSavings}</div>
        </div>
      </div>

      <p className="text-xs text-slate-400 text-center mb-4">*Estimates are approximate. Final numbers depend on location, roof space, and shading.</p>
      
      <button className="w-full bg-slate-900 text-white rounded-lg py-3 font-semibold hover:bg-slate-800 transition-colors">
        Get Detailed EMI Options
      </button>
    </div>
  );
};

const HomeView = ({ openQuoteModal, setActiveTab }) => (
  <div className="space-y-24 pb-24">
    {/* Hero Section */}
    <div className="relative bg-slate-900 text-white overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 -left-1/4 w-1/2 h-full bg-emerald-500 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-blue-500 blur-[120px] rounded-full"></div>
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-12 md:mb-0 pr-0 md:pr-12">
          <div className="inline-flex items-center bg-white/10 rounded-full px-4 py-1.5 mb-6 text-sm font-medium text-emerald-300 backdrop-blur-sm border border-white/10">
            <Zap className="h-4 w-4 mr-2" /> Top-Rated Clean Energy Services
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
            Powering Your Future With <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Clean Energy</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-lg leading-relaxed">
            From high-efficiency solar panels and home windmills to EV chargers and total energy audits. We make switching to green energy seamless.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={openQuoteModal} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3.5 rounded-full font-semibold text-lg transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center">
              Start Your Project <ChevronRight className="ml-2 h-5 w-5" />
            </button>
            <button onClick={() => setActiveTab('Products')} className="bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm text-white px-8 py-3.5 rounded-full font-semibold text-lg transition-all flex items-center justify-center">
              Explore Products
            </button>
          </div>
        </div>
        <div className="md:w-1/2 w-full">
          <ProjectEstimator />
        </div>
      </div>
    </div>

    {/* Quick Features */}
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">A Complete Renewable Ecosystem</h2>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">We provide everything you need to generate, store, and utilize clean energy efficiently.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {[
          { icon: Sun, title: "Solar Solutions", desc: "High-efficiency panels & hybrid inverters." },
          { icon: Battery, title: "Energy Storage", desc: "Advanced Lithium batteries for backup." },
          { icon: Wind, title: "Domestic Wind", desc: "Compact turbines for continuous power." },
          { icon: Zap, title: "EV Infrastructure", desc: "Fast chargers for homes & business." }
        ].map((feature, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group text-center">
            <div className="bg-emerald-50 w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500 transition-colors duration-300">
              <feature.icon className="h-8 w-8 text-emerald-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
            <p className="text-slate-500">{feature.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const ProductsView = ({ openQuoteModal }) => {
  const products = [
    { category: "Solar", name: "Premium Monocrystalline Panels", desc: "400W+ High efficiency panels with 25-year warranty.", icon: Sun, price: "From $250/panel" },
    { category: "Storage", name: "LiFePO4 Home Battery System", desc: "10kWh scalable storage solutions for 24/7 backup.", icon: Battery, price: "From $4,500" },
    { category: "EV", name: "Smart Level 2 EV Charger", desc: "WiFi-enabled fast charging for your garage.", icon: Zap, price: "$650 + Install" },
    { category: "Wind", name: "Domestic Micro-Turbine", desc: "Whisper-quiet wind generation for residential roofs.", icon: Wind, price: "From $2,800" },
    { category: "Inverters", name: "Hybrid Smart Inverters", desc: "Grid-tied and off-grid capable management.", icon: Settings, price: "From $1,200" },
    { category: "Agri", name: "Solar Water Pump System", desc: "Complete agricultural water solutions powered by the sun.", icon: Target, price: "Custom Quote" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Product Catalog</h2>
          <p className="text-slate-500 text-lg max-w-2xl">High-quality, certified renewable energy components for residential and commercial setups.</p>
        </div>
        <div className="mt-6 md:mt-0">
          <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition-colors">
            Download Product Brochure
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((prod, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 bg-slate-50 flex items-center justify-center border-b border-slate-100 relative">
               <span className="absolute top-4 left-4 bg-white px-3 py-1 text-xs font-bold tracking-wide text-emerald-600 rounded-full shadow-sm">
                 {prod.category}
               </span>
               <prod.icon className="h-20 w-20 text-slate-300" strokeWidth={1} />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{prod.name}</h3>
              <p className="text-slate-500 text-sm mb-6 h-10">{prod.desc}</p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-4">
                <span className="font-semibold text-slate-800">{prod.price}</span>
                <button onClick={openQuoteModal} className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center text-sm">
                  Inquire <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ServicesView = ({ openQuoteModal }) => {
  const services = [
    { title: "Turnkey Solar Installation", icon: HomeIcon, desc: "End-to-end service from site assessment and permits to installation and grid connection." },
    { title: "Annual Maintenance Contracts (AMC)", icon: Wrench, desc: "Preventative maintenance, panel cleaning, and system checks to ensure peak efficiency." },
    { title: "Professional Energy Audits", icon: LineChart, desc: "Detailed analysis of your energy consumption to identify savings and right-size your system." },
    { title: "Industrial & Commercial Projects", icon: Settings, desc: "Large-scale megawatt projects for factories, warehouses, and corporate parks." },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">Expert Engineering & Services</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">We don't just sell equipment; we deliver complete, hassle-free energy solutions.</p>
      </div>

      <div className="space-y-12">
        {services.map((service, idx) => (
          <div key={idx} className={`flex flex-col md:flex-row gap-8 items-center ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
            <div className="w-full md:w-1/2 aspect-video bg-slate-100 rounded-2xl flex items-center justify-center overflow-hidden relative group">
               {/* Decorative background for placeholder */}
               <div className="absolute inset-0 bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors"></div>
               <service.icon className="h-24 w-24 text-emerald-600/30" />
            </div>
            <div className="w-full md:w-1/2 space-y-4 px-4 md:px-8">
              <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center">
                <service.icon className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold text-slate-800">{service.title}</h3>
              <p className="text-slate-600 text-lg leading-relaxed">{service.desc}</p>
              <ul className="space-y-2 mt-4">
                {['Certified Engineers', 'Premium Quality Tools', 'Dedicated Support Team'].map((item, i) => (
                  <li key={i} className="flex items-center text-slate-700 font-medium">
                    <ShieldCheck className="h-5 w-5 text-emerald-500 mr-3" /> {item}
                  </li>
                ))}
              </ul>
              <div className="pt-4">
                <button onClick={openQuoteModal} className="bg-slate-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors">
                  Book Consultation
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectsView = () => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
     <div className="text-center mb-16">
        <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Recent Installations</h2>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto">See how we are transforming roofs and properties into green power stations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "10kW Residential Solar", location: "Austin, TX", type: "Solar + Battery" },
          { title: "250kW Commercial Warehouse", location: "Phoenix, AZ", type: "Rooftop Solar" },
          { title: "Hybrid Domestic Wind + Solar", location: "Denver, CO", type: "Hybrid System" },
          { title: "Community EV Charging Hub", location: "Seattle, WA", type: "EV Infrastructure" },
          { title: "Off-grid Farm Setup", location: "Boise, ID", type: "Solar + Pumps" },
          { title: "5kW Urban Installation", location: "San Diego, CA", type: "Residential" },
        ].map((project, idx) => (
          <div key={idx} className="group relative overflow-hidden rounded-2xl cursor-pointer">
            <div className="aspect-[4/3] bg-slate-800 flex items-center justify-center">
              {/* Abstract pattern for project image placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-900 opacity-80 flex items-center justify-center">
                 <Leaf className="h-16 w-16 text-slate-600" />
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <span className="text-emerald-400 font-medium text-sm mb-1">{project.type}</span>
              <h3 className="text-white text-xl font-bold mb-1">{project.title}</h3>
              <p className="text-slate-300 text-sm flex items-center">
                <MapPin className="h-3 w-3 mr-1" /> {project.location}
              </p>
            </div>
          </div>
        ))}
      </div>
  </div>
);

const ContactView = ({ openQuoteModal }) => (
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
    <div className="bg-emerald-600 rounded-3xl overflow-hidden shadow-2xl">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/2 p-12 md:p-16 text-white flex flex-col justify-center">
          <h2 className="text-4xl font-bold mb-6">Ready to make the switch?</h2>
          <p className="text-emerald-100 text-lg mb-8 leading-relaxed">
            Whether you need a quick home installation or a massive commercial setup, our team is ready to provide a free consultation and project estimate.
          </p>
          <div className="space-y-6 mb-10">
            <div className="flex items-center">
              <div className="bg-emerald-500 p-3 rounded-full mr-4"><Phone className="h-6 w-6" /></div>
              <div>
                <p className="text-emerald-200 text-sm">Call us directly</p>
                <p className="text-xl font-bold">1-800-ECO-PWR</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="bg-emerald-500 p-3 rounded-full mr-4"><Mail className="h-6 w-6" /></div>
              <div>
                <p className="text-emerald-200 text-sm">Email support</p>
                <p className="text-xl font-bold">hello@ecopower.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-1/2 bg-white p-12 md:p-16 flex flex-col justify-center items-center text-center">
           <div className="bg-slate-100 p-6 rounded-full mb-6">
             <Target className="h-16 w-16 text-emerald-600" />
           </div>
           <h3 className="text-2xl font-bold text-slate-800 mb-4">Get a Custom Project Plan</h3>
           <p className="text-slate-600 mb-8 max-w-sm">Use our quick form to tell us about your requirements, and our engineers will create a tailored proposal.</p>
           <button onClick={openQuoteModal} className="w-full max-w-sm bg-emerald-600 text-white rounded-xl py-4 font-bold text-lg hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/30">
              Open Request Form
           </button>
        </div>
      </div>
    </div>
  </div>
);


// --- MAIN APP ENTRY ---

export default function EcoPowerApp() {
  const [activeTab, setActiveTab] = useState('Home');
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const renderView = () => {
    switch (activeTab) {
      case 'Home': return <HomeView openQuoteModal={() => setIsQuoteModalOpen(true)} setActiveTab={setActiveTab} />;
      case 'Products': return <ProductsView openQuoteModal={() => setIsQuoteModalOpen(true)} />;
      case 'Services': return <ServicesView openQuoteModal={() => setIsQuoteModalOpen(true)} />;
      case 'Projects': return <ProjectsView />;
      case 'Contact': return <ContactView openQuoteModal={() => setIsQuoteModalOpen(true)} />;
      default: return <HomeView openQuoteModal={() => setIsQuoteModalOpen(true)} setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-emerald-200 selection:text-emerald-900">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} openQuoteModal={() => setIsQuoteModalOpen(true)} />
      
      <main className="min-h-[calc(100vh-300px)]">
        {renderView()}
      </main>

      <Footer />
      
      <QuoteModal isOpen={isQuoteModalOpen} onClose={() => setIsQuoteModalOpen(false)} />
    </div>
  );
}
