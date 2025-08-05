import { MultiSelectDropdown } from "@/components/MultiSelectDropdown"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Edit, Filter, MoreHorizontal, MoveLeft, MoveRight, Plus, Search, Snowflake, Trash2, X } from "lucide-react"
import { useEffect, useState } from "react"
 
// Types
interface Website {
  id: string;
  name: string;
  url: string;
  businessType: string;
  label: string;
  description: string;
  createdAt: string;
  status: string;
  priority: number;
}
 
// Mock data - you can replace this with actual API calls
const generateMockWebsites = (): Website[] => {
  const businessTypes = [
    "Technology", "Restaurant", "Cafe", "Fitness", "Automotive", "Retail",
    "Food Market", "Entertainment", "Art Gallery", "Sporting Goods",
    "Financial Services", "Engineering", "Health & Wellness", "Fashion Retail"
  ]
 
  const statuses = ["active", "inactive", "pending"]
  const priorities = [1, 2, 3]
  const labels = ["Primary", "Main Site", "Website", "Landing Page", "Blog"]
 
  const websites: Website[] = []
  for (let i = 1; i <= 25; i++) {
    const businessType = businessTypes[i % businessTypes.length]
    const status = statuses[i % statuses.length]
    const priority = priorities[i % priorities.length]
    const label = labels[i % labels.length]
   
    websites.push({
      id: i.toString(),
      name: `${businessType} Website ${i}`,
      url: `https://${businessType.toLowerCase().replace(' ', '')}${i}.com`,
      businessType,
      label,
      description: `Official website for ${businessType} business ${i}`,
      createdAt: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      status,
      priority
    })
  }
  return websites
}
 
const allWebsites = generateMockWebsites()
 
