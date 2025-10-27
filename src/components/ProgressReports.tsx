import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, Circle, AlertCircle, Clock } from 'lucide-react';

interface DrainageTask {
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'delayed';
  progress: number;
  startDate: string;
  endDate: string;
}

interface EarthMovingTask {
  name: string;
  status: 'completed' | 'in-progress' | 'pending' | 'delayed';
  progress: number;
  startDate: string;
  endDate: string;
}

interface SiteProgress {
  id: string;
  name: string;
  overallProgress: number;
  drainage: DrainageTask[];
  earthMoving: EarthMovingTask[];
  lastUpdated: string;
}

const mockSiteProgress: SiteProgress[] = [
  {
    id: '1',
    name: 'Highway A1 Construction',
    overallProgress: 75,
    lastUpdated: '2024-10-03',
    drainage: [
      { name: 'Excavation', status: 'completed', progress: 100, startDate: '2024-01-15', endDate: '2024-02-15' },
      { name: 'Blinding', status: 'completed', progress: 100, startDate: '2024-02-16', endDate: '2024-03-01' },
      { name: 'Wall Installation', status: 'completed', progress: 100, startDate: '2024-03-02', endDate: '2024-04-15' },
      { name: 'Base', status: 'in-progress', progress: 80, startDate: '2024-04-16', endDate: '2024-05-30' },
      { name: 'Walkway', status: 'pending', progress: 0, startDate: '2024-06-01', endDate: '2024-06-30' }
    ],
    earthMoving: [
      { name: 'Clearance', status: 'completed', progress: 100, startDate: '2024-01-15', endDate: '2024-02-01' },
      { name: 'Cut and Fill', status: 'completed', progress: 100, startDate: '2024-02-02', endDate: '2024-03-15' },
      { name: 'Sub Base', status: 'completed', progress: 100, startDate: '2024-03-16', endDate: '2024-04-30' },
      { name: 'Base', status: 'in-progress', progress: 70, startDate: '2024-05-01', endDate: '2024-06-15' },
      { name: 'Final', status: 'pending', progress: 0, startDate: '2024-06-16', endDate: '2024-07-15' },
      { name: 'MC1', status: 'pending', progress: 0, startDate: '2024-07-16', endDate: '2024-08-01' },
      { name: 'Asphalt', status: 'pending', progress: 0, startDate: '2024-08-02', endDate: '2024-08-20' },
      { name: 'Kerbs', status: 'pending', progress: 0, startDate: '2024-08-21', endDate: '2024-08-30' }
    ]
  },
  {
    id: '2',
    name: 'Bridge B2 Project',
    overallProgress: 45,
    lastUpdated: '2024-10-02',
    drainage: [
      { name: 'Excavation', status: 'completed', progress: 100, startDate: '2024-03-01', endDate: '2024-03-20' },
      { name: 'Blinding', status: 'completed', progress: 100, startDate: '2024-03-21', endDate: '2024-04-05' },
      { name: 'Wall Installation', status: 'in-progress', progress: 60, startDate: '2024-04-06', endDate: '2024-05-30' },
      { name: 'Base', status: 'pending', progress: 0, startDate: '2024-06-01', endDate: '2024-07-15' },
      { name: 'Walkway', status: 'pending', progress: 0, startDate: '2024-07-16', endDate: '2024-08-15' }
    ],
    earthMoving: [
      { name: 'Clearance', status: 'completed', progress: 100, startDate: '2024-03-01', endDate: '2024-03-10' },
      { name: 'Cut and Fill', status: 'in-progress', progress: 40, startDate: '2024-03-11', endDate: '2024-05-15' },
      { name: 'Sub Base', status: 'pending', progress: 0, startDate: '2024-05-16', endDate: '2024-06-30' },
      { name: 'Base', status: 'pending', progress: 0, startDate: '2024-07-01', endDate: '2024-08-15' },
      { name: 'Final', status: 'pending', progress: 0, startDate: '2024-08-16', endDate: '2024-09-15' },
      { name: 'MC1', status: 'pending', progress: 0, startDate: '2024-09-16', endDate: '2024-10-01' },
      { name: 'Asphalt', status: 'pending', progress: 0, startDate: '2024-10-02', endDate: '2024-10-10' },
      { name: 'Kerbs', status: 'pending', progress: 0, startDate: '2024-10-11', endDate: '2024-10-15' }
    ]
  }
];

const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))'];

export function ProgressReports() {
  const [selectedSite, setSelectedSite] = useState(mockSiteProgress[0].id);
  const [activeTab, setActiveTab] = useState('drainage');

  const currentSite = mockSiteProgress.find(site => site.id === selectedSite)!;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'delayed':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'in-progress':
        return 'secondary';
      case 'delayed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getAllTasks = (site: SiteProgress) => [...site.drainage, ...site.earthMoving];
  
  const getTaskStatusData = (site: SiteProgress) => {
    const tasks = getAllTasks(site);
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
      value: count
    }));
  };

  const getPhaseProgressData = (site: SiteProgress) => [
    {
      phase: 'Drainage',
      progress: Math.round(site.drainage.reduce((sum, task) => sum + task.progress, 0) / site.drainage.length)
    },
    {
      phase: 'Earth Moving',
      progress: Math.round(site.earthMoving.reduce((sum, task) => sum + task.progress, 0) / site.earthMoving.length)
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Progress Reports</h1>
          <p className="text-muted-foreground">
            Track road construction progress across drainage and earth moving phases
          </p>
        </div>
        <Select value={selectedSite} onValueChange={setSelectedSite}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Select site" />
          </SelectTrigger>
          <SelectContent>
            {mockSiteProgress.map(site => (
              <SelectItem key={site.id} value={site.id}>{site.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Site Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {currentSite.name}
            <Badge variant="secondary">Last updated: {currentSite.lastUpdated}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span>{currentSite.overallProgress}%</span>
              </div>
              <Progress value={currentSite.overallProgress} className="h-3" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium mb-3">Phase Progress</h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <BarChart data={getPhaseProgressData(currentSite)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="phase" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="progress" fill="hsl(var(--chart-1))" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="text-sm font-medium mb-3">Task Status Distribution</h4>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={getTaskStatusData(currentSite)}
                        cx="50%"
                        cy="50%"
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {getTaskStatusData(currentSite).map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Progress */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="drainage">Drainage Works</TabsTrigger>
          <TabsTrigger value="earth-moving">Earth Moving</TabsTrigger>
        </TabsList>

        <TabsContent value="drainage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Drainage Works Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentSite.drainage.map((task, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <h4 className="font-medium">{task.name}</h4>
                      </div>
                      <Badge variant={getStatusBadgeVariant(task.status)}>
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progress: {task.progress}%</span>
                        <span>{task.startDate} - {task.endDate}</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="earth-moving" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Earth Moving Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {currentSite.earthMoving.map((task, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(task.status)}
                        <h4 className="font-medium">{task.name}</h4>
                      </div>
                      <Badge variant={getStatusBadgeVariant(task.status)}>
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Progress: {task.progress}%</span>
                        <span>{task.startDate} - {task.endDate}</span>
                      </div>
                      <Progress value={task.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline">Update Progress</Button>
            <Button variant="outline">Generate Report</Button>
            <Button variant="outline">Schedule Inspection</Button>
            <Button variant="outline">Export Data</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}