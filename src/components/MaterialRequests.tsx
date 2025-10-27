import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Textarea } from './ui/textarea';
import { Plus, Search, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface MaterialRequest {
  id: string;
  requestedBy: string;
  site: string;
  material: string;
  quantity: number;
  unit: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'approved' | 'rejected' | 'in-progress' | 'completed';
  requestDate: string;
  requiredDate: string;
  source: 'main-yard' | string; // site name if from another site
  notes: string;
  approvedBy?: string;
  approvalDate?: string;
}

const mockRequests: MaterialRequest[] = [
  {
    id: 'REQ-001',
    requestedBy: 'John Smith',
    site: 'Highway A1 Construction',
    material: 'Portland Cement',
    quantity: 50,
    unit: 'bags',
    priority: 'high',
    status: 'pending',
    requestDate: '2024-10-03',
    requiredDate: '2024-10-05',
    source: 'main-yard',
    notes: 'Needed for foundation work, urgent delivery required'
  },
  {
    id: 'REQ-002',
    requestedBy: 'Sarah Johnson',
    site: 'Bridge B2 Project',
    material: 'Steel Rebar 12mm',
    quantity: 10,
    unit: 'tons',
    priority: 'medium',
    status: 'approved',
    requestDate: '2024-10-02',
    requiredDate: '2024-10-08',
    source: 'Highway A1 Construction',
    notes: 'Transfer from Highway A1 site surplus',
    approvedBy: 'Manager Admin',
    approvalDate: '2024-10-02'
  },
  {
    id: 'REQ-003',
    requestedBy: 'Mike Wilson',
    site: 'Road R3 Upgrade',
    material: 'Asphalt Mix',
    quantity: 25,
    unit: 'tons',
    priority: 'urgent',
    status: 'in-progress',
    requestDate: '2024-10-01',
    requiredDate: '2024-10-04',
    source: 'main-yard',
    notes: 'Weather window closing, immediate delivery needed',
    approvedBy: 'Manager Admin',
    approvalDate: '2024-10-01'
  },
  {
    id: 'REQ-004',
    requestedBy: 'Lisa Chen',
    site: 'Tunnel T4 Boring',
    material: 'Diesel Fuel',
    quantity: 500,
    unit: 'liters',
    priority: 'low',
    status: 'completed',
    requestDate: '2024-09-30',
    requiredDate: '2024-10-02',
    source: 'main-yard',
    notes: 'Regular fuel resupply',
    approvedBy: 'Manager Admin',
    approvalDate: '2024-09-30'
  }
];

export function MaterialRequests() {
  const [requests, setRequests] = useState<MaterialRequest[]>(mockRequests);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MaterialRequest | null>(null);

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusIcon = (status: MaterialRequest['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'approved':
      case 'in-progress':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadgeVariant = (status: MaterialRequest['status']) => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'approved':
      case 'in-progress':
        return 'secondary';
      case 'rejected':
        return 'destructive';
      case 'pending':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getPriorityBadgeVariant = (priority: MaterialRequest['priority']) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'destructive';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const handleApprove = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'approved', approvedBy: 'Manager Admin', approvalDate: new Date().toISOString().split('T')[0] }
        : req
    ));
  };

  const handleReject = (requestId: string) => {
    setRequests(prev => prev.map(req => 
      req.id === requestId 
        ? { ...req, status: 'rejected', approvedBy: 'Manager Admin', approvalDate: new Date().toISOString().split('T')[0] }
        : req
    ));
  };

  const sites = ['Highway A1 Construction', 'Bridge B2 Project', 'Road R3 Upgrade', 'Tunnel T4 Boring'];
  const materials = ['Portland Cement', 'Steel Rebar 12mm', 'Gravel Aggregate', 'Asphalt Mix', 'Diesel Fuel', 'Sand'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Material Requests</h1>
          <p className="text-muted-foreground">
            Manage material requests between sites and main yard
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Request
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Material Request</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="requestSite">Requesting Site</Label>
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
                  <Label htmlFor="requestedBy">Requested By</Label>
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
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="material">Material</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select material" />
                    </SelectTrigger>
                    <SelectContent>
                      {materials.map(material => (
                        <SelectItem key={material} value={material}>{material}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="unit">Unit</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bags">Bags</SelectItem>
                      <SelectItem value="tons">Tons</SelectItem>
                      <SelectItem value="kg">Kilograms</SelectItem>
                      <SelectItem value="liters">Liters</SelectItem>
                      <SelectItem value="pieces">Pieces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="requiredDate">Required Date</Label>
                  <Input id="requiredDate" type="date" />
                </div>
              </div>

              <div>
                <Label htmlFor="source">Source</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main-yard">Main Yard</SelectItem>
                    {sites.map(site => (
                      <SelectItem key={site} value={site}>{site}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder="Additional details, special requirements..." />
              </div>

              <Button className="w-full">Submit Request</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl text-yellow-600">
                  {requests.filter(r => r.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl text-blue-600">
                  {requests.filter(r => r.status === 'approved').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl text-green-600">
                  {requests.filter(r => r.status === 'in-progress').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Urgent</p>
                <p className="text-2xl text-red-600">
                  {requests.filter(r => r.priority === 'urgent').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
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
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Material Requests ({filteredRequests.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Request ID</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Required Date</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{request.id}</p>
                      <p className="text-sm text-muted-foreground">
                        by {request.requestedBy}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{request.site}</TableCell>
                  <TableCell>{request.material}</TableCell>
                  <TableCell>{request.quantity} {request.unit}</TableCell>
                  <TableCell>
                    <Badge variant={getPriorityBadgeVariant(request.priority)}>
                      {request.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(request.status)}
                      <Badge variant={getStatusBadgeVariant(request.status)}>
                        {request.status}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{request.requiredDate}</TableCell>
                  <TableCell>{request.source === 'main-yard' ? 'Main Yard' : request.source}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleApprove(request.id)}
                            className="text-green-600 hover:text-green-700"
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleReject(request.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Reject
                          </Button>
                        </>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRequest(request)}
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

      {/* Request Details Dialog */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Details - {selectedRequest.id}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Requested By</Label>
                  <p>{selectedRequest.requestedBy}</p>
                </div>
                <div>
                  <Label>Site</Label>
                  <p>{selectedRequest.site}</p>
                </div>
                <div>
                  <Label>Material</Label>
                  <p>{selectedRequest.material}</p>
                </div>
                <div>
                  <Label>Quantity</Label>
                  <p>{selectedRequest.quantity} {selectedRequest.unit}</p>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Badge variant={getPriorityBadgeVariant(selectedRequest.priority)}>
                    {selectedRequest.priority}
                  </Badge>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="flex items-center gap-1">
                    {getStatusIcon(selectedRequest.status)}
                    <Badge variant={getStatusBadgeVariant(selectedRequest.status)}>
                      {selectedRequest.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Request Date</Label>
                  <p>{selectedRequest.requestDate}</p>
                </div>
                <div>
                  <Label>Required Date</Label>
                  <p>{selectedRequest.requiredDate}</p>
                </div>
                <div>
                  <Label>Source</Label>
                  <p>{selectedRequest.source === 'main-yard' ? 'Main Yard' : selectedRequest.source}</p>
                </div>
                {selectedRequest.approvedBy && (
                  <div>
                    <Label>Approved By</Label>
                    <p>{selectedRequest.approvedBy} on {selectedRequest.approvalDate}</p>
                  </div>
                )}
              </div>
              
              {selectedRequest.notes && (
                <div>
                  <Label>Notes</Label>
                  <p className="text-sm text-muted-foreground">{selectedRequest.notes}</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}