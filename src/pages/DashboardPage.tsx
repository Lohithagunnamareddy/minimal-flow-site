
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/hooks/useAuth';
import StudentDashboard from '@/components/dashboard/StudentDashboard';
import FacultyDashboard from '@/components/dashboard/FacultyDashboard';
import AdminDashboard from '@/components/dashboard/AdminDashboard';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  
  const renderDashboard = () => {
    if (!user) return null;
    
    switch (user.role) {
      case 'student':
        return <StudentDashboard />;
      case 'faculty':
        return <FacultyDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div>Unknown user role</div>;
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {user?.firstName}!</h1>
          <p className="text-gray-600">
            Here's what's happening in your academic world.
          </p>
        </div>
        
        {renderDashboard()}
      </div>
    </Layout>
  );
};

export default DashboardPage;
