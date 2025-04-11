
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronRight, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    courseCode: string;
    description: string;
    department: string;
    instructor: {
      firstName: string;
      lastName: string;
    };
    students?: Array<any>;
    schedule?: {
      days: string[];
      startTime: string;
      endTime: string;
      location: string;
    };
  };
  isInstructor: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isInstructor }) => {
  const getDepartmentBadgeColor = (dept: string) => {
    const deptColors: Record<string, string> = {
      'cs': 'bg-blue-100 text-blue-800',
      'math': 'bg-green-100 text-green-800',
      'eng': 'bg-amber-100 text-amber-800',
      'sci': 'bg-indigo-100 text-indigo-800',
      'arts': 'bg-rose-100 text-rose-800',
      'bus': 'bg-purple-100 text-purple-800',
    };
    
    return deptColors[dept.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between">
          <Badge 
            className={`${getDepartmentBadgeColor(course.department)} font-normal`}
            variant="outline"
          >
            {course.courseCode}
          </Badge>
          
          {isInstructor && course.students && (
            <Badge variant="outline" className="flex items-center gap-1 font-normal">
              <Users className="h-3 w-3" /> 
              {course.students.length} student{course.students.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <CardTitle className="text-xl mt-2 line-clamp-1">{course.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {course.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="text-sm text-muted-foreground">
          <div className="flex items-center mt-1 gap-1">
            <span className="font-medium text-foreground">Instructor:</span> 
            <span>{course.instructor.firstName} {course.instructor.lastName}</span>
          </div>
          
          {course.schedule && (
            <div className="mt-2 space-y-1">
              <div className="flex items-start gap-1">
                <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p>{course.schedule.days.join(', ')}</p>
                  <p>{course.schedule.startTime} - {course.schedule.endTime}</p>
                  <p>{course.schedule.location}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 border-t">
        <Button asChild className="w-full">
          <Link to={`/courses/${course._id}`} className="flex items-center justify-center">
            {isInstructor ? 'Manage Course' : 'View Course'}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
