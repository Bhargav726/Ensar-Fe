import { useState, useEffect } from "react";
import { Search, Filter, Settings, Plus, ChevronDown, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { PersonDetail } from "./PersonDetail";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { ResizableTable } from "./ResizableTable";
import mockData from "../data/mockBusinesses.json";

interface Business {
  id: string;
  name: string;
  address: string;
  type: string;
  rating: number;
  reviewCount: number;
  phone?: string;
  website?: string;
  status: 'Open' | 'Closed' | 'Unknown';
  city: string;
  state: string;
  country: string;
}

export function FindPeople() {
  const [showFilters, setShowFilters] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const itemsPerPage = 10;

  const typeOptions = Array.from(new Set(mockData.businesses.map(b => b.type))).map(type => ({
    value: type,
    label: type
  })).sort((a, b) => a.label.localeCompare(b.label));
  const cityOptions = Array.from(new Set(mockData.businesses.map(b => b.city))).map(city => ({
    value: city,
    label: city
  })).sort((a, b) => a.label.localeCompare(b.label));
  const stateOptions = Array.from(new Set(mockData.businesses.map(b => b.state))).map(state => ({
    value: state,
    label: state
  })).sort((a, b) => a.label.localeCompare(b.label));
  const countryOptions = Array.from(new Set(mockData.businesses.map(b => b.country))).map(country => ({
    value: country,
    label: country
  })).sort((a, b) => a.label.localeCompare(b.label));

  const filterBusinesses = () => {
    let filtered = mockData.businesses as Business[];

    if (searchTerm) {
      filtered = filtered.filter(business => business.name.toLowerCase().includes(searchTerm.toLowerCase()) || business.address.toLowerCase().includes(searchTerm.toLowerCase()) || business.type.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedTypes.length > 0) {
      filtered = filtered.filter(business => selectedTypes.includes(business.type));
    }

    if (selectedCities.length > 0) {
      filtered = filtered.filter(business => selectedCities.includes(business.city));
    }

    if (selectedStates.length > 0) {
      filtered = filtered.filter(business => selectedStates.includes(business.state));
    }

    if (selectedCountries.length > 0) {
      filtered = filtered.filter(business => selectedCountries.includes(business.country));
    }
    return filtered;
  };

  const applyFiltersAndPagination = () => {
    setLoading(true);
    const filtered = filterBusinesses();
    const totalFiltered = filtered.length;
    const totalPagesCalculated = Math.ceil(totalFiltered / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = filtered.slice(startIndex, endIndex);
    setBusinesses(paginatedData);
    setTotal(totalFiltered);
    setTotalPages(totalPagesCalculated);
    setLoading(false);
  };

  useEffect(() => {
    applyFiltersAndPagination();
  }, [currentPage, searchTerm, selectedTypes, selectedCities, selectedStates, selectedCountries]);

  const handleSearch = () => {
    setCurrentPage(1);
    applyFiltersAndPagination();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleClearAllFilters = () => {
    setSearchTerm("");
    setSelectedTypes([]);
    setSelectedCities([]);
    setSelectedStates([]);
    setSelectedCountries([]);
    setCurrentPage(1);
  };

  if (selectedBusiness) {
    return <PersonDetail person={selectedBusiness} onBack={() => setSelectedBusiness(null)} />;
  }

  return <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="border-b border-border p-4 bg-background flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            
            <div className="flex items-center gap-2">
              
            </div>
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
                <Input placeholder="Search businesses..." className="pl-8 w-64" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} />
              </div>
              <Button onClick={handleSearch}>Search</Button>
              <Button>
                <Plus className="w-4 h-4 mr-1" />
                Create workflow
                <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
              
              
              
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Filters Sidebar */}
          {showFilters && <div className="w-80 border-r border-border bg-muted/10 flex-shrink-0 overflow-hidden">
              <div className="p-4 h-full overflow-y-auto">
                <h2 className="font-semibold mb-4">Filters</h2>
                <div className="space-y-4">
                  <div>
                    <MultiSelectDropdown label="Location" options={countryOptions} selectedValues={selectedCountries} onSelectionChange={setSelectedCountries} placeholder="Select countries..." />
                  </div>

                  <div>
                    <MultiSelectDropdown label="State" options={stateOptions} selectedValues={selectedStates} onSelectionChange={setSelectedStates} placeholder="Select states..." />
                  </div>

                  <div>
                    <MultiSelectDropdown label="City" options={cityOptions} selectedValues={selectedCities} onSelectionChange={setSelectedCities} placeholder="Select cities..." />
                  </div>

                  <div>
                    <MultiSelectDropdown label="Business Type" options={typeOptions} selectedValues={selectedTypes} onSelectionChange={setSelectedTypes} placeholder="Select business types..." />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button variant="outline" size="sm" className="w-full" onClick={handleClearAllFilters}>
                    <X className="w-4 h-4 mr-1" />
                    Clear Filters
                  </Button>
                </div>
              </div>
            </div>}

          {/* Main Content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Table Container */}
            <div className="flex-1 overflow-hidden">
              <ResizableTable businesses={businesses} onBusinessClick={setSelectedBusiness} loading={loading} />
            </div>

            {/* Pagination */}
<div className="border-t border-border p-4 bg-background flex-shrink-0 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">

  {/* Record Range Info */}
  <span className="text-sm text-muted-foreground">
    Showing{" "}
    <span className="font-medium text-foreground">
      {(currentPage - 1) * pageSize + 1}
    </span>
    –
    <span className="font-medium text-foreground">
      {Math.min(currentPage * pageSize, totalRecords)}
    </span>{" "}
    of{" "}
    <span className="font-medium text-foreground">
      {totalRecords}
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
    </div>;
}
