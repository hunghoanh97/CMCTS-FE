import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Zap, Rocket, Users, Target, Award, ArrowRight } from 'lucide-react';

const Home: React.FC = () => {
    const { scrollYProgress } = useScroll();
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    return (
        <div className="min-h-screen bg-cmc-gray overflow-hidden">
            {/* Navbar */}
            <header className="fixed top-0 w-full z-50 bg-white/90 backdrop-blur-md shadow-sm">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-10 h-10 bg-cmc-blue rounded-lg flex items-center justify-center text-white font-bold text-xl">
                            20
                        </div>
                        <h1 className="text-2xl font-bold text-cmc-blue">CMC TS</h1>
                    </motion.div>
                    <nav>
                        <Link 
                            to="/login" 
                            className="bg-cmc-blue text-white hover:bg-cmc-sky transition-colors px-6 py-2 rounded-full font-semibold"
                        >
                            Đăng nhập
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section with Parallax */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                {/* Background Pattern */}
                <motion.div 
                    style={{ y: heroY, opacity }}
                    className="absolute inset-0 z-0 opacity-10"
                >
                    <div className="absolute inset-0 bg-[url('https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=abstract%20digital%20technology%20waves%20blue%20background%203d&image_size=landscape_16_9')] bg-cover bg-center" />
                </motion.div>
                
                <div className="absolute inset-0 bg-gradient-to-b from-cmc-blue/10 to-cmc-gray z-10" />

                <div className="container mx-auto px-4 z-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <span className="text-cmc-sky font-bold tracking-wider uppercase mb-4 block">
                            Kỷ niệm 20 năm thành lập
                        </span>
                        <h2 className="text-5xl md:text-7xl font-extrabold mb-6 text-cmc-blue">
                            Kiến tạo Tương lai số
                        </h2>
                        <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-3xl mx-auto">
                            Hành trình 20 năm dẫn đầu thị trường chuyển đổi số, kết nối công nghệ và con người, vươn tầm quốc tế.
                        </p>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block"
                        >
                            <Link 
                                to="/login" 
                                className="inline-flex items-center gap-2 px-8 py-4 text-lg font-bold text-white rounded-full bg-gradient-to-r from-cmc-blue to-cmc-sky shadow-lg hover:shadow-xl transition-all"
                            >
                                Bắt đầu hành trình <ArrowRight size={20} />
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Numbers Section */}
            <section className="py-20 bg-white relative z-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {[
                            { number: "30", label: "Năm lịch sử Tập đoàn CMC", icon: Award },
                            { number: "20", label: "Năm thành lập CMC TS", icon: Target },
                            { number: "10.000+", label: "Khách hàng", icon: Users },
                            { number: "100+", label: "Đối tác chiến lược", icon: Rocket }
                        ].map((stat, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ delay: index * 0.1 }}
                                className="p-8 rounded-2xl bg-cmc-gray/50 text-center hover:bg-cmc-gray transition-colors border border-gray-100"
                            >
                                <stat.icon className="w-12 h-12 text-cmc-sky mx-auto mb-4" />
                                <h3 className="text-4xl font-black text-cmc-blue mb-2">{stat.number}</h3>
                                <p className="text-gray-600 font-medium">{stat.label}</p>
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