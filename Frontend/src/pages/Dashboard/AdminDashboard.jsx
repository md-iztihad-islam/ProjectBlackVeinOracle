// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// // eslint-disable-next-line no-unused-vars
// import { motion } from "framer-motion";
// import { adminSignoutApi } from "@/services/authServices/signoutApi";
// import userStore from "@/state/userStore";
// import {
//   Building2,
//   Shield,
//   Users,
//   FileText,
//   AlertCircle,
//   BarChart3,
//   Settings,
//   Plus,
//   Search,
//   Filter,
//   ChevronDown,
//   Eye,
//   Edit,
//   Trash2,
//   MapPin,
//   Skull,
//   Network,
//   Briefcase,
//   UserCheck,
//   Lock,
//   TrendingUp,
//   Activity,
//   Database,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// function AdminDashboard() {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [activeTab, setActiveTab] = useState("overview");
//   const navigate = useNavigate();
//   const { clearUser } = userStore();

//   const handleSignout = async () => {
//     await adminSignoutApi();
//     clearUser();
//     navigate("/");
//   };

//   // Mock data - replace with actual API calls
//   const stats = [
//     {
//       title: "Total Thanas",
//       value: "64",
//       change: "+3 this month",
//       icon: Building2,
//       color: "text-blue-500",
//       bgColor: "bg-blue-500/10",
//     },
//     {
//       title: "Active Officers",
//       value: "892",
//       change: "+24 this week",
//       icon: Shield,
//       color: "text-green-500",
//       bgColor: "bg-green-500/10",
//     },
//     {
//       title: "Criminals Tracked",
//       value: "1,284",
//       change: "+47 this month",
//       icon: Skull,
//       color: "text-red-500",
//       bgColor: "bg-red-500/10",
//     },
//     {
//       title: "Active Cases",
//       value: "347",
//       change: "-12 this week",
//       icon: FileText,
//       color: "text-yellow-500",
//       bgColor: "bg-yellow-500/10",
//     },
//     {
//       title: "Registered Jails",
//       value: "23",
//       change: "+1 this month",
//       icon: Lock,
//       color: "text-purple-500",
//       bgColor: "bg-purple-500/10",
//     },
//     {
//       title: "System Users",
//       value: "156",
//       change: "+8 this week",
//       icon: Users,
//       color: "text-cyan-500",
//       bgColor: "bg-cyan-500/10",
//     },
//   ];

//   const recentThanas = [
//     { id: "THN-0000045", name: "Motijheel Police Station", district: "Dhaka", zone: "Central", officers: 28, status: "active" },
//     { id: "THN-0000046", name: "Gulshan Police Station", district: "Dhaka", zone: "North", officers: 32, status: "active" },
//     { id: "THN-0000047", name: "Dhanmondi Police Station", district: "Dhaka", zone: "Central", officers: 25, status: "active" },
//     { id: "THN-0000048", name: "Uttara Police Station", district: "Dhaka", zone: "North", officers: 30, status: "active" },
//   ];

//   const recentOfficers = [
//     { id: "OFC-0000234", name: "Inspector Rahman", badge: "DMP-2341", rank: "Inspector", thana: "Motijheel", status: "active" },
//     { id: "OFC-0000235", name: "SI Ahmed", badge: "DMP-2342", rank: "Sub-Inspector", thana: "Gulshan", status: "active" },
//     { id: "OFC-0000236", name: "OC Khan", badge: "DMP-2343", rank: "Officer-in-Charge", thana: "Dhanmondi", status: "active" },
//     { id: "OFC-0000237", name: "Constable Islam", badge: "DMP-2344", rank: "Constable", thana: "Uttara", status: "active" },
//   ];

//   const recentJails = [
//     { id: "JAL-0000012", name: "Dhaka Central Jail", district: "Dhaka", zone: "Central", capacity: 1200, occupancy: 1450, status: "overcrowded" },
//     { id: "JAL-0000013", name: "Kashimpur Central Jail", district: "Gazipur", zone: "North", capacity: 800, occupancy: 750, status: "normal" },
//     { id: "JAL-0000014", name: "Keraniganj Central Jail", district: "Dhaka", zone: "South", capacity: 600, occupancy: 580, status: "normal" },
//   ];

//   const recentCriminals = [
//     { id: "CRM-0000789", name: "Karim Abdullah", nid: "1234567890123", status: "in_custody", riskLevel: 8, thana: "Motijheel" },
//     { id: "CRM-0000790", name: "Rahim Mollah", nid: "2345678901234", status: "on_bail", riskLevel: 5, thana: "Gulshan" },
//     { id: "CRM-0000791", name: "Jamal Hossain", nid: "3456789012345", status: "escaped", riskLevel: 9, thana: "Dhanmondi" },
//     { id: "CRM-0000792", name: "Hafiz Rahman", nid: "4567890123456", status: "released", riskLevel: 3, thana: "Uttara" },
//   ];

//   const recentGDReports = [
//     { id: "12345", thana: "Motijheel", submittedBy: "Citizen Ahmed", status: "assigned", date: "2026-02-10" },
//     { id: "12346", thana: "Gulshan", submittedBy: "Citizen Rahman", status: "approved", date: "2026-02-09" },
//     { id: "12347", thana: "Dhanmondi", submittedBy: "Citizen Khan", status: "rejected", date: "2026-02-09" },
//     { id: "12348", thana: "Uttara", submittedBy: "Citizen Islam", status: "submitted", date: "2026-02-08" },
//   ];

//   const getStatusColor = (status) => {
//     const colors = {
//       active: "bg-green-500/20 text-green-500 border-green-500/30",
//       inactive: "bg-gray-500/20 text-gray-500 border-gray-500/30",
//       overcrowded: "bg-red-500/20 text-red-500 border-red-500/30",
//       normal: "bg-blue-500/20 text-blue-500 border-blue-500/30",
//       in_custody: "bg-red-500/20 text-red-500 border-red-500/30",
//       on_bail: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
//       released: "bg-green-500/20 text-green-500 border-green-500/30",
//       escaped: "bg-red-500/20 text-red-500 border-red-500/30",
//       assigned: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
//       approved: "bg-green-500/20 text-green-500 border-green-500/30",
//       rejected: "bg-red-500/20 text-red-500 border-red-500/30",
//       submitted: "bg-blue-500/20 text-blue-500 border-blue-500/30",
//     };
//     return colors[status] || colors.inactive;
//   };

//   const getRiskLevelColor = (level) => {
//     if (level >= 8) return "text-red-500";
//     if (level >= 5) return "text-yellow-500";
//     return "text-green-500";
//   };

//   return (
//     <div className="min-h-screen bg-background text-foreground">
//       {/* Background Effects */}
//       <div className="fixed inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
//       <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

