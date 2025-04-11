
import React from 'react';
import Layout from '@/components/layout/Layout';
import CourseDetails from '@/components/courses/CourseDetails';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

const CourseDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to="/courses">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Courses
            </Link>
          </Button>
        </div>
        
        <CourseDetails />
      </div>
    </Layout>
  );
};

export default CourseDetailsPage;
