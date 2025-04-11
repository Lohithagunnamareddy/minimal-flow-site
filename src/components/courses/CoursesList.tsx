
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import CourseCard from './CourseCard';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock fetch function (replace with actual API call)
const fetchCourses = async () => {
  // This would be an API call in a real app
  return [
    {
      _id: '1',
      title: 'Introduction to Computer Science',
      courseCode: 'CS101',
      description: 'An introductory course covering the basics of computer science and programming.',
      instructor: {
        firstName: 'Frank',
        lastName: 'Faculty'
      },
      department: 'cs',
      schedule: {
        days: ['Monday', 'Wednesday'],
        startTime: '10:00 AM',
        endTime: '11:30 AM',
        location: 'Science Building Rm 101'
      },
      students: [
        { _id: '1', firstName: 'Sam', lastName: 'Student' }
      ]
    },
    {
      _id: '2',
      title: 'Data Structures and Algorithms',
      courseCode: 'CS202',
      description: 'A comprehensive exploration of common data structures and algorithms used in software development.',
      instructor: {
        firstName: 'Frank',
        lastName: 'Faculty'
      },
      department: 'cs',
      schedule: {
        days: ['Tuesday', 'Thursday'],
        startTime: '1:00 PM',
        endTime: '2:30 PM',
        location: 'Science Building Rm 205'
      },
      students: [
        { _id: '1', firstName: 'Sam', lastName: 'Student' }
      ]
    }
  ];
};

const CoursesList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: courses, isLoading, error, refetch } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
  });
  
  const isInstructor = user?.role === 'faculty' || user?.role === 'admin';
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500 mb-4">Error loading courses</p>
        <Button variant="outline" onClick={() => refetch()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Try Again
        </Button>
      </div>
    );
  }
  
  if (!courses || courses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <p className="text-lg mb-4">No courses found</p>
        {isInstructor && (
          <Button onClick={() => navigate('/courses/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Course
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Your Courses</h2>
        {isInstructor && (
          <Button onClick={() => navigate('/courses/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Create New Course
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard 
            key={course._id} 
            course={course} 
            isInstructor={isInstructor}
          />
        ))}
      </div>
    </div>
  );
};

export default CoursesList;
