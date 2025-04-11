
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Calendar, CheckSquare, Clock, FileText, GraduationCap, MapPin, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import CourseMaterials from './CourseMaterials';
import CourseAssignments from './CourseAssignments';
import CourseStudents from './CourseStudents';
import CourseAttendance from './CourseAttendance';

// Mock fetch function (replace with actual API call)
const fetchCourseDetails = async (courseId: string) => {
  // This would be an API call in a real app
  return {
    _id: courseId,
    title: 'Introduction to Computer Science',
    courseCode: 'CS101',
    description: 'An introductory course covering the basics of computer science and programming concepts. Topics include algorithms, data structures, problem-solving, and an introduction to programming languages.',
    instructor: {
      _id: '2',
      firstName: 'Frank',
      lastName: 'Faculty',
      email: 'faculty@example.com'
    },
    department: 'cs',
    credits: 3,
    schedule: {
      days: ['Monday', 'Wednesday'],
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      location: 'Science Building Rm 101'
    },
    students: [
      { _id: '1', firstName: 'Sam', lastName: 'Student', email: 'student@example.com' }
    ],
    startDate: '2024-09-01',
    endDate: '2024-12-15'
  };
};

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', id],
    queryFn: () => fetchCourseDetails(id!),
    enabled: !!id,
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500">Error loading course details</p>
        <Button asChild variant="outline">
          <Link to="/courses">Back to Courses</Link>
        </Button>
      </div>
    );
  }
  
  const isInstructor = user?.role === 'faculty' || user?.role === 'admin';
  const isInstructorOfCourse = isInstructor && user?.id === course.instructor._id;
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.courseCode}</p>
        </div>
        
        {isInstructorOfCourse && (
          <Button asChild>
            <Link to={`/courses/${course._id}/edit`}>Edit Course</Link>
          </Button>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
          {isInstructorOfCourse && (
            <>
              <TabsTrigger value="students">Students</TabsTrigger>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
            </>
          )}
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Course Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{course.description}</p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <GraduationCap className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>
                          <span className="font-medium">Instructor:</span> {course.instructor.firstName} {course.instructor.lastName}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Book className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>
                          <span className="font-medium">Department:</span> {course.department.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>
                          <span className="font-medium">Credits:</span> {course.credits}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>
                          <span className="font-medium">Days:</span> {course.schedule.days.join(', ')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>
                          <span className="font-medium">Time:</span> {course.schedule.startTime} - {course.schedule.endTime}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
                        <span>
                          <span className="font-medium">Location:</span> {course.schedule.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Course Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Course Dates</h3>
                      <p className="mt-1">
                        {new Date(course.startDate).toLocaleDateString()} to {new Date(course.endDate).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Enrollment</h3>
                      <div className="flex items-center mt-1">
                        <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{course.students?.length || 0} Students</span>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">Quick Links</h3>
                      <div className="space-y-2 mt-2">
                        <Button 
                          variant="outline" 
                          className="w-full justify-start" 
                          onClick={() => setActiveTab('materials')}
                        >
                          <Book className="h-4 w-4 mr-2" />
                          Course Materials
                        </Button>
                        <Button 
                          variant="outline" 
                          className="w-full justify-start"
                          onClick={() => setActiveTab('assignments')}
                        >
                          <CheckSquare className="h-4 w-4 mr-2" />
                          Assignments
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="materials" className="mt-6">
          <CourseMaterials courseId={course._id} isInstructor={isInstructorOfCourse} />
        </TabsContent>
        
        <TabsContent value="assignments" className="mt-6">
          <CourseAssignments courseId={course._id} isInstructor={isInstructorOfCourse} />
        </TabsContent>
        
        {isInstructorOfCourse && (
          <>
            <TabsContent value="students" className="mt-6">
              <CourseStudents courseId={course._id} students={course.students} />
            </TabsContent>
            
            <TabsContent value="attendance" className="mt-6">
              <CourseAttendance courseId={course._id} students={course.students} />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

export default CourseDetails;
