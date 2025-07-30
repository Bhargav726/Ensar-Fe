
import { useState, useEffect } from "react"
import { Search, Filter, Settings, Plus, ChevronDown, ArrowUpDown, Phone, Globe, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { PersonDetail } from "./PersonDetail"

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
  coordinates?: {
    lat: number
    lng: number
  }
}

interface ApiResponse {
  businesses: Business[]
  total: number
  page: number
  limit: number
  totalPages: number
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
  const [selectedTypes, setSelectedTypes] = useState("")
  const [selectedCities, setSelectedCities] = useState("")
  const [selectedState, setSelectedState] = useState("all")

  const fetchBusinesses = async (page: number = 1, search: string = "", types: string = "", cities: string = "", state: string = "all") => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "50",
        search,
        types,
        cities,
        state
      })
      
      const response = await fetch(`https://ai-business-manager.azurewebsites.net/api/places?${params}`)
      const data: ApiResponse = await response.json()
      
      setBusinesses(data.businesses || [])
      setTotal(data.total || 0)
      setCurrentPage(data.page || 1)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error('Failed to fetch businesses:', error)
      setBusinesses([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBusinesses()
  }, [])

  const handleSearch = () => {
    setCurrentPage(1)
    fetchBusinesses(1, searchTerm, selectedTypes, selectedCities, selectedState)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchBusinesses(page, searchTerm, selectedTypes, selectedCities, selectedState)
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
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 bg-background">
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
            <div className="w-64 border-r border-border bg-muted/10">
              <div className="p-4">
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
                    <h3 className="font-medium text-sm mb-2">Business Type</h3>
                    <Input 
                      placeholder="Search business type..."
                      value={selectedTypes}
                      onChange={(e) => setSelectedTypes(e.target.value)}
                    />
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2">City</h3>
                    <Input 
                      placeholder="Search cities..."
                      value={selectedCities}
                      onChange={(e) => setSelectedCities(e.target.value)}
                    />
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2">State</h3>
                    <select 
                      className="w-full p-2 border rounded"
                      value={selectedState}
                      onChange={(e) => setSelectedState(e.target.value)}
                    >
                      <option value="all">All States</option>
                      <option value="IL">Illinois</option>
                      <option value="CA">California</option>
                      <option value="NY">New York</option>
                      <option value="TX">Texas</option>
                    </select>
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
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedTypes("")
                      setSelectedCities("")
                      setSelectedState("all")
                      setCurrentPage(1)
                      fetchBusinesses()
                    }}
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
            <div className="border-b border-border p-4 bg-background">
              <div className="flex items-center gap-8 text-sm">
                <div>
                  <span className="text-muted-foreground">Showing {((currentPage - 1) * 50) + 1} to {Math.min(currentPage * 50, total)} of {total.toLocaleString()} businesses</span>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-muted-foreground">Loading...</div>
                </div>
              ) : (
                <Table>
                  <TableHeader className="sticky top-0 bg-background">
                    <TableRow>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          BUSINESS
                          <ArrowUpDown className="w-4 h-4" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          ADDRESS
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          TYPE
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          RATING
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1">
                          CONTACT
                        </div>
                      </TableHead>
                      <TableHead>
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
                        <TableCell>
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
              )}
            </div>

            {/* Pagination */}
            <div className="border-t border-border p-4 bg-background">
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
                    const page = i + 1
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
