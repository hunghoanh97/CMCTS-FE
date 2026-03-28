import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Zap, Rocket, ArrowRight, Gamepad2 } from 'lucide-react';

import logo from '../assets/images/CTS20-Logo-08.png';
import heroBg from '../assets/images/Hero-section_background-01.png';

const Home: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <div className="min-h-screen bg-cmc-gray overflow-hidden font-sans">
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
                            to="/gamehub" 
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
                                    to="/mission" 
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

            {/* Core Values Section */}
            <section className="py-24 bg-cmc-gray relative z-20">
                <div className="container mx-auto px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-cmc-blue mb-4">Giá trị Cốt lõi</h2>
                        <p className="text-xl text-gray-600">Kim chỉ nam cho mọi hoạt động và sự phát triển của CMC TS</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {[
                            { 
                                title: "TRUST", 
                                desc: "Xây dựng niềm tin với khách hàng, đối tác và đồng nghiệp thông qua sự minh bạch và cam kết chất lượng.",
                                icon: Shield,
                                color: "from-blue-500 to-cmc-blue"
                            },
                            { 
                                title: "EXPRESS", 
                                desc: "Tự do sáng tạo, thể hiện đam mê và bứt phá giới hạn để tạo ra những giải pháp công nghệ đột phá.",
                                icon: Zap,
                                color: "from-cmc-sky to-cyan-400"
                            },
                            { 
                                title: "TRANSFORM", 
                                desc: "Không ngừng chuyển đổi, thích ứng và dẫn dắt sự thay đổi trong kỷ nguyên số.",
                                icon: Rocket,
                                color: "from-indigo-500 to-blue-600"
                            }
                        ].map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ delay: index * 0.2 }}
                                whileHover={{ y: -10 }}
                                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all"
                            >
                                <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mb-6`}>
                                    <value.icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-cmc-blue mb-4">{value.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{value.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-cmc-blue text-white py-12 text-center">
                <div className="container mx-auto px-4">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold mb-2">Tổng Công ty Công nghệ và Giải pháp CMC</h2>
                        <p className="text-blue-200">Sẵn sàng đồng hành cùng bạn trên hành trình chuyển đổi số</p>
                    </div>
                    <div className="border-t border-blue-400/30 pt-6 mt-6">
                        <p className="text-blue-200 text-sm">© 2024 CMC TS. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;