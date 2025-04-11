
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Book, Users, School, User, Calendar, Bell } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
              Connecting Your Campus Community
            </h1>
            <p className="text-xl text-gray-600">
              Campus Bridge provides a seamless platform for students, faculty, and administrators to collaborate, communicate, and succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg">
                <Link to="/register">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-100 rounded-lg -z-10"></div>
              <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-red-100 rounded-lg -z-10"></div>
              <div className="bg-white p-6 rounded-lg shadow-lg z-10">
                <img 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Campus students" 
                  className="rounded-lg w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Everything You Need in One Place</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Campus Bridge brings together all the tools and resources needed for a successful academic journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full mb-6">
              <Book className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Course Management</h3>
            <p className="text-gray-600">
              Access course materials, submit assignments, and track your progress all in one place.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full mb-6">
              <Users className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Community Engagement</h3>
            <p className="text-gray-600">
              Connect with peers, join study groups, and participate in campus activities.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full mb-6">
              <Calendar className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Scheduling & Planning</h3>
            <p className="text-gray-600">
              Manage your academic calendar, set reminders, and plan your semester effectively.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full mb-6">
              <School className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Academic Resources</h3>
            <p className="text-gray-600">
              Access a wide range of learning resources, library materials, and research tools.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full mb-6">
              <Bell className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Notifications & Alerts</h3>
            <p className="text-gray-600">
              Stay informed with real-time notifications about important deadlines and announcements.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-sm">
            <div className="bg-blue-100 w-12 h-12 flex items-center justify-center rounded-full mb-6">
              <User className="text-primary h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold mb-2">Profile Management</h3>
            <p className="text-gray-600">
              Maintain your academic profile, showcase achievements, and build your portfolio.
            </p>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Academic Experience?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of students and faculty already using Campus Bridge to enhance their academic journey.
          </p>
          <Button asChild size="lg" variant="secondary">
            <Link to="/register">Create Your Account Today</Link>
          </Button>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What Our Users Say</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <span className="text-gray-600 font-bold">JS</span>
              </div>
              <div>
                <h4 className="font-bold">Jamie Smith</h4>
                <p className="text-sm text-gray-600">Computer Science Student</p>
              </div>
            </div>
            <p className="text-gray-600">
              "Campus Bridge has revolutionized how I manage my coursework. The intuitive interface and helpful reminders ensure I never miss a deadline."
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <span className="text-gray-600 font-bold">DP</span>
              </div>
              <div>
                <h4 className="font-bold">Dr. Patricia Johnson</h4>
                <p className="text-sm text-gray-600">Biology Professor</p>
              </div>
            </div>
            <p className="text-gray-600">
              "As a faculty member, I appreciate how easy it is to communicate with students, share resources, and manage course materials all in one platform."
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                <span className="text-gray-600 font-bold">MK</span>
              </div>
              <div>
                <h4 className="font-bold">Mark Kim</h4>
                <p className="text-sm text-gray-600">Department Administrator</p>
              </div>
            </div>
            <p className="text-gray-600">
              "The administrative tools in Campus Bridge have streamlined our departmental processes and improved communication across all levels of our organization."
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default HomePage;
