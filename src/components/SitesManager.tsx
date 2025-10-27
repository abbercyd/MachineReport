import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, MapPin, Users, Truck, Package } from 'lucide-react';

interface Site {
  id: string;
  name: string;
  location: string;
  manager: string;
  status: 'active' | 'inactive' | 'completed';
  workers: number;
  machines: number;
  progress: number;
  startDate: string;
  endDate: string;
}

const mockSites: Site[] = [
  {
    id: '1',
    name: 'Highway A1 Construction',
    location: 'North District',
    manager: 'John Smith',
    status: 'active',
    workers: 25,
    machines: 8,
    progress: 75,
    startDate: '2024-01-15',
    endDate: '2024-08-30'
  },
  {
    id: '2',
    name: 'Bridge B2 Project',
    location: 'East River',
    manager: 'Sarah Johnson',
    status: 'active',
    workers: 18,
    machines: 5,
    progress: 45,
    startDate: '2024-03-01',
    endDate: '2024-10-15'
  },
  {
    id: '3',
    name: 'Road R3 Upgrade',
    location: 'South Side',
    manager: 'Mike Wilson',
    status: 'active',
    workers: 12,
    machines: 4,
    progress: 90,
    startDate: '2024-02-10',
    endDate: '2024-06-20'
  },
  {
    id: '4',
    name: 'Tunnel T4 Boring',
    location: 'Underground',
    manager: 'Lisa Chen',
    status: 'active',
    workers: 30,
    machines: 12,
    progress: 30,
    startDate: '2024-04-01',
    endDate: '2024-12-31'
  }
];

export function SitesManager() {
  const [sites, setSites] = useState<Site[]>(mockSites);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const getStatusBadgeVariant = (status: Site['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'completed':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Sites Management</h1>
          <p className="text-muted-foreground">
            Manage construction sites, assign managers, and track progress
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Site
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Construction Site</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input id="siteName" placeholder="Enter site name" />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" placeholder="Enter location" />
              </div>
              <div>
                <Label htmlFor="manager">Site Manager</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Smith</SelectItem>
                    <SelectItem value="sarah">Sarah Johnson</SelectItem>
                    <SelectItem value="mike">Mike Wilson</SelectItem>
                    <SelectItem value="lisa">Lisa Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input id="startDate" type="date" />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input id="endDate" type="date" />
                </div>
              </div>
              <Button className="w-full">Create Site</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Sites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sites.map((site) => (
          <Card key={site.id} className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedSite(site)}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{site.name}</CardTitle>
                <Badge variant={getStatusBadgeVariant(site.status)}>
                  {site.status}
                </Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 mr-1" />
                {site.location}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Site Manager</p>
                  <p>{site.manager}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{site.workers} Workers</span>
                  </div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{site.machines} Machines</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{site.progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${site.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Site Details Dialog */}
      {selectedSite && (
        <Dialog open={!!selectedSite} onOpenChange={() => setSelectedSite(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedSite.name} - Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Location</Label>
                  <p>{selectedSite.location}</p>
                </div>
                <div>
                  <Label>Site Manager</Label>
                  <p>{selectedSite.manager}</p>
                </div>
                <div>
                  <Label>Start Date</Label>
                  <p>{selectedSite.startDate}</p>
                </div>
                <div>
                  <Label>End Date</Label>
                  <p>{selectedSite.endDate}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl">{selectedSite.workers}</p>
                    <p className="text-sm text-muted-foreground">Workers</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Truck className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl">{selectedSite.machines}</p>
                    <p className="text-sm text-muted-foreground">Machines</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <Package className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <p className="text-2xl">{selectedSite.progress}%</p>
                    <p className="text-sm text-muted-foreground">Progress</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}