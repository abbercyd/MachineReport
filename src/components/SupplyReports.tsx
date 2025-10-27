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
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Plus, Search, Truck, User, Package, Calendar } from 'lucide-react';

interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
  materials: string[];
  rating: number;
  totalSupplies: number;
  vehicles: Vehicle[];
}

interface Vehicle {
  id: string;
  licensePlate: string;
  type: string;
  capacity: number;
  driver: Driver;
  trips: Trip[];
}

interface Driver {
  id: string;
  name: string;
  license: string;
  phone: string;
  totalTrips: number;
}

interface Trip {
  id: string;
  date: string;
  material: string;
  quantity: number;
  unit: string;
  destination: string;
  status: 'completed' | 'in-transit' | 'scheduled';
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'ABC Materials Ltd',
    contact: '+1-555-1001',
    email: 'contact@abcmaterials.com',
    materials: ['Cement', 'Gravel', 'Sand'],
    rating: 4.5,
    totalSupplies: 1250,
    vehicles: [
      {
        id: 'v1',
        licensePlate: 'ABC-001',
        type: 'Dump Truck',
        capacity: 25,
        driver: {
          id: 'd1',
          name: 'John Driver',
          license: 'CDL-12345',
          phone: '+1-555-2001',
          totalTrips: 45
        },
        trips: [
          {
            id: 't1',
            date: '2024-10-03',
            material: 'Cement',
            quantity: 20,
            unit: 'tons',
            destination: 'Highway A1 Construction',
            status: 'completed'
          },
          {
            id: 't2',
            date: '2024-10-02',
            material: 'Gravel',
            quantity: 25,
            unit: 'tons',
            destination: 'Bridge B2 Project',
            status: 'completed'
          }
        ]
      },
      {
        id: 'v2',
        licensePlate: 'ABC-002',
        type: 'Cement Mixer',
        capacity: 8,
        driver: {
          id: 'd2',
          name: 'Mike Transport',
          license: 'CDL-12346',
          phone: '+1-555-2002',
          totalTrips: 32
        },
        trips: [
          {
            id: 't3',
            date: '2024-10-03',
            material: 'Concrete Mix',
            quantity: 8,
            unit: 'tons',
            destination: 'Highway A1 Construction',
            status: 'in-transit'
          }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Steel Works Inc',
    contact: '+1-555-1002',
    email: 'orders@steelworks.com',
    materials: ['Steel Rebar', 'Steel Beams', 'Reinforcement'],
    rating: 4.8,
    totalSupplies: 850,
    vehicles: [
      {
        id: 'v3',
        licensePlate: 'STL-001',
        type: 'Flatbed Truck',
        capacity: 30,
        driver: {
          id: 'd3',
          name: 'Sarah Steel',
          license: 'CDL-12347',
          phone: '+1-555-2003',
          totalTrips: 28
        },
        trips: [
          {
            id: 't4',
            date: '2024-10-01',
            material: 'Steel Rebar',
            quantity: 15,
            unit: 'tons',
            destination: 'Bridge B2 Project',
            status: 'completed'
          }
        ]
      }
    ]
  }
];

export function SupplyReports() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(mockSuppliers);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAllTrips = () => {
    return suppliers.flatMap(supplier =>
      supplier.vehicles.flatMap(vehicle =>
        vehicle.trips.map(trip => ({
          ...trip,
          supplier: supplier.name,
          vehicle: vehicle.licensePlate,
          driver: vehicle.driver.name
        }))
      )
    );
  };

  const getTripsByDate = () => {
    const trips = getAllTrips();
    const tripsByDate = trips.reduce((acc, trip) => {
      const date = trip.date;
      if (!acc[date]) {
        acc[date] = { date, trips: 0, quantity: 0 };
      }
      acc[date].trips += 1;
      acc[date].quantity += trip.quantity;
      return acc;
    }, {} as Record<string, { date: string; trips: number; quantity: number }>);

    return Object.values(tripsByDate).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const getSupplierPerformance = () => {
    return suppliers.map(supplier => ({
      name: supplier.name,
      totalTrips: supplier.vehicles.reduce((sum, vehicle) => sum + vehicle.trips.length, 0),
      totalQuantity: supplier.vehicles.reduce((sum, vehicle) =>
        sum + vehicle.trips.reduce((tripSum, trip) => tripSum + trip.quantity, 0), 0
      ),
      rating: supplier.rating
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Supply Reports</h1>
          <p className="text-muted-foreground">
            Track suppliers, vehicles, drivers, and material deliveries
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddSupplierOpen} onOpenChange={setIsAddSupplierOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Supplier</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="supplierName">Supplier Name</Label>
                  <Input id="supplierName" placeholder="Enter supplier name" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="contact">Contact Phone</Label>
                    <Input id="contact" placeholder="+1-555-0000" />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="contact@supplier.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="materials">Materials Supplied</Label>
                  <Input id="materials" placeholder="Cement, Gravel, Sand (comma separated)" />
                </div>
                <Button className="w-full">Add Supplier</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isAddTripOpen} onOpenChange={setIsAddTripOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Record Trip
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record New Trip</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="tripSupplier">Supplier</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>{supplier.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tripVehicle">Vehicle</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.flatMap(supplier =>
                        supplier.vehicles.map(vehicle => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.licensePlate} - {vehicle.type}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="material">Material</Label>
                    <Input id="material" placeholder="Material type" />
                  </div>
                  <div>
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input id="quantity" type="number" placeholder="0" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="unit">Unit</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tons">Tons</SelectItem>
                        <SelectItem value="kg">Kilograms</SelectItem>
                        <SelectItem value="bags">Bags</SelectItem>
                        <SelectItem value="liters">Liters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="destination">Destination</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select destination" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="highway-a1">Highway A1 Construction</SelectItem>
                        <SelectItem value="bridge-b2">Bridge B2 Project</SelectItem>
                        <SelectItem value="road-r3">Road R3 Upgrade</SelectItem>
                        <SelectItem value="tunnel-t4">Tunnel T4 Boring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="tripDate">Delivery Date</Label>
                  <Input id="tripDate" type="date" />
                </div>
                <Button className="w-full">Record Trip</Button>
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
                <p className="text-sm text-muted-foreground">Total Suppliers</p>
                <p className="text-2xl">{suppliers.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Vehicles</p>
                <p className="text-2xl">{suppliers.reduce((sum, s) => sum + s.vehicles.length, 0)}</p>
              </div>
              <Truck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Drivers</p>
                <p className="text-2xl">{suppliers.reduce((sum, s) => sum + s.vehicles.length, 0)}</p>
              </div>
              <User className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trips</p>
                <p className="text-2xl">{getAllTrips().length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
          <TabsTrigger value="trips">Trips</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Daily Deliveries</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={getTripsByDate()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="trips" fill="hsl(var(--chart-1))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Supplier Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={getSupplierPerformance()}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="totalTrips" fill="hsl(var(--chart-2))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="suppliers" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {supplier.name}
                    <Badge variant="secondary">{supplier.rating}★</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Contact</p>
                      <p className="text-sm">{supplier.contact}</p>
                      <p className="text-sm">{supplier.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Materials</p>
                      <div className="flex flex-wrap gap-1">
                        {supplier.materials.map((material, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {material}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Vehicles</p>
                        <p className="text-lg">{supplier.vehicles.length}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Trips</p>
                        <p className="text-lg">
                          {supplier.vehicles.reduce((sum, vehicle) => sum + vehicle.trips.length, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trips" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Destination</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getAllTrips().slice(0, 10).map((trip) => (
                    <TableRow key={trip.id}>
                      <TableCell>{trip.date}</TableCell>
                      <TableCell>{trip.supplier}</TableCell>
                      <TableCell>{trip.vehicle}</TableCell>
                      <TableCell>{trip.driver}</TableCell>
                      <TableCell>{trip.material}</TableCell>
                      <TableCell>{trip.quantity} {trip.unit}</TableCell>
                      <TableCell>{trip.destination}</TableCell>
                      <TableCell>
                        <Badge variant={trip.status === 'completed' ? 'default' : 
                                      trip.status === 'in-transit' ? 'secondary' : 'outline'}>
                          {trip.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Drivers by Trips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {suppliers.flatMap(s => s.vehicles.map(v => v.driver))
                    .sort((a, b) => b.totalTrips - a.totalTrips)
                    .slice(0, 5)
                    .map((driver, index) => (
                      <div key={driver.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <p className="text-sm text-muted-foreground">{driver.license}</p>
                        </div>
                        <Badge variant="secondary">{driver.totalTrips} trips</Badge>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Material Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* This would show distribution of materials delivered */}
                  <div className="flex items-center justify-between">
                    <span>Cement</span>
                    <span>35%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Gravel</span>
                    <span>28%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Steel Rebar</span>
                    <span>22%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Sand</span>
                    <span>15%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}