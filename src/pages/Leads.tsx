import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
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
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
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
 
interface Lead {
  id: string;
  name: string;
  email: string;
  designation: string;
  company: string;
  state: string;
  sentDate: string;
  sentBy: string;
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
 
const generateMockLeads = (count: number): Lead[] => {
  const leads: Lead[] = [];
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
 
  for (let i = 1; i <= count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const company = companies[Math.floor(Math.random() * companies.length)];
    leads.push({
      id: i.toString(),
      name: `${firstName} ${lastName}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@${company
        .toLowerCase()
        .replace(/\s+/g, "")}.com`,
      designation:
        designations[Math.floor(Math.random() * designations.length)],
      company: company,
      state: states[Math.floor(Math.random() * states.length)],
      sentDate: "7/31/2025",
      sentBy: "sumanth",
    });
  }
  return leads;
};
 
const mockLeads: Lead[] = generateMockLeads(50);
 
const ITEMS_PER_PAGE = 10;
 
export function Leads() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDesignation, setSelectedDesignation] = useState("all");
  const [selectedState, setSelectedState] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({
    name: 250,
    email: 100,
    designation: 150,
    company: 200,
    state: 120,
    sentDate: 120,
    sentBy: 120,
    phone: 150,
    notes: 200,
  });
  const [resizing, setResizing] = useState<string | null>(null);
  const [resizeStartX, setResizeStartX] = useState<number>(0);
  const [resizeStartWidth, setResizeStartWidth] = useState<number>(0);
  const [draggedRow, setDraggedRow] = useState<string | null>(null);
  const [dragOverRow, setDragOverRow] = useState<string | null>(null);
  const navigate = useNavigate();
 
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
      key: "sentDate",
      label: "Sent Date",
      width: columnWidths.sentDate,
      minWidth: 100,
      maxWidth: 150,
      defaultWidth: 120,
      thresholdWidth: 110,
      resizable: true
    },
    {
      key: "sentBy",
      label: "Sent By",
      width: columnWidths.sentBy,
      minWidth: 80,
      maxWidth: 150,
      defaultWidth: 120,
      thresholdWidth: 100,
      resizable: true
    },
    {
      key: "phone",
      label: "Phone",
      width: columnWidths.phone,
      minWidth: 120,
      maxWidth: 200,
      defaultWidth: 150,
      thresholdWidth: 130,
      resizable: true
    },
    {
      key: "notes",
      label: "Notes",
      width: columnWidths.notes,
      minWidth: 150,
      maxWidth: 400,
      defaultWidth: 200,
      thresholdWidth: 180,
      resizable: true
    },
  ];
 
  // Filter leads based on search and filters
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesState =
        selectedState === "all" || lead.state === selectedState;
      const matchesDesignation =
        selectedDesignation === "all" ||
        lead.designation === selectedDesignation;
 
      return matchesSearch && matchesState && matchesDesignation;
    });
  }, [leads, searchTerm, selectedState, selectedDesignation]);
 
  // Pagination
  const totalPages = Math.ceil(filteredLeads.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentLeads = filteredLeads.slice(startIndex, endIndex);
 
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
  const handleDragStart = useCallback((e: React.DragEvent, leadId: string) => {
    setDraggedRow(leadId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', leadId);
  }, []);
 
  const handleDragOver = useCallback((e: React.DragEvent, leadId: string) => {
    e.preventDefault();
    if (draggedRow !== leadId) {
      setDragOverRow(leadId);
    }
  }, [draggedRow]);
 
  const handleDragLeave = useCallback(() => {
    setDragOverRow(null);
  }, []);
 
  const handleDrop = useCallback((e: React.DragEvent, targetLeadId: string) => {
    e.preventDefault();
    if (!draggedRow || draggedRow === targetLeadId) return;
 
    const draggedIndex = leads.findIndex(lead => lead.id === draggedRow);
    const targetIndex = leads.findIndex(lead => lead.id === targetLeadId);
   
    if (draggedIndex === -1 || targetIndex === -1) return;
 
    const newLeads = [...leads];
    const [draggedLead] = newLeads.splice(draggedIndex, 1);
    newLeads.splice(targetIndex, 0, draggedLead);
   
    setLeads(newLeads);
    setDraggedRow(null);
    setDragOverRow(null);
  }, [draggedRow, leads]);
 
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
 
  const handleClearAllFilters = () => {
    setSearchTerm("");
    setSelectedDesignation("all");
    setSelectedState("all");
    setCurrentPage(1);
  };
 
  const handleSelectAll = (checked: boolean | "indeterminate") => {
    if (checked === true) {
      setSelectedRows(new Set(currentLeads.map((lead) => lead.id)));
    } else {
      setSelectedRows(new Set());
    }
  };
 
  const handleRowSelect = (leadId: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(leadId)) {
      newSelectedRows.delete(leadId);
    } else {
      newSelectedRows.add(leadId);
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
    () => Array.from(new Set(leads.map((lead) => lead.state))).sort(),
    [leads]
  );
  const uniqueDesignations = useMemo(
    () => Array.from(new Set(leads.map((lead) => lead.designation))).sort(),
    [leads]
  );
 
  const isAllSelected =
    currentLeads.length > 0 && selectedRows.size === currentLeads.length;
  const isPartiallySelected =
    selectedRows.size > 0 && selectedRows.size < currentLeads.length;
 
  // Calculate total table width
  const totalTableWidth = columns.reduce((sum, col) => sum + col.width, 0);
 
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
            Leads
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
                placeholder="Search leads..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
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
                    {currentLeads.map((lead) => (
                      <TableRow
                        key={lead.id}
                        data-state={selectedRows.has(lead.id) ? "selected" : undefined}
                        className={`cursor-pointer hover:bg-muted/50 ${
                          draggedRow === lead.id ? 'dragging' : ''
                        } ${
                          dragOverRow === lead.id ? 'drag-over' : ''
                        }`}
                        onClick={() => navigate(`/leads/${lead.id}`)}
                        draggable
                        onDragStart={(e) => handleDragStart(e, lead.id)}
                        onDragOver={(e) => handleDragOver(e, lead.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, lead.id)}
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
                                  checked={selectedRows.has(lead.id)}
                                  onCheckedChange={() => handleRowSelect(lead.id)}
                                  aria-label={`Select row for ${lead.name}`}
                                />
                                <div className="font-medium underline underline-offset-4 cursor-pointer table-cell-content">
                                  {lead.name}
                                </div>
                              </div>
                            ) : column.key === 'email' ? (
                              <div className="table-cell-content email" title={lead.email || "-"}>
                                {lead.email || "-"}
                              </div>
                            ) : column.key === 'designation' ? (
                              <span className="px-2 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full table-cell-content designation" title={lead.designation}>
                                {lead.designation}
                              </span>
                            ) : column.key === 'company' ? (
                              <span className="px-2 py-1 text-xs font-medium text-gray-800 bg-gray-100 rounded-full table-cell-content company" title={lead.company}>
                                {lead.company}
                              </span>
                            ) : column.key === 'state' ? (
                              <div className="table-cell-content" title={lead.state}>
                                {lead.state}
                              </div>
                            ) : column.key === 'sentDate' ? (
                              <div className="table-cell-content" title={lead.sentDate}>
                                {lead.sentDate}
                              </div>
                            ) : column.key === 'sentBy' ? (
                              <div className="table-cell-content" title={lead.sentBy}>
                                {lead.sentBy}
                              </div>
                            ) : column.key === 'phone' ? (
                              <div className="table-cell-content" title="+1-555-0123">
                                +1-555-0123
                              </div>
                            ) : column.key === 'notes' ? (
                              <div className="table-cell-content" title="Follow up needed">
                                Follow up needed
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
                  {Math.min(startIndex + 1, filteredLeads.length)}
                </span>
                –
                <span className="font-medium text-foreground">
                  {Math.min(endIndex, filteredLeads.length)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {filteredLeads.length}
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
 
export default Leads;