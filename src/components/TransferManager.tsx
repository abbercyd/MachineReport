import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Textarea } from './ui/textarea';
import { Plus, Search, Users, Truck, ArrowRightLeft, Calendar, FileDown } from 'lucide-react';

interface Transfer {
  id: string;
  type: 'worker' | 'machine';
  itemId: string;
  itemName: string;
  fromSite: string;
  toSite: string;
  requestedBy: string;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'in-transit' | 'completed' | 'rejected';
  requestDate: string;
  scheduledDate: string;
  completedDate?: string;
  reason: string;
  notes?: string;
}

const mockTransfers: Transfer[] = [
  {
    id: 'TRF-001',
    type: 'machine',
    itemId: 'EXC-001',
    itemName: 'Excavator CAT-001',
    fromSite: 'Highway A1 Construction',
    toSite: 'Bridge B2 Project',
    requestedBy: 'Sarah Johnson',
    approvedBy: 'Manager Admin',
    status: 'completed',
    requestDate: '2024-09-28',
    scheduledDate: '2024-10-01',
    completedDate: '2024-10-01',
    reason: 'Project requirement',
    notes: 'Transferred with operator Maria Rodriguez'
  },
  {
    id: 'TRF-002',
    type: 'worker',
    itemId: 'WRK-015',
    itemName: 'Robert Chen - Civil Engineer',
    fromSite: 'Road R3 Upgrade',
    toSite: 'Tunnel T4 Boring',
    requestedBy: 'Lisa Chen',
    status: 'approved',
    requestDate: '2024-10-02',
    scheduledDate: '2024-10-05',
    reason: 'Technical expertise needed',
    notes: 'Temporary assignment for 2 weeks'
  },
  {
    id: 'TRF-003',
    type: 'machine',
    itemId: 'DMP-004',
    itemName: 'Dump Truck VOL-004',
    fromSite: 'Road R3 Upgrade',
    toSite: 'Highway A1 Construction',
    requestedBy: 'John Smith',
    status: 'pending',
    requestDate: '2024-10-03',
    scheduledDate: '2024-10-06',
    reason: 'Additional hauling capacity needed',
    notes: 'Rush completion requirement'
  },
  {
    id: 'TRF-004',
    type: 'worker',
    itemId: 'WRK-008',
    itemName: 'James Mitchell - Site Foreman',
    fromSite: 'Highway A1 Construction',
    toSite: 'Bridge B2 Project',
    requestedBy: 'Sarah Johnson',
    status: 'in-transit',
    requestDate: '2024-10-01',
    scheduledDate: '2024-10-03',
    reason: 'Leadership support',
    notes: 'Will oversee critical foundation work'
  }
];

const mockWorkers = [
  { id: 'WRK-001', name: 'James Mitchell', role: 'Site Foreman', site: 'Highway A1 Construction' },
  { id: 'WRK-002', name: 'Maria Rodriguez', role: 'Equipment Operator', site: 'Bridge B2 Project' },
  { id: 'WRK-003', name: 'Robert Chen', role: 'Civil Engineer', site: 'Road R3 Upgrade' },
  { id: 'WRK-004', name: 'Sarah Thompson', role: 'Safety Inspector', site: 'Highway A1 Construction' }
];

const mockMachines = [
  { id: 'EXC-001', name: 'Excavator CAT-001', type: 'Excavator', site: 'Highway A1 Construction' },
  { id: 'BLD-002', name: 'Bulldozer KOM-002', type: 'Bulldozer', site: 'Bridge B2 Project' },
  { id: 'CRN-003', name: 'Crane VOL-003', type: 'Mobile Crane', site: 'Tunnel T4 Boring' },
  { id: 'DMP-004', name: 'Dump Truck VOL-004', type: 'Dump Truck', site: 'Road R3 Upgrade' }
];

const sites = ['Highway A1 Construction', 'Bridge B2 Project', 'Road R3 Upgrade', 'Tunnel T4 Boring'];

