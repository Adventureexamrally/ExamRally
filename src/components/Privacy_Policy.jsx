import React, { useEffect, useState } from 'react';
import Api from '../service/Api';

const Privacy_Policy = () => {
  const [privacyContent, setPrivacyContent] = useState('');

  useEffect(() => {
    const fetchPrivacyPolicy = async () => {
      try {
        const res = await Api.get('site-documents'); // Adjust path if needed
        setPrivacyContent(res.data.privacy || '');
        console.log(res.data);
        
      } catch (error) {
        console.error('Failed to load privacy policy:', error);
      }
    };

    fetchPrivacyPolicy();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 space-y-6 font shadow-lg mt-2">
    <div className="container mx-auto px-4 py-8">
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: privacyContent }}
      />
    </div>
    </div>
  );
};

export default Privacy_Policy;