const WebsitesManager = () => {
  const [showFilters, setShowFilters] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [websites, setWebsites] = useState<Website[]>(allWebsites)
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedBusinessTypes, setSelectedBusinessTypes] = useState<string[]>([])
  const [selectedLabels, setSelectedLabels] = useState<string[]>([])
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingWebsite, setEditingWebsite] = useState<Website | null>(null)
  const [newWebsite, setNewWebsite] = useState({
    name: "",
    url: "",
    businessType: "",
    label: "",
    description: ""
  })
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null)
 
  // Column configuration for move and freeze functionality
  const [columns, setColumns] = useState([
    { key: 'checkbox', label: '', sortable: false, order: -1, frozen: false, width: 'w-6', sticky: false },
    { key: 'url', label: 'WEBSITE', sortable: true, order: 0, frozen: false, width: 'w-24', sticky: true },
    { key: 'businessType', label: 'BUSINESS TYPE', sortable: true, order: 1, frozen: false, width: 'w-20', sticky: false },
    { key: 'label', label: 'LABEL', sortable: true, order: 2, frozen: false, width: 'w-16', sticky: false },
    { key: 'description', label: 'DESCRIPTION', sortable: true, order: 3, frozen: false, width: 'w-32', sticky: false },
    { key: 'createdAt', label: 'CREATED DATE', sortable: true, order: 4, frozen: false, width: 'w-20', sticky: false },
    { key: 'actions', label: 'ACTIONS', sortable: false, order: 5, frozen: false, width: 'w-20', sticky: false }
  ])
 
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [selectAll, setSelectAll] = useState(false)
 
  const itemsPerPage = 10
 
  // Generate filter options
  const businessTypeOptions = Array.from(new Set(allWebsites.map(w => w.businessType))).map(type => ({
    value: type,
    label: type
  })).sort((a, b) => a.label.localeCompare(b.label))
 
  const labelOptions = Array.from(new Set(allWebsites.map(w => w.label))).map(label => ({
    value: label,
    label: label
  })).sort((a, b) => a.label.localeCompare(b.label))
 
  const filterWebsites = () => {
    let filtered = allWebsites
 
    if (searchTerm) {
      filtered = filtered.filter(website =>
        website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        website.businessType.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
 
    if (selectedBusinessTypes.length > 0) {
      filtered = filtered.filter(website => selectedBusinessTypes.includes(website.businessType))
    }
 
    if (selectedLabels.length > 0) {
      filtered = filtered.filter(website => selectedLabels.includes(website.label))
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
    const filtered = filterWebsites()
    const totalFiltered = filtered.length
    const totalPagesCalculated = Math.ceil(totalFiltered / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = filtered.slice(startIndex, endIndex)
    setWebsites(paginatedData)
    setTotal(totalFiltered)
    setTotalPages(totalPagesCalculated)
    setLoading(false)
  }
 
  useEffect(() => {
    applyFiltersAndPagination()
  }, [currentPage, searchTerm, selectedBusinessTypes, selectedLabels, sortConfig])
 
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
    setSelectedLabels([])
    setCurrentPage(1)
  }
 
  const handleSort = (key: string, direction: "asc" | "desc") => {
    setSortConfig({ key, direction })
  }
 
  const handleAddWebsite = () => {
    setIsAddModalOpen(true)
  }
 
  const handleCreateWebsite = () => {
    if (newWebsite.name && newWebsite.url && newWebsite.businessType) {
      const website: Website = {
        id: Date.now().toString(),
        name: newWebsite.name,
        url: newWebsite.url,
        businessType: newWebsite.businessType,
        label: newWebsite.label || 'Website',
        description: newWebsite.description || '',
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
        priority: 1
      }
     
      // Add to main data array
      allWebsites.push(website)
     
      // Reset form and close modal
      setNewWebsite({ name: "", url: "", businessType: "", label: "", description: "" })
      setIsAddModalOpen(false)
     
      // Refresh the list
      applyFiltersAndPagination()
    }
  }
 
  const handleEditWebsite = (website: Website) => {
    setEditingWebsite(website)
    setNewWebsite({
      name: website.name,
      url: website.url,
      businessType: website.businessType,
      label: website.label,
      description: website.description
    })
    setIsEditModalOpen(true)
  }
 
  const handleDeleteWebsite = (website: Website) => {
    if (window.confirm(`Are you sure you want to delete "${website.name}"?`)) {
      // Remove from the main data array
      const index = allWebsites.findIndex(w => w.id === website.id)
      if (index > -1) {
        allWebsites.splice(index, 1)
      }
     
      // Update the current websites (filtered/paginated data)
      const updatedWebsites = websites.filter(w => w.id !== website.id)
      setWebsites(updatedWebsites)
     
      // Remove from selected rows if it was selected
      const newSelected = new Set(selectedRows)
      newSelected.delete(website.id)
      setSelectedRows(newSelected)
     
      // Refresh the list
      applyFiltersAndPagination()
    }
  }
 
  const handleUpdateWebsite = () => {
    if (editingWebsite && newWebsite.name && newWebsite.url && newWebsite.businessType) {
      // Update in the main data array
      const index = allWebsites.findIndex(w => w.id === editingWebsite.id)
      if (index > -1) {
        allWebsites[index] = {
          ...editingWebsite,
          name: newWebsite.name,
          url: newWebsite.url,
          businessType: newWebsite.businessType,
          label: newWebsite.label,
          description: newWebsite.description
        }
      }
     
      // Update in the current websites (filtered/paginated data)
      const updatedWebsites = websites.map(w =>
        w.id === editingWebsite.id
          ? {
              ...w,
              name: newWebsite.name,
              url: newWebsite.url,
              businessType: newWebsite.businessType,
              label: newWebsite.label,
              description: newWebsite.description
            }
          : w
      )
      setWebsites(updatedWebsites)
     
      // Close modal and reset
      setIsEditModalOpen(false)
      setEditingWebsite(null)
      setNewWebsite({ name: "", url: "", businessType: "", label: "", description: "" })
     
      // Refresh the list
      applyFiltersAndPagination()
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
 
 
 
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(websites.map(w => w.id))
      setSelectedRows(allIds)
      setSelectAll(true)
    } else {
      setSelectedRows(new Set())
      setSelectAll(false)
    }
  }
 
  const handleRowSelect = (websiteId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(websiteId)
    } else {
      newSelected.delete(websiteId)
    }
    setSelectedRows(newSelected)
    setSelectAll(newSelected.size === websites.length)
  }
 
  const handleWebsiteClick = (website: Website) => {
    console.log("Website clicked:", website)
    // You can implement navigation or detail view here
  }
 
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
 
  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 bg-background flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">Websites Manager</h1>
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
                  placeholder="Search websites..."
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
                onClick={handleAddWebsite}
              >
                <Plus className="h-4 w-4" />
                Create Website
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
                      label="Label"
                      options={labelOptions}
                      selectedValues={selectedLabels}
                      onSelectionChange={setSelectedLabels}
                      placeholder="Select labels..."
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
            {/* Table Container with Sticky Column */}
            <div className="flex-1 min-h-0 relative">
              <div className="absolute inset-0 h-full overflow-y-auto">
                <div className="relative">
                  <Table className="w-full">
                    <TableHeader className="sticky top-0 bg-background z-20">
                      <TableRow>
                        {/* Checkbox Column - Sticky */}
                        <TableHead className="sticky left-0 z-30 bg-background border-r w-12 min-w-[48px]">
                          <Checkbox
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                            className="h-4 w-4"
                          />
                        </TableHead>
                       
                                                 {/* Website Column - Sticky */}
                         <DropdownMenu>
                           <DropdownMenuTrigger asChild>
                             <TableHead
                               className={`sticky left-12 z-30 bg-background border-r text-left cursor-pointer hover:bg-muted/50 transition-all duration-200 whitespace-nowrap min-w-[200px] font-medium ${
                                 columns.find(col => col.key === 'url')?.frozen ? 'bg-blue-50 border-blue-200' : ''
                               }`}
                               onClick={() => handleSort('url', sortConfig?.key === 'url' && sortConfig.direction === 'asc' ? 'desc' : 'asc')}
                               title="Click to sort WEBSITE, right-click for more options"
                             >
                               <div className="flex items-center justify-between">
                                 <span className="flex items-center gap-2">
                                   WEBSITE
                                   {columns.find(col => col.key === 'url')?.frozen && (
                                     <Snowflake className="h-3 w-3 text-blue-600" />
                                   )}
                                 </span>
                               </div>
                             </TableHead>
                           </DropdownMenuTrigger>
                           <DropdownMenuContent align="start">
                             <DropdownMenuItem onClick={() => handleSort('url', 'asc')}>
                               <ChevronUp className="mr-2 h-4 w-4" />
                               Sort Ascending
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleSort('url', 'desc')}>
                               <ChevronDown className="mr-2 h-4 w-4" />
                               Sort Descending
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                             {canMoveLeft('url') && (
                               <DropdownMenuItem onClick={() => handleMove('url', 'left')}>
                                 <MoveLeft className="mr-2 h-4 w-4" />
                                 Move Left
                               </DropdownMenuItem>
                             )}
                             {canMoveRight('url') && (
                               <DropdownMenuItem onClick={() => handleMove('url', 'right')}>
                                 <MoveRight className="mr-2 h-4 w-4" />
                                 Move Right
                               </DropdownMenuItem>
                             )}
                             <DropdownMenuItem onClick={() => handleFreezeColumn('url')}>
                               <Snowflake className="mr-2 h-4 w-4" />
                               {columns.find(col => col.key === 'url')?.frozen ? 'Unfreeze Column' : 'Freeze Column'}
                             </DropdownMenuItem>
                           </DropdownMenuContent>
                         </DropdownMenu>
 
                                                 {/* Scrollable Columns */}
                         {[...columns]
                           .filter(col => !col.sticky && col.key !== 'checkbox')
                           .sort((a, b) => a.order - b.order)
                           .map((column) => (
                             <DropdownMenu key={column.key}>
                               <DropdownMenuTrigger asChild>
                                 <TableHead
                                   className={`text-left cursor-pointer hover:bg-muted/50 transition-all duration-200 whitespace-nowrap ${
                                     column.key === 'businessType' ? 'min-w-[150px]' :
                                     column.key === 'label' ? 'min-w-[120px]' :
                                     column.key === 'description' ? 'min-w-[250px]' :
                                     column.key === 'createdAt' ? 'min-w-[120px]' :
                                     column.key === 'actions' ? 'min-w-[120px]' : 'min-w-[100px]'
                                   } ${column.sortable ? 'hover:bg-blue-50' : ''} ${
                                     columns.find(col => col.key === column.key)?.frozen ? 'bg-blue-50 border-blue-200' : ''
                                   }`}
                                   onClick={() => column.sortable && handleSort(column.key, sortConfig?.key === column.key && sortConfig.direction === 'asc' ? 'desc' : 'asc')}
                                   title={column.sortable ? `Click to sort ${column.label}, right-click for more options` : `Right-click for options`}
                                 >
                                   <div className="flex items-center justify-between">
                                     <span className="flex items-center gap-2">
                                       {column.label}
                                       {columns.find(col => col.key === column.key)?.frozen && (
                                         <Snowflake className="h-3 w-3 text-blue-600" />
                                       )}
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
                           ))}
                      </TableRow>
                    </TableHeader>
                   
                    <TableBody>
                      {websites.map((website) => (
                        <TableRow key={website.id}>
                          {/* Checkbox Cell - Sticky */}
                          <TableCell className="sticky left-0 z-10 bg-background border-r text-left whitespace-nowrap">
                            <Checkbox
                              checked={selectedRows.has(website.id)}
                              onCheckedChange={(checked) => handleRowSelect(website.id, checked as boolean)}
                              className="h-4 w-4 cursor-pointer"
                            />
                          </TableCell>
 
                                                     {/* Website Cell - Sticky */}
                           <TableCell className={`sticky left-12 z-10 bg-background border-r text-left whitespace-nowrap ${
                             columns.find(col => col.key === 'url')?.frozen ? 'bg-blue-50 border-blue-200' : ''
                           }`}>
                             <div className="text-left max-w-[200px]">
                               <a
                                 href={website.url}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm font-medium truncate block"
                                 title={website.url}
                               >
                                 {website.name}
                               </a>
                             </div>
                           </TableCell>
 
                                                     {/* Scrollable Cells */}
                           {[...columns]
                             .filter(col => !col.sticky && col.key !== 'checkbox')
                             .sort((a, b) => a.order - b.order)
                             .map((column) => (
                               <TableCell key={column.key} className={`text-left whitespace-nowrap ${
                                 columns.find(col => col.key === column.key)?.frozen ? 'bg-blue-50 border-blue-200' : ''
                               }`}>
                                {column.key === 'businessType' ? (
                                  <Badge
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-muted whitespace-nowrap"
                                    onClick={() => handleWebsiteClick(website)}
                                  >
                                    {website.businessType}
                                  </Badge>
                                ) : column.key === 'label' ? (
                                  <Badge
                                    variant="outline"
                                    className="text-xs font-medium whitespace-nowrap"
                                  >
                                    {website.label}
                                  </Badge>
                                ) : column.key === 'description' ? (
                                  <div className="max-w-[250px] truncate" title={website.description}>
                                    {website.description}
                                  </div>
                                ) : column.key === 'createdAt' ? (
                                  <div className="text-sm text-gray-600 whitespace-nowrap">
                                    {formatDate(website.createdAt)}
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
                                      <DropdownMenuItem onClick={() => handleEditWebsite(website)}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit Website
                                      </DropdownMenuItem>
                                      <DropdownMenuItem
                                        onClick={() => handleDeleteWebsite(website)}
                                        className="text-red-600"
                                      >
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        Delete Website
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                ) : (
                                  website[column.key as keyof Website]
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
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Website</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Website Name *</Label>
                <Input
                  id="edit-name"
                  value={newWebsite.name}
                  onChange={(e) => setNewWebsite(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter website name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-url">Website URL *</Label>
                <Input
                  id="edit-url"
                  value={newWebsite.url}
                  onChange={(e) => setNewWebsite(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-businessType">Business Type *</Label>
                <Select value={newWebsite.businessType} onValueChange={(value) => setNewWebsite(prev => ({ ...prev, businessType: value }))}>
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
                <Label htmlFor="edit-label">Label</Label>
                <Input
                  id="edit-label"
                  value={newWebsite.label}
                  onChange={(e) => setNewWebsite(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Primary, Main Site"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={newWebsite.description}
                  onChange={(e) => setNewWebsite(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the website"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setIsEditModalOpen(false)
                setEditingWebsite(null)
                setNewWebsite({ name: "", url: "", businessType: "", label: "", description: "" })
              }}>
                Cancel
              </Button>
              <Button onClick={handleUpdateWebsite} className="bg-blue-600 hover:bg-blue-700 text-white">
                Update
              </Button>
            </div>
          </DialogContent>
        </Dialog>
 
        {/* Add Modal */}
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Website</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="add-name">Website Name *</Label>
                <Input
                  id="add-name"
                  value={newWebsite.name}
                  onChange={(e) => setNewWebsite(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter website name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-url">Website URL *</Label>
                <Input
                  id="add-url"
                  value={newWebsite.url}
                  onChange={(e) => setNewWebsite(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-businessType">Business Type *</Label>
                <Select value={newWebsite.businessType} onValueChange={(value) => setNewWebsite(prev => ({ ...prev, businessType: value }))}>
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
                <Label htmlFor="add-label">Label</Label>
                <Input
                  id="add-label"
                  value={newWebsite.label}
                  onChange={(e) => setNewWebsite(prev => ({ ...prev, label: e.target.value }))}
                  placeholder="e.g., Primary, Main Site"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="add-description">Description</Label>
                <Textarea
                  id="add-description"
                  value={newWebsite.description}
                  onChange={(e) => setNewWebsite(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Brief description of the website"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => {
                setIsAddModalOpen(false)
                setNewWebsite({ name: "", url: "", businessType: "", label: "", description: "" })
              }}>
                Cancel
              </Button>
              <Button onClick={handleCreateWebsite} className="bg-blue-600 hover:bg-blue-700 text-white">
                Create Website
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
 
export default WebsitesManager