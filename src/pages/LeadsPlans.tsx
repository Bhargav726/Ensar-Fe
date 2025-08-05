import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
    ChevronLeft,
    ChevronRight,
    Filter,
    Search,
    UserPlus,
    X
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
 
// Custom styles for proper scrolling and resizing
// const tableStyles = `
//   .leads-table-container {
//     overflow: auto !important;
//     max-height: calc(100vh - 200px);
//     min-width: 100%;
//   }
 
//   .leads-table-container::-webkit-scrollbar {
//     width: 8px;
//     height: 8px;
//   }
 
//   .leads-table-container::-webkit-scrollbar-track {
//     background: #f1f5f9;
//     border-radius: 4px;
//   }
 
//   .leads-table-container::-webkit-scrollbar-thumb {
//     background: #cbd5e1;
//     border-radius: 4px;
//   }
 
//   .leads-table-container::-webkit-scrollbar-thumb:hover {
//     background: #94a3b8;
//   }
 
//   /* Force horizontal scrollbar to appear */
//   .leads-table-container > div {
//     min-width: 1400px !important;
//   }
 
//   /* Column resize styles */
//   .resize-handle {
//     position: absolute;
//     right: -3px;
//     top: 0;
//     bottom: 0;
//     width: 6px;
//     cursor: col-resize;
//     background: transparent;
//     transition: background-color 0.2s;
//     z-index: 10;
//   }
 
//   .resize-handle:hover {
//     background: #3b82f6;
//   }
 
//   .resize-handle.resizing {
//     background: #3b82f6;
//   }
 
//   /* Prevent text selection during resize */
//   .resizing * {
//     user-select: none;
//   }
 
//   /* Make resize handle more visible on hover */
//   .table-header:hover .resize-handle {
//     background: rgba(59, 130, 246, 0.3);
//   }
 
//   /* Add a subtle border to make resize handle more visible */
//   .resize-handle::after {
//     content: '';
//     position: absolute;
//     right: 0;
//     top: 0;
//     bottom: 0;
//     width: 1px;
//     background: #e5e7eb;
//   }
 
//   /* Table cell ellipsis styles */
//   .table-cell-content {
//     overflow: hidden;
//     text-overflow: ellipsis;
//     white-space: nowrap;
//     max-width: 100%;
//   }
 
//   .table-cell-content.email {
//     max-width: calc(100% - 8px);
//   }
 
//   .table-cell-content.designation,
//   .table-cell-content.company {
//     max-width: calc(100% - 16px);
//   }
 
//   /* Visual feedback for column constraints */
//   .resize-handle.at-max-width {
//     background: #ef4444 !important;
//   }
 
//   /* Removed threshold highlighting to reduce visual noise */
 
//   /* Drag and drop styles */
//   .dragging {
//     opacity: 0.5;
//     transform: rotate(2deg);
//   }
 
//   .drag-over {
//     border-top: 2px solid #3b82f6;
//   }
 
//   .drag-handle {
//     cursor: grab;
//     color: #6b7280;
//     transition: color 0.2s;
//   }
 
//   .drag-handle:hover {
//     color: #3b82f6;
//   }
 
//   .drag-handle:active {
//     cursor: grabbing;
//   }
// `;
 
interface LeadPlan {
  id: string;
  name: string;
  email: string;
  designation: string;
  company: string;
  state: string;
  planType: string;
  status: string;
  createdDate: string;
  createdBy: string;
}
 
interface ColumnConfig {
  key: string;
  label: string;
  width: number;
  minWidth: number;
  maxWidth: number;
  defaultWidth: number;
  thresholdWidth: number;
  resizable: boolean;
}
 
