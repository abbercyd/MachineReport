import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Search, Wrench, ArrowRightLeft, Calendar } from 'lucide-react';

interface Machine {
  id: string;
  name: string;
  type: string;
  model: string;
  site: string;
  status: 'active' | 'maintenance' | 'idle' | 'broken';
  operator: string;
  lastMaintenance: string;
  nextMaintenance: string;
  hoursUsed: number;
  fuelLevel: number;
}

const mockMachines: Machine[] = [
  {
    id: '1',
    name: 'Excavator CAT-001',
    type: 'Excavator',
    model: 'CAT 320D',
    site: 'Highway A1 Construction',
    status: 'active',
    operator: 'Maria Rodriguez',
    lastMaintenance: '2024-09-15',
    nextMaintenance: '2024-12-15',
    hoursUsed: 1250,
    fuelLevel: 75
  },
  {
    id: '2',
    name: 'Bulldozer KOM-002',
    type: 'Bulldozer',
    model: 'Komatsu D65',
    site: 'Bridge B2 Project',
    status: 'active',
    operator: 'James Mitchell',
    lastMaintenance: '2024-08-20',
    nextMaintenance: '2024-11-20',
    hoursUsed: 980,
    fuelLevel: 60
  },
  {
    id: '3',
    name: 'Crane VOL-003',
    type: 'Mobile Crane',
    model: 'Volvo EC380E',
    site: 'Tunnel T4 Boring',
    status: 'maintenance',
    operator: 'Unassigned',
    lastMaintenance: '2024-10-01',
    nextMaintenance: '2024-10-15',
    hoursUsed: 2100,
    fuelLevel: 30
  },
  {
    id: '4',
    name: 'Dump Truck VOL-004',
    type: 'Dump Truck',
    model: 'Volvo A40G',
    site: 'Road R3 Upgrade',
    status: 'idle',
    operator: 'Robert Chen',
    lastMaintenance: '2024-09-10',
    nextMaintenance: '2024-12-10',
    hoursUsed: 1800,
    fuelLevel: 85
  }
];

export function MachinesManager() {
  const [machines, setMachines] = useState<Machine[]>(mockMachines);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null);

  const filteredMachines = machines.filter(machine => {
    const matchesSearch = machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         machine.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         machine.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSite = selectedSite === 'all' || machine.site === selectedSite;
    const matchesStatus = selectedStatus === 'all' || machine.status === selectedStatus;
    return matchesSearch && matchesSite && matchesStatus;
  });

  const getStatusBadgeVariant = (status: Machine['status']) => {
    switch (status) {
      case 'active':
        return 'default';
      case 'maintenance':
        return 'secondary';
      case 'idle':
        return 'secondary';
      case 'broken':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getFuelLevelColor = (level: number) => {
    if (level > 50) return 'text-green-600';
    if (level > 25) return 'text-yellow-600';
    return 'text-red-600';
  };

  const sites = Array.from(new Set(machines.map(machine => machine.site)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Machines Management</h1>
          <p className="text-muted-foreground">
            Manage heavy machinery, track maintenance, and monitor usage
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Machine
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Machine</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="machineName">Machine Name</Label>
                  <Input id="machineName" placeholder="e.g. Excavator CAT-005" />
                </div>
                <div>
                  <Label htmlFor="machineType">Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excavator">Excavator</SelectItem>
                      <SelectItem value="bulldozer">Bulldozer</SelectItem>
                      <SelectItem value="crane">Mobile Crane</SelectItem>
                      <SelectItem value="dump-truck">Dump Truck</SelectItem>
                      <SelectItem value="loader">Wheel Loader</SelectItem>
                      <SelectItem value="grader">Motor Grader</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="model">Model</Label>
                <Input id="model" placeholder="e.g. CAT 320D" />
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
              <div>
                <Label htmlFor="operator">Operator</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maria">Maria Rodriguez</SelectItem>
                    <SelectItem value="james">James Mitchell</SelectItem>
                    <SelectItem value="robert">Robert Chen</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Add Machine</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search machines..."
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
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="idle">Idle</SelectItem>
                <SelectItem value="broken">Broken</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Machines</p>
                <p className="text-2xl">{machines.filter(m => m.status === 'active').length}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Maintenance</p>
                <p className="text-2xl">{machines.filter(m => m.status === 'maintenance').length}</p>
              </div>
              <Wrench className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Idle</p>
                <p className="text-2xl">{machines.filter(m => m.status === 'idle').length}</p>
              </div>
              <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-gray-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Broken</p>
                <p className="text-2xl">{machines.filter(m => m.status === 'broken').length}</p>
              </div>
              <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-red-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Machines Table */}
      <Card>
        <CardHeader>
          <CardTitle>Machines List ({filteredMachines.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Machine</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Operator</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fuel Level</TableHead>
                <TableHead>Hours Used</TableHead>
                <TableHead>Next Maintenance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMachines.map((machine) => (
                <TableRow key={machine.id}>
                  <TableCell>
                    <div>
                      <p>{machine.name}</p>
                      <p className="text-sm text-muted-foreground">{machine.type} - {machine.model}</p>
                    </div>
                  </TableCell>
                  <TableCell>{machine.site}</TableCell>
                  <TableCell>{machine.operator}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(machine.status)}>
                      {machine.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={getFuelLevelColor(machine.fuelLevel)}>
                      {machine.fuelLevel}%
                    </span>
                  </TableCell>
                  <TableCell>{machine.hoursUsed}h</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      {machine.nextMaintenance}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedMachine(machine);
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

      {/* Transfer Machine Dialog */}
      <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer Machine</DialogTitle>
          </DialogHeader>
          {selectedMachine && (
            <div className="space-y-4">
              <div>
                <Label>Machine</Label>
                <p>{selectedMachine.name} - {selectedMachine.model}</p>
              </div>
              <div>
                <Label>Current Site</Label>
                <p>{selectedMachine.site}</p>
              </div>
              <div>
                <Label htmlFor="newSite">Transfer to Site</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select destination site" />
                  </SelectTrigger>
                  <SelectContent>
                    {sites.filter(site => site !== selectedMachine.site).map(site => (
                      <SelectItem key={site} value={site}>{site}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="newOperator">Assign New Operator</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="maria">Maria Rodriguez</SelectItem>
                    <SelectItem value="james">James Mitchell</SelectItem>
                    <SelectItem value="robert">Robert Chen</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
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