//       <div className="relative z-10">
//         {/* Header */}
//         <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
//           <div className="flex items-center justify-between px-8 py-4">
//             <div>
//               <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
//                 <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
//                   BV
//                 </div>
//                 Admin Dashboard
//               </h1>
//               <p className="text-sm text-muted-foreground mt-1 font-mono">
//                 CLASSIFIED SYSTEM ACCESS — ADMINISTRATOR LEVEL
//               </p>
//             </div>
//             <div className="flex items-center gap-3">
//               <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10">
//                 <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
//                 <span className="text-xs font-mono text-green-500">SYSTEM ONLINE</span>
//               </div>
//               <Button variant="outline" size="sm">
//                 <Settings className="h-4 w-4" />
//               </Button>
//               <Button variant="destructive" size="sm" onClick={handleSignout} className="hover:bg-red-600 hover:scale-105 transition-all duration-200">
//                 Sign Out
//               </Button>
//             </div>
//           </div>
//         </header>

//         {/* Main Content */}
//         <main className="p-8 max-w-[1600px] mx-auto">
//           {/* Stats Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
//             {stats.map((stat, index) => (
//               <motion.div
//                 key={stat.title}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ delay: index * 0.1 }}
//               >
//                 <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all">
//                   <CardHeader className="flex flex-row items-center justify-between pb-2">
//                     <CardTitle className="text-sm font-medium text-muted-foreground">
//                       {stat.title}
//                     </CardTitle>
//                     <div className={`p-2 rounded-lg ${stat.bgColor}`}>
//                       <stat.icon className={`h-4 w-4 ${stat.color}`} />
//                     </div>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="text-3xl font-bold font-mono">{stat.value}</div>
//                     <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
//                       <TrendingUp className="h-3 w-3" />
//                       {stat.change}
//                     </p>
//                   </CardContent>
//                 </Card>
//               </motion.div>
//             ))}
//           </div>

//           {/* Main Tabs */}
//           <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
//             <TabsList className="bg-card/50 border border-border/50 p-1">
//               <TabsTrigger value="overview" className="gap-2">
//                 <BarChart3 className="h-4 w-4" />
//                 Overview
//               </TabsTrigger>
//               <TabsTrigger value="thanas" className="gap-2">
//                 <Building2 className="h-4 w-4" />
//                 Thanas
//               </TabsTrigger>
//               <TabsTrigger value="officers" className="gap-2">
//                 <Shield className="h-4 w-4" />
//                 Officers
//               </TabsTrigger>
//               <TabsTrigger value="jails" className="gap-2">
//                 <Lock className="h-4 w-4" />
//                 Jails
//               </TabsTrigger>
//               <TabsTrigger value="criminals" className="gap-2">
//                 <Skull className="h-4 w-4" />
//                 Criminals
//               </TabsTrigger>
//               <TabsTrigger value="users" className="gap-2">
//                 <Users className="h-4 w-4" />
//                 Users
//               </TabsTrigger>
//               <TabsTrigger value="gd-reports" className="gap-2">
//                 <FileText className="h-4 w-4" />
//                 GD Reports
//               </TabsTrigger>
//             </TabsList>

