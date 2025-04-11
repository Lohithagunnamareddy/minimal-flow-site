
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, Calendar, Clock, FileUp, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

interface CourseAssignmentsProps {
  courseId: string;
  isInstructor: boolean;
}

// Mock fetch function (replace with actual API call)
const fetchAssignments = async (courseId: string) => {
  // This would be an API call in a real app
  return [
    {
      _id: '1',
      title: 'Programming Exercise 1',
      description: 'Write a program that calculates and prints the Fibonacci sequence.',
      dueDate: '2024-09-15T23:59:59Z',
      pointsPossible: 100,
      submissionType: 'file',
      isPublished: true,
      status: 'not_submitted' // For students: 'not_submitted', 'submitted', 'graded'
    },
    {
      _id: '2',
      title: 'Quiz 1: Programming Fundamentals',
      description: 'Online quiz covering basic programming concepts discussed in Weeks 1-3.',
      dueDate: '2024-09-22T23:59:59Z',
      pointsPossible: 50,
      submissionType: 'link',
      isPublished: true,
      status: 'submitted',
      submissionDate: '2024-09-20T10:15:00Z'
    },
    {
      _id: '3',
      title: 'Programming Project: Calculator App',
      description: 'Develop a simple calculator application with basic operations.',
      dueDate: '2024-10-10T23:59:59Z',
      pointsPossible: 200,
      submissionType: 'file',
      isPublished: true,
      status: 'graded',
      grade: 185
    }
  ];
};

const CourseAssignments: React.FC<CourseAssignmentsProps> = ({ courseId, isInstructor }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { data: assignments, isLoading, error } = useQuery({
    queryKey: ['assignments', courseId],
    queryFn: () => fetchAssignments(courseId),
    enabled: !!courseId,
  });
  
  const getStatusBadge = (assignment: any) => {
    if (isInstructor) {
      return null;
    }
    
    if (assignment.status === 'not_submitted') {
      const dueDate = new Date(assignment.dueDate);
      const now = new Date();
      
      if (dueDate < now) {
        return <Badge variant="destructive">Overdue</Badge>;
      }
      return <Badge variant="outline">Not Submitted</Badge>;
    } else if (assignment.status === 'submitted') {
      return <Badge variant="secondary">Submitted</Badge>;
    } else if (assignment.status === 'graded') {
      return <Badge variant="secondary" className="bg-green-100 text-green-800">Graded: {assignment.grade}/{assignment.pointsPossible}</Badge>;
    }
    
    return null;
  };
  
  const handleAssignmentAction = (assignment: any) => {
    if (isInstructor) {
      navigate(`/courses/${courseId}/assignment/${assignment._id}/manage`);
    } else {
      navigate(`/courses/${courseId}/assignment/${assignment._id}`);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Error loading assignments</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Assignments</h2>
        {isInstructor && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Assignment
          </Button>
        )}
      </div>
      
      {(!assignments || assignments.length === 0) ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">No assignments available yet</p>
            {isInstructor && (
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Assignment
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Course Assignments</CardTitle>
            <CardDescription>
              {isInstructor ? 'Manage your course assignments' : 'View and submit your assignments'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {assignments.map((assignment, index) => (
                <React.Fragment key={assignment._id}>
                  {index > 0 && <Separator />}
                  <li className="pt-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-medium">{assignment.title}</h3>
                          {getStatusBadge(assignment)}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {assignment.description}
                        </p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5 mr-1" />
                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <AlertCircle className="h-3.5 w-3.5 mr-1" />
                            {assignment.pointsPossible} points
                          </div>
                        </div>
                      </div>
                      <Button 
                        size="sm" 
                        className="mt-2 sm:mt-0"
                        onClick={() => handleAssignmentAction(assignment)}
                      >
                        {isInstructor ? 'Manage' : (
                          <>
                            <FileUp className="mr-2 h-4 w-4" />
                            {assignment.status === 'not_submitted' ? 'Submit' : 'View'}
                          </>
                        )}
                      </Button>
                    </div>
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseAssignments;
