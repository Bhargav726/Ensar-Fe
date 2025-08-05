import { useState, useMemo, useEffect, useRef } from "react"
import { Search, Download, Upload, ChevronUp, Plus, ChevronDown, ChevronRight, Eye, EyeOff, Filter, Settings, Menu, X, ChevronLeft, ArrowUpDown, Edit, Trash2, MoveLeft, MoveRight, Snowflake, Phone, Globe, MoreHorizontal, FileText } from "lucide-react"
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
 
// Mock data for business types
const generateMockBusinessTypes = () => {
  const types = [
    "insurance agency", "attorney", "real estate agency", "real estate agent",
    "building", "restaurant", "beauty salon", "auto repair shop", "corporate office",
    "dental office", "medical clinic", "law firm", "accounting firm", "consulting firm"
  ]
 
  const statuses = ["active", "inactive"]
  const priorities = [0, 1, 2]
  const cities = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"]
  const states = ["NY", "CA", "IL", "TX", "AZ", "PA", "FL", "OH", "GA", "NC"]
  const countries = ["USA", "Canada", "UK", "Australia", "Germany", "France", "Japan", "India", "Brazil", "Mexico"]
 
  const businessTypes = []
  for (let i = 1; i <= 12; i++) { // changed from 50 to 12
    const type = types[i % types.length]
    const status = statuses[i % statuses.length]
    const priority = priorities[i % priorities.length]
    const city = cities[i % cities.length]
    const state = states[i % states.length]
    const country = countries[i % countries.length]
   
    businessTypes.push({
      id: i,
      type,
      number: Math.floor(Math.random() * 400000) + 200000,
      priority,
      created: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      status,
      city,
      state,
      country
    })
  }
  return businessTypes
}
 
const allBusinessTypes = generateMockBusinessTypes()
 
