
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Check, Award, Heart } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <section className="py-12 text-center">
          <h1 className="text-4xl font-bold mb-6">About Campus Bridge</h1>
          <p className="text-xl text-gray-600 mb-8">
            Building connections across the academic landscape
          </p>
          <div className="relative rounded-xl overflow-hidden h-64 md:h-96">
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
              alt="University campus"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <p className="text-lg font-medium">Founded in 2023</p>
              <p>Serving over 50 educational institutions</p>
            </div>
          </div>
        </section>

        {/* Mission and Vision */}
        <section className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Award className="mr-2 text-primary h-6 w-6" />
                Our Mission
              </h2>
              <p className="text-gray-600 mb-4">
                Campus Bridge was founded with a clear mission: to create a seamless digital environment that enhances the academic experience for all stakeholders in educational institutions.
              </p>
              <p className="text-gray-600">
                We strive to break down communication barriers, streamline administrative processes, and foster a sense of community within academic institutions through innovative technology solutions.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-4 flex items-center">
                <Heart className="mr-2 text-primary h-6 w-6" />
                Our Vision
              </h2>
              <p className="text-gray-600 mb-4">
                We envision a future where technology truly serves education, where administrative tasks are simplified, and where students, faculty, and administrators can focus on what matters most: learning and growth.
              </p>
              <p className="text-gray-600">
                Campus Bridge aims to be the catalyst that transforms academic institutions into more connected, efficient, and vibrant communities.
              </p>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Check className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-gray-600">
                We are committed to continuous improvement and finding creative solutions to complex academic challenges.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Check className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Inclusivity</h3>
              <p className="text-gray-600">
                We design our platform to be accessible and valuable to every member of the academic community.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full mb-4">
                <Check className="text-primary h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Integrity</h3>
              <p className="text-gray-600">
                We uphold the highest standards of data security and ethical practices in all our operations.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-12">
          <h2 className="text-2xl font-bold mb-8 text-center">Our Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden bg-gray-200">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="CEO Portrait" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Michael Johnson</h3>
              <p className="text-gray-600">CEO & Co-Founder</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden bg-gray-200">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="CTO Portrait" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">Sarah Chen</h3>
              <p className="text-gray-600">CTO & Co-Founder</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full mx-auto mb-4 overflow-hidden bg-gray-200">
                <img 
                  src="https://randomuser.me/api/portraits/men/67.jpg" 
                  alt="COO Portrait" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold">David Rodriguez</h3>
              <p className="text-gray-600">COO</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-12">
          <div className="bg-gray-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4 text-center">Get in Touch</h2>
            <p className="text-center text-gray-600 mb-6">
              Have questions about Campus Bridge? We'd love to hear from you!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold mb-2">Contact Information</h3>
                <p className="text-gray-600 mb-1">Email: info@campusbridge.com</p>
                <p className="text-gray-600 mb-1">Phone: (555) 123-4567</p>
                <p className="text-gray-600">Address: 123 University Ave, Academic City</p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-600 hover:text-primary">
                    <span className="sr-only">Facebook</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-primary">
                    <span className="sr-only">Twitter</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-600 hover:text-primary">
                    <span className="sr-only">LinkedIn</span>
                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default AboutPage;
