
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, GraduationCap, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CourseCardProps {
  course: {
    _id: string;
    title: string;
    courseCode: string;
    description: string;
    instructor: {
      firstName: string;
      lastName: string;
    };
    department: string;
    schedule: {
      days: string[];
      startTime: string;
      endTime: string;
      location: string;
    };
    students?: any[];
  };
  isInstructor?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, isInstructor = false }) => {
  const navigate = useNavigate();
  
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{course.title}</CardTitle>
            <CardDescription className="text-sm mt-1">{course.courseCode}</CardDescription>
          </div>
          <span className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary font-medium">
            {course.department.toUpperCase()}
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {course.description}
        </p>
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <GraduationCap className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {course.instructor.firstName} {course.instructor.lastName}
            </span>
          </div>
          <div className="flex items-center text-sm">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>{course.schedule?.days?.join(', ') || 'Schedule not set'}</span>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
            <span>
              {course.schedule?.startTime} - {course.schedule?.endTime}
            </span>
          </div>
          {isInstructor && course.students && (
            <div className="flex items-center text-sm">
              <Users className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{course.students.length} Students</span>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t">
        <Button
          className="w-full"
          onClick={() => navigate(`/courses/${course._id}`)}
        >
          {isInstructor ? 'Manage Course' : 'View Course'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
