import { useState, useMemo, useEffect, useRef } from "react"
import { Search, Download, Upload, ChevronUp, Plus, ChevronDown, ChevronRight, Eye, EyeOff, Filter, Settings, Menu, X, ChevronLeft, ArrowUpDown, Edit, Trash2, MoveLeft, MoveRight, Snowflake, Phone, Globe, MoreHorizontal, ExternalLink, Copy } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { MultiSelectDropdown } from "@/components/MultiSelectDropdown"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { useNavigate } from "react-router-dom";
 
// Types
interface SalesPlan {
  id: string;
  businessType: string;
  location: string;
  emailTemplate: string;
  linkedinTemplate: string;
  coldCallTemplate: string;
  status: string;
  createdAt: string;
}
 
// Mock data
const generateMockSalesPlans = (): SalesPlan[] => {
  const businessTypes = [
    "insurance agency", "attorney", "real estate agency", "real estate agent",
    "building", "restaurant", "beauty salon", "auto repair shop", "corporate office",
    "dental office", "medical clinic", "law firm", "accounting firm", "consulting firm"
  ]
 
  const locations = [
    "Naperville, Illinois", "Chicago, Illinois", "New York, NY", "Los Angeles, CA",
    "Houston, TX", "Phoenix, AZ", "Philadelphia, PA", "San Antonio, TX",
    "San Diego, CA", "Dallas, TX", "San Jose, CA", "Austin, TX"
  ]
 
  const templates = ["None", "Template A", "Template B", "Template C", "Custom Template"]
  const statuses = ["Pending", "Active", "Completed", "On Hold", "Cancelled"]
 
  const salesPlans: SalesPlan[] = []
  for (let i = 1; i <= 25; i++) {
    const businessType = businessTypes[i % businessTypes.length]
    const location = locations[i % locations.length]
    const emailTemplate = templates[i % templates.length]
    const linkedinTemplate = templates[i % templates.length]
    const coldCallTemplate = templates[i % templates.length]
    const status = statuses[i % statuses.length]
   
    salesPlans.push({
      id: i.toString(),
      businessType,
      location,
      emailTemplate,
      linkedinTemplate,
      coldCallTemplate,
      status,
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
    })
  }
  return salesPlans
}
 
const allSalesPlans = generateMockSalesPlans()
 
