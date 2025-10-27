import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Search, Download, ArrowRightLeft } from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  role: string;
  site: string;
  skills: string[];
  status: 'active' | 'inactive' | 'on-leave';
  phone: string;
  email: string;
  joinDate: string;
  experience: number;
}

const mockWorkers: Worker[] = [
  {
    id: '1',
    name: 'James Mitchell',
    role: 'Site Foreman',
    site: 'Highway A1 Construction',
    skills: ['Heavy Equipment', 'Safety Management', 'Team Leadership'],
    status: 'active',
    phone: '+1-555-0123',
    email: 'james.mitchell@company.com',
    joinDate: '2023-01-15',
    experience: 8
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    role: 'Equipment Operator',
    site: 'Bridge B2 Project',
    skills: ['Excavator Operation', 'Crane Operation', 'Safety Protocols'],
    status: 'active',
    phone: '+1-555-0124',
    email: 'maria.rodriguez@company.com',
    joinDate: '2023-03-10',
    experience: 5
  },
  {
    id: '3',
    name: 'Robert Chen',
    role: 'Civil Engineer',
    site: 'Road R3 Upgrade',
    skills: ['AutoCAD', 'Project Planning', 'Quality Control'],
    status: 'active',
    phone: '+1-555-0125',
    email: 'robert.chen@company.com',
    joinDate: '2022-11-20',
    experience: 12
  },
  {
    id: '4',
    name: 'Sarah Thompson',
    role: 'Safety Inspector',
    site: 'Highway A1 Construction',
    skills: ['OSHA Compliance', 'Risk Assessment', 'Documentation'],
    status: 'on-leave',
    phone: '+1-555-0126',
    email: 'sarah.thompson@company.com',
    joinDate: '2023-05-05',
    experience: 7
  }
];

export function WorkersManager() {
  const [workers, setWorkers] = useState<Worker[]>(mockWorkers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         worker.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSite = selectedSite === 'all' || worker.site === selectedSite;
    return matchesSearch && matchesSite;
  });

  const getStatusBadgeVariant = (status: Worker['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'inactive':
        return 'secondary';
      case 'on-leave':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const sites = Array.from(new Set(workers.map(worker => worker.site)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Workers Management</h1>
          <p className="text-muted-foreground">
            Manage workers, assign to sites, and track their details
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export List
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Worker
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Worker</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="workerName">Full Name</Label>
                    <Input id="workerName" placeholder="Enter full name" />
                  </div>
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="foreman">Site Foreman</SelectItem>
                        <SelectItem value="operator">Equipment Operator</SelectItem>
                        <SelectItem value="engineer">Civil Engineer</SelectItem>
                        <SelectItem value="inspector">Safety Inspector</SelectItem>
                        <SelectItem value="laborer">General Laborer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="assignedSite">Assigned Site</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select site" />
                    </SelectTrigger>
                    <SelectContent>
                      {sites.map(site => (
                        <SelectItem key={site} value={site}>{site}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input id="phone" placeholder="+1-555-0000" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="worker@company.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="skills">Skills (comma separated)</Label>
                  <Input id="skills" placeholder="Heavy Equipment, Safety Management" />
                </div>
                <Button className="w-full">Add Worker</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedSite} onValueChange={setSelectedSite}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by site" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sites</SelectItem>
                {sites.map(site => (
                  <SelectItem key={site} value={site}>{site}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Workers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Workers List ({filteredWorkers.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Skills</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredWorkers.map((worker) => (
                <TableRow key={worker.id}>
                  <TableCell>
                    <div>
                      <p>{worker.name}</p>
                      <p className="text-sm text-muted-foreground">{worker.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{worker.role}</TableCell>
                  <TableCell>{worker.site}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {worker.skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {worker.skills.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{worker.skills.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(worker.status)}>
                      {worker.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{worker.experience} years</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedWorker(worker);
                        setIsTransferDialogOpen(true);
                      }}
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transfer Worker Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Worker</DialogTitle>
          </DialogHeader>
          {selectedWorker && (
            <div className="space-y-4">
              <div>
                <Label>Worker</Label>
                <p>{selectedWorker.name} - {selectedWorker.role}</p>
              </div>
              <div>
                <Label>Current Site</Label>
                <p>{selectedWorker.site}</p>
              </div>
              <div>
                <Label htmlFor="newSite">Transfer to Site</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.filter(site => site !== selectedWorker.site).map(site => (
                      <SelectItem key={site} value={site}>{site}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="transferDate">Transfer Date</Label>
                <Input id="transferDate" type="date" />
              </div>
              <Button className="w-full">Confirm Transfer</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}