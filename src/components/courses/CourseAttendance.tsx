
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Save } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';

interface CourseAttendanceProps {
  courseId: string;
  students: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
}

// Mock fetch function (replace with actual API call)
const fetchAttendanceRecords = async (courseId: string) => {
  // This would be an API call in a real app
  return [
    {
      _id: '1',
      date: '2024-09-05T00:00:00Z',
      records: [
        { student: '1', status: 'present' }
      ]
    },
    {
      _id: '2',
      date: '2024-09-07T00:00:00Z',
      records: [
        { student: '1', status: 'absent' }
      ]
    }
  ];
};

const CourseAttendance: React.FC<CourseAttendanceProps> = ({ courseId, students }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [attendanceData, setAttendanceData] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  
  const { data: attendanceRecords, isLoading } = useQuery({
    queryKey: ['attendance', courseId],
    queryFn: () => fetchAttendanceRecords(courseId),
    enabled: !!courseId,
  });
  
  const handleSaveAttendance = () => {
    console.log('Saving attendance for', date, attendanceData);
    // This would be an API call in a real app
    setIsEditMode(false);
  };
  
  const handleStatusChange = (studentId: string, status: string) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: status
    }));
  };
  
  const getAttendanceForDate = () => {
    if (!date || !attendanceRecords) return {};
    
    const dateString = format(date, 'yyyy-MM-dd');
    const record = attendanceRecords.find(record => {
      const recordDate = new Date(record.date);
      return format(recordDate, 'yyyy-MM-dd') === dateString;
    });
    
    if (!record) return {};
    
    const result: Record<string, string> = {};
    record.records.forEach(entry => {
      result[entry.student] = entry.status;
    });
    
    return result;
  };
  
  // Initialize attendance data when date changes
  React.useEffect(() => {
    if (date) {
      const existingData = getAttendanceForDate();
      setAttendanceData(existingData);
      setIsEditMode(Object.keys(existingData).length === 0);
    }
  }, [date, attendanceRecords]);
  
  const statusOptions = [
    { value: 'present', label: 'Present' },
    { value: 'absent', label: 'Absent' },
    { value: 'late', label: 'Late' },
    { value: 'excused', label: 'Excused' }
  ];
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'excused':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (date) {
                  const prev = new Date(date);
                  prev.setDate(prev.getDate() - 1);
                  setDate(prev);
                }
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                if (date) {
                  const next = new Date(date);
                  next.setDate(next.getDate() + 1);
                  setDate(next);
                }
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="flex gap-2">
          {isEditMode ? (
            <Button variant="default" onClick={handleSaveAttendance}>
              <Save className="mr-2 h-4 w-4" />
              Save Attendance
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditMode(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Take Attendance
            </Button>
          )}
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Attendance Record</CardTitle>
          <CardDescription>
            {date ? format(date, "EEEE, MMMM d, yyyy") : "Select a date to view or record attendance"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {students.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No students enrolled in this course</p>
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">
                        {student.firstName} {student.lastName}
                      </TableCell>
                      <TableCell>
                        {isEditMode ? (
                          <Select
                            value={attendanceData[student._id] || 'absent'}
                            onValueChange={(value) => handleStatusChange(student._id, value)}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <span className={cn(
                            "px-2 py-1 rounded-full text-xs font-medium",
                            getStatusColor(attendanceData[student._id] || 'absent')
                          )}>
                            {attendanceData[student._id] ? 
                              statusOptions.find(o => o.value === attendanceData[student._id])?.label : 
                              'Not Recorded'}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {isEditMode ? (
                          <Input placeholder="Optional notes" className="w-full" />
                        ) : (
                          <span className="text-muted-foreground text-sm">No notes</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseAttendance;
