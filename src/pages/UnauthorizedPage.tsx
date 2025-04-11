
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { ShieldAlert } from 'lucide-react';

const UnauthorizedPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <ShieldAlert className="h-24 w-24 text-red-500 mb-6" />
        <h1 className="text-4xl font-bold mb-4">Access Denied</h1>
        <p className="text-xl text-gray-600 mb-8 max-w-md">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default UnauthorizedPage;