//             {/* Overview Tab */}
//             <TabsContent value="overview" className="space-y-6">
//               <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Recent Activity */}
//                 <Card className="border-border/50 bg-card/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Activity className="h-5 w-5 text-primary" />
//                       Recent Activity
//                     </CardTitle>
//                     <CardDescription>Latest system updates and changes</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div className="flex items-start gap-3 pb-3 border-b border-border/50">
//                         <div className="p-2 rounded-lg bg-green-500/10">
//                           <Shield className="h-4 w-4 text-green-500" />
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium">New officer registered</p>
//                           <p className="text-xs text-muted-foreground">Inspector Rahman at Motijheel — 2 hours ago</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3 pb-3 border-b border-border/50">
//                         <div className="p-2 rounded-lg bg-red-500/10">
//                           <Skull className="h-4 w-4 text-red-500" />
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium">Criminal status updated</p>
//                           <p className="text-xs text-muted-foreground">Karim Abdullah marked as escaped — 4 hours ago</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3 pb-3 border-b border-border/50">
//                         <div className="p-2 rounded-lg bg-blue-500/10">
//                           <Building2 className="h-4 w-4 text-blue-500" />
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium">New thana added</p>
//                           <p className="text-xs text-muted-foreground">Uttara Police Station — Yesterday</p>
//                         </div>
//                       </div>
//                       <div className="flex items-start gap-3">
//                         <div className="p-2 rounded-lg bg-yellow-500/10">
//                           <FileText className="h-4 w-4 text-yellow-500" />
//                         </div>
//                         <div className="flex-1">
//                           <p className="text-sm font-medium">GD Report approved</p>
//                           <p className="text-xs text-muted-foreground">Report #12346 at Gulshan — Yesterday</p>
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 {/* System Health */}
//                 <Card className="border-border/50 bg-card/50">
//                   <CardHeader>
//                     <CardTitle className="flex items-center gap-2">
//                       <Database className="h-5 w-5 text-primary" />
//                       System Health
//                     </CardTitle>
//                     <CardDescription>Infrastructure status and metrics</CardDescription>
//                   </CardHeader>
//                   <CardContent>
//                     <div className="space-y-4">
//                       <div>
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="text-sm font-medium">Database Load</span>
//                           <span className="text-sm text-green-500">23%</span>
//                         </div>
//                         <div className="h-2 bg-border rounded-full overflow-hidden">
//                           <div className="h-full bg-green-500 w-[23%]" />
//                         </div>
//                       </div>
//                       <div>
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="text-sm font-medium">API Response Time</span>
//                           <span className="text-sm text-green-500">124ms</span>
//                         </div>
//                         <div className="h-2 bg-border rounded-full overflow-hidden">
//                           <div className="h-full bg-green-500 w-[15%]" />
//                         </div>
//                       </div>
//                       <div>
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="text-sm font-medium">Storage Usage</span>
//                           <span className="text-sm text-yellow-500">67%</span>
//                         </div>
//                         <div className="h-2 bg-border rounded-full overflow-hidden">
//                           <div className="h-full bg-yellow-500 w-[67%]" />
//                         </div>
//                       </div>
//                       <div>
//                         <div className="flex items-center justify-between mb-2">
//                           <span className="text-sm font-medium">Active Sessions</span>
//                           <span className="text-sm text-blue-500">342</span>
//                         </div>
//                         <div className="h-2 bg-border rounded-full overflow-hidden">
//                           <div className="h-full bg-blue-500 w-[45%]" />
//                         </div>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Alerts */}
//               <Card className="border-yellow-500/30 bg-yellow-500/5">
//                 <CardHeader>
//                   <CardTitle className="flex items-center gap-2 text-yellow-500">
//                     <AlertCircle className="h-5 w-5" />
//                     System Alerts
//                   </CardTitle>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="space-y-3">
//                     <div className="flex items-center gap-3 p-3 rounded-lg border border-red-500/30 bg-red-500/5">
//                       <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-red-500">Dhaka Central Jail Overcrowded</p>
//                         <p className="text-xs text-muted-foreground mt-1">
//                           Current occupancy: 1450/1200 (121%) — Immediate action required
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex items-center gap-3 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5">
//                       <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />
//                       <div className="flex-1">
//                         <p className="text-sm font-medium text-yellow-500">23 Unassigned GD Reports</p>
//                         <p className="text-xs text-muted-foreground mt-1">
//                           Reports awaiting officer assignment across 8 thanas
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Thanas Tab */}
//             <TabsContent value="thanas" className="space-y-6">
//               <Card className="border-border/50 bg-card/50">
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle>Police Stations (Thanas)</CardTitle>
//                       <CardDescription>Manage and monitor all thanas in the system</CardDescription>
//                     </div>
//                     <Button className="gap-2 bg-primary hover:bg-primary/90">
//                       <Plus className="h-4 w-4" />
//                       Add Thana
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex gap-4 mb-6">
//                     <div className="flex-1 relative">
//                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input
//                         placeholder="Search thanas..."
//                         value={searchQuery}
//                         onChange={(e) => setSearchQuery(e.target.value)}
//                         className="pl-10"
//                       />
//                     </div>
//                     <Select defaultValue="all">
//                       <SelectTrigger className="w-[180px]">
//                         <SelectValue placeholder="Filter by district" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Districts</SelectItem>
//                         <SelectItem value="dhaka">Dhaka</SelectItem>
//                         <SelectItem value="chittagong">Chittagong</SelectItem>
//                         <SelectItem value="sylhet">Sylhet</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="border border-border rounded-lg overflow-hidden">
//                     <Table>
//                       <TableHeader>
//                         <TableRow className="bg-muted/50">
//                           <TableHead>Thana ID</TableHead>
//                           <TableHead>Name</TableHead>
//                           <TableHead>District</TableHead>
//                           <TableHead>Zone</TableHead>
//                           <TableHead>Officers</TableHead>
//                           <TableHead>Status</TableHead>
//                           <TableHead className="text-right">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {recentThanas.map((thana) => (
//                           <TableRow key={thana.id} className="hover:bg-muted/30">
//                             <TableCell className="font-mono text-xs">{thana.id}</TableCell>
//                             <TableCell className="font-medium">{thana.name}</TableCell>
//                             <TableCell>{thana.district}</TableCell>
//                             <TableCell>{thana.zone}</TableCell>
//                             <TableCell>
//                               <Badge variant="outline" className="gap-1">
//                                 <Shield className="h-3 w-3" />
//                                 {thana.officers}
//                               </Badge>
//                             </TableCell>
//                             <TableCell>
//                               <Badge variant="outline" className={getStatusColor(thana.status)}>
//                                 {thana.status}
//                               </Badge>
//                             </TableCell>
//                             <TableCell className="text-right">
//                               <div className="flex items-center justify-end gap-2">
//                                 <Button variant="ghost" size="sm">
//                                   <Eye className="h-4 w-4" />
//                                 </Button>
//                                 <Button variant="ghost" size="sm">
//                                   <Edit className="h-4 w-4" />
//                                 </Button>
//                                 <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-500 hover:bg-red-500/10">
//                                   <Trash2 className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Officers Tab */}
//             <TabsContent value="officers" className="space-y-6">
//               <Card className="border-border/50 bg-card/50">
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle>Law Enforcement Officers</CardTitle>
//                       <CardDescription>View and manage all officers by thana</CardDescription>
//                     </div>
//                     <Button className="gap-2 bg-primary hover:bg-primary/90">
//                       <Plus className="h-4 w-4" />
//                       Add Officer
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex gap-4 mb-6">
//                     <div className="flex-1 relative">
//                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input placeholder="Search officers..." className="pl-10" />
//                     </div>
//                     <Select defaultValue="all">
//                       <SelectTrigger className="w-[180px]">
//                         <SelectValue placeholder="Filter by thana" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Thanas</SelectItem>
//                         <SelectItem value="motijheel">Motijheel</SelectItem>
//                         <SelectItem value="gulshan">Gulshan</SelectItem>
//                         <SelectItem value="dhanmondi">Dhanmondi</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <Select defaultValue="all-ranks">
//                       <SelectTrigger className="w-[180px]">
//                         <SelectValue placeholder="Filter by rank" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all-ranks">All Ranks</SelectItem>
//                         <SelectItem value="oc">Officer-in-Charge</SelectItem>
//                         <SelectItem value="inspector">Inspector</SelectItem>
//                         <SelectItem value="si">Sub-Inspector</SelectItem>
//                         <SelectItem value="constable">Constable</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="border border-border rounded-lg overflow-hidden">
//                     <Table>
//                       <TableHeader>
//                         <TableRow className="bg-muted/50">
//                           <TableHead>Officer ID</TableHead>
//                           <TableHead>Name</TableHead>
//                           <TableHead>Badge No.</TableHead>
//                           <TableHead>Rank</TableHead>
//                           <TableHead>Thana</TableHead>
//                           <TableHead>Status</TableHead>
//                           <TableHead className="text-right">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {recentOfficers.map((officer) => (
//                           <TableRow key={officer.id} className="hover:bg-muted/30">
//                             <TableCell className="font-mono text-xs">{officer.id}</TableCell>
//                             <TableCell className="font-medium">{officer.name}</TableCell>
//                             <TableCell className="font-mono text-xs">{officer.badge}</TableCell>
//                             <TableCell>
//                               <Badge variant="outline">{officer.rank}</Badge>
//                             </TableCell>
//                             <TableCell>{officer.thana}</TableCell>
//                             <TableCell>
//                               <Badge variant="outline" className={getStatusColor(officer.status)}>
//                                 {officer.status}
//                               </Badge>
//                             </TableCell>
//                             <TableCell className="text-right">
//                               <div className="flex items-center justify-end gap-2">
//                                 <Button variant="ghost" size="sm">
//                                   <Eye className="h-4 w-4" />
//                                 </Button>
//                                 <Button variant="ghost" size="sm">
//                                   <Edit className="h-4 w-4" />
//                                 </Button>
//                                 <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-500 hover:bg-red-500/10">
//                                   <Trash2 className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Jails Tab */}
//             <TabsContent value="jails" className="space-y-6">
//               <Card className="border-border/50 bg-card/50">
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle>Jail Facilities</CardTitle>
//                       <CardDescription>Monitor jail capacity and manage facilities</CardDescription>
//                     </div>
//                     <Button className="gap-2 bg-primary hover:bg-primary/90">
//                       <Plus className="h-4 w-4" />
//                       Add Jail
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex gap-4 mb-6">
//                     <div className="flex-1 relative">
//                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input placeholder="Search jails..." className="pl-10" />
//                     </div>
//                     <Select defaultValue="all">
//                       <SelectTrigger className="w-[180px]">
//                         <SelectValue placeholder="Filter by status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Statuses</SelectItem>
//                         <SelectItem value="normal">Normal</SelectItem>
//                         <SelectItem value="overcrowded">Overcrowded</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="border border-border rounded-lg overflow-hidden">
//                     <Table>
//                       <TableHeader>
//                         <TableRow className="bg-muted/50">
//                           <TableHead>Jail ID</TableHead>
//                           <TableHead>Name</TableHead>
//                           <TableHead>District</TableHead>
//                           <TableHead>Zone</TableHead>
//                           <TableHead>Capacity</TableHead>
//                           <TableHead>Occupancy</TableHead>
//                           <TableHead>Status</TableHead>
//                           <TableHead className="text-right">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {recentJails.map((jail) => (
//                           <TableRow key={jail.id} className="hover:bg-muted/30">
//                             <TableCell className="font-mono text-xs">{jail.id}</TableCell>
//                             <TableCell className="font-medium">{jail.name}</TableCell>
//                             <TableCell>{jail.district}</TableCell>
//                             <TableCell>{jail.zone}</TableCell>
//                             <TableCell className="font-mono">{jail.capacity}</TableCell>
//                             <TableCell>
//                               <div className="flex items-center gap-2">
//                                 <span className="font-mono">{jail.occupancy}</span>
//                                 <span className="text-xs text-muted-foreground">
//                                   ({Math.round((jail.occupancy / jail.capacity) * 100)}%)
//                                 </span>
//                               </div>
//                             </TableCell>
//                             <TableCell>
//                               <Badge variant="outline" className={getStatusColor(jail.status)}>
//                                 {jail.status}
//                               </Badge>
//                             </TableCell>
//                             <TableCell className="text-right">
//                               <div className="flex items-center justify-end gap-2">
//                                 <Button variant="ghost" size="sm">
//                                   <Eye className="h-4 w-4" />
//                                 </Button>
//                                 <Button variant="ghost" size="sm">
//                                   <Edit className="h-4 w-4" />
//                                 </Button>
//                                 <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-500 hover:bg-red-500/10">
//                                   <Trash2 className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Criminals Tab */}
//             <TabsContent value="criminals" className="space-y-6">
//               <Card className="border-border/50 bg-card/50">
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle>Criminal Registry</CardTitle>
//                       <CardDescription>Monitor and manage all registered criminals</CardDescription>
//                     </div>
//                     <Button className="gap-2 bg-primary hover:bg-primary/90">
//                       <Plus className="h-4 w-4" />
//                       Register Criminal
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex gap-4 mb-6">
//                     <div className="flex-1 relative">
//                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input placeholder="Search criminals..." className="pl-10" />
//                     </div>
//                     <Select defaultValue="all">
//                       <SelectTrigger className="w-[180px]">
//                         <SelectValue placeholder="Filter by status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Statuses</SelectItem>
//                         <SelectItem value="in_custody">In Custody</SelectItem>
//                         <SelectItem value="on_bail">On Bail</SelectItem>
//                         <SelectItem value="released">Released</SelectItem>
//                         <SelectItem value="escaped">Escaped</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="border border-border rounded-lg overflow-hidden">
//                     <Table>
//                       <TableHeader>
//                         <TableRow className="bg-muted/50">
//                           <TableHead>Criminal ID</TableHead>
//                           <TableHead>Name</TableHead>
//                           <TableHead>NID</TableHead>
//                           <TableHead>Risk Level</TableHead>
//                           <TableHead>Status</TableHead>
//                           <TableHead>Registered Thana</TableHead>
//                           <TableHead className="text-right">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {recentCriminals.map((criminal) => (
//                           <TableRow key={criminal.id} className="hover:bg-muted/30">
//                             <TableCell className="font-mono text-xs">{criminal.id}</TableCell>
//                             <TableCell className="font-medium">{criminal.name}</TableCell>
//                             <TableCell className="font-mono text-xs">{criminal.nid}</TableCell>
//                             <TableCell>
//                               <div className="flex items-center gap-2">
//                                 <div className="flex items-center gap-1">
//                                   {[...Array(10)].map((_, i) => (
//                                     <div
//                                       key={i}
//                                       className={`h-2 w-1 rounded-full ${
//                                         i < criminal.riskLevel ? getRiskLevelColor(criminal.riskLevel) : "bg-border"
//                                       }`}
//                                       style={{ backgroundColor: i < criminal.riskLevel ? undefined : undefined }}
//                                     />
//                                   ))}
//                                 </div>
//                                 <span className={`text-xs font-mono ${getRiskLevelColor(criminal.riskLevel)}`}>
//                                   {criminal.riskLevel}/10
//                                 </span>
//                               </div>
//                             </TableCell>
//                             <TableCell>
//                               <Badge variant="outline" className={getStatusColor(criminal.status)}>
//                                 {criminal.status.replace("_", " ")}
//                               </Badge>
//                             </TableCell>
//                             <TableCell>{criminal.thana}</TableCell>
//                             <TableCell className="text-right">
//                               <div className="flex items-center justify-end gap-2">
//                                 <Button variant="ghost" size="sm">
//                                   <Eye className="h-4 w-4" />
//                                 </Button>
//                                 <Button variant="ghost" size="sm">
//                                   <Edit className="h-4 w-4" />
//                                 </Button>
//                                 <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-500 hover:bg-red-500/10">
//                                   <Trash2 className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* Users Tab */}
//             <TabsContent value="users" className="space-y-6">
//               <Card className="border-border/50 bg-card/50">
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle>Registered Users</CardTitle>
//                       <CardDescription>Manage civilian user accounts</CardDescription>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex gap-4 mb-6">
//                     <div className="flex-1 relative">
//                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input placeholder="Search users..." className="pl-10" />
//                     </div>
//                   </div>

