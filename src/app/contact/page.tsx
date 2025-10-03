"use client";

import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-8 py-16">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">Contact Us</h1>
      <div className="text-left text-gray-700 space-y-6">
        <p className="text-lg leading-relaxed">
          We'd love to hear from you! Whether you have questions about Prismora, need support, or want to share feedback, our team is here to help.
        </p>
        <div className="grid md:grid-cols-2 gap-8 mt-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Get In Touch</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-800">Email</h3>
                <p className="text-purple-600">support@prismora.com</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Phone</h3>
                <p className="text-purple-600">+1 (555) 123-4567</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">Address</h3>
                <p>123 Safe Street<br />Digital City, DC 12345<br />United States</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Support Hours</h2>
            <div className="space-y-2">
              <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM EST</p>
              <p><strong>Saturday:</strong> 10:00 AM - 4:00 PM EST</p>
              <p><strong>Sunday:</strong> Closed</p>
            </div>
            <h2 className="text-2xl font-semibold text-gray-800 mt-8 mb-4">Follow Us</h2>
            <div className="flex space-x-4">
              <a href="#" className="text-purple-600 hover:text-purple-800">Facebook</a>
              <a href="#" className="text-purple-600 hover:text-purple-800">Twitter</a>
              <a href="#" className="text-purple-600 hover:text-purple-800">Instagram</a>
            </div>
          </div>
        </div>
        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Send Us a Message</h2>
          <p className="leading-relaxed">
            For inquiries, please email us at <a href="mailto:support@prismora.com" className="text-purple-600 hover:text-purple-800">support@prismora.com</a>.
            We typically respond within 24 hours during business days.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
