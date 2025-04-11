
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Calendar, FileText, Users } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const StudentDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BookOpen className="h-8 w-8 text-primary mb-4" />
            <CardTitle className="text-xl mb-2">Courses</CardTitle>
            <CardDescription className="text-center mb-4">
              Access your enrolled courses
            </CardDescription>
            <Button variant="outline" className="w-full">View Courses</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Calendar className="h-8 w-8 text-primary mb-4" />
            <CardTitle className="text-xl mb-2">Schedule</CardTitle>
            <CardDescription className="text-center mb-4">
              View your class schedule
            </CardDescription>
            <Button variant="outline" className="w-full">View Schedule</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <FileText className="h-8 w-8 text-primary mb-4" />
            <CardTitle className="text-xl mb-2">Assignments</CardTitle>
            <CardDescription className="text-center mb-4">
              Check upcoming assignments
            </CardDescription>
            <Button variant="outline" className="w-full">View Assignments</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Users className="h-8 w-8 text-primary mb-4" />
            <CardTitle className="text-xl mb-2">Study Groups</CardTitle>
            <CardDescription className="text-center mb-4">
              Join or create study groups
            </CardDescription>
            <Button variant="outline" className="w-full">View Groups</Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="upcoming">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="grades">Recent Grades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upcoming" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Your scheduled events for the next week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h4 className="font-medium">Assignment Deadline: Project Proposal</h4>
                      <p className="text-sm text-muted-foreground">CS101 - Introduction to Programming</p>
                    </div>
                    <div className="text-sm text-right">
                      <p className="font-medium">Fri, Mar 15</p>
                      <p className="text-muted-foreground">11:59 PM</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="announcements" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Announcements</CardTitle>
              <CardDescription>Latest updates from your courses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="border-b pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">Guest Lecture: Industry Trends</h4>
                      <span className="text-xs bg-blue-100 text-blue-800 rounded-full px-2 py-1">CS101</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      We will have a guest speaker from Tech Inc. discussing current industry trends.
                    </p>
                    <p className="text-xs text-muted-foreground">Posted 2 days ago</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="grades" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Grades</CardTitle>
              <CardDescription>Your latest assessment results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex justify-between items-center border-b pb-4">
                    <div>
                      <h4 className="font-medium">Quiz 2: Data Structures</h4>
                      <p className="text-sm text-muted-foreground">CS101 - Introduction to Programming</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-lg">85%</p>
                      <p className="text-xs text-muted-foreground">Class Avg: 78%</p>
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

export default StudentDashboard;
