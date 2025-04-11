
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCog, School, Calendar, Settings, Users, BookOpen, FileText, AlertTriangle } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Users className="h-8 w-8 text-primary mb-4" />
            <CardTitle className="text-xl mb-2">Users</CardTitle>
            <CardDescription className="text-center mb-4">
              Manage all system users
            </CardDescription>
            <Button variant="outline" className="w-full">Manage Users</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <BookOpen className="h-8 w-8 text-primary mb-4" />
            <CardTitle className="text-xl mb-2">Courses</CardTitle>
            <CardDescription className="text-center mb-4">
              Manage all courses
            </CardDescription>
            <Button variant="outline" className="w-full">Manage Courses</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <School className="h-8 w-8 text-primary mb-4" />
            <CardTitle className="text-xl mb-2">Departments</CardTitle>
            <CardDescription className="text-center mb-4">
              Department administration
            </CardDescription>
            <Button variant="outline" className="w-full">Manage Departments</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Settings className="h-8 w-8 text-primary mb-4" />
            <CardTitle className="text-xl mb-2">System</CardTitle>
            <CardDescription className="text-center mb-4">
              System settings and configuration
            </CardDescription>
            <Button variant="outline" className="w-full">System Settings</Button>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="stats">
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="stats">System Stats</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="stats" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Statistics</CardTitle>
              <CardDescription>Overview of system usage and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="text-3xl font-bold text-primary mb-2">1,245</h3>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="text-3xl font-bold text-primary mb-2">87</h3>
                  <p className="text-sm text-muted-foreground">Active Courses</p>
                </div>
                <div className="border rounded-lg p-4 text-center">
                  <h3 className="text-3xl font-bold text-primary mb-2">92%</h3>
                  <p className="text-sm text-muted-foreground">System Uptime</p>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-4">Recent Activity</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex justify-between items-center border-b pb-4">
                      <div>
                        <h4 className="font-medium">New user registration</h4>
                        <p className="text-sm text-muted-foreground">Jane Doe (Faculty)</p>
                      </div>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Reports</CardTitle>
              <CardDescription>Generated reports and analytics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex justify-between items-center border-b pb-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">Enrollment Report - Spring 2024</h4>
                        <p className="text-sm text-muted-foreground">Generated on Mar 15, 2024</p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">Download</Button>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-end">
                <Button>Generate New Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alerts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Warnings and notifications requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800">Database Backup Warning</h4>
                    <p className="text-sm text-amber-700 mt-1">
                      Automatic database backup failed last night. Please check the backup configuration.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">Resolve</Button>
                      <Button size="sm" variant="ghost">Dismiss</Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-red-800">Storage Space Critical</h4>
                    <p className="text-sm text-red-700 mt-1">
                      The file storage is at 95% capacity. Consider increasing storage or removing unused files.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">Resolve</Button>
                      <Button size="sm" variant="ghost">Dismiss</Button>
                    </div>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-4">
                  <AlertTriangle className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-800">System Update Available</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Version 2.4.5 is available for installation. Contains security fixes and new features.
                    </p>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">Update Now</Button>
                      <Button size="sm" variant="ghost">Remind Later</Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
