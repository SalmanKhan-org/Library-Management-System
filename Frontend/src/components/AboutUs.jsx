import React from 'react';
import { FaBookReader } from 'react-icons/fa';
import salman_khan_img from '@/assets/Salman.jpeg';
import { MdEmail } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { FaPlus } from "react-icons/fa6";
import { IoFlashOutline } from "react-icons/io5";
import { RiUserCommunityLine } from "react-icons/ri";

const AboutUs = () => {
    return (
        <div className="min-h-screen w-full p-2 bg-gray-100">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-700 text-white p-3 rounded-lg shadow-sm mb-2">
                <h1 className="text-xl font-semibold">About Scholarly</h1>
                <p className="text-xs opacity-90">Modernizing library management for the digital age</p>
            </div>

            {/* Motive Section */}
            <div className="bg-white rounded-lg p-4 shadow-sm mb-2 space-y-4">
                <h2 className="text-xl font-semibold text-emerald-700">Our Motive</h2>
                <p className="text-sm text-black/70">
                    Scholarly was founded with the mission to revolutionize library management through intuitive,
                    accessible, and powerful software — making knowledge easier to access for everyone.
                </p>

                <div className="flex flex-wrap gap-4 mt-2">
                    <StatCard
                        icon={<FaBookReader className="text-white text-2xl" />}
                        title="200K+ Books"
                        subtitle="in our digital catalog"
                    />
                    <StatCard
                        icon={<FaBookReader className="text-white text-2xl" />}
                        title="100K+ Members"
                        subtitle="actively using our system"
                    />
                </div>
            </div>

            {/* About Developer */}
            <div className="bg-white rounded-lg p-4 shadow-sm space-y-4 mb-2">
                <h2 className="text-xl font-semibold text-emerald-700">About the Founder</h2>

                <div className="flex flex-col sm:flex-row items-start gap-4">
                    <div className="w-32 h-32 rounded-full overflow-hidden flex-shrink-0 border-2 border-white">
                        <img
                            src={salman_khan_img}
                            alt="Salman Khan"
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="space-y-1 text-black/70">
                        <h3 className="text-lg font-semibold text-black/70">Salman Khan</h3>
                        <p className="text-sm text-black/70">Edovu Ventures Pvt. Ltd.</p>
                        <p className="text-sm leading-relaxed">
                            I’m a fourth-year student at GD Goenka University with a strong passion for web development.
                            I specialize in building clean, scalable web apps and constantly explore modern technologies.
                            I strive to create intuitive digital experiences and enjoy turning ideas into efficient products.
                        </p>
                    </div>
                </div>
            </div>

            {/* Our values Section */}
            <div className="bg-white w-full h-fit rounded-md p-4 space-y-4 mb-2">
                <h1 className="text-lg font-medium text-emerald-700">Our Values</h1>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Accessibility */}
                    <div className="flex flex-col gap-2 border border-emerald-200 rounded-md p-3 hover:shadow-md transition">
                        <div className="p-2 w-fit rounded-full bg-emerald-500 text-white">
                            <FaPlus/>
                        </div>
                        <p className="text-base font-semibold text-black">Accessibility</p>
                        <p className="text-sm text-black/70">
                            We believe knowledge should be accessible to all. Our platform ensures easy, inclusive access for every reader.
                        </p>
                    </div>
                    {/* Innovation */}
                    <div className="flex flex-col gap-2 border border-emerald-200 rounded-md p-3 hover:shadow-md transition">
                        <div className="p-2 w-fit rounded-full bg-emerald-500 text-white">
                            <IoFlashOutline/>
                        </div>
                        <p className="text-base font-semibold text-black">Innovation</p>
                        <p className="text-sm text-black/70">
                            We're redefining how libraries function with modern, tech-driven solutions that simplify and enhance user experience.
                        </p>
                    </div>
                    {/* Community */}
                    <div className="flex flex-col gap-2 border border-emerald-200 rounded-md p-3 hover:shadow-md transition">
                        <div className="p-2 w-fit rounded-full bg-emerald-500 text-white">
                            <RiUserCommunityLine/>
                        </div>
                        <p className="text-base font-semibold text-black">Community</p>
                        <p className="text-sm text-black/70">
                            Scholarly is built around collaboration. We aim to connect learners, educators, and knowledge seekers everywhere.
                        </p>
                    </div>
                </div>
            </div>


            {/* Get in touch */}
            <div className="bg-white w-full h-fit rounded-md p-4 shadow-sm space-y-4 mb-2">
                <h1 className="text-lg font-medium text-emerald-700">Get in Touch</h1>
                <div className="space-y-3 grid grid-cols-3">
                    {/* Email */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500 rounded-full text-white">
                            <MdEmail />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-black">Email</p>
                            <p className="text-xs text-black/70">contact@scholarly.com</p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500 rounded-full text-white">
                            <FaPhoneAlt />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-black">Phone</p>
                            <p className="text-xs text-black/70">+91 98765 43210</p>
                        </div>
                    </div>

                    {/* Headquarters */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500 rounded-full text-white">
                            <FaLocationDot />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-black">Headquarters</p>
                            <p className="text-xs text-black/70">603, 6th Floor, ILD Trade Centre, Sohna Rd, Sector 47, Gurugram, Haryana 122018</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

// Reusable stat card
const StatCard = ({ icon, title, subtitle }) => (
    <div className="flex items-center gap-3 bg-emerald-500 text-white px-4 py-3 rounded-md shadow-sm w-full sm:w-auto">
        <div className="bg-emerald-600 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-base font-medium">{title}</p>
            <p className="text-xs opacity-90">{subtitle}</p>
        </div>
    </div>
);

export default AboutUs;
