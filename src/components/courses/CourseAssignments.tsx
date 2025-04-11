
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, File, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
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
      title: 'Project Proposal',
      description: 'Submit a 1-2 page proposal for your final project.',
      dueDate: '2024-10-15T23:59:00Z',
      pointsPossible: 100,
      submissionType: 'file',
      isPublished: true,
      createdAt: '2024-09-01T12:00:00Z'
    },
    {
      _id: '2',
      title: 'Quiz 1',
      description: 'Online quiz covering the first three weeks of material.',
      dueDate: '2024-09-20T23:59:00Z',
      pointsPossible: 50,
      submissionType: 'text',
      isPublished: true,
      createdAt: '2024-09-05T10:00:00Z'
    },
    {
      _id: '3',
      title: 'Final Project',
      description: 'Complete implementation of your proposed project.',
      dueDate: '2024-12-10T23:59:00Z',
      pointsPossible: 200,
      submissionType: 'multiple',
      isPublished: false,
      createdAt: '2024-09-10T14:30:00Z'
    }
  ];
};

const CourseAssignments: React.FC<CourseAssignmentsProps> = ({ courseId, isInstructor }) => {
  const { user } = useAuth();
  const [openDialog, setOpenDialog] = useState(false);
  
  const { data: assignments, isLoading, error } = useQuery({
    queryKey: ['assignments', courseId],
    queryFn: () => fetchAssignments(courseId),
    enabled: !!courseId,
  });
  
  const isPastDue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };
  
  const getStatusBadge = (assignment: any) => {
    if (!assignment.isPublished) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          Draft
        </Badge>
      );
    }
    
    if (isPastDue(assignment.dueDate)) {
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-800">
          Past Due
        </Badge>
      );
    }
    
    const dueDate = new Date(assignment.dueDate);
    const now = new Date();
    const daysLeft = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysLeft <= 3) {
      return (
        <Badge variant="secondary" className="bg-amber-100 text-amber-800">
          Due Soon
        </Badge>
      );
    }
    
    return (
      <Badge variant="secondary" className="bg-green-100 text-green-800">
        Active
      </Badge>
    );
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
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
                <DialogDescription>
                  Create a new assignment for this course. Students will be notified when you publish it.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="text-center text-muted-foreground">
                  Assignment creation form would go here
                </p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      {(!assignments || assignments.length === 0) ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">No assignments available yet</p>
            {isInstructor && (
              <Button onClick={() => setOpenDialog(true)}>
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
              {isInstructor 
                ? "Manage and grade student assignments" 
                : "View and submit your assignments"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {assignments
                .filter(a => a.isPublished || isInstructor)
                .map((assignment, index) => (
                  <React.Fragment key={assignment._id}>
                    {index > 0 && <Separator />}
                    <li className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-lg">{assignment.title}</h3>
                            {getStatusBadge(assignment)}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {assignment.description}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Calendar className="mr-1 h-4 w-4" />
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock className="mr-1 h-4 w-4" />
                              {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <File className="mr-1 h-4 w-4" />
                              {assignment.pointsPossible} pts
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {isInstructor && (
                            <Button variant="outline" size="sm" className="h-8">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button asChild size="sm" className="h-8">
                            <Link to={`/courses/${courseId}/assignment/${assignment._id}`}>
                              {isInstructor ? "Grade" : "View"}
                            </Link>
                          </Button>
                        </div>
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
