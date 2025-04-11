
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ChevronLeft, Calendar, Clock, AlertCircle, Upload, FileText, File, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

// Mock fetch function (replace with actual API call)
const fetchAssignmentDetails = async (courseId: string, assignmentId: string) => {
  // This would be an API call in a real app
  return {
    _id: assignmentId,
    title: 'Programming Exercise 1',
    description: 'Write a program that calculates and prints the Fibonacci sequence. Your program should ask the user for the number of terms to generate and then output the sequence. Include proper error handling for invalid inputs.',
    dueDate: '2024-09-15T23:59:59Z',
    pointsPossible: 100,
    submissionType: 'file',
    isPublished: true,
    course: {
      _id: courseId,
      title: 'Introduction to Computer Science',
      courseCode: 'CS101'
    },
    submission: null, // or { _id: '123', content: '...', attachments: [...], submissionDate: '...', status: '...' }
  };
};

const AssignmentPage: React.FC = () => {
  const { courseId, assignmentId } = useParams<{ courseId: string; assignmentId: string }>();
  const [files, setFiles] = useState<File[]>([]);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const { data: assignment, isLoading, error } = useQuery({
    queryKey: ['assignment', assignmentId],
    queryFn: () => fetchAssignmentDetails(courseId!, assignmentId!),
    enabled: !!courseId && !!assignmentId,
  });
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Assignment Submitted",
        description: "Your work has been submitted successfully.",
      });
      setIsSubmitting(false);
    }, 1500);
  };
  
  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }
  
  if (error || !assignment) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <p className="text-red-500">Error loading assignment details</p>
          <Button asChild variant="outline">
            <Link to={`/courses/${courseId}`}>Back to Course</Link>
          </Button>
        </div>
      </Layout>
    );
  }
  
  const isPastDue = new Date() > new Date(assignment.dueDate);
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link to={`/courses/${courseId}`}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Course
            </Link>
          </Button>
          
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">{assignment.title}</h1>
              <p className="text-muted-foreground">
                {assignment.course.courseCode} - {assignment.course.title}
              </p>
            </div>
            
            {isPastDue && !assignment.submission && (
              <Badge variant="destructive" className="w-fit">Due Date Passed</Badge>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Assignment Description</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p>{assignment.description}</p>
                </div>
              </CardContent>
            </Card>
            
            {!assignment.submission && (
              <Card>
                <CardHeader>
                  <CardTitle>Submit Your Work</CardTitle>
                  <CardDescription>
                    Upload your completed assignment files
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="files">Assignment Files</Label>
                        <div className="mt-2 border-2 border-dashed rounded-lg p-6 text-center">
                          <Input
                            id="files"
                            type="file"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <label 
                            htmlFor="files" 
                            className="flex flex-col items-center cursor-pointer"
                          >
                            <Upload className="h-8 w-8 mb-2 text-muted-foreground" />
                            <span className="text-sm font-medium mb-1">
                              Drag and drop your files here or click to browse
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Accepted file types: .pdf, .doc, .docx, .zip, .txt
                            </span>
                          </label>
                        </div>
                      </div>
                      
                      {files.length > 0 && (
                        <div className="mt-4 space-y-2">
                          <Label>Selected Files</Label>
                          <div className="border rounded-md divide-y">
                            {files.map((file, index) => (
                              <div key={index} className="flex items-center justify-between p-3">
                                <div className="flex items-center">
                                  <File className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <span className="text-sm">{file.name}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => removeFile(index)}
                                >
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="mt-4">
                        <Label htmlFor="comment">Comments (Optional)</Label>
                        <Input
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add any comments for your instructor"
                          className="h-24"
                        />
                      </div>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={files.length === 0 || isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                            Submitting...
                          </>
                        ) : 'Submit Assignment'}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}
            
            {assignment.submission && (
              <Card>
                <CardHeader>
                  <CardTitle>Your Submission</CardTitle>
                  <CardDescription>
                    Submitted on {new Date(assignment.submission.submissionDate).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignment.submission.attachments?.map((file: any, index: number) => (
                      <div key={index} className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <a 
                          href={file.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {file.name}
                        </a>
                      </div>
                    ))}
                    
                    {assignment.submission.content && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-sm font-medium mb-2">Comments</h3>
                          <p className="text-sm">{assignment.submission.content}</p>
                        </div>
                      </>
                    )}
                    
                    {assignment.submission.grade && (
                      <>
                        <Separator />
                        <div>
                          <h3 className="text-sm font-medium mb-2">Grade</h3>
                          <div className="flex items-center">
                            <span className="text-lg font-bold">
                              {assignment.submission.grade.points} / {assignment.pointsPossible}
                            </span>
                            <span className="ml-2 text-sm text-muted-foreground">
                              ({Math.round((assignment.submission.grade.points / assignment.pointsPossible) * 100)}%)
                            </span>
                          </div>
                          
                          {assignment.submission.grade.feedback && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium">Instructor Feedback</h4>
                              <p className="text-sm mt-1">{assignment.submission.grade.feedback}</p>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t">
                  <Button variant="outline" className="w-full">Resubmit Assignment</Button>
                </CardFooter>
              </Card>
            )}
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Assignment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Due Date</h3>
                    <div className="flex items-center mt-1 gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center mt-1 gap-1">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {new Date(assignment.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Points</h3>
                    <div className="flex items-center mt-1 gap-1">
                      <AlertCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{assignment.pointsPossible} points possible</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Submission Type</h3>
                    <div className="flex items-center mt-1 gap-1">
                      <Upload className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{assignment.submissionType} upload</span>
                    </div>
                  </div>
                  
                  {assignment.submission && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Submission Status</h3>
                      <div className="mt-1">
                        <Badge variant="secondary" className="capitalize">
                          {assignment.submission.status}
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssignmentPage;
