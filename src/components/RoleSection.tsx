import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const RoleSection: React.FC = () => {
    return (
        <section className="py-20 bg-cmc-gray relative z-20">
            <div className="container mx-auto px-4 max-w-5xl">
                <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-[#FAFBFF] border-2 border-transparent relative rounded-[16px] p-10 md:p-16 shadow-lg overflow-hidden group"
                >
                    {/* Gradient border effect using pseudo-element */}
                    <div className="absolute inset-0 rounded-[16px] border-2 border-transparent [background:linear-gradient(to_right,#2AE4FF,#B255F8)_border-box] [-webkit-mask:linear-gradient(#fff_0_0)_padding-box,linear-gradient(#fff_0_0)] [-webkit-mask-composite:destination-out] mask-composite-exclude opacity-50" />

                    <div className="flex flex-col md:flex-row justify-between items-start gap-12 relative z-10">
                        {/* Left Column: Heading and List */}
                        <div className="flex-1">
                            <h2 className="text-[40px] md:text-[48px] font-[900] text-[#0B33CC] leading-[1.1] mb-8 tracking-tight">
                                Bạn đóng<br/>
                                vai trò gì<br/>
                                trong hành<br/>
                                trình này?
                            </h2>
                            
                            <ul className="space-y-2 text-[#1630B8] text-[15px] md:text-[16px] font-medium leading-relaxed">
                                <li>Hoàn thành Mission: Tham gia các thử thách của từng Act</li>
                                <li>Tích lũy XP: Mỗi hoạt động đều mang lại điểm cho bạn và Alliance</li>
                                <li>Leo bảng xếp hạng: Cạnh tranh giữa các Alliance trong suốt hành trình CTS20</li>
                            </ul>
                        </div>

                        {/* Right Column: CTA */}
                        <div className="flex flex-col items-start md:items-end">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Link 
                                    to="/login" 
                                    className="inline-flex items-center gap-3 px-10 py-4 text-[16px] font-bold text-white bg-gradient-to-r from-[#2AE4FF] to-[#B255F8] rounded-full hover:shadow-[0_0_20px_rgba(42,228,255,0.4)] transition-all"
                                >
                                    Vào GameHub
                                    <span className="flex text-white">
                                        <ArrowRight size={20} className="-mr-3 opacity-70" />
                                        <ArrowRight size={20} className="-mr-1" />
                                    </span>
                                </Link>
                            </motion.div>
                            <Link 
                                to="/login" 
                                className="mt-4 text-[#2F5BFF] hover:text-[#0B33CC] font-medium text-[15px] transition-colors inline-block md:pr-4"
                            >
                                Bắt đầu Mission đầu tiên của bạn
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default RoleSection;