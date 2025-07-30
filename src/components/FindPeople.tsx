import { useState, useEffect } from "react"
import { Search, Filter, Settings, Plus, ChevronDown, ArrowUpDown, Phone, Globe, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { PersonDetail } from "./PersonDetail"
import { MultiSelectDropdown } from "./MultiSelectDropdown"
import mockData from "../data/mockBusinesses.json"

interface Business {
  id: string
  name: string
  address: string
  type: string
  rating: number
  reviewCount: number
  phone?: string
  website?: string
  status: 'Open' | 'Closed' | 'Unknown'
  city: string
  state: string
  country: string
}

export function FindPeople() {
  const [showFilters, setShowFilters] = useState(true)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedStates, setSelectedStates] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])

  const itemsPerPage = 10

  // Extract unique options from mock data
  const typeOptions = Array.from(new Set(mockData.businesses.map(b => b.type)))
    .map(type => ({ value: type, label: type }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const cityOptions = Array.from(new Set(mockData.businesses.map(b => b.city)))
    .map(city => ({ value: city, label: city }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const stateOptions = Array.from(new Set(mockData.businesses.map(b => b.state)))
    .map(state => ({ value: state, label: state }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const countryOptions = Array.from(new Set(mockData.businesses.map(b => b.country)))
    .map(country => ({ value: country, label: country }))
    .sort((a, b) => a.label.localeCompare(b.label))

  const filterBusinesses = () => {
    let filtered = mockData.businesses as Business[]

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(business =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by selected types
    if (selectedTypes.length > 0) {
      filtered = filtered.filter(business => selectedTypes.includes(business.type))
    }

    // Filter by selected cities
    if (selectedCities.length > 0) {
      filtered = filtered.filter(business => selectedCities.includes(business.city))
    }

    // Filter by selected states
    if (selectedStates.length > 0) {
      filtered = filtered.filter(business => selectedStates.includes(business.state))
    }

    // Filter by selected countries
    if (selectedCountries.length > 0) {
      filtered = filtered.filter(business => selectedCountries.includes(business.country))
    }

    return filtered
  }

  const applyFiltersAndPagination = () => {
    setLoading(true)
    
    const filtered = filterBusinesses()
    const totalFiltered = filtered.length
    const totalPagesCalculated = Math.ceil(totalFiltered / itemsPerPage)
    
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const paginatedData = filtered.slice(startIndex, endIndex)
    
    setBusinesses(paginatedData)
    setTotal(totalFiltered)
    setTotalPages(totalPagesCalculated)
    setLoading(false)
  }

  useEffect(() => {
    applyFiltersAndPagination()
  }, [currentPage, searchTerm, selectedTypes, selectedCities, selectedStates, selectedCountries])

  const handleSearch = () => {
    setCurrentPage(1)
    applyFiltersAndPagination()
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleClearAllFilters = () => {
    setSearchTerm("")
    setSelectedTypes([])
    setSelectedCities([])
    setSelectedStates([])
    setSelectedCountries([])
    setCurrentPage(1)
  }

  const formatRating = (rating: number, reviewCount: number) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-yellow-500">★</span>
        <span className="font-medium">{rating.toFixed(1)}</span>
        <span className="text-muted-foreground">({reviewCount})</span>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'Open': 'bg-green-100 text-green-800',
      'Closed': 'bg-red-100 text-red-800',
      'Unknown': 'bg-gray-100 text-gray-800'
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status as keyof typeof statusColors] || statusColors.Unknown}`}>
        {status}
      </span>
    )
  }

  if (selectedBusiness) {
    return <PersonDetail person={selectedBusiness} onBack={() => setSelectedBusiness(null)} />
  }

  return (
    <div className="flex h-screen">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 bg-background flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">Find Businesses</h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                Import
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Quick search</span>
              <span className="text-xs text-muted-foreground">Ctrl+K</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                Default view
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-1" />
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-2.5 text-muted-foreground" />
                <Input 
                  placeholder="Search businesses..." 
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button onClick={handleSearch}>Search</Button>
              <Button>
                <Plus className="w-4 h-4 mr-1" />
                Create workflow
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="outline">Save as new search</Button>
              <Button variant="outline">
                Relevance
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 border-r border-border bg-muted/10 flex-shrink-0">
              <div className="p-4 h-full overflow-y-auto">
                <h2 className="font-semibold mb-4">Filters</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm mb-2">Search</h3>
                    <Input 
                      placeholder="Search businesses..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>

                  <div>
                    <MultiSelectDropdown
                      label="Location"
                      options={countryOptions}
                      selectedValues={selectedCountries}
                      onSelectionChange={setSelectedCountries}
                      placeholder="Select countries..."
                    />
                  </div>

                  <div>
                    <MultiSelectDropdown
                      label="State"
                      options={stateOptions}
                      selectedValues={selectedStates}
                      onSelectionChange={setSelectedStates}
                      placeholder="Select states..."
                    />
                  </div>

                  <div>
                    <MultiSelectDropdown
                      label="City"
                      options={cityOptions}
                      selectedValues={selectedCities}
                      onSelectionChange={setSelectedCities}
                      placeholder="Select cities..."
                    />
                  </div>

                  <div>
                    <MultiSelectDropdown
                      label="Business Type"
                      options={typeOptions}
                      selectedValues={selectedTypes}
                      onSelectionChange={setSelectedTypes}
                      placeholder="Select business types..."
                    />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full mb-2"
                    onClick={handleSearch}
                  >
                    Apply Filters
                  </Button>
                  <Button 
                    variant="link" 
                    className="text-sm p-0"
                    onClick={handleClearAllFilters}
                  >
                    Clear all
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Stats */}
            <div className="border-b border-border p-4 bg-background flex-shrink-0">
              <div className="flex items-center gap-8 text-sm">
                <div>
                  <span className="text-muted-foreground">
                    Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, total)} of {total.toLocaleString()} businesses
                  </span>
                </div>
              </div>
            </div>

            {/* Table Container with Scrollbars - Only for table */}
            <div className="flex-1 overflow-hidden relative">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">Loading...</div>
                </div>
              ) : (
                <div className="h-full overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10 border-b">
                      <TableRow>
                        <TableHead className="sticky left-0 bg-background z-20 min-w-[200px] border-r">
                          <div className="flex items-center gap-1">
                            BUSINESS
                            <ArrowUpDown className="w-4 h-4" />
                          </div>
                        </TableHead>
                        <TableHead className="min-w-[300px]">
                          <div className="flex items-center gap-1">
                            ADDRESS
                          </div>
                        </TableHead>
                        <TableHead className="min-w-[150px]">
                          <div className="flex items-center gap-1">
                            TYPE
                          </div>
                        </TableHead>
                        <TableHead className="min-w-[120px]">
                          <div className="flex items-center gap-1">
                            RATING
                          </div>
                        </TableHead>
                        <TableHead className="min-w-[120px]">
                          <div className="flex items-center gap-1">
                            CONTACT
                          </div>
                        </TableHead>
                        <TableHead className="min-w-[100px]">
                          <div className="flex items-center gap-1">
                            STATUS
                          </div>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {businesses.map((business) => (
                        <TableRow 
                          key={business.id}
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSelectedBusiness(business)}
                        >
                          <TableCell className="sticky left-0 bg-background border-r">
                            <div className="font-medium text-blue-600 hover:underline">
                              {business.name}
                            </div>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {business.address}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {business.type}
                          </TableCell>
                          <TableCell>
                            {business.rating && business.reviewCount ? formatRating(business.rating, business.reviewCount) : '-'}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {business.phone && (
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Phone className="w-4 h-4" />
                                </Button>
                              )}
                              {business.website && (
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                  <Globe className="w-4 h-4" />
                                </Button>
                              )}
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MapPin className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(business.status)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="border-t border-border p-4 bg-background flex-shrink-0">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage > 1) handlePageChange(currentPage - 1)
                      }}
                      className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const page = Math.max(1, currentPage - 2) + i
                    if (page > totalPages) return null
                    return (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(page)
                          }}
                          isActive={currentPage === page}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        if (currentPage < totalPages) handlePageChange(currentPage + 1)
                      }}
                      className={currentPage >= totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
