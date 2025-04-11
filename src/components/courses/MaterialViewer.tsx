
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, ExternalLink, File, FileText, Video } from 'lucide-react';

interface MaterialViewerProps {
  material: {
    _id: string;
    title: string;
    description: string;
    type: string;
    content: string;
    createdAt: string;
  };
  onBack: () => void;
}

const MaterialViewer: React.FC<MaterialViewerProps> = ({ material, onBack }) => {
  const [loading, setLoading] = useState(false);
  
  const renderContent = () => {
    switch (material.type) {
      case 'video':
        return (
          <div className="aspect-video rounded-lg overflow-hidden bg-black">
            <iframe 
              src={material.content}
              className="w-full h-full"
              title={material.title}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>
        );
        
      case 'pdf':
        return (
          <div className="aspect-[4/3] rounded-lg overflow-hidden border bg-white">
            <iframe 
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(material.content)}&embedded=true`}
              className="w-full h-full"
              title={material.title}
            ></iframe>
          </div>
        );
        
      case 'document':
        // For documents that aren't PDFs
        return (
          <div className="p-8 flex flex-col items-center justify-center">
            <FileText className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-center text-muted-foreground mb-6">
              This document can be viewed externally or downloaded
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <a href={material.content} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={material.content} download>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            </div>
          </div>
        );
        
      case 'image':
        return (
          <div className="flex justify-center">
            <img 
              src={material.content} 
              alt={material.title} 
              className="max-w-full max-h-[60vh] object-contain rounded-lg"
            />
          </div>
        );
        
      case 'link':
        return (
          <div className="p-8 flex flex-col items-center justify-center">
            <ExternalLink className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-center text-muted-foreground mb-6">
              This content is hosted externally
            </p>
            <Button asChild>
              <a href={material.content} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Visit External Resource
              </a>
            </Button>
          </div>
        );
        
      default:
        return (
          <div className="p-8 flex flex-col items-center justify-center">
            <File className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-center text-muted-foreground mb-6">
              This file type is not directly viewable
            </p>
            <Button asChild variant="outline">
              <a href={material.content} download>
                <Download className="mr-2 h-4 w-4" />
                Download File
              </a>
            </Button>
          </div>
        );
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">{material.title}</CardTitle>
            <CardDescription className="mt-2">
              Added on {new Date(material.createdAt).toLocaleDateString()}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={onBack}>
            Back to Materials
          </Button>
        </div>
      </CardHeader>
      
      <Tabs defaultValue="content" className="w-full">
        <div className="px-6">
          <TabsList className="w-full md:w-[400px]">
            <TabsTrigger value="content" className="flex-1">Content</TabsTrigger>
            <TabsTrigger value="description" className="flex-1">Description</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="content" className="px-6 py-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            renderContent()
          )}
        </TabsContent>
        
        <TabsContent value="description" className="px-6 py-4">
          <div className="prose max-w-none">
            <p>{material.description}</p>
          </div>
        </TabsContent>
      </Tabs>
      
      <CardFooter className="flex justify-between border-t p-6">
        <div className="text-sm text-muted-foreground">
          Type: <span className="capitalize">{material.type}</span>
        </div>
        
        {(material.type === 'document' || material.type === 'pdf' || material.type === 'image') && (
          <Button asChild variant="outline" size="sm">
            <a href={material.content} download>
              <Download className="mr-2 h-4 w-4" />
              Download
            </a>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MaterialViewer;
