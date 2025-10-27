import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Search, Package, AlertTriangle, Truck } from 'lucide-react';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  unit: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  site: string;
  lastUpdated: string;
  supplier: string;
  unitPrice: number;
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    name: 'Portland Cement',
    category: 'Building Materials',
    unit: 'bags',
    currentStock: 150,
    minStock: 100,
    maxStock: 500,
    site: 'Highway A1 Construction',
    lastUpdated: '2024-10-02',
    supplier: 'ABC Materials Ltd',
    unitPrice: 12.50
  },
  {
    id: '2',
    name: 'Steel Rebar 12mm',
    category: 'Steel',
    unit: 'tons',
    currentStock: 25,
    minStock: 20,
    maxStock: 100,
    site: 'Bridge B2 Project',
    lastUpdated: '2024-10-01',
    supplier: 'Steel Works Inc',
    unitPrice: 850.00
  },
  {
    id: '3',
    name: 'Diesel Fuel',
    category: 'Fuel',
    unit: 'liters',
    currentStock: 1200,
    minStock: 500,
    maxStock: 3000,
    site: 'Highway A1 Construction',
    lastUpdated: '2024-10-03',
    supplier: 'Energy Solutions',
    unitPrice: 1.45
  },
  {
    id: '4',
    name: 'Gravel Aggregate',
    category: 'Aggregates',
    unit: 'tons',
    currentStock: 80,
    minStock: 50,
    maxStock: 200,
    site: 'Road R3 Upgrade',
    lastUpdated: '2024-09-30',
    supplier: 'Quarry Materials',
    unitPrice: 25.00
  },
  {
    id: '5',
    name: 'Asphalt Mix',
    category: 'Road Materials',
    unit: 'tons',
    currentStock: 15,
    minStock: 30,
    maxStock: 150,
    site: 'Highway A1 Construction',
    lastUpdated: '2024-10-02',
    supplier: 'Road Solutions',
    unitPrice: 95.00
  }
];

export function InventoryManager() {
  const [inventory, setInventory] = useState<InventoryItem[]>(mockInventory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSite, setSelectedSite] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSite = selectedSite === 'all' || item.site === selectedSite;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesSite && matchesCategory;
  });

  const getStockStatus = (item: InventoryItem) => {
    if (item.currentStock <= item.minStock) return 'low';
    if (item.currentStock >= item.maxStock) return 'high';
    return 'normal';
  };

  const getStockBadgeVariant = (status: string) => {
    switch (status) {
      case 'low':
        return 'destructive';
      case 'high':
        return 'secondary';
      case 'normal':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const sites = Array.from(new Set(inventory.map(item => item.site)));
  const categories = Array.from(new Set(inventory.map(item => item.category)));
  const lowStockItems = inventory.filter(item => getStockStatus(item) === 'low');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1>Inventory Management</h1>
          <p className="text-muted-foreground">
            Manage materials and supplies across all construction sites
          </p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Inventory Item</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="itemName">Item Name</Label>
                <Input id="itemName" placeholder="Enter item name" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                      <SelectItem value="new">+ Add New Category</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="meters">Meters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="site">Site</Label>
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
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currentStock">Current Stock</Label>
                  <Input id="currentStock" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="minStock">Min Stock</Label>
                  <Input id="minStock" type="number" placeholder="0" />
                </div>
                <div>
                  <Label htmlFor="maxStock">Max Stock</Label>
                  <Input id="maxStock" type="number" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supplier">Supplier</Label>
                  <Input id="supplier" placeholder="Supplier name" />
                </div>
                <div>
                  <Label htmlFor="unitPrice">Unit Price ($)</Label>
                  <Input id="unitPrice" type="number" step="0.01" placeholder="0.00" />
                </div>
              </div>
              <Button className="w-full">Add Item</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Alert for Low Stock */}
      {lowStockItems.length > 0 && (
        <Card className="border-destructive bg-destructive/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <p className="text-destructive">
                  <span className="font-semibold">{lowStockItems.length} items</span> are running low on stock
                </p>
                <p className="text-sm text-muted-foreground">
                  {lowStockItems.map(item => item.name).join(', ')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Items</p>
                <p className="text-2xl">{inventory.length}</p>
              </div>
              <Package className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Low Stock</p>
                <p className="text-2xl text-destructive">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-2xl">{categories.length}</p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sites</p>
                <p className="text-2xl">{sites.length}</p>
              </div>
              <Truck className="h-8 w-8 text-green-600" />
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
                  placeholder="Search inventory..."
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
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Items ({filteredInventory.length} total)</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Current Stock</TableHead>
                <TableHead>Stock Status</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const stockStatus = getStockStatus(item);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <p>{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Last updated: {item.lastUpdated}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.site}</TableCell>
                    <TableCell>
                      <div>
                        <p>{item.currentStock} {item.unit}</p>
                        <p className="text-xs text-muted-foreground">
                          Min: {item.minStock} | Max: {item.maxStock}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStockBadgeVariant(stockStatus)}>
                        {stockStatus === 'low' && 'Low Stock'}
                        {stockStatus === 'high' && 'High Stock'}
                        {stockStatus === 'normal' && 'Normal'}
                      </Badge>
                    </TableCell>
                    <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell>{item.supplier}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedItem(item);
                          setIsUpdateDialogOpen(true);
                        }}
                      >
                        Update
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Update Stock Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Stock</DialogTitle>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div>
                <Label>Item</Label>
                <p>{selectedItem.name} ({selectedItem.category})</p>
              </div>
              <div>
                <Label>Current Stock</Label>
                <p>{selectedItem.currentStock} {selectedItem.unit}</p>
              </div>
              <div>
                <Label htmlFor="newStock">New Stock Level</Label>
                <Input 
                  id="newStock" 
                  type="number" 
                  defaultValue={selectedItem.currentStock}
                />
              </div>
              <div>
                <Label htmlFor="updateReason">Update Reason</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="delivery">New Delivery</SelectItem>
                    <SelectItem value="usage">Material Usage</SelectItem>
                    <SelectItem value="transfer">Site Transfer</SelectItem>
                    <SelectItem value="adjustment">Stock Adjustment</SelectItem>
                    <SelectItem value="damage">Damage/Loss</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full">Update Stock</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}