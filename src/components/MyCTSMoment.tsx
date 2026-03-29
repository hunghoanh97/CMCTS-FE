import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyCTSMoment: React.FC = () => {
    const moments = [
        {
            id: 1,
            text: '"Khoảnh khắc đội Alliance đầu tiên của tôi cùng nhau phá vỡ kỷ lục. Trust là khi bạn biết mọi người đều sẽ làm hết mình."',
            imageType: 'bottom',
            className: 'md:col-span-1 md:row-span-2'
        },
        {
            id: 2,
            text: '"Khoảnh khắc đội Alliance đầu tiên của tôi cùng nhau phá vỡ kỷ lục. Trust là khi bạn biết mọi người đều sẽ làm hết mình."',
            imageType: 'right',
            className: 'md:col-span-1 md:row-span-1'
        },
        {
            id: 3,
            text: '"Tôi chứng kiến sức mạnh thật sự của chúng ta khi cùng nhau vượt qua giới hạn. 20 năm đã dẫn đến khoảnh khắc này."',
            imageType: 'none',
            className: 'md:col-span-1 md:row-span-1'
        },
        {
            id: 4,
            text: '"TỪ ...20 đến WE TRANSFORM, mọi giây đều cho mình thấy: chúng ta transform trust thành breakthrough thực sự."',
            imageType: 'top',
            className: 'md:col-span-1 md:row-span-1'
        },
        {
            id: 5,
            text: '"Khoảnh khắc đội Alliance đầu tiên của tôi cùng nhau phá vỡ kỷ lục."',
            imageType: 'avatar-bottom-right',
            className: 'md:col-span-1 md:row-span-1'
        },
        {
            id: 6,
            text: '"Khoảnh khắc đội Alliance đầu tiên của tôi cùng nhau phá vỡ kỷ lục."',
            imageType: 'avatar-bottom-right',
            className: 'md:col-span-1 md:row-span-1'
        },
        {
            id: 7,
            text: '"Khoảnh khắc đội Alliance đầu tiên của tôi cùng nhau phá vỡ kỷ lục."',
            imageType: 'bottom',
            className: 'md:col-span-1 md:row-span-1'
        },
        {
            id: 8,
            text: '"Demo Day không chỉ là showcase công nghệ. Đó là lúc chúng ta transform trust thành breakthrough thực sự."',
            imageType: 'none',
            className: 'md:col-span-1 md:row-span-2'
        },
        {
            id: 9,
            text: '"Khoảnh khắc đội Alliance đầu tiên của tôi cùng nhau phá vỡ kỷ lục."',
            imageType: 'avatar-top-right',
            className: 'md:col-span-1 md:row-span-1'
        }
    ];

    const getCardImage = (type: string) => {
        // Placeholder images to mimic the blurred ones in the design
        const placeholderSrc = "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=blurred%20happy%20office%20worker%20blue%20tone&image_size=landscape_16_9";
        
        switch(type) {
            case 'bottom':
                return <img src={placeholderSrc} alt="CTS Member" className="w-full h-32 object-cover mt-4 rounded-b-[16px] -mx-6 -mb-6 max-w-[calc(100%+3rem)]" />;
            case 'top':
                return <img src={placeholderSrc} alt="CTS Member" className="w-full h-24 object-cover mb-4 rounded-t-[16px] -mx-6 -mt-6 max-w-[calc(100%+3rem)]" />;
            case 'right':
                return <img src={placeholderSrc} alt="CTS Member" className="absolute right-0 top-0 w-20 h-full object-cover rounded-r-[16px]" />;
            case 'avatar-bottom-right':
                return <img src={placeholderSrc} alt="CTS Member" className="w-10 h-10 rounded-full object-cover absolute bottom-4 right-4 border-2 border-white/20" />;
            case 'avatar-top-right':
                return <img src={placeholderSrc} alt="CTS Member" className="w-12 h-12 rounded-full object-cover absolute top-4 right-4 border-2 border-white/20" />;
            case 'avatar-left':
                return <img src={placeholderSrc} alt="CTS Member" className="w-12 h-12 rounded-full object-cover mb-4 border-2 border-white/20" />;
            default:
                return null;
        }
    };

    return (
        <section className="py-24 bg-[#0A1BD9] relative z-20 overflow-hidden rounded-t-[40px] -mt-10">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-5xl md:text-[64px] font-bold text-white mb-6 tracking-tight leading-tight">
                        My CTS Moment
                    </h2>
                    <p className="text-[16px] md:text-[18px] text-white/90 max-w-3xl mx-auto leading-relaxed font-medium">
                        Những khoảnh khắc trong hành trình CTS20 được đóng góp bởi người CTS.<br/>
                        Hãy để dấu ấn của bạn trở thành một phần của câu chuyện lịch sử.
                    </p>
                </motion.div>

                {/* Masonry Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-[200px] mb-16">
                    {moments.map((moment, index) => (
                        <motion.div
                            key={moment.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                            whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}
                            className={`bg-[#828EFF]/30 backdrop-blur-sm rounded-[20px] p-6 text-white relative overflow-hidden flex flex-col justify-center border border-white/10 ${moment.className}`}
                        >
                            <p className={`text-[14px] md:text-[15px] leading-relaxed relative z-10 ${moment.imageType === 'right' ? 'pr-24' : ''}`}>
                                {moment.text}
                            </p>
                            {getCardImage(moment.imageType)}
                        </motion.div>
                    ))}
                </div>

                {/* CTA Button */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
                        <Link 
                            to="/share-moment" 
                            className="inline-flex items-center gap-3 px-8 py-4 text-base font-bold text-[#001B7A] bg-[#00ffff] rounded-full hover:bg-white hover:text-[#001B7A] transition-all shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)]"
                        >
                            Chia sẻ khoảnh khắc của bạn
                            <span className="flex text-[#001B7A]">
                                <ArrowRight size={20} className="-mr-3 opacity-50" />
                                <ArrowRight size={20} className="-mr-3 opacity-75" />
                                <ArrowRight size={20} />
                            </span>
                        </Link>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

export default MyCTSMoment;