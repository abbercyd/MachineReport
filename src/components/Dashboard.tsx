import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockStats = {
  totalSites: 8,
  activeSites: 6,
  totalWorkers: 156,
  activeWorkers: 134,
  totalMachines: 45,
  activeMachines: 38,
  pendingRequests: 12
};

const progressData = [
  { site: 'Highway A1', progress: 75 },
  { site: 'Bridge B2', progress: 45 },
  { site: 'Road R3', progress: 90 },
  { site: 'Tunnel T4', progress: 30 },
];

const chartData = [
  { month: 'Jan', completed: 2, ongoing: 4 },
  { month: 'Feb', completed: 3, ongoing: 5 },
  { month: 'Mar', completed: 1, ongoing: 6 },
  { month: 'Apr', completed: 4, ongoing: 4 },
  { month: 'May', completed: 2, ongoing: 6 },
  { month: 'Jun', completed: 3, ongoing: 5 },
];

export function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">
          Construction company overview and key metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Total Sites</CardTitle>
            <Badge variant="secondary">{mockStats.activeSites} Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{mockStats.totalSites}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Workers</CardTitle>
            <Badge variant="secondary">{mockStats.activeWorkers} Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{mockStats.totalWorkers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Machines</CardTitle>
            <Badge variant="secondary">{mockStats.activeMachines} Active</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{mockStats.totalMachines}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Pending Requests</CardTitle>
            <Badge variant="destructive">Urgent</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{mockStats.pendingRequests}</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressData.map((project) => (
              <div key={project.site} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">{project.site}</span>
                  <span className="text-sm">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="completed" fill="hsl(var(--chart-1))" />
                <Bar dataKey="ongoing" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="text-sm">Material request submitted for Highway A1</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
              <Badge>Pending</Badge>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="text-sm">Excavator #3 transferred to Bridge B2</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
              <Badge variant="secondary">Completed</Badge>
            </div>
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="text-sm">Progress report updated for Road R3</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
              <Badge variant="secondary">Completed</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}