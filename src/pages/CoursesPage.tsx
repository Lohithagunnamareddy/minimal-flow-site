
import React from 'react';
import Layout from '@/components/layout/Layout';
import CoursesList from '@/components/courses/CoursesList';

const CoursesPage: React.FC = () => {
  return (
    <Layout>
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Your Courses</h1>
        <p className="text-muted-foreground">
          Browse and manage your enrolled courses
        </p>
        
        <CoursesList />
      </div>
    </Layout>
  );
};

export default CoursesPage;
