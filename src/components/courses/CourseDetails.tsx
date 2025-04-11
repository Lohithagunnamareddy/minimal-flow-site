
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Edit, UserPlus, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import CourseMaterials from './CourseMaterials';
import CourseAssignments from './CourseAssignments';
import CourseStudents from './CourseStudents';
import CourseAttendance from './CourseAttendance';
import MaterialViewer from './MaterialViewer';

// Mock fetch function (replace with actual API call)
const fetchCourseDetails = async (courseId: string) => {
  // This would be an API call in a real app
  return {
    _id: courseId,
    title: 'Introduction to Computer Science',
    courseCode: 'CS101',
    description: 'An introductory course covering the basics of computer science and programming. Topics include algorithms, data structures, programming concepts, and an introduction to software development.',
    department: 'cs',
    credits: 3,
    instructor: {
      _id: '2',
      firstName: 'Frank',
      lastName: 'Faculty',
      email: 'faculty@example.com'
    },
    students: [
      { _id: '1', firstName: 'Sam', lastName: 'Student', email: 'student@example.com' },
      { _id: '4', firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' },
      { _id: '5', firstName: 'John', lastName: 'Smith', email: 'john@example.com' }
    ],
    startDate: '2024-09-01T00:00:00Z',
    endDate: '2024-12-20T00:00:00Z',
    schedule: {
      days: ['Monday', 'Wednesday'],
      startTime: '10:00 AM',
      endTime: '11:30 AM',
      location: 'Science Building Rm 101'
    },
    isActive: true
  };
};

const CourseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const courseId = id || '';
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  
  const { data: course, isLoading, error } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => fetchCourseDetails(courseId),
    enabled: !!courseId,
  });
  
  const isInstructor = user?.role === 'faculty' || user?.role === 'admin' || 
    (course?.instructor?._id === user?.id);
    
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error || !course) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading course details</p>
      </div>
    );
  }
  
  const handleBackToMaterials = () => {
    setSelectedMaterial(null);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-800 font-normal">
                  {course.courseCode}
                </Badge>
                <Badge variant="outline" className="font-normal">
                  {course.credits} Credits
                </Badge>
                {course.isActive ? (
                  <Badge variant="outline" className="bg-green-100 text-green-800 font-normal">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-gray-100 text-gray-800 font-normal">
                    Inactive
                  </Badge>
                )}
              </div>
              
              <CardTitle className="text-2xl">{course.title}</CardTitle>
              <CardDescription className="mt-2 max-w-2xl">
                {course.description}
              </CardDescription>
            </div>
            
            {isInstructor && (
              <div className="flex gap-2">
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Course
                </Button>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Students
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Instructor</h3>
              <p>{course.instructor.firstName} {course.instructor.lastName}</p>
              <p className="text-sm text-muted-foreground">{course.instructor.email}</p>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Schedule</h3>
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{course.schedule.days.join(', ')}</p>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <p className="text-sm">{course.schedule.startTime} - {course.schedule.endTime}</p>
                  </div>
                  <p className="text-sm">{course.schedule.location}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h3 className="font-medium">Students</h3>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <p>{course.students.length} enrolled</p>
              </div>
              <p className="text-sm text-muted-foreground">
                {new Date(course.startDate).toLocaleDateString()} - {new Date(course.endDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {selectedMaterial ? (
        <MaterialViewer material={selectedMaterial} onBack={handleBackToMaterials} />
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 w-full">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="materials">Materials</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="students">
              {isInstructor ? "Students" : "Classmates"}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Course Overview</CardTitle>
                <CardDescription>
                  Key information about the course
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="mb-4">
                    This course provides an introduction to the field of computer science, covering 
                    fundamental concepts and problem-solving skills using programming. Students will learn
                    algorithmic thinking, data structures, and basic programming concepts.
                  </p>
                  
                  <h3>Learning Objectives</h3>
                  <ul>
                    <li>Understand fundamental programming concepts</li>
                    <li>Develop problem-solving skills using computational thinking</li>
                    <li>Learn to implement basic algorithms and data structures</li>
                    <li>Gain proficiency in a programming language</li>
                    <li>Create small software applications to solve real-world problems</li>
                  </ul>
                  
                  <h3>Grading Policy</h3>
                  <ul>
                    <li>Assignments: 40%</li>
                    <li>Quizzes: 15%</li>
                    <li>Midterm Exam: 20%</li>
                    <li>Final Project: 25%</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <p className="font-medium">Quiz 1</p>
                        <p className="text-sm text-muted-foreground">50 points</p>
                      </div>
                      <p className="text-sm">Due Sep 20</p>
                    </li>
                    <li className="flex justify-between items-center pb-2 border-b">
                      <div>
                        <p className="font-medium">Project Proposal</p>
                        <p className="text-sm text-muted-foreground">100 points</p>
                      </div>
                      <p className="text-sm">Due Oct 15</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Announcements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="pb-2 border-b">
                      <p className="font-medium">Office Hours Changed</p>
                      <p className="text-sm">Office hours will now be held on Tuesdays from 2-4pm instead of Mondays.</p>
                      <p className="text-xs text-muted-foreground mt-1">Posted 2 days ago</p>
                    </li>
                    <li>
                      <p className="font-medium">Midterm Date Announced</p>
                      <p className="text-sm">The midterm exam will be held on October 20th during regular class time.</p>
                      <p className="text-xs text-muted-foreground mt-1">Posted 5 days ago</p>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="materials">
            <CourseMaterials 
              courseId={courseId} 
              isInstructor={isInstructor} 
            />
          </TabsContent>
          
          <TabsContent value="assignments">
            <CourseAssignments 
              courseId={courseId} 
              isInstructor={isInstructor} 
            />
          </TabsContent>
          
          <TabsContent value="students">
            {isInstructor ? (
              <CourseStudents 
                courseId={courseId} 
                students={course.students}
              />
            ) : (
              <CourseAttendance 
                courseId={courseId}
                isInstructor={false}
                students={course.students}
              />
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default CourseDetails;
