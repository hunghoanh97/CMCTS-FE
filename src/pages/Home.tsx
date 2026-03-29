import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Rocket, ArrowRight, Gamepad2, Menu, X } from 'lucide-react';
import AdminImageUpload from '../components/AdminImageUpload';
import MyCTSMoment from '../components/MyCTSMoment';
import RoleSection from '../components/RoleSection';
import { getImages } from '../services/api';

import logo from '../assets/images/CTS20-Logo-08.png';
import heroBg from '../assets/images/Hero-section_background-01.png';

const Home: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    // Sidebar state
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Lắng nghe thay đổi từ localStorage để cập nhật UI nếu cần
    const [hasUploadedImage, setHasUploadedImage] = useState(false);

    // Event Stages State
    const [eventStages, setEventStages] = useState<any[]>([]);

    // Slides State
    const [currentSlide, setCurrentSlide] = useState(0);
    const [slides, setSlides] = useState<string[]>([
        "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Corporate%20team%20celebration%20with%20blue%20theme&image_size=landscape_16_9",
        "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Digital%20transformation%20technology%20abstract%20blue%20background&image_size=landscape_16_9",
        "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Business%20meeting%20handshake%20trust%20concept%20blue%20tone&image_size=landscape_16_9",
        "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Modern%20data%20center%20server%20room%20blue%20lighting&image_size=landscape_16_9",
        "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Future%20city%20smart%20technology%20blue%20cyan%20colors&image_size=landscape_16_9",
        "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Teamwork%20success%20celebration%20office%20environment&image_size=landscape_16_9"
    ]);

    // Load images and stages from API
    const loadData = async () => {
        try {
            const apiImages = await getImages();
            if (apiImages && apiImages.length > 0) {
                setSlides(apiImages.map(img => img.url));
                setHasUploadedImage(true);
            }
        } catch (error) {
            console.error("Lỗi khi load ảnh từ API:", error);
            // Fallback to localStorage logic if API fails
            const savedImage = localStorage.getItem('admin_section_image');
            if (savedImage) {
                setHasUploadedImage(true);
                setSlides(prev => [savedImage, ...prev.slice(1)]);
            }
        }

        try {
            // Fetch stages without needing token by calling a public endpoint or handling 401 gracefully
            // Assuming /api/quiz/stages is accessible or we create a public endpoint. 
            // For now, let's use the existing api utility but catch errors if unauthenticated.
            const { default: api } = await import('../utils/api');
            const stagesRes = await api.get('/quiz/stages');
            if (stagesRes.data) {
                setEventStages(stagesRes.data);
            }
        } catch (error) {
            console.error("Lỗi khi load event stages:", error);
        }
    };

    useEffect(() => {
        loadData();
        
        // Cập nhật lại khi có sự thay đổi từ upload (thông qua localStorage event hoặc polling)
        const handleStorageChange = () => {
            loadData();
        };
        
        window.addEventListener('storage', handleStorageChange);
        const interval = setInterval(loadData, 5000); // Poll API every 5s to sync
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="min-h-screen bg-cmc-gray overflow-hidden font-sans relative">
            {/* Admin Toggle Button */}
            <button 
                onClick={() => setIsSidebarOpen(true)}
                className="fixed bottom-6 right-6 z-[60] bg-white p-3 rounded-full shadow-2xl text-cmc-blue hover:text-cmc-sky hover:scale-110 transition-all border border-gray-100"
            >
                <Menu size={24} />
            </button>

            {/* Admin Sidebar */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/50 z-[70] backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed top-0 right-0 w-full md:w-[400px] lg:w-[450px] h-full bg-gray-50 z-[80] shadow-2xl flex flex-col"
                        >
                            <div className="flex items-center justify-between p-6 border-b bg-white">
                                <h2 className="text-xl font-bold text-cmc-blue">Quản lý hình ảnh</h2>
                                <button 
                                    onClick={() => setIsSidebarOpen(false)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-red-500"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto p-6">
                                <AdminImageUpload />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Navbar */}
            <header className="absolute top-0 w-full z-50 bg-transparent">
                <div className="container mx-auto px-4 py-6 flex justify-between items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center"
                    >
                        <img src={logo} alt="CMC TS 20 WE TRANSFORM" className="h-10 md:h-14 object-contain" />
                    </motion.div>
                    <nav className="hidden lg:flex items-center gap-8">
                        <Link to="/" className="text-white text-sm font-semibold relative after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-full after:h-[2px] after:bg-[#00ffff]">Trang chủ</Link>
                        <Link to="/" className="text-white/80 hover:text-white text-sm font-semibold transition-colors">DI SẢN 20 NĂM</Link>
                        <Link to="/" className="text-white/80 hover:text-white text-sm font-semibold transition-colors">IN</Link>
                        <Link to="/" className="text-white/80 hover:text-white text-sm font-semibold transition-colors">TRUST</Link>
                        <Link to="/" className="text-white/80 hover:text-white text-sm font-semibold transition-colors">WE TRANSFORM</Link>
                    </nav>
                    <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                        <Link 
                            to="/login" 
                            className="bg-gradient-to-r from-[#00ffff] to-[#d946ef] text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-[#00ffff]/30 transition-all text-sm inline-block"
                        >
                            Vào GameHub
                        </Link>
                    </motion.div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-[#001253] pt-32 pb-20">
                {/* Background Image */}
                <motion.div 
                    style={{ y: heroY, opacity }}
                    className="absolute inset-0 z-0"
                >
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{ backgroundImage: `url(${heroBg})` }}
                    />
                </motion.div>
                
                {/* Hero Content */}
                <div className="container mx-auto px-4 z-20 text-center flex-1 flex flex-col justify-center mt-10 md:mt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-6 text-white uppercase leading-tight tracking-wide">
                            IN 20 YEARS OF TRUST<br/>
                            WE TRANSFORM
                        </h2>
                        <p className="text-base md:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
                            Trust is our Operating System.<br/>
                            When Trust runs strong, everything moves faster.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link 
                                    to="/journey" 
                                    className="inline-flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 text-base font-bold text-[#001253] bg-white rounded-full hover:bg-gray-50 transition-all shadow-lg"
                                >
                                    Khám phá hành trình
                                    <div className="w-6 h-6 bg-[#001253] rounded-full flex items-center justify-center ml-2">
                                        <ArrowRight size={14} className="text-white" />
                                    </div>
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link 
                                    to="/login" 
                                    className="inline-flex items-center justify-center w-full sm:w-auto gap-3 px-8 py-4 text-base font-bold text-white bg-gradient-to-r from-[#00ffff] to-[#ff00ff] rounded-full hover:shadow-lg hover:shadow-[#ff00ff]/30 transition-all shadow-lg"
                                >
                                    <Gamepad2 size={20} />
                                    Bắt đầu Mission ngay
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Cards */}
                <div className="container mx-auto px-4 z-20 mt-16 lg:mt-24">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
                        {[
                            { number: "700+", lines: ["CTS Members", "đang viết tiếp", "hành trình niềm tin"] },
                            { number: "2,400+", lines: ["My CTS Moments", "được chia sẻ"] },
                            { number: "6", lines: ["Alliance", "được", "hình thành"] },
                            { number: "5,600+", lines: ["Lượt tương tác"] }
                        ].map((stat, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + index * 0.1 }}
                                className="relative p-6 lg:p-8 rounded-2xl bg-[#003399]/30 backdrop-blur-md border border-white/10 text-center flex flex-col justify-center min-h-[200px] hover:bg-[#003399]/40 transition-colors"
                            >
                                {/* Cyan corner tab */}
                                <div className="absolute -top-3 -right-3 w-10 h-10">
                                    <div className="absolute top-0 right-0 w-10 h-3 bg-[#00ffff] rounded-tr-xl" />
                                    <div className="absolute top-0 right-0 w-3 h-10 bg-[#00ffff] rounded-tr-xl" />
                                </div>
                                
                                <h3 className="text-4xl lg:text-5xl font-black text-[#00ffff] mb-4 tracking-tight">{stat.number}</h3>
                                <div className="text-white/90 text-sm lg:text-base leading-relaxed font-medium">
                                    {stat.lines.map((line, i) => <div key={i}>{line}</div>)}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 20 Năm */}
            <section className="py-24 bg-[#0005a3] relative z-20">
                <div className="container mx-auto px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">20 năm xây dựng niềm tin</h2>
                        <p className="text-lg md:text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
                            Từ những dự án hạ tầng công nghệ đầu tiên, đến những bước chuyển mình chiến lược<br/>
                            để trở thành Digital Transformation Partner.<br/>
                            Niềm tin là cách CTS vận hành và đưa chúng ta đến ngày hôm nay.
                        </p>
                    </motion.div>
                    {/* Carousel Area */}
                    <div className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden shadow-2xl h-[400px] md:h-[500px]">
                        <div className="absolute inset-0 flex items-center justify-center bg-[#001253]">
                            {/* Main Image based on current slide */}
                            <img 
                                src={slides[currentSlide]} 
                                alt={`CMC TS 20 Years Slide ${currentSlide + 1}`} 
                                className="w-full h-full object-cover transition-opacity duration-500"
                            />
                            
                            {/* Blue overlay panels for carousel effect */}
                            <div className="absolute inset-y-0 left-0 w-1/6 bg-[#0005a3]/60 backdrop-blur-sm hidden md:block border-r border-white/10" />
                            <div className="absolute inset-y-0 right-0 w-1/6 bg-[#0005a3]/60 backdrop-blur-sm hidden md:block border-l border-white/10" />
                            
                            {/* Caption box */}
                            <div className="absolute bottom-0 left-0 md:left-1/6 w-full md:w-4/6 p-6 bg-blue-600/80 backdrop-blur-md">
                                <p className="text-white text-sm md:text-base italic">
                                    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur vitae nisl vel lacus fermentum tincidunt, at aliquet turpis pretium. Donec nec justo sed velit facilisis tristique in sed magna."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pagination dots */}
                    <div className="flex justify-center gap-3 mt-8">
                        {slides.map((_, index) => (
                            <button 
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all ${currentSlide === index ? 'bg-[#00ffff] scale-125' : 'bg-white/50 hover:bg-white/80'}`}
                                aria-label={`Slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Section Lộ trình sự kiện CTS20 */}
            <section className="py-24 bg-white relative z-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-[#001253] mb-6 leading-tight">
                            Giờ là lúc<br/>
                            bước vào hành trình CTS20
                        </h2>
                        <div className="text-base md:text-lg text-[#001253]/80 max-w-2xl mx-auto leading-relaxed">
                            <p>Tin tưởng để dám làm khác.</p>
                            <p>Tin tưởng để hành động nhanh hơn.</p>
                            <p>Tin tưởng để tạo ra những đột phá mới.</p>
                            <p className="mt-2 text-[#001253] font-medium">CTS20 là hành trình nơi Trust được chuyển hóa thành kết quả.</p>
                        </div>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
                        {eventStages && eventStages.length > 0 ? eventStages.map((stage, index) => {
                            // Extract dates for display
                            const startDate = new Date(stage.startTime);
                            const endDate = new Date(stage.endTime);
                            const timeString = `${startDate.getDate()}/${startDate.getMonth() + 1} - ${endDate.getDate()}/${endDate.getMonth() + 1}`;
                            
                            // Determine styles based on status
                            const isEnded = stage.status === "Đã kết thúc";
                            const isActive = stage.status === "Đang diễn ra";
                            const isUpcoming = stage.status === "Sắp diễn ra";

                            return (
                                <motion.div 
                                    key={stage.id}
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.1 + (index * 0.1) }}
                                    className={`bg-gradient-to-b ${isActive ? 'from-[#0033ff] to-[#001ae6] transform scale-105 z-10 hover:shadow-[#00ffff]/20' : 'from-[#000d6b] to-[#0005a3]'} rounded-[24px] p-8 text-white relative overflow-hidden group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300`}
                                >
                                    {isActive && (
                                        <>
                                            {/* Glow effect for active card */}
                                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#00ffff]/30 blur-3xl rounded-full" />
                                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-[#ff00ff]/30 blur-3xl rounded-full" />
                                        </>
                                    )}

                                    <div className={`absolute top-6 left-6 ${isActive ? 'z-20' : ''}`}>
                                        <span className={`inline-block px-4 py-1.5 text-xs font-bold rounded-full ${
                                            isActive 
                                                ? 'bg-gradient-to-r from-[#00ffff] to-[#ff00ff] text-white shadow-[0_0_15px_rgba(0,255,255,0.5)]' 
                                                : isUpcoming
                                                    ? 'bg-white/10 backdrop-blur-sm text-white/70 border border-white/20'
                                                    : 'bg-white/20 backdrop-blur-sm text-white font-semibold'
                                        }`}>
                                            {stage.status}
                                        </span>
                                    </div>
                                    
                                    <div className={`mt-16 mb-4 ${isActive ? 'relative z-20' : ''}`}>
                                        <p className={`text-sm font-semibold tracking-widest mb-1 ${isActive ? 'text-white/80' : isUpcoming ? 'text-white/50' : 'text-white/60'}`}>ACT {index + 1}</p>
                                        <h3 className={`text-3xl font-bold tracking-wide ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-white' : isUpcoming ? 'text-white/90' : ''}`}>{stage.name}</h3>
                                        <p className={`mt-2 text-sm ${isActive ? 'text-[#00ffff] font-bold' : isUpcoming ? 'text-white/60 font-medium' : 'text-white/80 font-medium'}`}>{timeString}</p>
                                    </div>
                                    
                                    <div className={`space-y-4 text-sm leading-relaxed min-h-[120px] ${isActive ? 'text-white relative z-20' : isUpcoming ? 'text-white/70' : 'text-white/90'}`} dangerouslySetInnerHTML={{ __html: stage.description }}>
                                    </div>
                                    
                                    <div className={`mt-8 pt-6 border-t ${isActive ? 'border-white/20 relative z-20' : 'border-white/10'}`}>
                                        {isUpcoming ? (
                                            <span className="inline-flex items-center gap-2 text-sm font-medium text-white/40">
                                                Đang chờ mở khóa
                                                <span className="flex">
                                                    <ArrowRight size={14} className="opacity-30" />
                                                    <ArrowRight size={14} className="opacity-50 -ml-1" />
                                                    <ArrowRight size={14} className="opacity-70 -ml-1" />
                                                </span>
                                            </span>
                                        ) : (
                                            <Link to="/gamehub" className={`inline-flex items-center gap-2 text-sm transition-colors group-hover:gap-3 ${isActive ? 'font-bold text-[#00ffff] hover:text-white' : 'font-medium hover:text-[#00ffff]'}`}>
                                                {isActive ? 'Tham gia ngay' : 'Xem recap'}
                                                <span className="flex">
                                                    <ArrowRight size={14} className="opacity-50" />
                                                    <ArrowRight size={14} className="opacity-75 -ml-1" />
                                                    <ArrowRight size={14} className="-ml-1" />
                                                </span>
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            );
                        }) : (
                            <div className="col-span-3 text-center text-gray-500 py-10">Đang tải dữ liệu sự kiện...</div>
                        )}
                    </div>

                    <div className="text-center mt-12">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                            <Link 
                                to="/journey" 
                                className="inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-[#001253] bg-white border-2 border-[#001253]/10 rounded-full hover:bg-gray-50 transition-all shadow-lg hover:shadow-xl"
                            >
                                Khám phá CTS20
                                <span className="flex text-[#001253]">
                                    <ArrowRight size={18} className="-mr-2" />
                                    <ArrowRight size={18} />
                                </span>
                            </Link>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* My CTS Moment Section */}
            <MyCTSMoment />

            {/* Role Section */}
            <RoleSection />

            {/* Footer */}
            <footer className="bg-cmc-gray pb-12 pt-6 text-center">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="border-t border-[#001253]/10 pt-8 mt-6 flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="text-left">
                            <h2 className="text-[16px] font-bold text-[#001253] mb-1">Tổng Công ty Công nghệ và Giải pháp CMC</h2>
                            <p className="text-[#001253]/70 text-[14px]">Sẵn sàng đồng hành cùng bạn trên hành trình chuyển đổi số</p>
                        </div>
                        <div>
                            <p className="text-[#001253]/50 text-sm">© 2024 CMC TS. All rights reserved.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;