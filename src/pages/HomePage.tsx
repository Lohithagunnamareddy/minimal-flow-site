
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, BookOpen, FileText, Calendar, Users } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <section className="py-12 md:py-24 lg:py-32 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Welcome to Campus Bridge
          </h1>
          <p className="text-xl mb-8 max-w-2xl text-gray-600">
            Your complete learning management system for educational institutions.
            Connect, collaborate, and learn in one unified platform.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Log In</Link>
            </Button>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              icon={<GraduationCap className="h-10 w-10" />}
              title="Course Management"
              description="Create, organize, and manage courses with ease. Track progress and student engagement."
            />
            <FeatureCard 
              icon={<BookOpen className="h-10 w-10" />}
              title="Learning Materials"
              description="Upload and share documents, videos, and resources in multiple formats."
            />
            <FeatureCard 
              icon={<FileText className="h-10 w-10" />}
              title="Assignments & Grading"
              description="Create assignments, track submissions, and provide timely feedback."
            />
            <FeatureCard 
              icon={<Calendar className="h-10 w-10" />}
              title="Attendance Tracking"
              description="Record and monitor student attendance for in-person and online classes."
            />
          </div>
        </section>

        <section className="py-12 bg-gray-50 rounded-lg p-8">
          <h2 className="text-3xl font-bold text-center mb-6">Getting Started</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">1</div>
                <div>
                  <h3 className="text-xl font-semibold">Create an Account</h3>
                  <p className="text-gray-600">Register as a student, faculty member, or administrator.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">2</div>
                <div>
                  <h3 className="text-xl font-semibold">Explore the Dashboard</h3>
                  <p className="text-gray-600">Access your personalized dashboard to view courses and activities.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center shrink-0">3</div>
                <div>
                  <h3 className="text-xl font-semibold">Join or Create Courses</h3>
                  <p className="text-gray-600">Enroll in available courses or create new ones as an instructor.</p>
                </div>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button size="lg" asChild>
                <Link to="/register">Create Your Account</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-12">
          <h2 className="text-3xl font-bold text-center mb-6">Demo Accounts</h2>
          <div className="max-w-3xl mx-auto bg-gray-100 p-6 rounded-lg">
            <p className="text-center mb-4">
              For demonstration purposes, you can use these test accounts:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Email:</strong> student@example.com</p>
                  <p><strong>Password:</strong> password123</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/login">Login as Student</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Faculty</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Email:</strong> faculty@example.com</p>
                  <p><strong>Password:</strong> password123</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/login">Login as Faculty</Link>
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Admin</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Email:</strong> admin@example.com</p>
                  <p><strong>Password:</strong> password123</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant="outline" asChild>
                    <Link to="/login">Login as Admin</Link>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => {
  return (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto mb-4 bg-primary/10 p-4 rounded-full">{icon}</div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};

export default HomePage;
