
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, FileText, Link, Plus, Video } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface CourseMaterialsProps {
  courseId: string;
  isInstructor: boolean;
}

// Mock fetch function (replace with actual API call)
const fetchMaterials = async (courseId: string) => {
  // This would be an API call in a real app
  return [
    {
      _id: '1',
      title: 'Course Syllabus',
      description: 'Detailed syllabus with course objectives, policies, and schedule.',
      type: 'document',
      content: 'https://example.com/syllabus.pdf',
      createdAt: '2024-08-15T12:00:00Z',
      isPublished: true
    },
    {
      _id: '2',
      title: 'Introduction to Programming',
      description: 'Lecture slides covering programming fundamentals.',
      type: 'document',
      content: 'https://example.com/lecture1.pdf',
      createdAt: '2024-09-01T12:00:00Z',
      isPublished: true
    },
    {
      _id: '3',
      title: 'Setting Up Your Development Environment',
      description: 'Video tutorial on setting up the required software for this course.',
      type: 'video',
      content: 'https://example.com/setup-video',
      createdAt: '2024-09-02T12:00:00Z',
      isPublished: true
    },
    {
      _id: '4',
      title: 'Additional Resources',
      description: 'Links to helpful websites, tutorials, and documentation.',
      type: 'link',
      content: 'https://example.com/resources',
      createdAt: '2024-09-03T12:00:00Z',
      isPublished: true
    }
  ];
};

const getIconForType = (type: string) => {
  switch (type) {
    case 'video':
      return <Video className="h-5 w-5" />;
    case 'link':
      return <Link className="h-5 w-5" />;
    case 'document':
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const CourseMaterials: React.FC<CourseMaterialsProps> = ({ courseId, isInstructor }) => {
  const { data: materials, isLoading, error } = useQuery({
    queryKey: ['materials', courseId],
    queryFn: () => fetchMaterials(courseId),
    enabled: !!courseId,
  });
  
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
        <p className="text-red-500">Error loading course materials</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Materials</h2>
        {isInstructor && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Material
          </Button>
        )}
      </div>
      
      {(!materials || materials.length === 0) ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground mb-4">No materials available yet</p>
            {isInstructor && (
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Material
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Available Materials</CardTitle>
            <CardDescription>
              Access your course materials below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {materials.map((material, index) => (
                <React.Fragment key={material._id}>
                  {index > 0 && <Separator />}
                  <li className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 bg-muted rounded-md p-2">
                          {getIconForType(material.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{material.title}</h3>
                            <Badge variant="outline" className="capitalize">
                              {material.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {material.description}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Added on {new Date(material.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button size="sm" variant="secondary" asChild>
                        <a href={material.content} target="_blank" rel="noopener noreferrer">
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </a>
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

export default CourseMaterials;