//                   <div className="text-center py-12 text-muted-foreground">
//                     <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
//                     <p>User management interface</p>
//                     <p className="text-sm mt-2">View and manage all registered civilian users</p>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>

//             {/* GD Reports Tab */}
//             <TabsContent value="gd-reports" className="space-y-6">
//               <Card className="border-border/50 bg-card/50">
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle>General Diary (GD) Reports</CardTitle>
//                       <CardDescription>View and manage GD reports by thana</CardDescription>
//                     </div>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="flex gap-4 mb-6">
//                     <div className="flex-1 relative">
//                       <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//                       <Input placeholder="Search GD reports..." className="pl-10" />
//                     </div>
//                     <Select defaultValue="all">
//                       <SelectTrigger className="w-[180px]">
//                         <SelectValue placeholder="Filter by thana" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all">All Thanas</SelectItem>
//                         <SelectItem value="motijheel">Motijheel</SelectItem>
//                         <SelectItem value="gulshan">Gulshan</SelectItem>
//                         <SelectItem value="dhanmondi">Dhanmondi</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <Select defaultValue="all-status">
//                       <SelectTrigger className="w-[180px]">
//                         <SelectValue placeholder="Filter by status" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="all-status">All Statuses</SelectItem>
//                         <SelectItem value="assigned">Assigned</SelectItem>
//                         <SelectItem value="approved">Approved</SelectItem>
//                         <SelectItem value="rejected">Rejected</SelectItem>
//                         <SelectItem value="submitted">Submitted</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="border border-border rounded-lg overflow-hidden">
//                     <Table>
//                       <TableHeader>
//                         <TableRow className="bg-muted/50">
//                           <TableHead>GD ID</TableHead>
//                           <TableHead>Thana</TableHead>
//                           <TableHead>Submitted By</TableHead>
//                           <TableHead>Date</TableHead>
//                           <TableHead>Status</TableHead>
//                           <TableHead className="text-right">Actions</TableHead>
//                         </TableRow>
//                       </TableHeader>
//                       <TableBody>
//                         {recentGDReports.map((report) => (
//                           <TableRow key={report.id} className="hover:bg-muted/30">
//                             <TableCell className="font-mono text-xs">#{report.id}</TableCell>
//                             <TableCell>{report.thana}</TableCell>
//                             <TableCell>{report.submittedBy}</TableCell>
//                             <TableCell className="text-sm text-muted-foreground">{report.date}</TableCell>
//                             <TableCell>
//                               <Badge variant="outline" className={getStatusColor(report.status)}>
//                                 {report.status}
//                               </Badge>
//                             </TableCell>
//                             <TableCell className="text-right">
//                               <div className="flex items-center justify-end gap-2">
//                                 <Button variant="ghost" size="sm">
//                                   <Eye className="h-4 w-4" />
//                                 </Button>
//                                 <Button variant="ghost" size="sm">
//                                   <Edit className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </TableCell>
//                           </TableRow>
//                         ))}
//                       </TableBody>
//                     </Table>
//                   </div>
//                 </CardContent>
//               </Card>
//             </TabsContent>
//           </Tabs>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminSignoutApi } from "@/services/authServices/signoutApi";
import {
  getAllThanas,
  getAllOfficers,
  getAllCriminals,
  getAllRanks,
  getAllJails,
  getAllUsers,
  getAllGDReports,
  getDashboardOverview,
  addThana,
  addJail,
  addRank,
  addHeadOfficer as _addHeadOfficer,
  deleteThana,
} from "@/services/Admin/adminApi";
import {
  getAllCriminalLocations,
  getAllCriminalOrganizationLinks,
  getAllCriminalRelations,
  getAllLocations,
  getAllOrganizations,
} from "@/services/Thana/thanaApi";
import {
  getCriminalRanking,
  getDistrictCrimeStats,
  getOfficerWorkload,
  getThanaPerformance,
} from "@/services/Analytics/analyticsApi";
import { getUnreadNotificationCount } from "@/services/Notification/notificationApi";
import userStore from "@/state/userStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function AdminDashboard() {
  const navigate = useNavigate();
  const { clearUser, user } = userStore();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddThana, setShowAddThana] = useState(false);
  const [showAddJail, setShowAddJail] = useState(false);
  const [showAddRank, setShowAddRank] = useState(false);

  // Form states
  const [thanaForm, setThanaForm] = useState({
    thana_name: "",
    district: "",
    zone: "",
    address: "",
    phone: "",
    email: "",
    password: "",
    created_by_admin_id: "",
  });
  const [rankForm, setRankForm] = useState({
    rank_code: "",
    rank_name: "",
    level: "",
  });
  const [jailForm, setJailForm] = useState({
    jail_name: "",
    district: "",
    zone: "",
    address: "",
    capacity: "",
    email: "",
    password: "",
  });

  const handleSignout = async () => {
    await adminSignoutApi();
    clearUser();
    navigate("/");
  };

  useEffect(() => {
    const id = user?.admin_id || user?.thana_id || user?.officer_id || user?.jail_id || user?.user_id;
    if (!id) return;

    if (String(id).startsWith("ADM")) return;
    if (String(id).startsWith("JAL")) {
      navigate("/jail/dashboard", { replace: true });
      return;
    }
    if (String(id).startsWith("THN")) {
      navigate("/thana/dashboard", { replace: true });
      return;
    }
    if (String(id).startsWith("OFC")) {
      navigate("/officer/dashboard", { replace: true });
      return;
    }
    if (String(id).startsWith("USR")) {
      navigate("/user/dashboard", { replace: true });
    }
  }, [navigate, user]);

  // Queries — live data from backend
  const { data: thanasData } = useQuery({
    queryKey: ["allThanas"],
    queryFn: getAllThanas,
  });
  const { data: officersData } = useQuery({
    queryKey: ["allOfficers"],
    queryFn: getAllOfficers,
  });
  const { data: criminalsData } = useQuery({
    queryKey: ["allCriminals"],
    queryFn: getAllCriminals,
  });
  const { data: ranksData } = useQuery({
    queryKey: ["allRanks"],
    queryFn: getAllRanks,
  });
  const { data: jailsData } = useQuery({
    queryKey: ["allJails"],
    queryFn: getAllJails,
  });
  const { data: usersData } = useQuery({
    queryKey: ["allUsers"],
    queryFn: getAllUsers,
  });
  const { data: gdData } = useQuery({
    queryKey: ["allGDReports"],
    queryFn: getAllGDReports,
  });
  const { data: organizationsData } = useQuery({
    queryKey: ["allOrganizations"],
    queryFn: getAllOrganizations,
  });
  const { data: locationsData } = useQuery({
    queryKey: ["allLocations"],
    queryFn: getAllLocations,
  });
  const { data: criminalOrgLinksData } = useQuery({
    queryKey: ["allCriminalOrgLinks"],
    queryFn: getAllCriminalOrganizationLinks,
  });
  const { data: criminalRelationsData } = useQuery({
    queryKey: ["allCriminalRelations"],
    queryFn: getAllCriminalRelations,
  });
  const { data: criminalLocationLinksData } = useQuery({
    queryKey: ["allCriminalLocationLinks"],
    queryFn: getAllCriminalLocations,
  });
  const { data: _overviewData } = useQuery({
    queryKey: ["dashboardOverview"],
    queryFn: getDashboardOverview,
  });
  const { data: districtStatsData } = useQuery({
    queryKey: ["admin-district-stats"],
    queryFn: getDistrictCrimeStats,
  });
  const { data: officerWorkloadData } = useQuery({
    queryKey: ["admin-officer-workload"],
    queryFn: getOfficerWorkload,
  });
  const { data: criminalRankingData } = useQuery({
    queryKey: ["admin-criminal-ranking"],
    queryFn: getCriminalRanking,
  });
  const { data: thanaPerformanceData } = useQuery({
    queryKey: ["admin-thana-performance"],
    queryFn: getThanaPerformance,
  });
  const { data: unreadNotificationData } = useQuery({
    queryKey: ["admin-unread-notification-count"],
    queryFn: getUnreadNotificationCount,
  });

  const thanas = thanasData?.data || [];
  const officers = officersData?.data || [];
  const criminals = criminalsData?.data || [];
  const ranks = ranksData?.data || [];
  const jails = jailsData?.data || [];
  const users = usersData?.data || [];
  const gdReports = gdData?.data || [];
  const organizations = organizationsData?.data || [];
  const locations = locationsData?.data || [];
  const criminalOrgLinks = criminalOrgLinksData?.data || [];
  const criminalRelations = criminalRelationsData?.data || [];
  const criminalLocationLinks = criminalLocationLinksData?.data || [];
  const districtStats = districtStatsData?.data || [];
  const officerWorkload = officerWorkloadData?.data || [];
  const criminalRanking = criminalRankingData?.data || [];
  const thanaPerformance = thanaPerformanceData?.data || [];
  const unreadNotificationCount = Number(
    unreadNotificationData?.data?.unread_count || 0,
  );

  // Mutations
  const addThanaMut = useMutation({
    mutationFn: (d) => addThana(d),
    onSuccess: (r) => {
      if (r.success) {
        queryClient.invalidateQueries(["allThanas"]);
        setShowAddThana(false);
        setThanaForm({
          thana_name: "",
          district: "",
          zone: "",
          address: "",
          phone: "",
          email: "",
          password: "",
          created_by_admin_id: "",
        });
      } else {
        alert(r.message);
      }
    },
  });
  const addRankMut = useMutation({
    mutationFn: (d) => addRank(d),
    onSuccess: (r) => {
      if (r.success) {
        queryClient.invalidateQueries(["allRanks"]);
        setShowAddRank(false);
        setRankForm({ rank_code: "", rank_name: "", level: "" });
      } else {
        alert(r.message);
      }
    },
  });
  const addJailMut = useMutation({
    mutationFn: (d) => addJail(d),
    onSuccess: (r) => {
      if (r.success) {
        queryClient.invalidateQueries(["allJails"]);
        setShowAddJail(false);
        setJailForm({
          jail_name: "",
          district: "",
          zone: "",
          address: "",
          capacity: "",
          email: "",
          password: "",
        });
      } else {
        alert(r.message || "Failed to add jail");
      }
    },
  });
  const deleteThanaMut = useMutation({
    mutationFn: (id) => deleteThana(id),
    onSuccess: () => queryClient.invalidateQueries(["allThanas"]),
  });

  const statusColor = (s) => {
    const c = {
      active: "text-green-400 bg-green-500/10",
      in_custody: "text-red-400 bg-red-500/10",
      on_bail: "text-yellow-400 bg-yellow-500/10",
      wanted: "text-orange-400 bg-orange-500/10",
      escaped: "text-rose-400 bg-rose-500/10",
      released: "text-blue-400 bg-blue-500/10",
      unknown: "text-gray-400 bg-gray-500/10",
      assigned: "text-yellow-400 bg-yellow-500/10",
      approved: "text-green-400 bg-green-500/10",
      rejected: "text-red-400 bg-red-500/10",
      submitted: "text-blue-400 bg-blue-500/10",
    };
    return c[s] || "text-gray-400 bg-gray-500/10";
  };

  const inputCls =
    "w-full bg-gray-800 border border-white/10 text-slate-200 text-sm rounded-lg px-3 py-2 outline-none focus:border-blue-500/50";
  const btnCls =
    "px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200";

  const renderTable = (rows, columns, emptyText = "No data found") => (
    <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
            {columns.map((c) => (
              <th key={c.key} className="text-left p-3">
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="p-6 text-center text-slate-500">
                {emptyText}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={idx} className="border-b border-white/5 hover:bg-white/[0.02]">
                {columns.map((c) => (
                  <td key={c.key} className="p-3 text-slate-200">
                    {row?.[c.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "thanas", label: `Thanas (${thanas.length})` },
    { id: "officers", label: `Officers (${officers.length})` },
    { id: "criminals", label: `Criminals (${criminals.length})` },
    { id: "jails", label: `Jails (${jails.length})` },
    { id: "organizations", label: `Organizations (${organizations.length})` },
    { id: "locations", label: `Locations (${locations.length})` },
    { id: "criminal-relations", label: `Relations (${criminalRelations.length})` },
    { id: "criminal-org-links", label: `Org Links (${criminalOrgLinks.length})` },
    { id: "criminal-location-links", label: `Location Links (${criminalLocationLinks.length})` },
    { id: "ranks", label: `Ranks (${ranks.length})` },
    { id: "users", label: `Users (${users.length})` },
    { id: "gd-reports", label: `GD Reports (${gdReports.length})` },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-slate-200">
      {/* Header */}
      <header className="border-b border-white/5 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white text-sm">
              BV
            </div>
            <div>
              <h1 className="text-lg font-bold">Admin Dashboard</h1>
              <p className="text-xs text-slate-500 font-mono">
                BLACK VEIN ORACLE
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/admin/dashboard/notifications")}
              className="relative w-10 h-10 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 text-blue-300 rounded-lg transition-all flex items-center justify-center"
              aria-label="Notifications"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadNotificationCount}
                </span>
              )}
            </button>
            <button
              onClick={handleSignout}
              className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-sm rounded-lg transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-6 bg-gray-900 border border-white/5 rounded-xl p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-2 text-sm rounded-lg transition-all ${activeTab === t.id ? "bg-blue-600 text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Thanas", val: thanas.length, color: "text-blue-400" },
              {
                label: "Officers",
                val: officers.length,
                color: "text-green-400",
              },
              {
                label: "Criminals",
                val: criminals.length,
                color: "text-red-400",
              },
              { label: "Jails", val: jails.length, color: "text-purple-400" },
              { label: "Ranks", val: ranks.length, color: "text-cyan-400" },
              { label: "Users", val: users.length, color: "text-amber-400" },
              {
                label: "Organizations",
                val: organizations.length,
                color: "text-fuchsia-400",
              },
              {
                label: "Locations",
                val: locations.length,
                color: "text-teal-400",
              },
              {
                label: "GD Reports",
                val: gdReports.length,
                color: "text-emerald-400",
              },
              {
                label: "In Custody",
                val: criminals.filter((c) => c.status === "in_custody").length,
                color: "text-orange-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="bg-gray-900 border border-white/5 rounded-xl p-4"
              >
                <p className="text-xs text-slate-500 uppercase tracking-wider">
                  {s.label}
                </p>
                <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.val}</p>
              </div>
            ))}
          </div>
        )}

        {/* Thanas */}
        {activeTab === "thanas" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Police Stations</h2>
              <button
                onClick={() => setShowAddThana(!showAddThana)}
                className={`${btnCls} bg-blue-600 hover:bg-blue-500 text-white`}
              >
                + Add Thana
              </button>
            </div>

            {showAddThana && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addThanaMut.mutate(thanaForm);
                }}
                className="bg-gray-900 border border-white/5 rounded-xl p-5 grid grid-cols-2 gap-3"
              >
                <input
                  placeholder="Thana Name"
                  value={thanaForm.thana_name}
                  onChange={(e) =>
                    setThanaForm({ ...thanaForm, thana_name: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="District"
                  value={thanaForm.district}
                  onChange={(e) =>
                    setThanaForm({ ...thanaForm, district: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Zone"
                  value={thanaForm.zone}
                  onChange={(e) =>
                    setThanaForm({ ...thanaForm, zone: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Address"
                  value={thanaForm.address}
                  onChange={(e) =>
                    setThanaForm({ ...thanaForm, address: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Phone"
                  value={thanaForm.phone}
                  onChange={(e) =>
                    setThanaForm({ ...thanaForm, phone: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Email"
                  type="email"
                  value={thanaForm.email}
                  onChange={(e) =>
                    setThanaForm({ ...thanaForm, email: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={thanaForm.password}
                  onChange={(e) =>
                    setThanaForm({ ...thanaForm, password: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Admin ID (e.g. ADM-0000001)"
                  value={thanaForm.created_by_admin_id}
                  onChange={(e) =>
                    setThanaForm({
                      ...thanaForm,
                      created_by_admin_id: e.target.value,
                    })
                  }
                  className={inputCls}
                  required
                />
                <div className="col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={addThanaMut.isPending}
                    className={`${btnCls} bg-green-600 hover:bg-green-500 text-white`}
                  >
                    {addThanaMut.isPending ? "Adding..." : "Add Thana"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddThana(false)}
                    className={`${btnCls} bg-gray-700 text-slate-300`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">District</th>
                    <th className="text-left p-3">Zone</th>
                    <th className="text-left p-3">Phone</th>
                    <th className="text-right p-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {thanas.map((t) => (
                    <tr
                      key={t.thana_id}
                      className="border-b border-white/5 hover:bg-white/[0.02]"
                    >
                      <td className="p-3 font-mono text-xs">{t.thana_id}</td>
                      <td className="p-3 font-medium">{t.thana_name}</td>
                      <td className="p-3 text-slate-400">{t.district}</td>
                      <td className="p-3 text-slate-400">{t.zone}</td>
                      <td className="p-3 text-slate-400">{t.phone}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => {
                            if (confirm("Delete this thana?"))
                              deleteThanaMut.mutate(t.thana_id);
                          }}
                          className="text-red-400 hover:text-red-300 text-xs"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                  {thanas.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="p-6 text-center text-slate-500"
                      >
                        No thanas found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Officers */}
        {activeTab === "officers" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Badge</th>
                  <th className="text-left p-3">Rank</th>
                  <th className="text-left p-3">Thana</th>
                </tr>
              </thead>
              <tbody>
                {officers.map((o) => (
                  <tr
                    key={o.officer_id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="p-3 font-mono text-xs">{o.officer_id}</td>
                    <td className="p-3 font-medium">{o.full_name}</td>
                    <td className="p-3 text-slate-400 font-mono text-xs">
                      {o.badge_no}
                    </td>
                    <td className="p-3 text-slate-400">{o.rank_code}</td>
                    <td className="p-3 text-slate-400">{o.thana_id}</td>
                  </tr>
                ))}
                {officers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-slate-500">
                      No officers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Criminals */}
        {activeTab === "criminals" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">NID</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Risk</th>
                  <th className="text-left p-3">Thana</th>
                </tr>
              </thead>
              <tbody>
                {criminals.map((c) => (
                  <tr
                    key={c.criminal_id}
                    className="border-b border-white/5 hover:bg-white/[0.02]"
                  >
                    <td className="p-3 font-mono text-xs">{c.criminal_id}</td>
                    <td className="p-3 font-medium">{c.full_name}</td>
                    <td className="p-3 text-slate-400 font-mono text-xs">
                      {c.nid}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${statusColor(c.status)}`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{c.risk_level}/10</td>
                    <td className="p-3 text-slate-400">
                      {c.registered_thana_id}
                    </td>
                  </tr>
                ))}
                {criminals.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No criminals found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Jails */}
        {activeTab === "jails" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Jails</h2>
              <button
                onClick={() => setShowAddJail(!showAddJail)}
                className={`${btnCls} bg-blue-600 hover:bg-blue-500 text-white`}
              >
                + Add Jail
              </button>
            </div>

            {showAddJail && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addJailMut.mutate({
                    ...jailForm,
                    capacity: Number(jailForm.capacity || 0),
                  });
                }}
                className="bg-gray-900 border border-white/5 rounded-xl p-5 grid grid-cols-2 gap-3"
              >
                <input
                  placeholder="Jail Name"
                  value={jailForm.jail_name}
                  onChange={(e) =>
                    setJailForm({ ...jailForm, jail_name: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="District"
                  value={jailForm.district}
                  onChange={(e) =>
                    setJailForm({ ...jailForm, district: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Zone"
                  value={jailForm.zone}
                  onChange={(e) =>
                    setJailForm({ ...jailForm, zone: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Address"
                  value={jailForm.address}
                  onChange={(e) =>
                    setJailForm({ ...jailForm, address: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Capacity"
                  type="number"
                  min="1"
                  value={jailForm.capacity}
                  onChange={(e) =>
                    setJailForm({ ...jailForm, capacity: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Email"
                  type="email"
                  value={jailForm.email}
                  onChange={(e) =>
                    setJailForm({ ...jailForm, email: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Password"
                  type="password"
                  value={jailForm.password}
                  onChange={(e) =>
                    setJailForm({ ...jailForm, password: e.target.value })
                  }
                  className={`${inputCls} col-span-2`}
                  required
                />
                <div className="col-span-2 flex gap-2">
                  <button
                    type="submit"
                    disabled={addJailMut.isPending}
                    className={`${btnCls} bg-green-600 hover:bg-green-500 text-white`}
                  >
                    {addJailMut.isPending ? "Adding..." : "Add Jail"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddJail(false)}
                    className={`${btnCls} bg-gray-700 text-slate-300`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                    <th className="text-left p-3">ID</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">District</th>
                    <th className="text-left p-3">Zone</th>
                    <th className="text-left p-3">Capacity</th>
                  </tr>
                </thead>
                <tbody>
                  {jails.map((j) => (
                    <tr
                      key={j.jail_id}
                      className="border-b border-white/5 hover:bg-white/[0.02]"
                    >
                      <td className="p-3 font-mono text-xs">{j.jail_id}</td>
                      <td className="p-3 font-medium">{j.jail_name}</td>
                      <td className="p-3 text-slate-400">{j.district}</td>
                      <td className="p-3 text-slate-400">{j.zone}</td>
                      <td className="p-3 font-mono">{j.capacity}</td>
                    </tr>
                  ))}
                  {jails.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-slate-500">
                        No jails found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Organizations */}
        {activeTab === "organizations" &&
          renderTable(organizations, [
            { key: "org_id", label: "ID" },
            { key: "name", label: "Name" },
            { key: "ideology", label: "Ideology" },
            { key: "threat_level", label: "Threat" },
          ])}

        {/* Locations */}
        {activeTab === "locations" &&
          renderTable(locations, [
            { key: "location_id", label: "ID" },
            { key: "district", label: "District" },
            { key: "zone", label: "Zone" },
            { key: "address", label: "Address" },
          ])}

        {/* Criminal Relations */}
        {activeTab === "criminal-relations" &&
          renderTable(criminalRelations, [
            { key: "relation_id", label: "Relation ID" },
            { key: "criminal_id_1", label: "Criminal A ID" },
            { key: "criminal_1_name", label: "Criminal A Name" },
            { key: "criminal_id_2", label: "Criminal B ID" },
            { key: "criminal_2_name", label: "Criminal B Name" },
            { key: "relation_type", label: "Type" },
          ])}

        {/* Criminal Organization Links */}
        {activeTab === "criminal-org-links" &&
          renderTable(criminalOrgLinks, [
            { key: "criminal_id", label: "Criminal ID" },
            { key: "criminal_name", label: "Criminal Name" },
            { key: "org_id", label: "Org ID" },
            { key: "organization_name", label: "Organization" },
            { key: "threat_level", label: "Threat" },
            { key: "role", label: "Role" },
          ])}

        {/* Criminal Location Links */}
        {activeTab === "criminal-location-links" &&
          renderTable(criminalLocationLinks, [
            { key: "criminal_location_id", label: "Link ID" },
            { key: "criminal_id", label: "Criminal ID" },
            { key: "criminal_name", label: "Criminal Name" },
            { key: "location_id", label: "Location ID" },
            { key: "district", label: "District" },
            { key: "zone", label: "Zone" },
            { key: "address", label: "Address" },
            { key: "noted_at", label: "Noted At" },
          ])}

        {/* Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold mb-2">District Crime Stats</h2>
              {renderTable(districtStats, [
                { key: "district", label: "District" },
                { key: "total_criminals", label: "Total Criminals" },
                { key: "high_risk_criminals", label: "High Risk" },
                { key: "total_cases", label: "Total Cases" },
                { key: "open_cases", label: "Open Cases" },
                { key: "total_arrests", label: "Arrests" },
                { key: "active_thanas", label: "Active Thanas" },
              ])}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Officer Workload</h2>
              {renderTable(officerWorkload, [
                { key: "officer_id", label: "Officer ID" },
                { key: "full_name", label: "Officer" },
                { key: "badge_no", label: "Badge" },
                { key: "rank_name", label: "Rank" },
                { key: "thana_name", label: "Thana" },
                { key: "assigned_gds", label: "Assigned GD" },
                { key: "approved_gds", label: "Approved GD" },
                { key: "total_workload", label: "Total Workload" },
                { key: "workload_rank", label: "Rank" },
              ])}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Criminal Ranking</h2>
              {renderTable(criminalRanking, [
                { key: "criminal_id", label: "Criminal ID" },
                { key: "full_name", label: "Name" },
                { key: "status", label: "Status" },
                { key: "arrest_count", label: "Arrests" },
                { key: "case_count", label: "Case Count" },
                { key: "overall_rank", label: "Overall Rank" },
                { key: "status_rank", label: "Status Rank" },
              ])}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Thana Performance</h2>
              {renderTable(thanaPerformance, [
                { key: "thana_id", label: "Thana ID" },
                { key: "thana_name", label: "Thana" },
                { key: "district", label: "District" },
                { key: "officer_count", label: "Officers" },
                { key: "total_cases", label: "Total Cases" },
                { key: "closed_cases", label: "Closed Cases" },
                { key: "case_closure_rate", label: "Case Closure %" },
                { key: "total_gd_reports", label: "Total GD" },
                { key: "approved_gds", label: "Approved GD" },
                { key: "gd_approval_rate", label: "GD Approval %" },
                { key: "criminals_registered", label: "Criminals" },
                { key: "performance_rank", label: "Performance Rank" },
              ])}
            </div>
          </div>
        )}

        {/* Ranks */}
        {activeTab === "ranks" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">Police Ranks</h2>
              <button
                onClick={() => setShowAddRank(!showAddRank)}
                className={`${btnCls} bg-blue-600 hover:bg-blue-500 text-white`}
              >
                + Add Rank
              </button>
            </div>
            {showAddRank && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  addRankMut.mutate({
                    ...rankForm,
                    level: Number(rankForm.level),
                  });
                }}
                className="bg-gray-900 border border-white/5 rounded-xl p-5 grid grid-cols-3 gap-3"
              >
                <input
                  placeholder="Rank Code (e.g. inspector)"
                  value={rankForm.rank_code}
                  onChange={(e) =>
                    setRankForm({ ...rankForm, rank_code: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Rank Name (e.g. Inspector)"
                  value={rankForm.rank_name}
                  onChange={(e) =>
                    setRankForm({ ...rankForm, rank_name: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <input
                  placeholder="Level (1-10)"
                  type="number"
                  value={rankForm.level}
                  onChange={(e) =>
                    setRankForm({ ...rankForm, level: e.target.value })
                  }
                  className={inputCls}
                  required
                />
                <div className="col-span-3 flex gap-2">
                  <button
                    type="submit"
                    className={`${btnCls} bg-green-600 hover:bg-green-500 text-white`}
                  >
                    Add Rank
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddRank(false)}
                    className={`${btnCls} bg-gray-700 text-slate-300`}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
            <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                    <th className="text-left p-3">Code</th>
                    <th className="text-left p-3">Name</th>
                    <th className="text-left p-3">Level</th>
                  </tr>
                </thead>
                <tbody>
                  {ranks.map((r) => (
                    <tr key={r.rank_code} className="border-b border-white/5">
                      <td className="p-3 font-mono">{r.rank_code}</td>
                      <td className="p-3">{r.rank_name}</td>
                      <td className="p-3">{r.level}</td>
                    </tr>
                  ))}
                  {ranks.length === 0 && (
                    <tr>
                      <td
                        colSpan={3}
                        className="p-6 text-center text-slate-500"
                      >
                        No ranks found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users */}
        {activeTab === "users" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Name</th>
                  <th className="text-left p-3">Email</th>
                  <th className="text-left p-3">Phone</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.user_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{u.user_id}</td>
                    <td className="p-3">{u.full_name}</td>
                    <td className="p-3 text-slate-400">{u.email}</td>
                    <td className="p-3 text-slate-400">{u.phone}</td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-6 text-center text-slate-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* GD Reports */}
        {activeTab === "gd-reports" && (
          <div className="bg-gray-900 border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-slate-500 text-xs uppercase">
                  <th className="text-left p-3">ID</th>
                  <th className="text-left p-3">Thana</th>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Description</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {gdReports.map((g) => (
                  <tr key={g.gd_id} className="border-b border-white/5">
                    <td className="p-3 font-mono text-xs">{g.gd_id}</td>
                    <td className="p-3">{g.thana_id}</td>
                    <td className="p-3 text-xs capitalize">
                      {g.gd_type?.replace("_", " ") || "—"}
                    </td>
                    <td className="p-3 text-slate-400 truncate max-w-xs">
                      {g.description}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${statusColor(g.status)}`}
                      >
                        {g.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400 text-xs">
                      {g.submitted_at
                        ? new Date(g.submitted_at).toLocaleDateString()
                        : "—"}
                    </td>
                  </tr>
                ))}
                {gdReports.length === 0 && (
                  <tr>
                    <td colSpan={6} className="p-6 text-center text-slate-500">
                      No GD reports found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;