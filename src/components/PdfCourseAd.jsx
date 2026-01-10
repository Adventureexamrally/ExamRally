import React from 'react';
import { Link } from 'react-router-dom';
import { FaStar, FaCalendarCheck, FaSync, FaChartLine, FaCheckCircle, FaFilePdf, FaArrowRight, FaRupeeSign } from 'react-icons/fa';

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
                                    Replace preparation chaos with <span className="text-green-600 font-bold underline decoration-green-200 underline-offset-4">disciplined consistency</span>. A scientifically structured daily mentor for IBPS, SBI, and RRB.
                                </p>
                            </div>

                            {/* Feature Highlights Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-white shadow-md border border-green-50 rounded-xl flex items-center justify-center">
                                        <FaCalendarCheck className="text-green-600 text-sm" />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-800 font-bold text-sm">365-Day Schedule</h4>
                                        <p className="text-slate-400 text-xs mt-0.5">Prelims & Mains from Day 1</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-white shadow-md border border-green-50 rounded-xl flex items-center justify-center">
                                        <FaSync className="text-green-600 text-sm" />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-800 font-bold text-sm">Sunday Revision</h4>
                                        <p className="text-slate-400 text-xs mt-0.5">Dedicated retention slots</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-white shadow-md border border-green-50 rounded-xl flex items-center justify-center">
                                        <FaChartLine className="text-green-600 text-sm" />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-800 font-bold text-sm">Trend Focused</h4>
                                        <p className="text-slate-400 text-xs mt-0.5">Based on 2020-2025 patterns</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 w-10 h-10 bg-white shadow-md border border-green-50 rounded-xl flex items-center justify-center">
                                        <FaRupeeSign className="text-green-600 text-sm" />
                                    </div>  
                                    <div>
                                        <h4 className="text-slate-800 font-bold text-sm">₹1 Per Day</h4>
                                        <p className="text-slate-400 text-xs mt-0.5">Premium quality, unbeatable price</p>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Footer */}
                            <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-1.5">
                                    <FaCheckCircle className="text-green-600 text-sm" />
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider italic">Consistency.</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FaCheckCircle className="text-green-600 text-sm" />
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider italic">Practice.</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <FaCheckCircle className="text-green-600 text-sm" />
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider italic">Selection.</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Section - Pricing & CTA */}
                        <div className="lg:col-span-5 flex flex-col items-center">
                            <div className="relative group mb-8">
                                <div className="absolute inset-0 bg-green-200 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition-opacity"></div>
                                
                                <div className="relative bg-white p-10 rounded-3xl border border-green-100 shadow-2xl shadow-green-100/50 transform transition-transform group-hover:-translate-y-2 text-center">
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] font-black px-4 py-1 rounded-full shadow-lg whitespace-nowrap">
                                        ₹365 ONLY
                                    </div>
                                    <FaFilePdf className="text-7xl text-green-600 mx-auto" />
                                    <div className="mt-4">
                                        <span className="text-slate-300 line-through text-sm">₹1,499</span>
                                        <p className="text-2xl font-black text-slate-800">₹1 <span className="text-xs text-slate-400 font-normal">/ day</span></p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center space-y-4 w-full">
                                <Link
                                    to="/pdf-course"
                                    className="group w-full inline-flex items-center justify-center gap-3 bg-green-600 text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-green-200 hover:bg-green-700 transition-all duration-300 hover:scale-[1.02] active:scale-95"
                                >
                                    <span>Start Your Daily Rally</span>
                                    <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <p className="text-slate-400 text-sm font-serif italic">
                                    Examrally — Your Rally to the Merit List
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