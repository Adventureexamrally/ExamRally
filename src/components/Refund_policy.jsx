function Refund_policy() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
            <div className="bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg overflow-hidden border border-gray-100">
                {/* Header Section */}
                <div className="bg-green-600 px-6 py-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-white text-center">Refund Policy</h1>
                </div>
                
                <div className="p-6 md:p-8 space-y-8">
                    {/* Commitment Section */}
                    <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="bg-green-100 p-3 rounded-full shrink-0">
                            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">Our Commitment to You</h2>
                            <p className="text-gray-700 leading-relaxed">
                                At ExamRally, we are committed to delivering reliable products and exceptional support. 
                                If you encounter any issues, our Customer Support Team is ready to assist you.
                            </p>
                        </div>
                    </div>

                    {/* Policy Highlights */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center mb-3">
                                <div className="bg-orange-100 p-2 rounded-full mr-3">
                                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-medium text-gray-800">Response Time</h3>
                            </div>
                            <p className="text-gray-600 text-sm">We review all queries within <span className="font-medium">48 working hours</span> and provide complete guidance to resolve your issue.</p>
                        </div>

                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <div className="flex items-center mb-3">
                                <div className="bg-green-100 p-2 rounded-full mr-3">
                                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <h3 className="font-medium text-gray-800">Support Availability</h3>
                            </div>
                            <p className="text-gray-600 text-sm">24/7 support via email and phone support during <span className="font-medium">10:00 AM to 6:00 PM IST</span>.</p>
                        </div>
                    </div>

                    {/* Refund Details */}
                    <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded-r-lg">
                        <h2 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                            <svg className="w-6 h-6 text-amber-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                            Refund Policy Details
                        </h2>
                        <p className="text-gray-700 mb-4">
                            All purchases on ExamRally are final as per our terms and conditions. 
                            Cancellations or refunds are typically not accepted after purchase.
                        </p>
                        <p className="text-gray-700 font-medium">
                            For exceptional cases, we're happy to discuss potential solutions, including refunds when justified.
                        </p>
                    </div>

                    {/* Process Timeline */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Refund Process</h2>
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-4 top-0 h-full w-0.5 bg-blue-200"></div>
                            
                            {/* Timeline items */}
                            <div className="relative pl-12 pb-8">
                                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">1</div>
                                <h3 className="font-medium text-gray-800 mb-1">Request Submission</h3>
                                <p className="text-gray-600 text-sm">Contact our support team with your refund request</p>
                            </div>
                            
                            <div className="relative pl-12 pb-8">
                                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">2</div>
                                <h3 className="font-medium text-gray-800 mb-1">Review Period</h3>
                                <p className="text-gray-600 text-sm">We evaluate your request within 48 working hours</p>
                            </div>
                            
                            <div className="relative pl-12">
                                <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold">3</div>
                                <h3 className="font-medium text-gray-800 mb-1">Processing</h3>
                                <p className="text-gray-600 text-sm">Approved refunds processed within 14 business days</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="bg-green-50 rounded-lg p-6 text-center">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">Need Help?</h2>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <a href="mailto:support@examrally.in" className="bg-white px-5 py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 text-green-600 font-medium hover:bg-green-100 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Email Us
                            </a>
                            <a href="tel:+919600058949" className="bg-white px-5 py-3 rounded-lg shadow-sm flex items-center justify-center gap-2 text-green-600 font-medium hover:bg-green-100 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                Call Us
                            </a>
                        </div>
                        <p className="text-gray-600 mt-4 text-sm">Phone support available 10:00 AM to 6:00 PM IST</p>
                    </div>

                    {/* Closing Note */}
                    <div className="text-center text-gray-500 text-sm italic">
                        Thank you for choosing ExamRally. We value your trust and are committed to your satisfaction.
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Refund_policy;