const generateMockLeadPlans = (count: number): LeadPlan[] => {
  const leadPlans: LeadPlan[] = [];
  const firstNames = [
    "John",
    "Jane",
    "Bob",
    "Alice",
    "Charlie",
    "Diana",
    "Frank",
    "Grace",
    "Peter",
    "Olivia",
  ];
  const lastNames = [
    "Smith",
    "Doe",
    "Johnson",
    "Brown",
    "Wilson",
    "Martinez",
    "Davis",
    "Lee",
    "Jones",
    "Taylor",
  ];
  const companies = [
    "Tech Corp",
    "Startup Inc",
    "Enterprise Solutions",
    "Innovate LLC",
    "Business Co",
    "Data Systems",
    "Web Services",
    "CloudNet",
    "Future Tech",
    "Quantum Leap",
  ];
  const designations = [
    "CEO",
    "CTO",
    "VP Sales",
    "Marketing Director",
    "Sales Manager",
    "HR Director",
    "Product Manager",
    "Software Engineer",
    "Data Analyst",
    "UX Designer",
  ];
  const states = [
    "Massachusetts",
    "California",
    "New York",
    "Texas",
    "Florida",
    "Washington",
    "Illinois",
    "Colorado",
  ];
  const planTypes = [
    "Basic Plan",
    "Premium Plan",
    "Enterprise Plan",
    "Custom Plan",
    "Starter Plan",
  ];
  const statuses = [
    "Active",
    "Pending",
    "Expired",
    "Suspended",
    "Completed",
  ];
 
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    leadPlans.push({
      id: i.toString(),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${company
        .toLowerCase()
        .replace(/\s+/g, "")}.com`,
      designation:
        designations[Math.floor(Math.random() * designations.length)],
      company: company,
      state: states[Math.floor(Math.random() * states.length)],
      planType: planTypes[Math.floor(Math.random() * planTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdDate: "7/31/2025",
      createdBy: "sumanth",
    });
  }
  return leadPlans;
};
 
const mockLeadPlans: LeadPlan[] = generateMockLeadPlans(50);
 
const ITEMS_PER_PAGE = 10;
 
export function LeadsPlans() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [selectedPlanType, setSelectedPlanType] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [leadPlans, setLeadPlans] = useState<LeadPlan[]>(mockLeadPlans);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    name: 250,
    email: 100,
    designation: 150,
    company: 200,
    state: 120,
    planType: 150,
    status: 120,
    createdDate: 120,
    createdBy: 120,
  });
  const [resizing, setResizing] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState<number>(0);
  const [resizeStartWidth, setResizeStartWidth] = useState<number>(0);
  const [draggedRow, setDraggedRow] = useState<string | null>(null);
  const [dragOverRow, setDragOverRow] = useState<string | null>(null);
  const navigate = useNavigate();
 
  // Form state for create form
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    designation: "",
    company: "",
    state: "",
    planType: "",
    status: "",
    notes: "",
  });
 
  // Column configuration
  const columns: ColumnConfig[] = [
    {
      key: "name",
      label: "Name",
      width: columnWidths.name,
      minWidth: 150,
      maxWidth: 400,
      defaultWidth: 250,
      thresholdWidth: 200,
      resizable: true
    },
    {
      key: "email",
      label: "Email",
      width: columnWidths.email,
      minWidth: 100,
      maxWidth: 350,
      defaultWidth: 160,
      thresholdWidth: 140,
      resizable: true
    },
    {
      key: "designation",
      label: "Designation",
      width: columnWidths.designation,
      minWidth: 100,
      maxWidth: 250,
      defaultWidth: 150,
      thresholdWidth: 120,
      resizable: true
    },
    {
      key: "company",
      label: "Company",
      width: columnWidths.company,
      minWidth: 120,
      maxWidth: 300,
      defaultWidth: 200,
      thresholdWidth: 160,
      resizable: true
    },
    {
      key: "state",
      label: "State",
      width: columnWidths.state,
      minWidth: 80,
      maxWidth: 150,
      defaultWidth: 120,
      thresholdWidth: 100,
      resizable: true
    },
    {
      key: "planType",
      label: "Plan Type",
      width: columnWidths.planType,
      minWidth: 120,
      maxWidth: 200,
      defaultWidth: 150,
      thresholdWidth: 130,
      resizable: true
    },
    {
      key: "status",
      label: "Status",
      width: columnWidths.status,
      minWidth: 80,
      maxWidth: 150,
      defaultWidth: 120,
      thresholdWidth: 100,
      resizable: true
    },
    {
      key: "createdDate",
      label: "Created Date",
      width: columnWidths.createdDate,
      minWidth: 100,
      maxWidth: 150,
      defaultWidth: 120,
      thresholdWidth: 110,
      resizable: true
    },
    {
      key: "createdBy",
      label: "Created By",
      width: columnWidths.createdBy,
      minWidth: 80,
      maxWidth: 150,
      defaultWidth: 120,
      thresholdWidth: 100,
      resizable: true
    },
  ];
 
  // Filter lead plans based on search and filters
  const filteredLeadPlans = useMemo(() => {
    return leadPlans.filter((leadPlan) => {
      const matchesSearch =
        leadPlan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        leadPlan.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState =
        selectedState === "all" || leadPlan.state === selectedState;
      const matchesDesignation =
        selectedDesignation === "all" ||
        leadPlan.designation === selectedDesignation;
      const matchesPlanType =
        selectedPlanType === "all" ||
        leadPlan.planType === selectedPlanType;
      const matchesStatus =
        selectedStatus === "all" ||
        leadPlan.status === selectedStatus;
 
      return matchesSearch && matchesState && matchesDesignation && matchesPlanType && matchesStatus;
    });
  }, [leadPlans, searchTerm, selectedState, selectedDesignation, selectedPlanType, selectedStatus]);
 
  // Pagination
  const totalPages = Math.ceil(filteredLeadPlans.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLeadPlans = filteredLeadPlans.slice(startIndex, endIndex);
 
  // Column resizing handlers
  const handleResizeStart = useCallback((columnKey: string, e: React.MouseEvent) => {
    console.log('Resize start for column:', columnKey);
    e.preventDefault();
    e.stopPropagation();
   
    const column = columns.find(col => col.key === columnKey);
    if (!column) return;
   
    const startX = e.clientX;
    const startWidth = columnWidths[columnKey];
   
    setResizing(columnKey);
    setResizeStartX(startX);
    setResizeStartWidth(startWidth);
   
    const handleMouseMove = (e: MouseEvent) => {
      e.preventDefault();
     
      console.log('Mouse move - columnKey:', columnKey, 'clientX:', e.clientX);
     
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(column.minWidth, Math.min(column.maxWidth, startWidth + deltaX));
     
      console.log('New width for', columnKey, ':', newWidth);
     
      setColumnWidths(prev => ({
        ...prev,
        [columnKey]: newWidth
      }));
    };
 
    const handleMouseUp = () => {
      console.log('Resize end for column:', columnKey);
      setResizing(null);
      setResizeStartX(0);
      setResizeStartWidth(0);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
 
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [columns, columnWidths]);
 
  // Drag and drop handlers
  const handleDragStart = useCallback((e: React.DragEvent, leadPlanId: string) => {
    setDraggedRow(leadPlanId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', leadPlanId);
  }, []);
 
  const handleDragOver = useCallback((e: React.DragEvent, leadPlanId: string) => {
    e.preventDefault();
    if (draggedRow !== leadPlanId) {
      setDragOverRow(leadPlanId);
    }
  }, [draggedRow]);
 
  const handleDragLeave = useCallback(() => {
    setDragOverRow(null);
  }, []);
 
  const handleDrop = useCallback((e: React.DragEvent, targetLeadPlanId: string) => {
    e.preventDefault();
    if (!draggedRow || draggedRow === targetLeadPlanId) return;
 
    const draggedIndex = leadPlans.findIndex(leadPlan => leadPlan.id === draggedRow);
    const targetIndex = leadPlans.findIndex(leadPlan => leadPlan.id === targetLeadPlanId);
   
    if (draggedIndex === -1 || targetIndex === -1) return;
 
    const newLeadPlans = [...leadPlans];
    const [draggedLeadPlan] = newLeadPlans.splice(draggedIndex, 1);
    newLeadPlans.splice(targetIndex, 0, draggedLeadPlan);
   
    setLeadPlans(newLeadPlans);
    setDraggedRow(null);
    setDragOverRow(null);
  }, [draggedRow, leadPlans]);
 
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
 
  const handleClearAllFilters = () => {
    setSearchTerm("");
    setSelectedDesignation("all");
    setSelectedState("all");
    setSelectedPlanType("all");
    setSelectedStatus("all");
    setCurrentPage(1);
  };
 
  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedRows(new Set(currentLeadPlans.map((leadPlan) => leadPlan.id)));
    } else {
      setSelectedRows(new Set());
    }
  };
 
  const handleRowSelect = (leadPlanId: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(leadPlanId)) {
      newSelectedRows.delete(leadPlanId);
    } else {
      newSelectedRows.add(leadPlanId);
    }
    setSelectedRows(newSelectedRows);
  };
 
  const resetColumnWidths = () => {
    const defaultWidths: Record<string, number> = {};
    columns.forEach(column => {
      defaultWidths[column.key] = column.defaultWidth;
    });
    setColumnWidths(defaultWidths);
  };
 
  const uniqueStates = useMemo(
    () => Array.from(new Set(leadPlans.map((leadPlan) => leadPlan.state))).sort(),
    [leadPlans]
  );
  const uniqueDesignations = useMemo(
    () => Array.from(new Set(leadPlans.map((leadPlan) => leadPlan.designation))).sort(),
    [leadPlans]
  );
  const uniquePlanTypes = useMemo(
    () => Array.from(new Set(leadPlans.map((leadPlan) => leadPlan.planType))).sort(),
    [leadPlans]
  );
  const uniqueStatuses = useMemo(
    () => Array.from(new Set(leadPlans.map((leadPlan) => leadPlan.status))).sort(),
    [leadPlans]
  );
 
  const isAllSelected =
    currentLeadPlans.length > 0 && selectedRows.size === currentLeadPlans.length;
  const isPartiallySelected =
    selectedRows.size > 0 && selectedRows.size < currentLeadPlans.length;
 
 
 // Calculate total table width
  const totalTableWidth = columns.reduce((sum, col) => sum + col.width, 0);
 
  // Handle form submission
  const handleCreateLeadPlan = () => {
    const newLeadPlan: LeadPlan = {
      id: (leadPlans.length + 1).toString(),
      name: formData.name,
      email: formData.email,
      designation: formData.designation,
      company: formData.company,
      state: formData.state,
      planType: formData.planType,
      status: formData.status,
      createdDate: new Date().toLocaleDateString(),
      createdBy: "sumanth",
    };
 
    setLeadPlans([newLeadPlan, ...leadPlans]);
    setFormData({
      name: "",
      email: "",
      designation: "",
      company: "",
      state: "",
      planType: "",
      status: "",
      notes: "",
    });
    setShowCreateForm(false);
  };
 
return (
    <>
      {/* <style>{tableStyles}</style> */}
      <div className="flex flex-col h-screen bg-background text-foreground">
        {/* Top Bar - now sticky */}
        <div className="sticky top-0 z-30 bg-background flex items-center justify-between p-4 border-b border-border flex-shrink-0 leads-topbar-shadow">
          <span style={{
              fontFamily: `'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif`,
              fontSize: '20px',
              fontWeight: 400,
              color: '#111827',
            }}>
            Leads Plans
          </span>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
            </Button>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search lead plans..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create Lead Plan
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Lead Plan</DialogTitle>
                  <DialogDescription>
                    Fill in the details to create a new lead plan.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="designation">Designation</Label>
                    <Input
                      id="designation"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      placeholder="Enter designation"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Enter company"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planType">Plan Type</Label>
                    <Select value={formData.planType} onValueChange={(value) => setFormData({ ...formData, planType: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select plan type" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniquePlanTypes.map((planType) => (
                          <SelectItem key={planType} value={planType}>
                            {planType}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {uniqueStatuses.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      placeholder="Enter additional notes"
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateLeadPlan}>
                    Create Lead Plan
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
 
        <div className="flex flex-1 min-h-0 overflow-hidden">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 border-r border-border bg-muted/10 flex-shrink-0 overflow-hidden">
              <div className="p-4 h-full overflow-y-auto">
                <h2 className="font-semibold mb-4">Filters</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Designation</label>
                    <Select
                      value={selectedDesignation}
                      onValueChange={setSelectedDesignation}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select designations..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Designations</SelectItem>
                        {uniqueDesignations.map((d) => (
                          <SelectItem key={d} value={d}>
                            {d}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
 
                  <div>
                    <label className="text-sm font-medium">State</label>
                    <Select
                      value={selectedState}
                      onValueChange={setSelectedState}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select states..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        {uniqueStates.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
 
                  <div>
                    <label className="text-sm font-medium">Plan Type</label>
                    <Select
                      value={selectedPlanType}
                      onValueChange={setSelectedPlanType}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select plan types..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Plan Types</SelectItem>
                        {uniquePlanTypes.map((pt) => (
                          <SelectItem key={pt} value={pt}>
                            {pt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
 
                  <div>
                    <label className="text-sm font-medium">Status</label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select statuses..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        {uniqueStatuses.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
 
                <div className="mt-6 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={handleClearAllFilters}
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
 
{/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Table Container with both horizontal and vertical scrolling */}
            <div className="flex-1 h-full overflow-y-auto border rounded-md leads-table-container" style={{ maxHeight: 'calc(100vh - 200px)' }}>
             
              <div className="w-full" style={{ minWidth: `${totalTableWidth}px` }}>
                <Table className="w-full" style={{ minWidth: `${totalTableWidth}px` }}>
                  {/* Sticky Header */}
                  <TableHeader className="sticky top-0 bg-background z-20">
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead
                          key={column.key}
                          className={`relative table-header ${column.key === 'name' ? 'sticky left-0 z-30 bg-background border-r' : 'bg-background'}`}
                          style={{ width: `${column.width}px`, minWidth: `${column.width}px` }}
                        >
                          {column.key === 'name' ? (
                            <div className="flex items-center justify-between pr-2">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={isPartiallySelected ? "indeterminate" : isAllSelected}
                                  onCheckedChange={handleSelectAll}
                                  aria-label="Select all rows"
                                />
                                <span className="table-cell-content">{column.label}</span>
                              </div>
                              {column.resizable && (
                                <div
                                  className={`resize-handle ${resizing === column.key ? 'resizing' : ''} ${
                                    columnWidths[column.key] >= column.maxWidth ? 'at-max-width' : ''
                                  }`}
                                  onMouseDown={(e) => handleResizeStart(column.key, e)}
                                  title={`Drag to resize column (${columnWidths[column.key]}px / ${column.maxWidth}px max)`}
                                />
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center justify-between pr-2">
                              <span className="table-cell-content">{column.label}</span>
                              {column.resizable && (
                                <div
                                  className={`resize-handle ${resizing === column.key ? 'resizing' : ''} ${
                                    columnWidths[column.key] >= column.maxWidth ? 'at-max-width' : ''
                                  }`}
                                  onMouseDown={(e) => handleResizeStart(column.key, e)}
                                  title={`Drag to resize column (${columnWidths[column.key]}px / ${column.maxWidth}px max)`}
                                />
                              )}
                            </div>
                          )}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
 
                  {/* Table Body */}
                  <TableBody>
                    {currentLeadPlans.map((leadPlan) => (
                      <TableRow
                        key={leadPlan.id}
                        data-state={selectedRows.has(leadPlan.id) ? "selected" : undefined}
                        className={`cursor-pointer hover:bg-muted/50 ${
                          draggedRow === leadPlan.id ? 'dragging' : ''
                        } ${
                          dragOverRow === leadPlan.id ? 'drag-over' : ''
                        }`}
                        onClick={() => navigate(`/leads-plans/${leadPlan.id}`)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, leadPlan.id)}
                        onDragOver={(e) => handleDragOver(e, leadPlan.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, leadPlan.id)}
                      >
                        {columns.map((column) => (
                          <TableCell
                            key={column.key}
                            className={`${column.key === 'name' ? 'sticky left-0 z-10 bg-background border-r' : ''}`}
                            style={{ width: `${column.width}px`, minWidth: `${column.width}px` }}
                            onClick={column.key === 'name' ? (e) => e.stopPropagation() : undefined}
                          >
                            {column.key === 'name' ? (
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={selectedRows.has(leadPlan.id)}
                                  onCheckedChange={() => handleRowSelect(leadPlan.id)}
                                  aria-label={`Select row for ${leadPlan.name}`}
                                />
                                <div className="font-medium underline underline-offset-4 cursor-pointer table-cell-content">
                                  {leadPlan.name}
                                </div>
                              </div>
                            ) : column.key === 'email' ? (
                              <div className="table-cell-content email" title={leadPlan.email || "-"}>
                                {leadPlan.email || "-"}
                              </div>
                            ) : column.key === 'designation' ? (
                              <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full table-cell-content designation" title={leadPlan.designation}>
                                {leadPlan.designation}
                              </span>
                            ) : column.key === 'company' ? (
                              <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full table-cell-content company" title={leadPlan.company}>
                                {leadPlan.company}
                              </span>
                            ) : column.key === 'state' ? (
                              <div className="table-cell-content" title={leadPlan.state}>
                                {leadPlan.state}
                              </div>
                            ) : column.key === 'planType' ? (
                              <span className="px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full table-cell-content" title={leadPlan.planType}>
                                {leadPlan.planType}
                              </span>
                            ) : column.key === 'status' ? (
                              <span className={`px-2 py-1 text-xs font-medium rounded-full table-cell-content ${
                                leadPlan.status === 'Active' ? 'text-green-800 bg-green-100' :
                                leadPlan.status === 'Pending' ? 'text-yellow-800 bg-yellow-100' :
                                leadPlan.status === 'Expired' ? 'text-red-800 bg-red-100' :
                                leadPlan.status === 'Suspended' ? 'text-orange-800 bg-orange-100' :
                                'text-gray-800 bg-gray-100'
                              }`} title={leadPlan.status}>
                                {leadPlan.status}
                              </span>
                            ) : column.key === 'createdDate' ? (
                              <div className="table-cell-content" title={leadPlan.createdDate}>
                                {leadPlan.createdDate}
                              </div>
                            ) : column.key === 'createdBy' ? (
                              <div className="table-cell-content" title={leadPlan.createdBy}>
                                {leadPlan.createdBy}
                              </div>
                            ) : null}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
 
            {/* Pagination */}
            <div className="border-t border-border p-4 bg-background flex-shrink-0 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
              <span className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {Math.min(startIndex + 1, filteredLeadPlans.length)}
                </span>
                –
                <span className="font-medium text-foreground">
                  {Math.min(endIndex, filteredLeadPlans.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filteredLeadPlans.length}
                </span>{" "}
                records
              </span>
 
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`px-3 py-1 text-white bg-black border rounded text-sm flex items-center gap-1 ${
                    currentPage <= 1 ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
 
                <span className="text-sm">Page</span>
 
                <select
                  value={currentPage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  className="px-2 py-1 border rounded text-sm cursor-pointer pagination-select"
                  aria-label="Go to page"
                >
                  {Array.from({ length: totalPages }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
 
                <span className="text-sm">of {totalPages}</span>
 
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`px-3 py-1 text-white bg-black border rounded text-sm flex items-center gap-1 ${
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }`}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
 
export default LeadsPlans;
 
 