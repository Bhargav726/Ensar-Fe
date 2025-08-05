
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Download, Filter, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import mockData from "../data/mockBusinesses.json";
import { MultiSelectDropdown } from "./MultiSelectDropdown";
import { PersonDetail } from "./PersonDetail";
import { ResizableTable } from "./ResizableTable";

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
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [selectAll, setSelectAll] = useState(false);
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

  // Handle select all - select all records across all pages
  const handleSelectAll = (selected: boolean) => {
    setSelectAll(selected);
    if (selected) {
      // Get all business IDs from all pages (all filtered results)
      const allFilteredBusinesses = filterBusinesses();
      const allIds = new Set(allFilteredBusinesses.map(b => b.id));
      setSelectedRows(allIds);
    } else {
      setSelectedRows(new Set());
    }
  };

  // Handle individual row selection
  const handleRowSelect = (businessId: string, checked: boolean) => {
    const newSelected = new Set(selectedRows);
    if (checked) {
      newSelected.add(businessId);
    } else {
      newSelected.delete(businessId);
    }
    setSelectedRows(newSelected);
    
    // Update select all state based on current page
    const currentPageSelected = businesses.every(b => newSelected.has(b.id));
    setSelectAll(currentPageSelected);
  };

  // Handle export
  const handleExport = () => {
    if (selectedRows.size > 0) {
      console.log('Exporting selected IDs:', Array.from(selectedRows));
      alert(`Exporting ${selectedRows.size} selected records`);
    }
  };

  if (selectedBusiness) {
    return <PersonDetail person={selectedBusiness} onBack={() => setSelectedBusiness(null)} />;
  }

  return (
  <div className="flex h-full overflow-hidden">
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4 bg-background flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <span
            style={{
              fontFamily: `'Inter', 'Segoe UI', 'Helvetica Neue', sans-serif`,
              fontSize: '20px',
              fontWeight: 400,
              color: '#111827',
            }}
          >
            People
          </span>
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
                placeholder="Search businesses..."
                className="pl-8 w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            
            {/* Export Button - appears when any checkbox is selected */}
            {selectedRows.size > 0 && (
              <Button 
                onClick={handleExport}
                size="sm"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export Selected ({selectedRows.size})
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="w-80 border-r border-l border-border bg-muted/10 flex-shrink-0 overflow-hidden">
            <div className="p-4 h-full overflow-y-auto">
              <h2 className="font-semibold mb-4">Filters</h2>
              <div className="space-y-4">
                <MultiSelectDropdown
                  label="Location"
                  options={countryOptions}
                  selectedValues={selectedCountries}
                  onSelectionChange={setSelectedCountries}
                  placeholder="Select countries..."
                />
                <MultiSelectDropdown
                  label="State"
                  options={stateOptions}
                  selectedValues={selectedStates}
                  onSelectionChange={setSelectedStates}
                  placeholder="Select states..."
                />
                <MultiSelectDropdown
                  label="City"
                  options={cityOptions}
                  selectedValues={selectedCities}
                  onSelectionChange={setSelectedCities}
                  placeholder="Select cities..."
                />
                <MultiSelectDropdown
                  label="Business Type"
                  options={typeOptions}
                  selectedValues={selectedTypes}
                  onSelectionChange={setSelectedTypes}
                  placeholder="Select business types..."
                />
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
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Table Container */}
          <div className="flex-1 overflow-hidden">
            <ResizableTable
              businesses={businesses}
              onBusinessClick={setSelectedBusiness}
              loading={loading}
              totalRecords={total}
              onSelectAll={handleSelectAll}
              selectedRows={selectedRows}
              onRowSelect={handleRowSelect}
              selectAll={selectAll}
            />
          </div>

          {/* Pagination */}
          <div className="border-t border-border p-4 bg-background flex-shrink-0 flex items-center gap-4 flex-wrap sm:flex-nowrap">
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                className={`text-[#000000] hover:text-[#000000] transition-colors ${currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}`}
              >
                <ChevronLeft size={20} />
              </button>

              <div className="flex items-center gap-2">
                <select
                  value={currentPage}
                  onChange={(e) => handlePageChange(Number(e.target.value))}
                  className="px-3 py-1 bg-white border border-gray-300 rounded text-[#000000] text-sm cursor-pointer focus:outline-none focus:border-gray-400"
                >
                  {Array.from({ length: totalPages }, (_, i) => (
                    <option key={i + 1} value={i + 1} className="bg-white text-[#000000]">
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                className={`text-[#000000] hover:text-[#000000] transition-colors ${currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}`}
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <span className="text-sm text-[#000000]">
              {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, total)} of {total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
)
};