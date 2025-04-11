
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import LoginForm from '@/components/forms/LoginForm';
import Layout from '@/components/layout/Layout';

const LoginPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Login to Campus Bridge</CardTitle>
              <CardDescription>
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>
            <LoginForm />
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;
