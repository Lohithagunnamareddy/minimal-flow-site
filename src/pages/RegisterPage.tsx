
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import RegisterForm from '@/components/forms/RegisterForm';
import Layout from '@/components/layout/Layout';

const RegisterPage: React.FC = () => {
  return (
    <Layout>
      <div className="flex justify-center items-center py-12">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
              <CardDescription>
                Join Campus Bridge to connect with your academic community
              </CardDescription>
            </CardHeader>
            <RegisterForm />
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default RegisterPage;