export function TransferManager() {
  const [transfers, setTransfers] = useState<Transfer[]>(mockTransfers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [transferType, setTransferType] = useState<'worker' | 'machine'>('worker');

  const filteredTransfers = transfers.filter(transfer => {
    const matchesSearch = transfer.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.fromSite.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transfer.toSite.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transfer.status === statusFilter;
    const matchesType = typeFilter === 'all' || transfer.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadgeVariant = (status: Transfer['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'approved':
      case 'in-transit':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getTypeIcon = (type: Transfer['type']) => {
    return type === 'worker' ? <Users className="h-4 w-4" /> : <Truck className="h-4 w-4" />;
  };

  const handleApprove = (transferId: string) => {
    setTransfers(prev => prev.map(transfer => 
      transfer.id === transferId 
        ? { ...transfer, status: 'approved', approvedBy: 'Manager Admin' }
        : transfer
    ));
  };

  const handleReject = (transferId: string) => {
    setTransfers(prev => prev.map(transfer => 
      transfer.id === transferId 
        ? { ...transfer, status: 'rejected', approvedBy: 'Manager Admin' }
        : transfer
    ));
  };

  const handleComplete = (transferId: string) => {
    setTransfers(prev => prev.map(transfer => 
      transfer.id === transferId 
        ? { ...transfer, status: 'completed', completedDate: new Date().toISOString().split('T')[0] }
        : transfer
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Transfer Management</h1>
          <p className="text-muted-foreground">
            Manage worker and machine transfers between construction sites
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <FileDown className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Transfer
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Transfer Request</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Transfer Type</Label>
                  <Select value={transferType} onValueChange={(value: 'worker' | 'machine') => setTransferType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="worker">Worker Transfer</SelectItem>
                      <SelectItem value="machine">Machine Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>{transferType === 'worker' ? 'Select Worker' : 'Select Machine'}</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder={`Select ${transferType}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {(transferType === 'worker' ? mockWorkers : mockMachines).map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} - {transferType === 'worker' ? (item as any).role : (item as any).type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>From Site</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select source site" />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map(site => (
                          <SelectItem key={site} value={site}>{site}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>To Site</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination site" />
                      </SelectTrigger>
                      <SelectContent>
                        {sites.map(site => (
                          <SelectItem key={site} value={site}>{site}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Requested By</Label>
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
                  <div>
                    <Label>Scheduled Date</Label>
                    <Input type="date" />
                  </div>
                </div>

                <div>
                  <Label>Reason for Transfer</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="project-requirement">Project Requirement</SelectItem>
                      <SelectItem value="skill-expertise">Technical Expertise Needed</SelectItem>
                      <SelectItem value="equipment-demand">Equipment Demand</SelectItem>
                      <SelectItem value="capacity-optimization">Capacity Optimization</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Additional Notes</Label>
                  <Textarea placeholder="Any additional details about the transfer..." />
                </div>

                <Button className="w-full">Submit Transfer Request</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Transfers</p>
                <p className="text-2xl text-yellow-600">
                  {transfers.filter(t => t.status === 'pending').length}
                </p>
              </div>
              <ArrowRightLeft className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Transit</p>
                <p className="text-2xl text-blue-600">
                  {transfers.filter(t => t.status === 'in-transit').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Worker Transfers</p>
                <p className="text-2xl text-green-600">
                  {transfers.filter(t => t.type === 'worker').length}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Machine Transfers</p>
                <p className="text-2xl text-orange-600">
                  {transfers.filter(t => t.type === 'machine').length}
                </p>
              </div>
              <Truck className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transfers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="worker">Workers</SelectItem>
                <SelectItem value="machine">Machines</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in-transit">In Transit</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transfers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transfer Requests ({filteredTransfers.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transfer ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>From Site</TableHead>
                <TableHead>To Site</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Scheduled Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransfers.map((transfer) => (
                <TableRow key={transfer.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{transfer.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {transfer.requestDate}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getTypeIcon(transfer.type)}
                      <Badge variant="outline">
                        {transfer.type}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{transfer.itemName}</p>
                      <p className="text-sm text-muted-foreground">{transfer.reason}</p>
                    </div>
                  </TableCell>
                  <TableCell>{transfer.fromSite}</TableCell>
                  <TableCell>{transfer.toSite}</TableCell>
                  <TableCell>{transfer.requestedBy}</TableCell>
                  <TableCell>{transfer.scheduledDate}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(transfer.status)}>
                      {transfer.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {transfer.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(transfer.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(transfer.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      {transfer.status === 'in-transit' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleComplete(transfer.id)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          Complete
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedTransfer(transfer)}
                      >
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Transfer Details Dialog */}
      {selectedTransfer && (
        <Dialog open={!!selectedTransfer} onOpenChange={() => setSelectedTransfer(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Transfer Details - {selectedTransfer.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Transfer Type</Label>
                  <div className="flex items-center gap-1">
                    {getTypeIcon(selectedTransfer.type)}
                    <Badge variant="outline">{selectedTransfer.type}</Badge>
                  </div>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge variant={getStatusBadgeVariant(selectedTransfer.status)}>
                    {selectedTransfer.status}
                  </Badge>
                </div>
                <div>
                  <Label>Item</Label>
                  <p>{selectedTransfer.itemName}</p>
                </div>
                <div>
                  <Label>Requested By</Label>
                  <p>{selectedTransfer.requestedBy}</p>
                </div>
                <div>
                  <Label>From Site</Label>
                  <p>{selectedTransfer.fromSite}</p>
                </div>
                <div>
                  <Label>To Site</Label>
                  <p>{selectedTransfer.toSite}</p>
                </div>
                <div>
                  <Label>Request Date</Label>
                  <p>{selectedTransfer.requestDate}</p>
                </div>
                <div>
                  <Label>Scheduled Date</Label>
                  <p>{selectedTransfer.scheduledDate}</p>
                </div>
                {selectedTransfer.completedDate && (
                  <div>
                    <Label>Completed Date</Label>
                    <p>{selectedTransfer.completedDate}</p>
                  </div>
                )}
                {selectedTransfer.approvedBy && (
                  <div>
                    <Label>Approved By</Label>
                    <p>{selectedTransfer.approvedBy}</p>
                  </div>
                )}
              </div>
              
              <div>
                <Label>Reason</Label>
                <p>{selectedTransfer.reason}</p>
              </div>
              
              {selectedTransfer.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm text-muted-foreground">{selectedTransfer.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}