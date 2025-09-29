
import type { Train, Kpi, Disruption, AuditLog } from '@/lib/types';

export const mockTrains: Train[] = [
  {
    id: 'T12345',
    name: 'Rajdhani Express',
    type: 'Express',
    priority: 'High',
    status: 'On Time',
    currentLocation: 'Kanpur Central',
    delay: 0,
    nextStation: 'New Delhi',
    eta: '14:30',
  },
  {
    id: 'T67890',
    name: 'Mumbai Local',
    type: 'Local',
    priority: 'Medium',
    status: 'Delayed',
    currentLocation: 'Dadar',
    delay: 15,
    nextStation: 'CST',
    eta: '10:45',
  },
  {
    id: 'T54321',
    name: 'Goods Carrier',
    type: 'Freight',
    priority: 'Low',
    status: 'Halted',
    currentLocation: 'Mughalsarai',
    delay: 120,
    nextStation: 'Allahabad',
    eta: '18:00',
  },
  {
    id: 'T98765',
    name: 'Shatabdi Express',
    type: 'Express',
    priority: 'High',
    status: 'Rerouted',
    currentLocation: 'Ghaziabad',
    delay: 35,
    nextStation: 'New Delhi',
    eta: '13:00',
  },
  {
    id: 'T24680',
    name: 'Duronto Express',
    type: 'Express',
    priority: 'High',
    status: 'On Time',
    currentLocation: 'Nagpur',
    delay: 0,
    nextStation: 'Itarsi',
    eta: '11:55',
  },
];

export const mockKpis: Kpi[] = [
    { title: 'Overall Punctuality', value: '82%', change: '+1.2%', changeType: 'increase' },
    { title: 'Average Delay', value: '18 min', change: '-3 min', changeType: 'decrease' },
    { title: 'Network Throughput', value: '95 trains/day', change: '+5 t/day', changeType: 'increase' },
    { title: 'Track Utilization', value: '76%', change: '-0.5%', changeType: 'decrease' },
];

export const mockPunctualityData = [
  { name: 'Rajdhani/Shatabdi', onTime: 95, delayed: 5, color: 'hsl(var(--chart-1))' },
  { name: 'Duronto/Express', onTime: 85, delayed: 15, color: 'hsl(var(--chart-2))' },
  { name: 'Mail/Superfast', onTime: 80, delayed: 20, color: 'hsl(var(--chart-3))' },
  { name: 'Local/Suburban', onTime: 75, delayed: 25, color: 'hsl(var(--chart-4))' },
  { name: 'Freight', onTime: 60, delayed: 40, color: 'hsl(var(--chart-5))' },
];

export const mockDelayData = [
  { date: 'Mon', 'Avg Delay (min)': 22 },
  { date: 'Tue', 'Avg Delay (min)': 20 },
  { date: 'Wed', 'Avg Delay (min)': 25 },
  { date: 'Thu', 'Avg Delay (min)': 18 },
  { date: 'Fri', 'Avg Delay (min)': 15 },
  { date: 'Sat', 'Avg Delay (min)': 28 },
  { date: 'Sun', 'Avg Delay (min)': 30 },
];

export const mockDisruptions: Disruption[] = [
    { id: 'D001', type: 'Breakdown', location: 'Section NDLS-CNB', description: 'Engine failure on T54321', reportedAt: '2024-07-21 10:00', status: 'Active' },
    { id: 'D002', type: 'Weather', location: 'Mumbai Division', description: 'Heavy monsoon rains, speed restrictions in place.', reportedAt: '2024-07-21 08:30', status: 'Active' },
    { id: 'D003', type: 'Maintenance', location: 'Block 2A, Pune', description: 'Scheduled track maintenance until 16:00', reportedAt: '2024-07-21 09:00', status: 'Active' },
    { id: 'D004', type: 'Breakdown', location: 'Section BPL-NGP', description: 'Signal failure resolved.', reportedAt: '2024-07-20 18:00', status: 'Resolved' },
];

export const mockAuditLogs: AuditLog[] = [
    { id: 'L001', timestamp: '2024-07-21 10:05', user: 'controller_A', action: 'Halt Train', details: 'Halted T54321 due to engine failure ahead.' },
    { id: 'L002', timestamp: '2024-07-21 10:02', user: 'SYSTEM', action: 'Reroute Suggestion', details: 'Suggested rerouting T98765 via alternate line.' },
    { id: 'L003', timestamp: '2024-07-21 09:45', user: 'controller_B', action: 'Priority Override', details: 'Gave T12345 priority over T67890.' },
    { id: 'L004', timestamp: '2024-07-21 09:30', user: 'SYSTEM', action: 'Disruption Alert', details: 'New disruption D002 (Weather) reported.' },
    { id: 'L005', timestamp: '2024-07-21 09:21', user: 'controller_A', action: 'User Login', details: 'User controller_A logged in successfully.' },
];
