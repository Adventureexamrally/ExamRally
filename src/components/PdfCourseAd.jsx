import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaCalendarCheck, FaTag, FaShieldAlt, FaClock, FaSync, FaChartLine, FaCheckCircle, FaFilePdf, FaArrowRight, FaRupeeSign } from 'react-icons/fa';
const PdfCourseAd = () => {
    return (
        <div className="w-full pt-1 pb-4">
            <div className="relative bg-white border border-green-100 rounded-3xl overflow-hidden shadow-sm">
                {/* Subtle Decorative Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-50 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-50 rounded-full blur-3xl opacity-60"></div>
                </div>

                <div className="relative z-10 px-8 py-10 lg:px-16 lg:py-12">
                    <div className="grid lg:grid-cols-12 gap-12 items-center">

                        {/* Left Section - Content based on image */}
                        <div className="lg:col-span-7 space-y-8">
                            {/* Promo Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                                <FaStar className="text-green-600 text-[10px]" />
                                <span className="text-green-600 font-bold text-[10px] uppercase tracking-[0.2em]">
                                    Best Banking Bundle 2026
                                </span>
                            </div>

                            {/* Main Heading - Impressive Typography */}
                            <div>
                                <h2 className="text-4xl lg:text-6xl font-extrabold text-slate-800 mb-4 leading-[1.1] tracking-tight">
                                    365-Days <span className="text-green-600 italic font-serif font-bold">Rally</span>
                                    <span className="block">PDF Course</span>
                                </h2>
                                <p className="text-lg text-slate-500 leading-relaxed max-w-xl font-medium">
                                    Replace preparation chaos with <span className="text-green-600 font-bold underline decoration-green-200 underline-offset-4">disciplined consistency</span>. A scientifically structured daily mentor for IBPS, SBI, and RRB Exams.
                                </p>
                            </div>

                            {/* Feature Highlights Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {/* Card 1 - Green to Blue */}
                                <div className="relative p-[1px] bg-gradient-to-br from-green-400 to-blue-400 rounded-xl group hover:shadow-lg transition-shadow">
                                    <div className="bg-white rounded-xl p-4 flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-green-50 to-blue-50 border border-green-100 rounded-xl flex items-center justify-center">
                                            <FaCalendarCheck className="text-green-600 text-sm" />
                                        </div>
                                        <div>
                                            <h4 className="text-slate-800 font-bold text-md">365-Day Schedule</h4>
                                            <p className="text-slate-400 text-sm mt-0.5">Prelims & Mains from Day 1</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 2 - Purple to Pink */}
                                <div className="relative p-[1px] bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl group hover:shadow-lg transition-shadow">
                                    <div className="bg-white rounded-xl p-4 flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 rounded-xl flex items-center justify-center">
                                            <FaSync className="text-purple-600 text-sm" />
                                        </div>
                                        <div>
                                            <h4 className="text-slate-800 font-bold text-md">Sunday Revision</h4>
                                            <p className="text-slate-400 text-sm mt-0.5">Dedicated retention slots</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 3 - Orange to Amber */}
                                <div className="relative p-[1px] bg-gradient-to-br from-orange-400 to-amber-400 rounded-xl group hover:shadow-lg transition-shadow">
                                    <div className="bg-white rounded-xl p-4 flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 rounded-xl flex items-center justify-center">
                                            <FaChartLine className="text-orange-600 text-sm" />
                                        </div>
                                        <div>
                                            <h4 className="text-slate-800 font-bold text-md">Trend Focused</h4>
                                            <p className="text-slate-400 text-sm mt-0.5">Based on 2020-2025 patterns (Updated)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Card 4 - Emerald to Cyan */}
                                <div className="relative p-[1px] bg-gradient-to-br from-emerald-400 to-cyan-400 rounded-xl group hover:shadow-lg transition-shadow">
                                    <div className="bg-white rounded-xl p-4 flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-emerald-50 to-cyan-50 border border-emerald-100 rounded-xl flex items-center justify-center">
                                            <FaRupeeSign className="text-emerald-600 text-sm" />
                                        </div>
                                        <div>
                                            <h4 className="text-slate-800 font-bold text-md">₹1 Per Day</h4>
                                            <p className="text-slate-400 text-sm mt-0.5">Premium quality, unbeatable price</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Trust Footer */}
                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-1.5">
                                    <FaCheckCircle className="text-green-600 text-sm" />
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Consistency.</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FaCheckCircle className="text-green-600 text-sm" />
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Practice.</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FaCheckCircle className="text-green-600 text-sm" />
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selection.</span>
                                </div>
                            </div>
                        </div>
                        <div>

                        </div>
                        {/* Right Section - Pricing & CTA */}
                        <div className="lg:col-span-3 flex flex-col items-center">
                            {/* Compact Pricing Card - Reduced Height */}
                            <div className="relative group mb-6 w-full max-w-sm">
                                {/* Subtle Glow */}
                                <div className="absolute inset-0 bg-green-100 rounded-3xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>

                                {/* Main Card - Less Padding */}
                                <div className="relative bg-white p-6 rounded-3xl border border-green-50 shadow-lg shadow-green-100/30 text-center">
                                    {/* Badge - More Prominent */}
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white text-sm font-black px-5 py-1.5 rounded-full shadow-md whitespace-nowrap">
                                        <span className="text-base">₹365</span>
                                        <span className="text-xs font-bold ml-1">/YEAR</span>
                                    </div>

                                    {/* Icon - Smaller */}
                                    <div className="mb-4">
                                        <div className="bg-green-50 p-3 rounded-xl inline-block">
                                            <FaFilePdf className="text-4xl text-green-600" />
                                        </div>
                                    </div>

                                    {/* Price - More Emphasis */}
                                    <div className="mb-3">
                                        <span className="text-slate-400 line-through text-sm mr-2">₹1,499</span>
                                        <span className="text-red-600 text-xs font-bold bg-red-50 px-2 py-1 rounded">76% OFF</span>
                                    </div>

                                    {/* Bigger ₹1 */}
                                    <div className="flex flex-col items-center">
                                        <div className="flex items-baseline justify-center">
                                            <span className="text-4xl font-black text-slate-900">₹1</span>
                                            <span className="text-slate-500 ml-2 text-sm font-medium">per day</span>
                                        </div>
                                        <p className="text-slate-600 text-xs mt-1">Complete study materials access</p>
                                    </div>
                                </div>
                            </div>

                            {/* CTA - Reduced Spacing */}
                            <div className="text-center space-y-3 w-full max-w-sm">
                                <Link
                                    to="/pdf-course"
                                    className="block w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-bold text-base shadow-md shadow-green-200 hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-95"
                                >
                                    Start Daily Rally
                                </Link>

                                <p className="text-slate-400 text-xs font-serif italic">
                                    Examrally — Your Rally to Merit
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PdfCourseAd;