const BusinessTypes = () => {
  const [showFilters, setShowFilters] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [businessTypes, setBusinessTypes] = useState(allBusinessTypes)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedPriorities, setSelectedPriorities] = useState<number[]>([])
  const [minNumber, setMinNumber] = useState<string>("")
  const [maxNumber, setMaxNumber] = useState<string>("")
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingBusinessType, setEditingBusinessType] = useState<any>(null)
  const [newBusinessType, setNewBusinessType] = useState({
    type: "",
    number: "",
    priority: ""
  })
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
 
  // Import functionality
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isImporting, setIsImporting] = useState(false)
 
  // Column configuration for move and freeze functionality
  const [columns, setColumns] = useState([
    { key: 'checkbox', label: '', sortable: false, order: -1, frozen: false },
    { key: 'type', label: 'TYPE', sortable: true, order: 0, frozen: false },
    { key: 'number', label: 'NUMBER', sortable: true, order: 1, frozen: false },
    { key: 'priority', label: 'PRIORITY', sortable: true, order: 2, frozen: false },
    { key: 'created', label: 'CREATED', sortable: true, order: 3, frozen: false },
    { key: 'actions', label: 'ACTIONS', sortable: false, order: 4, frozen: false }
  ])
 
  const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
 
  const itemsPerPage = 10
 
  // Generate filter options
  const priorityOptions = Array.from(new Set(allBusinessTypes.map(b => b.priority))).map(priority => ({
    value: priority.toString(),
    label: `Priority ${priority}`
  })).sort((a, b) => a.label.localeCompare(b.label))
 
  const filterBusinessTypes = () => {
    let filtered = allBusinessTypes
 
    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.number.toString().includes(searchTerm) ||
        business.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.country.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
 
    if (selectedPriorities.length > 0) {
      filtered = filtered.filter(business => selectedPriorities.includes(business.priority))
    }
 
    // Min/Max number filtering
    if (minNumber && minNumber !== "") {
      const min = parseInt(minNumber)
      if (!isNaN(min)) {
        filtered = filtered.filter(business => business.number >= min)
      }
    }
 
    if (maxNumber && maxNumber !== "") {
      const max = parseInt(maxNumber)
      if (!isNaN(max)) {
        filtered = filtered.filter(business => business.number <= max)
      }
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
    const filtered = filterBusinessTypes()
    const totalFiltered = filtered.length
    const totalPagesCalculated = Math.ceil(totalFiltered / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = filtered.slice(startIndex, endIndex)
    setBusinessTypes(paginatedData)
    setTotal(totalFiltered)
    setTotalPages(totalPagesCalculated)
    setLoading(false)
  }
 
  useEffect(() => {
    applyFiltersAndPagination()
  }, [currentPage, searchTerm, selectedPriorities, minNumber, maxNumber, sortConfig])
 
  const handleSearch = () => {
    setCurrentPage(1)
    applyFiltersAndPagination()
  }
 
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }
 
  const handleClearAllFilters = () => {
    setSearchTerm("")
    setSelectedPriorities([])
    setMinNumber("")
    setMaxNumber("")
    setCurrentPage(1)
  }
 
  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortConfig({ key, direction })
  }
 
  const handleAddBusinessType = () => {
    // Handle adding new business type
    console.log("Adding business type:", newBusinessType)
    setIsAddModalOpen(false)
    setNewBusinessType({ type: "", number: "", priority: "" })
  }
 
  const handleEditBusinessType = (businessType: any) => {
    setEditingBusinessType(businessType)
    setNewBusinessType({
      type: businessType.type,
      number: businessType.number.toString(),
      priority: businessType.priority.toString()
    })
    setIsEditModalOpen(true)
  }
 
  const handleDeleteBusinessType = (businessType: any) => {
    if (window.confirm(`Are you sure you want to delete "${businessType.type}"?`)) {
      // Remove from the main data array
      const updatedAllBusinessTypes = allBusinessTypes.filter(bt => bt.id !== businessType.id)
     
      // Update the current business types (filtered/paginated data)
      const updatedBusinessTypes = businessTypes.filter(bt => bt.id !== businessType.id)
      setBusinessTypes(updatedBusinessTypes)
     
      // Remove from selected rows if it was selected
      const newSelected = new Set(selectedRows)
      newSelected.delete(businessType.id)
      setSelectedRows(newSelected)
     
      console.log("Business type deleted:", businessType)
    }
  }
 
  const handleUpdateBusinessType = () => {
    if (editingBusinessType && newBusinessType.type && newBusinessType.number && newBusinessType.priority) {
      // Update in the main data array
      const updatedAllBusinessTypes = allBusinessTypes.map(bt =>
        bt.id === editingBusinessType.id
          ? {
              ...bt,
              type: newBusinessType.type,
              number: parseInt(newBusinessType.number),
              priority: parseInt(newBusinessType.priority)
            }
          : bt
      )
     
      // Update in the current business types (filtered/paginated data)
      const updatedBusinessTypes = businessTypes.map(bt =>
        bt.id === editingBusinessType.id
          ? {
              ...bt,
              type: newBusinessType.type,
              number: parseInt(newBusinessType.number),
              priority: parseInt(newBusinessType.priority)
            }
          : bt
      )
      setBusinessTypes(updatedBusinessTypes)
     
      // Close modal and reset
      setIsEditModalOpen(false)
      setEditingBusinessType(null)
      setNewBusinessType({ type: "", number: "", priority: "" })
     
      console.log("Business type updated:", editingBusinessType.id, newBusinessType)
    }
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
 
  const handleContextMenuAction = (columnKey: string, action: string) => {
    switch (action) {
      case 'sort-asc':
        handleSort(columnKey, 'asc')
        break
      case 'sort-desc':
        handleSort(columnKey, 'desc')
        break
      case 'move-left':
        handleMove(columnKey, 'left')
        break
      case 'move-right':
        handleMove(columnKey, 'right')
        break
      case 'freeze':
        handleFreezeColumn(columnKey)
        break
    }
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
 
  const renderSortIcon = (columnKey: string) => {
    if (sortConfig?.key === columnKey) {
      return sortConfig.direction === "asc" ? (
        <ChevronUp className="h-4 w-4" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )
    }
    return <ArrowUpDown className="h-4 w-4" />
  }
 
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = businessTypes.map(bt => bt.id)
      setSelectedRows(new Set(allIds))
      setSelectAll(true)
    } else {
      setSelectedRows(new Set())
      setSelectAll(false)
    }
  }
 
  const handleRowSelect = (businessTypeId: number, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(businessTypeId)
    } else {
      newSelected.delete(businessTypeId)
    }
    setSelectedRows(newSelected)
    setSelectAll(newSelected.size === businessTypes.length)
  }
 
  const handleExportSelected = () => {
    if (selectedRows.size === 0) return;
   
    let businessTypesToExport;
   
    // If selectAll is true, export all records from the entire dataset
    if (selectAll) {
      businessTypesToExport = allBusinessTypes;
    } else {
      // Otherwise, export only the specifically selected items
      businessTypesToExport = allBusinessTypes.filter(businessType => selectedRows.has(businessType.id));
    }
   
    // Create CSV content
    const csvContent = [
      ['Type', 'Number', 'Priority', 'Created Date', 'Status', 'City', 'State', 'Country'],
      ...businessTypesToExport.map(businessType => [
        businessType.type,
        businessType.number,
        getPriorityLabel(businessType.priority),
        formatDate(businessType.created),
        businessType.status,
        businessType.city,
        businessType.state,
        businessType.country
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
   
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `business_types_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
 
  const handleBusinessTypeClick = (businessType: any) => {
    console.log("Business type clicked:", businessType)
    // You can implement navigation or detail view here
  }
 
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) {
        // Handle invalid dates
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
 
  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 0:
        return "Not Targeted"
      case 1:
        return "High Priority"
      case 2:
        return "Low Priority"
      default:
        return `Priority ${priority}`
    }
  }
 
  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 0:
        return "text-red-600 bg-red-50"
      case 1:
        return "text-green-600 bg-green-50"
      case 2:
        return "text-yellow-600 bg-yellow-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }
 
  // Import functionality
  const handleImportClick = () => {
    fileInputRef.current?.click()
  }
 
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
 
    setIsImporting(true)
   
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split('\n')
        const headers = lines[0].split(',').map(h => h.trim())
       
        const importedData = lines.slice(1).filter(line => line.trim()).map((line, index) => {
          const values = line.split(',').map(v => v.trim())
          return {
            id: allBusinessTypes.length + index + 1,
            type: values[0] || '',
            number: parseInt(values[1]) || 0,
            priority: parseInt(values[2]) || 1,
            created: new Date().toLocaleDateString('en-GB'),
            status: 'active',
            city: values[3] || 'Unknown',
            state: values[4] || 'Unknown',
            country: values[5] || 'Unknown'
          }
        })
 
allBusinessTypes.push(...importedData)
       
        // Refresh the current view
        applyFiltersAndPagination()
       
        console.log(`Successfully imported ${importedData.length} business types`)
        alert(`Successfully imported ${importedData.length} business types`)
      } catch (error) {
        console.error('Error importing file:', error)
        alert('Error importing file. Please check the file format.')
      } finally {
        setIsImporting(false)
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }
    }
   
    reader.readAsText(file)
  }
 
  return (
    <div className="flex h-full" style={{ width: '97%', margin: '0 auto' }}>
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 bg-background flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-foreground tracking-tight"></h1>
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
                  placeholder="Search business types..."
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
            </div>
 
              {selectedRows.size > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={handleExportSelected}
                >
                  <Download className="h-4 w-4" />
                  Export Selected ({selectedRows.size})
                </Button>
              )}
 
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={handleImportClick}
                disabled={isImporting}
              >
                <Upload className="h-4 w-4" />
                {isImporting ? 'Importing...' : 'Import CSV'}
              </Button>
             
              {/* Hidden file input for import */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
 
              <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Business Type
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Business Type</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="type">Type *</Label>
                      <Input
                        id="type"
                        placeholder="e.g., Restaurant, Retail Store"
                        value={newBusinessType.type}
                        onChange={(e) => setNewBusinessType(prev => ({ ...prev, type: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="number">Number *</Label>
                      <Input
                        id="number"
                        type="number"
                        placeholder="0"
                        value={newBusinessType.number}
                        onChange={(e) => setNewBusinessType(prev => ({ ...prev, number: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="priority">Priority *</Label>
                      <Input
                        id="priority"
                        type="number"
                        placeholder="0"
                        value={newBusinessType.priority}
                        onChange={(e) => setNewBusinessType(prev => ({ ...prev, priority: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddBusinessType} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Create
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
 
              {/* Edit Modal */}
              <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Business Type</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-type">Type *</Label>
                      <Input
                        id="edit-type"
                        placeholder="e.g., Restaurant, Retail Store"
                        value={newBusinessType.type}
                        onChange={(e) => setNewBusinessType(prev => ({ ...prev, type: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-number">Number *</Label>
                      <Input
                        id="edit-number"
                        type="number"
                        placeholder="0"
                        value={newBusinessType.number}
                        onChange={(e) => setNewBusinessType(prev => ({ ...prev, number: e.target.value }))}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-priority">Priority *</Label>
                      <Input
                        id="edit-priority"
                        type="number"
                        placeholder="0"
                        value={newBusinessType.priority}
                        onChange={(e) => setNewBusinessType(prev => ({ ...prev, priority: e.target.value }))}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={() => {
                      setIsEditModalOpen(false)
                      setEditingBusinessType(null)
                      setNewBusinessType({ type: "", number: "", priority: "" })
                    }}>
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateBusinessType} className="bg-blue-600 hover:bg-blue-700 text-white">
                      Update
                    </Button>
            </div>
                </DialogContent>
              </Dialog>
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
                    <Label htmlFor="min-number">Min Number</Label>
                    <Input
                      id="min-number"
                      type="number"
                      placeholder="Enter minimum number"
                      value={minNumber}
                      onChange={(e) => setMinNumber(e.target.value)}
                      className="w-full"
                    />
                  </div>
 
                  <div>
                    <Label htmlFor="max-number">Max Number</Label>
                    <Input
                      id="max-number"
                      type="number"
                      placeholder="Enter maximum number"
                      value={maxNumber}
                      onChange={(e) => setMaxNumber(e.target.value)}
                      className="w-full"
                    />
                  </div>
 
                  <div>
                    <MultiSelectDropdown
                      label="Priority"
                      options={priorityOptions}
                      selectedValues={selectedPriorities.map(p => p.toString())}
                      onSelectionChange={(values) => setSelectedPriorities(values.map(v => parseInt(v)))}
                      placeholder="Select priorities..."
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
          <div className="flex-1 flex flex-col" style={{ width: '90%' }}>
            {/* Table Data Scroll Area */}
            <div className="flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
              <Table className="w-full">
                <TableHeader className="sticky top-0 bg-background z-10 border-b border-border shadow-sm">
                  <TableRow>
                    {[...columns].sort((a, b) => a.order - b.order).map((column) => (
                      column.key === 'checkbox' ? (
                        <TableHead key={column.key} className="w-12 border-r border-border">
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
                              className={`text-left cursor-pointer hover:bg-muted/50 transition-all duration-200 ${
                                column.sortable ? 'hover:bg-blue-50' : ''
                              } ${column.frozen ? 'bg-blue-50 border-r-2 border-blue-300' : ''} ${column.key === 'type' ? 'border-l border-border' : ''}`}
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
                  {businessTypes.map((businessType) => (
                    <TableRow key={businessType.id}>
                      {[...columns].sort((a, b) => a.order - b.order).map((column) => (
                        <TableCell key={column.key} className={`text-left ${
                          column.frozen ? 'bg-blue-50 border-r-2 border-blue-300' : ''
                        } ${column.key === 'checkbox' ? 'border-r border-border' : column.key === 'type' ? 'border-l border-border' : ''}`}>
                          {column.key === 'checkbox' ? (
                            <Checkbox
                              checked={selectedRows.has(businessType.id)}
                              onCheckedChange={(checked) => handleRowSelect(businessType.id, checked as boolean)}
                              className="h-4 w-4 cursor-pointer"
                            />
                          ) : column.key === 'type' ? (
                            <div className="text-sm font-medium">
                              {businessType.type}
                            </div>
                          ) : column.key === 'number' ? (
                            businessType.number
                          ) : column.key === 'priority' ? (
                            <Badge
                              variant="secondary"
                              className={`px-2 py-1 text-xs font-medium ${getPriorityColor(businessType.priority)}`}
                            >
                              {getPriorityLabel(businessType.priority)}
                            </Badge>
                          ) : column.key === 'created' ? (
                            <div className="text-sm text-blue-600">
                              {formatDate(businessType.created)}
                            </div>
                          ) : column.key === 'actions' ? (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <MoreHorizontal className="h-4 w-4" />
                      </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleEditBusinessType(businessType)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleDeleteBusinessType(businessType)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          ) : (
                            businessType[column.key as keyof typeof businessType]
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
      </div>
    </div>
  )
}
 
export default BusinessTypes
 