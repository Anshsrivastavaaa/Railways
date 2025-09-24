export type Train = {
  id: string;
  name: string;
  type: 'Express' | 'Local' | 'Freight' | 'Special';
  priority: 'High' | 'Medium' | 'Low';
  status: 'On Time' | 'Delayed' | 'Halted' | 'Rerouted';
  currentLocation: string;
  delay: number; // in minutes
  nextStation: string;
  eta: string;
};

export type Kpi = {
  title: string;
  value: string;
  change: string;
  changeType: 'increase' | 'decrease';
};

export type Disruption = {
  id: string;
  type: 'Weather' | 'Breakdown' | 'Maintenance';
  location: string;
  description: string;
  reportedAt: string;
  status: 'Active' | 'Resolved';
};

export type AuditLog = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
};