const SalesPlans = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [salesPlans, setSalesPlans] = useState<SalesPlan[]>(allSalesPlans)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>([])
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingSalesPlan, setEditingSalesPlan] = useState<SalesPlan | null>(null)
  const [editForm, setEditForm] = useState({
    businessType: "",
    location: "",
    emailTemplate: "",
    linkedinTemplate: "",
    coldCallTemplate: "",
    status: ""
  })
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
 
  // Column configuration
  const [columns, setColumns] = useState([
    { key: 'checkbox', label: '', sortable: false, order: -1, frozen: false, width: 'w-6' },
    { key: 'businessType', label: 'BUSINESS TYPE', sortable: true, order: 0, frozen: false, width: 'w-32' },
    { key: 'location', label: 'LOCATION', sortable: true, order: 1, frozen: false, width: 'w-40' },
    { key: 'emailTemplate', label: 'EMAIL TEMPLATE', sortable: true, order: 2, frozen: false, width: 'w-32' },
    { key: 'linkedinTemplate', label: 'LINKEDIN TEMPLATE', sortable: true, order: 3, frozen: false, width: 'w-36' },
    { key: 'coldCallTemplate', label: 'COLD CALL TEMPLATE', sortable: true, order: 4, frozen: false, width: 'w-36' },
    { key: 'status', label: 'STATUS', sortable: true, order: 5, frozen: false, width: 'w-24' },
    { key: 'createdAt', label: 'CREATED DATE', sortable: true, order: 6, frozen: false, width: 'w-28' },
    { key: 'actions', label: 'ACTIONS', sortable: false, order: 7, frozen: false, width: 'w-20' }
  ])
 
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
 
  const itemsPerPage = 10
 
  // Generate filter options
  const businessTypeOptions = Array.from(new Set(allSalesPlans.map(sp => sp.businessType))).map(type => ({
    value: type,
    label: type
  })).sort((a, b) => a.label.localeCompare(b.label))
 
  const statusOptions = Array.from(new Set(allSalesPlans.map(sp => sp.status))).map(status => ({
    value: status,
    label: status
  })).sort((a, b) => a.label.localeCompare(b.label))
 
  const filterSalesPlans = () => {
    let filtered = allSalesPlans
 
    if (searchTerm) {
      filtered = filtered.filter(plan =>
        plan.businessType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.emailTemplate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.linkedinTemplate.toLowerCase().includes(searchTerm.toLowerCase()) ||
        plan.coldCallTemplate.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
 
    if (selectedBusinessTypes.length > 0) {
      filtered = filtered.filter(plan => selectedBusinessTypes.includes(plan.businessType))
    }
 
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter(plan => selectedStatuses.includes(plan.status))
    }
 
    // Apply sorting
    if (sortConfig) {
      filtered.sort((a: any, b: any) => {
        const aValue = a[sortConfig.key]
        const bValue = b[sortConfig.key]
       
        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1
        return 0
      })
    }
 
    return filtered
  }
 
  const applyFiltersAndPagination = () => {
    setLoading(true)
    const filtered = filterSalesPlans()
    const totalFiltered = filtered.length
    const totalPagesCalculated = Math.ceil(totalFiltered / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = filtered.slice(startIndex, endIndex)
    setSalesPlans(paginatedData)
    setTotal(totalFiltered)
    setTotalPages(totalPagesCalculated)
    setLoading(false)
  }
 
  useEffect(() => {
    applyFiltersAndPagination()
  }, [currentPage, searchTerm, selectedBusinessTypes, selectedStatuses, sortConfig])
 
  const handleSearch = () => {
    setCurrentPage(1)
    applyFiltersAndPagination()
  }
 
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
 
  const handleClearAllFilters = () => {
    setSearchTerm("")
    setSelectedBusinessTypes([])
    setSelectedStatuses([])
    setCurrentPage(1)
  }
 
  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortConfig({ key, direction })
  }
 
  const handleMove = (columnKey: string, direction: 'left' | 'right') => {
    const currentColumn = columns.find(col => col.key === columnKey)
    if (!currentColumn) return
 
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order)
    const currentIndex = sortedColumns.findIndex(col => col.key === columnKey)
   
    if (direction === 'left' && currentIndex > 0) {
      const targetColumn = sortedColumns[currentIndex - 1]
      setColumns(prev => prev.map(col => {
        if (col.key === columnKey) return { ...col, order: targetColumn.order }
        if (col.key === targetColumn.key) return { ...col, order: currentColumn.order }
        return col
      }))
    } else if (direction === 'right' && currentIndex < sortedColumns.length - 1) {
      const targetColumn = sortedColumns[currentIndex + 1]
      setColumns(prev => prev.map(col => {
        if (col.key === columnKey) return { ...col, order: targetColumn.order }
        if (col.key === targetColumn.key) return { ...col, order: currentColumn.order }
        return col
      }))
    }
  }
 
  const handleFreezeColumn = (columnKey: string) => {
    setColumns(prev => prev.map(col =>
      col.key === columnKey ? { ...col, frozen: !col.frozen } : col
    ))
  }
 
  const canMoveLeft = (columnKey: string) => {
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order)
    const currentIndex = sortedColumns.findIndex(col => col.key === columnKey)
    return currentIndex > 0
  }
 
  const canMoveRight = (columnKey: string) => {
    const sortedColumns = [...columns].sort((a, b) => a.order - b.order)
    const currentIndex = sortedColumns.findIndex(col => col.key === columnKey)
    return currentIndex < sortedColumns.length - 1
  }
 
  const handleEditSalesPlan = (salesPlan: SalesPlan) => {
    setEditingSalesPlan(salesPlan)
    setEditForm({
      businessType: salesPlan.businessType,
      location: salesPlan.location,
      emailTemplate: salesPlan.emailTemplate,
      linkedinTemplate: salesPlan.linkedinTemplate,
      coldCallTemplate: salesPlan.coldCallTemplate,
      status: salesPlan.status
    })
    setIsEditModalOpen(true)
  }
 
  const handleDeleteSalesPlan = (salesPlan: SalesPlan) => {
    if (window.confirm(`Are you sure you want to delete this sales plan?`)) {
      // Remove from the main data array
      const index = allSalesPlans.findIndex(sp => sp.id === salesPlan.id)
      if (index > -1) {
        allSalesPlans.splice(index, 1)
      }
     
      // Update the current sales plans (filtered/paginated data)
      const updatedSalesPlans = salesPlans.filter(sp => sp.id !== salesPlan.id)
      setSalesPlans(updatedSalesPlans)
     
      // Remove from selected rows if it was selected
      const newSelected = new Set(selectedRows)
      newSelected.delete(salesPlan.id)
      setSelectedRows(newSelected)
     
      // Refresh the list
      applyFiltersAndPagination()
    }
  }
 
  const handleUpdateSalesPlan = () => {
    if (editingSalesPlan && editForm.businessType && editForm.location) {
      // Update in the main data array
      const index = allSalesPlans.findIndex(sp => sp.id === editingSalesPlan.id)
      if (index > -1) {
        allSalesPlans[index] = {
          ...editingSalesPlan,
          businessType: editForm.businessType,
          location: editForm.location,
          emailTemplate: editForm.emailTemplate,
          linkedinTemplate: editForm.linkedinTemplate,
          coldCallTemplate: editForm.coldCallTemplate,
          status: editForm.status
        }
      }
     
      // Update in the current sales plans (filtered/paginated data)
      const updatedSalesPlans = salesPlans.map(sp =>
        sp.id === editingSalesPlan.id
          ? {
              ...sp,
              businessType: editForm.businessType,
              location: editForm.location,
              emailTemplate: editForm.emailTemplate,
              linkedinTemplate: editForm.linkedinTemplate,
              coldCallTemplate: editForm.coldCallTemplate,
              status: editForm.status
            }
          : sp
      )
      setSalesPlans(updatedSalesPlans)
     
      // Close modal and reset
      setIsEditModalOpen(false)
      setEditingSalesPlan(null)
      setEditForm({ businessType: "", location: "", emailTemplate: "", linkedinTemplate: "", coldCallTemplate: "", status: "" })
     
      // Refresh the list
      applyFiltersAndPagination()
    }
  }
 
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(salesPlans.map(sp => sp.id))
      setSelectedRows(allIds)
      setSelectAll(true)
    } else {
      setSelectedRows(new Set())
      setSelectAll(false)
    }
  }
 
  const handleRowSelect = (salesPlanId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(salesPlanId)
    } else {
      newSelected.delete(salesPlanId)
    }
    setSelectedRows(newSelected)
    setSelectAll(newSelected.size === salesPlans.length)
  }
 
  const handleBusinessTypeClick = (businessType: string) => {
    navigate(`/business-types/${businessType.toLowerCase().replace(/\s+/g, '-')}`)
  }
 
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        return "Invalid Date"
      }
      const month = date.toLocaleDateString('en-US', { month: 'short' })
      const day = date.getDate()
      const year = date.getFullYear()
      return `${month} ${day}, ${year}`
    } catch (error) {
      return "Invalid Date"
    }
  }
 
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "text-green-600 bg-green-50"
      case "Pending":
        return "text-yellow-600 bg-yellow-50"
      case "Completed":
        return "text-blue-600 bg-blue-50"
      case "On Hold":
        return "text-orange-600 bg-orange-50"
      case "Cancelled":
        return "text-red-600 bg-red-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }
 
  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 bg-background flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Sales Plans</h1>
          </div>
 
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter className="w-4 h-4 mr-1" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>
 
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-2.5 text-muted-foreground" />
                <Input
                  placeholder="Search sales plans..."
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
              </div>
             
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={() => console.log('Add Sales Plan clicked')}
              >
                <Plus className="h-4 w-4" />
                Add Sales Plan
              </Button>
            </div>
          </div>
        </div>
 
        <div className="flex flex-1">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 border-r border-border bg-muted/10 flex-shrink-0">
              <div className="p-4 h-full overflow-y-auto">
                <h2 className="font-semibold mb-4">Filters</h2>
                <div className="space-y-4">
                  <div>
                    <MultiSelectDropdown
                      label="Business Type"
                      options={businessTypeOptions}
                      selectedValues={selectedBusinessTypes}
                      onSelectionChange={setSelectedBusinessTypes}
                      placeholder="Select business types..."
                    />
                  </div>
 
                  <div>
                    <MultiSelectDropdown
                      label="Status"
                      options={statusOptions}
                      selectedValues={selectedStatuses}
                      onSelectionChange={setSelectedStatuses}
                      placeholder="Select statuses..."
                    />
                  </div>
                </div>
 
                <div className="mt-6 pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full" onClick={handleClearAllFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
 
          {/* Main Content */}
          <div className="flex-1 flex flex-col min-h-0">
            {/* Table Data Scroll Area with Enhanced Horizontal Scrollbar */}
            <div className="flex-1 min-h-0 relative">
              <div
                className="absolute inset-0 overflow-x-auto overflow-y-auto [&::-webkit-scrollbar]:h-4 [&::-webkit-scrollbar]:w-4 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:rounded-lg [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:rounded-lg [&::-webkit-scrollbar-thumb:hover]:bg-gray-500"
                style={{
                  scrollbarWidth: 'auto',
                  scrollbarColor: '#6b7280 #e5e7eb'
                }}
              >
                <div className="min-w-[1400px]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        {[...columns].sort((a, b) => a.order - b.order).map((column) => (
                          column.key === 'checkbox' ? (
                            <TableHead key={column.key} className={column.width}>
                              <Checkbox
                                checked={selectAll}
                                onCheckedChange={handleSelectAll}
                                className="h-4 w-4"
                              />
                            </TableHead>
                          ) : (
                            <DropdownMenu key={column.key}>
                              <DropdownMenuTrigger asChild>
                                <TableHead
                                  className={`${column.width} text-left cursor-pointer hover:bg-muted/50 transition-all duration-200 ${
                                    column.sortable ? 'hover:bg-blue-50' : ''
                                  } ${column.frozen ? 'bg-blue-50 border-r-2 border-blue-300' : ''}`}
                                  onClick={() => column.sortable && handleSort(column.key, sortConfig?.key === column.key && sortConfig.direction === 'asc' ? 'desc' : 'asc')}
                                  title={column.sortable ? `Click to sort ${column.label}, right-click for more options` : `Right-click for options`}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="flex items-center gap-2">
                                      {column.label}
                                      {column.frozen && <Snowflake className="h-3 w-3 text-blue-500" />}
                                    </span>
                                  </div>
                                </TableHead>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="start">
                                {column.sortable && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleSort(column.key, 'asc')}>
                                      <ChevronUp className="mr-2 h-4 w-4" />
                                      Sort Ascending
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleSort(column.key, 'desc')}>
                                      <ChevronDown className="mr-2 h-4 w-4" />
                                      Sort Descending
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                {canMoveLeft(column.key) && (
                                  <DropdownMenuItem onClick={() => handleMove(column.key, 'left')}>
                                    <MoveLeft className="mr-2 h-4 w-4" />
                                    Move Left
                                  </DropdownMenuItem>
                                )}
                                {canMoveRight(column.key) && (
                                  <DropdownMenuItem onClick={() => handleMove(column.key, 'right')}>
                                    <MoveRight className="mr-2 h-4 w-4" />
                                    Move Right
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem onClick={() => handleFreezeColumn(column.key)}>
                                  <Snowflake className="mr-2 h-4 w-4" />
                                  {columns.find(col => col.key === column.key)?.frozen ? 'Unfreeze Column' : 'Freeze Column'}
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesPlans.map((salesPlan) => (
                        <TableRow key={salesPlan.id}>
                          {[...columns].sort((a, b) => a.order - b.order).map((column) => (
                            <TableCell key={column.key} className={`${column.width} text-left ${
                              column.frozen ? 'bg-blue-50 border-r-2 border-blue-300' : ''
                            }`}>
                              {column.key === 'checkbox' ? (
                                <Checkbox
                                  checked={selectedRows.has(salesPlan.id)}
                                  onCheckedChange={(checked) => handleRowSelect(salesPlan.id, checked as boolean)}
                                  className="h-4 w-4 cursor-pointer"
                                />
                              ) : column.key === 'businessType' ? (
                                <div className="text-sm font-medium">
                                  {salesPlan.businessType}
                                </div>
                              ) : column.key === 'location' ? (
                                <div className="text-sm">
                                  {salesPlan.location}
                                </div>
                              ) : column.key === 'emailTemplate' ? (
                                <div className="text-sm">
                                  {salesPlan.emailTemplate}
                                </div>
                              ) : column.key === 'linkedinTemplate' ? (
                                <div className="text-sm">
                                  {salesPlan.linkedinTemplate}
                                </div>
                              ) : column.key === 'coldCallTemplate' ? (
                                <div className="text-sm">
                                  {salesPlan.coldCallTemplate}
                                </div>
                              ) : column.key === 'status' ? (
                                <Badge
                                  variant="secondary"
                                  className={`px-2 py-1 text-xs font-medium ${getStatusColor(salesPlan.status)}`}
                                >
                                  {salesPlan.status}
                                </Badge>
                              ) : column.key === 'createdAt' ? (
                                <div className="text-sm text-gray-600">
                                  {formatDate(salesPlan.createdAt)}
                                </div>
                              ) : column.key === 'actions' ? (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-7 w-7 p-0 flex-shrink-0 hover:bg-gray-50"
                                    >
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem onClick={() => handleEditSalesPlan(salesPlan)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit Sales Plan
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                      onClick={() => handleDeleteSalesPlan(salesPlan)}
                                      className="text-red-600"
                                    >
                                      <Trash2 className="mr-2 h-4 w-4" />
                                      Delete Sales Plan
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              ) : (
                                salesPlan[column.key as keyof SalesPlan]
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
 
            {/* Pagination/Footer */}
            <div className="border-t border-border p-4 bg-background flex-shrink-0 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
              {/* Record Range Info */}
              <span className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium text-foreground">
                  {total > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}
                </span>
                –
                <span className="font-medium text-foreground">
                  {Math.min(currentPage * itemsPerPage, total)}
                </span>{" "}
                of{" "}
                <span className="font-medium text-foreground">
                  {total}
                </span>{" "}
                records
              </span>
 
              {/* Pagination Controls */}
              <div className="flex items-center justify-center gap-2">
                {/* Previous */}
                <button
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={`px-3 py-1 text-white bg-black border rounded text-sm flex items-center gap-1 ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
 
                <span className="text-sm">Page</span>
 
                <select
                  value={currentPage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  className="px-2 py-1 border rounded text-sm cursor-pointer"
                  style={{ maxHeight: "200px", overflowY: "auto" }}
                >
                  {Array.from({ length: totalPages }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
 
                <span className="text-sm">of {totalPages}</span>
 
                {/* Next */}
                <button
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={`px-3 py-1 text-white bg-black border rounded text-sm flex items-center gap-1 ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
 
        {/* Edit Modal */}
        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Edit Sales Plan</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-businessType">Business Type</Label>
                  <Select value={editForm.businessType} onValueChange={(value) => setEditForm(prev => ({ ...prev, businessType: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select business type" />
                    </SelectTrigger>
                    <SelectContent>
                      {businessTypeOptions.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-location">Location</Label>
                  <Select value={editForm.location} onValueChange={(value) => setEditForm(prev => ({ ...prev, location: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Naperville, Illinois">Naperville, Illinois</SelectItem>
                      <SelectItem value="Chicago, Illinois">Chicago, Illinois</SelectItem>
                      <SelectItem value="New York, NY">New York, NY</SelectItem>
                      <SelectItem value="Los Angeles, CA">Los Angeles, CA</SelectItem>
                      <SelectItem value="Houston, TX">Houston, TX</SelectItem>
                      <SelectItem value="Phoenix, AZ">Phoenix, AZ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-emailTemplate">Email Template</Label>
                  <Select value={editForm.emailTemplate} onValueChange={(value) => setEditForm(prev => ({ ...prev, emailTemplate: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select email template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Template A">Template A</SelectItem>
                      <SelectItem value="Template B">Template B</SelectItem>
                      <SelectItem value="Template C">Template C</SelectItem>
                      <SelectItem value="Custom Template">Custom Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-linkedinTemplate">LinkedIn Template</Label>
                  <Select value={editForm.linkedinTemplate} onValueChange={(value) => setEditForm(prev => ({ ...prev, linkedinTemplate: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select LinkedIn template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Template A">Template A</SelectItem>
                      <SelectItem value="Template B">Template B</SelectItem>
                      <SelectItem value="Template C">Template C</SelectItem>
                      <SelectItem value="Custom Template">Custom Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-coldCallTemplate">Cold Call Template</Label>
                  <Select value={editForm.coldCallTemplate} onValueChange={(value) => setEditForm(prev => ({ ...prev, coldCallTemplate: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cold call template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      <SelectItem value="Template A">Template A</SelectItem>
                      <SelectItem value="Template B">Template B</SelectItem>
                      <SelectItem value="Template C">Template C</SelectItem>
                      <SelectItem value="Custom Template">Custom Template</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="On Hold">On Hold</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setIsEditModalOpen(false)
                setEditingSalesPlan(null)
                setEditForm({ businessType: "", location: "", emailTemplate: "", linkedinTemplate: "", coldCallTemplate: "", status: "" })
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdateSalesPlan} className="bg-blue-600 hover:bg-blue-700 text-white">
                Update Plan
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
 
export default SalesPlans