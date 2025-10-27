import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SitesManager } from './components/SitesManager';
import { WorkersManager } from './components/WorkersManager';
import { MachinesManager } from './components/MachinesManager';
import { InventoryManager } from './components/InventoryManager';
import { ProgressReports } from './components/ProgressReports';
import { SupplyReports } from './components/SupplyReports';
import { MaterialRequests } from './components/MaterialRequests';
import { TransferManager } from './components/TransferManager';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'sites':
        return <SitesManager />;
      case 'workers':
        return <WorkersManager />;
      case 'machines':
        return <MachinesManager />;
      case 'inventory':
        return <InventoryManager />;
      case 'progress':
        return <ProgressReports />;
      case 'supply':
        return <SupplyReports />;
      case 'requests':
        return <MaterialRequests />;
      case 'transfers':
        return <TransferManager />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-6">
        {renderContent()}
      </main>
    </div>
  );
}