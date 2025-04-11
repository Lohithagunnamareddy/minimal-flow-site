
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, FileText, Users, BookCheck, LineChart, MessageSquare } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const FacultyDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BookOpen className="h-8 w-8 text-primary mb-4" />
            <CardTitle className="text-xl mb-2">My Courses</CardTitle>
            <CardDescription className="text-center mb-4">
              Manage your teaching courses
            </CardDescription>
            <Button variant="outline" className="w-full">View Courses</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Users className="h-8 w-8 text-primary mb-4" />
            <CardTitle className="text-xl mb-2">Students</CardTitle>
            <CardDescription className="text-center mb-4">
              View and manage your students
            </CardDescription>
            <Button variant="outline" className="w-full">View Students</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BookCheck className="h-8 w-8 text-primary mb-4" />
            <CardTitle className="text-xl mb-2">Grading</CardTitle>
            <CardDescription className="text-center mb-4">
              Grade assignments and exams
            </CardDescription>
            <Button variant="outline" className="w-full">Go to Grading</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <LineChart className="h-8 w-8 text-primary mb-4" />
            <CardTitle className="text-xl mb-2">Analytics</CardTitle>
            <CardDescription className="text-center mb-4">
              Course performance analytics
            </CardDescription>
            <Button variant="outline" className="w-full">View Analytics</Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="upcoming">Schedule</TabsTrigger>
          <TabsTrigger value="outstanding">Outstanding</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Schedule</CardTitle>
              <CardDescription>Your upcoming classes and office hours</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h4 className="font-medium">CS101 - Introduction to Programming</h4>
                      <p className="text-sm text-muted-foreground">Lecture Hall 204</p>
                    </div>
                    <div className="text-sm text-right">
                      <p className="font-medium">Mon, Mar 18</p>
                      <p className="text-muted-foreground">10:00 AM - 11:30 AM</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="outstanding" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Outstanding Tasks</CardTitle>
              <CardDescription>Assignments and exams to grade</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Project Proposals</h4>
                      <span className="text-xs bg-amber-100 text-amber-800 rounded-full px-2 py-1">32 Submissions</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      CS101 - Introduction to Programming
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground">Due: Mar 20</p>
                      <Button size="sm" variant="outline">Grade Now</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="messages" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
              <CardDescription>Communications from students and staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex items-start gap-4 border-b pb-4">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-gray-500" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-medium">John Smith</h4>
                        <span className="text-xs text-muted-foreground">2h ago</span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Question about the upcoming quiz format and topics covered...
                      </p>
                      <Button size="sm" variant="ghost" className="text-primary p-0 h-auto">Reply</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyDashboard;
