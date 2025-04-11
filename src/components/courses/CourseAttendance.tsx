
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from '@/components/ui/table';
import { Calendar, Check, Plus, Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';

interface CourseAttendanceProps {
  courseId: string;
  isInstructor: boolean;
  students: Array<{
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  }>;
}

// Mock data for attendance records
const MOCK_ATTENDANCE = [
  {
    _id: '1',
    date: '2024-09-15T10:00:00',
    records: [
      { student: '1', status: 'present' },
      { student: '2', status: 'absent' },
      { student: '3', status: 'late' }
    ]
  },
  {
    _id: '2',
    date: '2024-09-17T10:00:00',
    records: [
      { student: '1', status: 'present' },
      { student: '2', status: 'present' },
      { student: '3', status: 'excused' }
    ]
  }
];

const AttendanceTable: React.FC<{
  students: CourseAttendanceProps['students']; 
  date: Date;
  records: Record<string, string>;
  onStatusChange: (studentId: string, status: string) => void;
  readOnly?: boolean;
}> = ({ students, date, records, onStatusChange, readOnly = false }) => {
  return (
    <Table className="border">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Student</TableHead>
          <TableHead>Status</TableHead>
          {!readOnly && <TableHead className="w-[100px]">Actions</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {students.map(student => {
          const status = records[student._id] || 'absent';
          
          const getStatusDisplay = () => {
            switch (status) {
              case 'present':
                return <Badge variant="outline" className="bg-green-100 text-green-800">Present</Badge>;
              case 'absent':
                return <Badge variant="outline" className="bg-red-100 text-red-800">Absent</Badge>;
              case 'late':
                return <Badge variant="outline" className="bg-amber-100 text-amber-800">Late</Badge>;
              case 'excused':
                return <Badge variant="outline" className="bg-blue-100 text-blue-800">Excused</Badge>;
              default:
                return <Badge variant="outline" className="bg-gray-100">Unknown</Badge>;
            }
          };
          
          return (
            <TableRow key={student._id}>
              <TableCell className="font-medium">{student.firstName} {student.lastName}</TableCell>
              <TableCell>
                {readOnly ? (
                  getStatusDisplay()
                ) : (
                  <Select defaultValue={status} onValueChange={(value) => onStatusChange(student._id, value)}>
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="excused">Excused</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </TableCell>
              {!readOnly && (
                <TableCell>
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onStatusChange(student._id, 'present')}
                      className="w-9 p-0"
                    >
                      <Check className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onStatusChange(student._id, 'absent')}
                      className="w-9 p-0"
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

const CourseAttendance: React.FC<CourseAttendanceProps> = ({ 
  courseId, 
  isInstructor,
  students 
}) => {
  const [attendanceRecords, setAttendanceRecords] = useState(MOCK_ATTENDANCE);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [recordDate, setRecordDate] = useState<Date | undefined>(new Date());
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [newAttendanceRecords, setNewAttendanceRecords] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  // Initialize attendance records for all students
  React.useEffect(() => {
    if (isRecordDialogOpen) {
      const initialRecords: Record<string, string> = {};
      students.forEach(student => {
        initialRecords[student._id] = 'absent'; // Default to absent
      });
      setNewAttendanceRecords(initialRecords);
    }
  }, [isRecordDialogOpen, students]);
  
  const handleStatusChange = (studentId: string, status: string) => {
    setNewAttendanceRecords(prev => ({
      ...prev,
      [studentId]: status
    }));
  };
  
  const getAttendanceForDate = (date: Date) => {
    // Convert date to string format for comparison
    const dateStr = date.toISOString().split('T')[0];
    
    const record = attendanceRecords.find(record => {
      const recordDate = new Date(record.date).toISOString().split('T')[0];
      return recordDate === dateStr;
    });
    
    if (!record) return null;
    
    // Format records as a map of studentId -> status
    const formattedRecords: Record<string, string> = {};
    record.records.forEach(r => {
      formattedRecords[r.student] = r.status;
    });
    
    return {
      id: record._id,
      date: new Date(record.date),
      records: formattedRecords
    };
  };
  
  const selectedDateRecord = selectedDate ? getAttendanceForDate(selectedDate) : null;
  
  const handleSaveAttendance = () => {
    // Format new attendance record
    const newRecord = {
      _id: `new-${Date.now()}`,
      date: recordDate?.toISOString() || new Date().toISOString(),
      records: Object.entries(newAttendanceRecords).map(([student, status]) => ({
        student,
        status
      }))
    };
    
    // Add to attendance records
    setAttendanceRecords(prev => [...prev, newRecord]);
    
    // Close dialog and show toast
    setIsRecordDialogOpen(false);
    toast({
      title: "Attendance Recorded",
      description: `Attendance for ${format(recordDate || new Date(), 'PPP')} has been saved.`,
    });
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
    }
  };
  
  const filteredStudents = searchQuery 
    ? students.filter(student => {
        const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
        return fullName.includes(searchQuery.toLowerCase());
      })
    : students;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Attendance</h2>
        {isInstructor && (
          <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Record Attendance
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Record Attendance</DialogTitle>
                <DialogDescription>
                  Take attendance for the selected date. Default status is absent.
                </DialogDescription>
              </DialogHeader>
              
              <div className="py-4 space-y-4">
                <div className="flex items-center gap-4">
                  <Label htmlFor="record-date" className="min-w-32">Attendance Date:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                        <Calendar className="mr-2 h-4 w-4" />
                        {recordDate ? format(recordDate, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={recordDate}
                        onSelect={setRecordDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <AttendanceTable 
                  students={students}
                  date={recordDate || new Date()}
                  records={newAttendanceRecords}
                  onStatusChange={handleStatusChange}
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRecordDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveAttendance}>
                  Save Attendance
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Attendance Dates</CardTitle>
            <CardDescription>Select a date to view records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDateSelect}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              
              <div className="space-y-2 mt-4">
                <p className="text-sm font-medium">Recent Attendance Records:</p>
                <ul className="space-y-2">
                  {attendanceRecords.map(record => (
                    <li key={record._id}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-left"
                        onClick={() => setSelectedDate(new Date(record.date))}
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {format(new Date(record.date), 'PPP')}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {selectedDate ? (
                <>Attendance for {format(selectedDate, 'PPP')}</>
              ) : 'Attendance Records'}
            </CardTitle>
            <CardDescription>
              {selectedDateRecord 
                ? `Viewing ${students.length} students' attendance records` 
                : 'Select a date to view attendance records'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateRecord ? (
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <AttendanceTable 
                  students={filteredStudents}
                  date={selectedDateRecord.date}
                  records={selectedDateRecord.records}
                  onStatusChange={() => {}}
                  readOnly={!isInstructor}
                />
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No attendance records selected</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Select a date from the calendar to view attendance
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CourseAttendance;
