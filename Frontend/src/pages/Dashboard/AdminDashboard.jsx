import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { adminSignoutApi } from "@/services/authServices/signoutApi";
import userStore from "@/state/userStore";
import {
  Building2,
  Shield,
  Users,
  FileText,
  AlertCircle,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  MapPin,
  Skull,
  Network,
  Briefcase,
  UserCheck,
  Lock,
  TrendingUp,
  Activity,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const { clearUser } = userStore();

  const handleSignout = async () => {
    await adminSignoutApi();
    clearUser();
    navigate("/");
  };

  // Mock data - replace with actual API calls
  const stats = [
    {
      title: "Total Thanas",
      value: "64",
      change: "+3 this month",
      icon: Building2,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Active Officers",
      value: "892",
      change: "+24 this week",
      icon: Shield,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Criminals Tracked",
      value: "1,284",
      change: "+47 this month",
      icon: Skull,
      color: "text-red-500",
      bgColor: "bg-red-500/10",
    },
    {
      title: "Active Cases",
      value: "347",
      change: "-12 this week",
      icon: FileText,
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
    },
    {
      title: "Registered Jails",
      value: "23",
      change: "+1 this month",
      icon: Lock,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "System Users",
      value: "156",
      change: "+8 this week",
      icon: Users,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
    },
  ];

  const recentThanas = [
    { id: "THN-0000045", name: "Motijheel Police Station", district: "Dhaka", zone: "Central", officers: 28, status: "active" },
    { id: "THN-0000046", name: "Gulshan Police Station", district: "Dhaka", zone: "North", officers: 32, status: "active" },
    { id: "THN-0000047", name: "Dhanmondi Police Station", district: "Dhaka", zone: "Central", officers: 25, status: "active" },
    { id: "THN-0000048", name: "Uttara Police Station", district: "Dhaka", zone: "North", officers: 30, status: "active" },
  ];

  const recentOfficers = [
    { id: "OFC-0000234", name: "Inspector Rahman", badge: "DMP-2341", rank: "Inspector", thana: "Motijheel", status: "active" },
    { id: "OFC-0000235", name: "SI Ahmed", badge: "DMP-2342", rank: "Sub-Inspector", thana: "Gulshan", status: "active" },
    { id: "OFC-0000236", name: "OC Khan", badge: "DMP-2343", rank: "Officer-in-Charge", thana: "Dhanmondi", status: "active" },
    { id: "OFC-0000237", name: "Constable Islam", badge: "DMP-2344", rank: "Constable", thana: "Uttara", status: "active" },
  ];

  const recentJails = [
    { id: "JAL-0000012", name: "Dhaka Central Jail", district: "Dhaka", zone: "Central", capacity: 1200, occupancy: 1450, status: "overcrowded" },
    { id: "JAL-0000013", name: "Kashimpur Central Jail", district: "Gazipur", zone: "North", capacity: 800, occupancy: 750, status: "normal" },
    { id: "JAL-0000014", name: "Keraniganj Central Jail", district: "Dhaka", zone: "South", capacity: 600, occupancy: 580, status: "normal" },
  ];

  const recentCriminals = [
    { id: "CRM-0000789", name: "Karim Abdullah", nid: "1234567890123", status: "in_custody", riskLevel: 8, thana: "Motijheel" },
    { id: "CRM-0000790", name: "Rahim Mollah", nid: "2345678901234", status: "on_bail", riskLevel: 5, thana: "Gulshan" },
    { id: "CRM-0000791", name: "Jamal Hossain", nid: "3456789012345", status: "escaped", riskLevel: 9, thana: "Dhanmondi" },
    { id: "CRM-0000792", name: "Hafiz Rahman", nid: "4567890123456", status: "released", riskLevel: 3, thana: "Uttara" },
  ];

  const recentGDReports = [
    { id: "12345", thana: "Motijheel", submittedBy: "Citizen Ahmed", status: "pending", date: "2026-02-10" },
    { id: "12346", thana: "Gulshan", submittedBy: "Citizen Rahman", status: "approved", date: "2026-02-09" },
    { id: "12347", thana: "Dhanmondi", submittedBy: "Citizen Khan", status: "rejected", date: "2026-02-09" },
    { id: "12348", thana: "Uttara", submittedBy: "Citizen Islam", status: "submitted", date: "2026-02-08" },
  ];

  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-500/20 text-green-500 border-green-500/30",
      inactive: "bg-gray-500/20 text-gray-500 border-gray-500/30",
      overcrowded: "bg-red-500/20 text-red-500 border-red-500/30",
      normal: "bg-blue-500/20 text-blue-500 border-blue-500/30",
      in_custody: "bg-red-500/20 text-red-500 border-red-500/30",
      on_bail: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      released: "bg-green-500/20 text-green-500 border-green-500/30",
      escaped: "bg-red-500/20 text-red-500 border-red-500/30",
      pending: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      approved: "bg-green-500/20 text-green-500 border-green-500/30",
      rejected: "bg-red-500/20 text-red-500 border-red-500/30",
      submitted: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    };
    return colors[status] || colors.inactive;
  };

  const getRiskLevelColor = (level) => {
    if (level >= 8) return "text-red-500";
    if (level >= 5) return "text-yellow-500";
    return "text-green-500";
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(220,38,38,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(220,38,38,0.03)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/80">
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
                  BV
                </div>
                Admin Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1 font-mono">
                CLASSIFIED SYSTEM ACCESS — ADMINISTRATOR LEVEL
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10">
                <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-mono text-green-500">SYSTEM ONLINE</span>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="sm" onClick={handleSignout} className="hover:bg-red-600 hover:scale-105 transition-all duration-200">
                Sign Out
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8 max-w-[1600px] mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-all">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold font-mono">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      {stat.change}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-card/50 border border-border/50 p-1">
              <TabsTrigger value="overview" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="thanas" className="gap-2">
                <Building2 className="h-4 w-4" />
                Thanas
              </TabsTrigger>
              <TabsTrigger value="officers" className="gap-2">
                <Shield className="h-4 w-4" />
                Officers
              </TabsTrigger>
              <TabsTrigger value="jails" className="gap-2">
                <Lock className="h-4 w-4" />
                Jails
              </TabsTrigger>
              <TabsTrigger value="criminals" className="gap-2">
                <Skull className="h-4 w-4" />
                Criminals
              </TabsTrigger>
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="gd-reports" className="gap-2">
                <FileText className="h-4 w-4" />
                GD Reports
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-primary" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>Latest system updates and changes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3 pb-3 border-b border-border/50">
                        <div className="p-2 rounded-lg bg-green-500/10">
                          <Shield className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New officer registered</p>
                          <p className="text-xs text-muted-foreground">Inspector Rahman at Motijheel — 2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 pb-3 border-b border-border/50">
                        <div className="p-2 rounded-lg bg-red-500/10">
                          <Skull className="h-4 w-4 text-red-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Criminal status updated</p>
                          <p className="text-xs text-muted-foreground">Karim Abdullah marked as escaped — 4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 pb-3 border-b border-border/50">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <Building2 className="h-4 w-4 text-blue-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New thana added</p>
                          <p className="text-xs text-muted-foreground">Uttara Police Station — Yesterday</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-yellow-500/10">
                          <FileText className="h-4 w-4 text-yellow-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">GD Report approved</p>
                          <p className="text-xs text-muted-foreground">Report #12346 at Gulshan — Yesterday</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card className="border-border/50 bg-card/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-primary" />
                      System Health
                    </CardTitle>
                    <CardDescription>Infrastructure status and metrics</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Database Load</span>
                          <span className="text-sm text-green-500">23%</span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 w-[23%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">API Response Time</span>
                          <span className="text-sm text-green-500">124ms</span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 w-[15%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Storage Usage</span>
                          <span className="text-sm text-yellow-500">67%</span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 w-[67%]" />
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">Active Sessions</span>
                          <span className="text-sm text-blue-500">342</span>
                        </div>
                        <div className="h-2 bg-border rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 w-[45%]" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Alerts */}
              <Card className="border-yellow-500/30 bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-500">
                    <AlertCircle className="h-5 w-5" />
                    System Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-red-500/30 bg-red-500/5">
                      <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-red-500">Dhaka Central Jail Overcrowded</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Current occupancy: 1450/1200 (121%) — Immediate action required
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border border-yellow-500/30 bg-yellow-500/5">
                      <AlertCircle className="h-5 w-5 text-yellow-500 shrink-0" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-yellow-500">23 Pending GD Reports</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Reports awaiting officer approval across 8 thanas
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Thanas Tab */}
            <TabsContent value="thanas" className="space-y-6">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Police Stations (Thanas)</CardTitle>
                      <CardDescription>Manage and monitor all thanas in the system</CardDescription>
                    </div>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4" />
                      Add Thana
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search thanas..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by district" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Districts</SelectItem>
                        <SelectItem value="dhaka">Dhaka</SelectItem>
                        <SelectItem value="chittagong">Chittagong</SelectItem>
                        <SelectItem value="sylhet">Sylhet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Thana ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>District</TableHead>
                          <TableHead>Zone</TableHead>
                          <TableHead>Officers</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentThanas.map((thana) => (
                          <TableRow key={thana.id} className="hover:bg-muted/30">
                            <TableCell className="font-mono text-xs">{thana.id}</TableCell>
                            <TableCell className="font-medium">{thana.name}</TableCell>
                            <TableCell>{thana.district}</TableCell>
                            <TableCell>{thana.zone}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="gap-1">
                                <Shield className="h-3 w-3" />
                                {thana.officers}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(thana.status)}>
                                {thana.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-500 hover:bg-red-500/10">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Officers Tab */}
            <TabsContent value="officers" className="space-y-6">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Law Enforcement Officers</CardTitle>
                      <CardDescription>View and manage all officers by thana</CardDescription>
                    </div>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4" />
                      Add Officer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search officers..." className="pl-10" />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by thana" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Thanas</SelectItem>
                        <SelectItem value="motijheel">Motijheel</SelectItem>
                        <SelectItem value="gulshan">Gulshan</SelectItem>
                        <SelectItem value="dhanmondi">Dhanmondi</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all-ranks">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by rank" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-ranks">All Ranks</SelectItem>
                        <SelectItem value="oc">Officer-in-Charge</SelectItem>
                        <SelectItem value="inspector">Inspector</SelectItem>
                        <SelectItem value="si">Sub-Inspector</SelectItem>
                        <SelectItem value="constable">Constable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Officer ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Badge No.</TableHead>
                          <TableHead>Rank</TableHead>
                          <TableHead>Thana</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentOfficers.map((officer) => (
                          <TableRow key={officer.id} className="hover:bg-muted/30">
                            <TableCell className="font-mono text-xs">{officer.id}</TableCell>
                            <TableCell className="font-medium">{officer.name}</TableCell>
                            <TableCell className="font-mono text-xs">{officer.badge}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{officer.rank}</Badge>
                            </TableCell>
                            <TableCell>{officer.thana}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(officer.status)}>
                                {officer.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-500 hover:bg-red-500/10">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Jails Tab */}
            <TabsContent value="jails" className="space-y-6">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Jail Facilities</CardTitle>
                      <CardDescription>Monitor jail capacity and manage facilities</CardDescription>
                    </div>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4" />
                      Add Jail
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search jails..." className="pl-10" />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="overcrowded">Overcrowded</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Jail ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>District</TableHead>
                          <TableHead>Zone</TableHead>
                          <TableHead>Capacity</TableHead>
                          <TableHead>Occupancy</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentJails.map((jail) => (
                          <TableRow key={jail.id} className="hover:bg-muted/30">
                            <TableCell className="font-mono text-xs">{jail.id}</TableCell>
                            <TableCell className="font-medium">{jail.name}</TableCell>
                            <TableCell>{jail.district}</TableCell>
                            <TableCell>{jail.zone}</TableCell>
                            <TableCell className="font-mono">{jail.capacity}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-mono">{jail.occupancy}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({Math.round((jail.occupancy / jail.capacity) * 100)}%)
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(jail.status)}>
                                {jail.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-500 hover:bg-red-500/10">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Criminals Tab */}
            <TabsContent value="criminals" className="space-y-6">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Criminal Registry</CardTitle>
                      <CardDescription>Monitor and manage all registered criminals</CardDescription>
                    </div>
                    <Button className="gap-2 bg-primary hover:bg-primary/90">
                      <Plus className="h-4 w-4" />
                      Register Criminal
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search criminals..." className="pl-10" />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="in_custody">In Custody</SelectItem>
                        <SelectItem value="on_bail">On Bail</SelectItem>
                        <SelectItem value="released">Released</SelectItem>
                        <SelectItem value="escaped">Escaped</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>Criminal ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>NID</TableHead>
                          <TableHead>Risk Level</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Registered Thana</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentCriminals.map((criminal) => (
                          <TableRow key={criminal.id} className="hover:bg-muted/30">
                            <TableCell className="font-mono text-xs">{criminal.id}</TableCell>
                            <TableCell className="font-medium">{criminal.name}</TableCell>
                            <TableCell className="font-mono text-xs">{criminal.nid}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(10)].map((_, i) => (
                                    <div
                                      key={i}
                                      className={`h-2 w-1 rounded-full ${
                                        i < criminal.riskLevel ? getRiskLevelColor(criminal.riskLevel) : "bg-border"
                                      }`}
                                      style={{ backgroundColor: i < criminal.riskLevel ? undefined : undefined }}
                                    />
                                  ))}
                                </div>
                                <span className={`text-xs font-mono ${getRiskLevelColor(criminal.riskLevel)}`}>
                                  {criminal.riskLevel}/10
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(criminal.status)}>
                                {criminal.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>{criminal.thana}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-500 hover:bg-red-500/10">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Registered Users</CardTitle>
                      <CardDescription>Manage civilian user accounts</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search users..." className="pl-10" />
                    </div>
                  </div>

                  <div className="text-center py-12 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>User management interface</p>
                    <p className="text-sm mt-2">View and manage all registered civilian users</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* GD Reports Tab */}
            <TabsContent value="gd-reports" className="space-y-6">
              <Card className="border-border/50 bg-card/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>General Diary (GD) Reports</CardTitle>
                      <CardDescription>View and manage GD reports by thana</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-6">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Search GD reports..." className="pl-10" />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by thana" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Thanas</SelectItem>
                        <SelectItem value="motijheel">Motijheel</SelectItem>
                        <SelectItem value="gulshan">Gulshan</SelectItem>
                        <SelectItem value="dhanmondi">Dhanmondi</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select defaultValue="all-status">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all-status">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="submitted">Submitted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border border-border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead>GD ID</TableHead>
                          <TableHead>Thana</TableHead>
                          <TableHead>Submitted By</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentGDReports.map((report) => (
                          <TableRow key={report.id} className="hover:bg-muted/30">
                            <TableCell className="font-mono text-xs">#{report.id}</TableCell>
                            <TableCell>{report.thana}</TableCell>
                            <TableCell>{report.submittedBy}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">{report.date}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className={getStatusColor(report.status)}>
                                {report.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;