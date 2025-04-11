
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import Layout from '@/components/layout/Layout';
import { UserCircle, Mail, Building, BookOpen, Shield, Pencil } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    department: user?.department || '',
    bio: 'I am a passionate learner interested in technology and innovation.',
    phone: '(555) 123-4567',
    address: '123 Campus Drive, University City',
  });
  
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleDepartmentChange = (value: string) => {
    setProfileData((prev) => ({ ...prev, department: value }));
  };
  
  const handleSaveProfile = () => {
    // In a real app, this would send an API request to update the profile
    toast({
      title: "Profile Updated",
      description: "Your profile has been successfully updated.",
    });
    setIsEditing(false);
  };
  
  // Mock data for demo purposes
  const departments = [
    { id: 'cs', name: 'Computer Science' },
    { id: 'eng', name: 'Engineering' },
    { id: 'math', name: 'Mathematics' },
    { id: 'bio', name: 'Biology' },
    { id: 'phys', name: 'Physics' },
    { id: 'chem', name: 'Chemistry' },
    { id: 'hist', name: 'History' },
    { id: 'eng', name: 'English' },
    { id: 'art', name: 'Art & Design' },
  ];
  
  const mockCourses = [
    { id: 'cs101', name: 'Introduction to Programming', code: 'CS101' },
    { id: 'cs201', name: 'Data Structures and Algorithms', code: 'CS201' },
    { id: 'math150', name: 'Calculus I', code: 'MATH150' },
  ];
  
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">My Profile</h1>
            <p className="text-gray-600">Manage your personal information and preferences</p>
          </div>
          <Button 
            variant={isEditing ? "default" : "outline"} 
            className="mt-4 md:mt-0"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <span>Cancel Editing</span>
            ) : (
              <>
                <Pencil className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
              </>
            )}
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <UserCircle className="h-24 w-24 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold">{user?.firstName} {user?.lastName}</h2>
                <p className="text-gray-600 capitalize">{user?.role}</p>
                <p className="text-sm text-gray-500 mt-1">ID: {user?.id}</p>
                
                <Separator className="my-4" />
                
                <div className="w-full text-left space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">{user?.email}</span>
                  </div>
                  {user?.department && (
                    <div className="flex items-center text-sm">
                      <Building className="mr-2 h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        {departments.find(d => d.id === user.department)?.name || user.department}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <BookOpen className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      {user?.role === 'student' ? '3 Enrolled Courses' : '2 Teaching Courses'}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Shield className="mr-2 h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      Role: <span className="capitalize">{user?.role}</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  <a href="#" className="px-6 py-3 text-sm hover:bg-gray-50 border-l-2 border-primary">
                    Profile Information
                  </a>
                  <a href="#" className="px-6 py-3 text-sm hover:bg-gray-50 border-l-2 border-transparent">
                    Password & Security
                  </a>
                  <a href="#" className="px-6 py-3 text-sm hover:bg-gray-50 border-l-2 border-transparent">
                    Notification Settings
                  </a>
                  <a href="#" className="px-6 py-3 text-sm hover:bg-gray-50 border-l-2 border-transparent">
                    Privacy Settings
                  </a>
                </nav>
              </CardContent>
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="space-y-8">
            <Tabs defaultValue="general">
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="preferences">Preferences</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Manage your personal details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={profileData.firstName}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={profileData.lastName}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={profileData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Select
                        value={profileData.department}
                        onValueChange={handleDepartmentChange}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={profileData.address}
                        onChange={handleChange}
                        disabled={!isEditing}
                      />
                    </div>
                  </CardContent>
                  {isEditing && (
                    <CardFooter>
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </CardFooter>
                  )}
                </Card>
              </TabsContent>
              
              <TabsContent value="academic">
                <Card>
                  <CardHeader>
                    <CardTitle>Academic Information</CardTitle>
                    <CardDescription>
                      View your academic details and enrolled courses
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">
                        {user?.role === 'student' ? 'Enrolled Courses' : 'Teaching Courses'}
                      </h3>
                      <div className="space-y-3">
                        {mockCourses.map(course => (
                          <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                            <div>
                              <h4 className="font-medium">{course.name}</h4>
                              <p className="text-sm text-gray-600">{course.code}</p>
                            </div>
                            <Button variant="ghost" size="sm">View Details</Button>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {user?.role === 'student' && (
                      <div>
                        <h3 className="text-lg font-medium mb-4">Academic Standing</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-600">GPA</p>
                            <p className="text-xl font-bold mt-1">3.75</p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-600">Credits Completed</p>
                            <p className="text-xl font-bold mt-1">64</p>
                          </div>
                          <div className="border rounded-lg p-4">
                            <p className="text-sm text-gray-600">Standing</p>
                            <p className="text-xl font-bold mt-1">Good</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences">
                <Card>
                  <CardHeader>
                    <CardTitle>System Preferences</CardTitle>
                    <CardDescription>
                      Customize your Campus Bridge experience
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-gray-600">Receive course updates via email</p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="email-notifications"
                              className="h-4 w-4 text-primary border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Assignment Reminders</p>
                            <p className="text-sm text-gray-600">Get reminders before assignments are due</p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="assignment-reminders"
                              className="h-4 w-4 text-primary border-gray-300 rounded"
                              defaultChecked
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">System Updates</p>
                            <p className="text-sm text-gray-600">Receive alerts about system maintenance</p>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              id="system-updates"
                              className="h-4 w-4 text-primary border-gray-300 rounded"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-medium mb-4">Accessibility Settings</h3>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="font-size">Font Size</Label>
                          <Select defaultValue="medium">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="small">Small</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="contrast">Contrast Mode</Label>
                          <Select defaultValue="normal">
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="normal">Normal</SelectItem>
                              <SelectItem value="high">High Contrast</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button>Save Preferences</Button>
                  </CardFooter>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
