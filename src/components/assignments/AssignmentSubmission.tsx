
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, FileUp, Loader2, Upload, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AssignmentSubmissionProps {
  assignment: {
    _id: string;
    title: string;
    description: string;
    dueDate: string;
    pointsPossible: number;
    submissionType: 'file' | 'text' | 'link' | 'multiple';
  };
  submission?: {
    _id: string;
    content?: string;
    attachments?: Array<{ name: string; url: string }>;
    submissionDate: string;
    isLate: boolean;
    status: string;
    grade?: {
      points: number;
      feedback: string;
      gradedAt: string;
    };
  };
  onSubmit: (data: any) => Promise<void>;
}

const AssignmentSubmission: React.FC<AssignmentSubmissionProps> = ({ 
  assignment, 
  submission,
  onSubmit 
}) => {
  const [content, setContent] = useState(submission?.content || '');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const isPastDue = new Date(assignment.dueDate) < new Date();
  const isGraded = submission?.status === 'graded';
  
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
    }
  };
  
  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((assignment.submissionType === 'text' || assignment.submissionType === 'link') && !content) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please provide content for your submission.",
      });
      return;
    }
    
    if (assignment.submissionType === 'file' && files.length === 0 && !submission) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please upload at least one file.",
      });
      return;
    }
    
    setUploading(true);
    
    try {
      // In a real app, this would upload files to a server and get URLs back
      const uploadedFiles = files.map(file => ({
        name: file.name,
        url: URL.createObjectURL(file) // This is just for demo purposes
      }));
      
      const submissionData = {
        assignment: assignment._id,
        content,
        attachments: uploadedFiles,
        isLate: isPastDue
      };
      
      await onSubmit(submissionData);
      
      toast({
        title: "Submission Successful",
        description: "Your assignment has been submitted.",
      });
    } catch (error) {
      console.error('Submission error:', error);
      toast({
        variant: "destructive",
        title: "Submission Failed",
        description: "There was an error submitting your assignment. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };
  
  const renderSubmissionForm = () => {
    switch (assignment.submissionType) {
      case 'text':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Your Answer</Label>
              <Textarea
                id="content"
                value={content}
                onChange={handleContentChange}
                placeholder="Type your answer here..."
                className="min-h-[200px]"
                disabled={uploading || isGraded}
              />
            </div>
          </div>
        );
        
      case 'link':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Resource URL</Label>
              <Input
                id="content"
                type="url"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="https://..."
                disabled={uploading || isGraded}
              />
            </div>
          </div>
        );
        
      case 'file':
      case 'multiple':
      default:
        return (
          <div className="space-y-4">
            {assignment.submissionType === 'multiple' && (
              <div className="space-y-2">
                <Label htmlFor="content">Comments (Optional)</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={handleContentChange}
                  placeholder="Add any comments about your submission..."
                  className="min-h-[100px]"
                  disabled={uploading || isGraded}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="files">Upload Files</Label>
              
              {!isGraded && (
                <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center">
                  <FileUp className="h-10 w-10 text-muted-foreground mb-2" />
                  <p className="text-sm text-center text-muted-foreground mb-2">
                    Drag and drop your files here or click to browse
                  </p>
                  <Input 
                    id="files" 
                    type="file" 
                    multiple 
                    className="hidden" 
                    onChange={handleFileChange}
                    disabled={uploading}
                  />
                  <Label htmlFor="files" className="cursor-pointer">
                    <Button type="button" variant="outline" disabled={uploading}>
                      <Upload className="mr-2 h-4 w-4" />
                      Select Files
                    </Button>
                  </Label>
                </div>
              )}
              
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Selected Files:</p>
                  <ul className="space-y-2">
                    {files.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-muted rounded-md p-2">
                        <span className="text-sm truncate">{file.name}</span>
                        {!isGraded && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            disabled={uploading}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {submission?.attachments && submission.attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Submitted Files:</p>
                  <ul className="space-y-2">
                    {submission.attachments.map((file, index) => (
                      <li key={index} className="flex items-center justify-between bg-muted rounded-md p-2">
                        <span className="text-sm truncate">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          asChild
                        >
                          <a href={file.url} target="_blank" rel="noopener noreferrer">
                            View
                          </a>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
    }
  };
  
  const renderGradeInfo = () => {
    if (!submission?.grade) return null;
    
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Grading</CardTitle>
          <CardDescription>
            Graded on {new Date(submission.grade.gradedAt).toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="font-medium">Score</p>
                <p className="text-lg font-bold">
                  {submission.grade.points} / {assignment.pointsPossible}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${(submission.grade.points / assignment.pointsPossible) * 100}%` }}
                ></div>
              </div>
            </div>
            
            {submission.grade.feedback && (
              <div>
                <p className="font-medium mb-2">Feedback</p>
                <div className="bg-muted p-3 rounded-md">
                  <p className="text-sm">{submission.grade.feedback}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Submit: {assignment.title}</CardTitle>
              <CardDescription className="mt-2 flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Due: {new Date(assignment.dueDate).toLocaleString()}
                {isPastDue && !submission && (
                  <span className="ml-2 text-red-500 font-semibold">Past Due</span>
                )}
                {submission && (
                  <span className={`ml-2 font-semibold ${submission.isLate ? 'text-amber-500' : 'text-green-500'}`}>
                    {submission.isLate ? 'Submitted Late' : 'Submitted On Time'}
                  </span>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <form onSubmit={handleSubmit}>
          <CardContent>
            {renderSubmissionForm()}
          </CardContent>
          
          <CardFooter className="flex justify-between border-t pt-6">
            <div className="text-sm text-muted-foreground">
              <p>Points Possible: {assignment.pointsPossible}</p>
              {submission && (
                <p className="mt-1">
                  Submitted: {new Date(submission.submissionDate).toLocaleString()}
                </p>
              )}
            </div>
            
            {(!isGraded || (isGraded && user?.role !== 'student')) && (
              <Button type="submit" disabled={uploading}>
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                    {submission ? 'Resubmitting...' : 'Submitting...'}
                  </>
                ) : (
                  submission ? 'Resubmit Assignment' : 'Submit Assignment'
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
      
      {renderGradeInfo()}
    </div>
  );
};

export default AssignmentSubmission;
