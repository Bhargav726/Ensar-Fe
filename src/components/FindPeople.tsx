
import { useState } from "react"
import { Search, Filter, Settings, Plus, ChevronDown, ArrowUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PersonDetail } from "./PersonDetail"

interface Person {
  id: string
  name: string
  company: string
  employees: string
  industry: string
  keywords: string
}

const mockData: Person[] = [
  {
    id: "1",
    name: "Monika Gupta",
    company: "450",
    employees: "450",
    industry: "Electrical/electronic manufacturing",
    keywords: ""
  },
  {
    id: "2", 
    name: "Sunil Ranjhan",
    company: "16K",
    employees: "16K",
    industry: "Electrical/electronic manufacturing",
    keywords: ""
  },
  {
    id: "3",
    name: "Mauro Porcini", 
    company: "127K",
    employees: "127K",
    industry: "",
    keywords: "+3"
  },
  {
    id: "4",
    name: "Elad Wertheimer",
    company: "164K", 
    employees: "164K",
    industry: "Electrical/electronic manufacturing",
    keywords: ""
  },
  {
    id: "5",
    name: "Akshada Daberao",
    company: "740",
    employees: "740", 
    industry: "Electrical/electronic manufacturing",
    keywords: ""
  },
  {
    id: "6",
    name: "Hanneke Faber",
    company: "7.3K",
    employees: "7.3K",
    industry: "Electrical/electronic manufacturing", 
    keywords: ""
  },
  {
    id: "7",
    name: "Revathi A",
    company: "148K",
    employees: "148K",
    industry: "",
    keywords: "+3"
  }
]

export function FindPeople() {
  const [showFilters, setShowFilters] = useState(true)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  if (selectedPerson) {
    return <PersonDetail person={selectedPerson} onBack={() => setSelectedPerson(null)} />
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-border p-4 bg-background">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-semibold">Find people</h1>
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
                Hide Filters
                <span className="ml-1 bg-muted px-1 rounded text-xs">1</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-2 top-2.5 text-muted-foreground" />
                <Input 
                  placeholder="Search" 
                  className="pl-8 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-sm mb-2">Lists</h3>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <ChevronDown className="w-4 h-4 mr-1" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2">Persona</h3>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <ChevronDown className="w-4 h-4 mr-1" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2">Email Status</h3>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <ChevronDown className="w-4 h-4 mr-1" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2">Job Titles</h3>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <ChevronDown className="w-4 h-4 mr-1" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2">Company</h3>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <ChevronDown className="w-4 h-4 mr-1" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2">Company Lookalikes</h3>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <ChevronDown className="w-4 h-4 mr-1" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2">Location</h3>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <ChevronDown className="w-4 h-4 mr-1" />
                    </Button>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-2"># Employees</h3>
                    <Button variant="ghost" className="w-full justify-start text-sm">
                      <ChevronDown className="w-4 h-4 mr-1" />
                    </Button>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <Button variant="link" className="text-sm p-0">
                    Clear all 1
                  </Button>
                  <Button variant="link" className="text-sm p-0 ml-4">
                    More Filters
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
                  <span className="text-muted-foreground">Total</span>
                  <div className="font-semibold">3.0M</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Net New</span>
                  <div className="font-semibold">3.0M</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Saved</span>
                  <div className="font-semibold">0</div>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="flex-1 overflow-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-background">
                  <TableRow>
                    <TableHead className="w-12">
                      <input type="checkbox" />
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        NAME
                        <ArrowUpDown className="w-4 h-4" />
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        COMPANY • NUMBER OF EMPLOYEES
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        COMPANY • INDUSTRIES
                      </div>
                    </TableHead>
                    <TableHead>
                      <div className="flex items-center gap-1">
                        COMPANY • KEYWORDS
                        <Plus className="w-4 h-4 ml-auto" />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockData.map((person) => (
                    <TableRow 
                      key={person.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => setSelectedPerson(person)}
                    >
                      <TableCell>
                        <input type="checkbox" />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-blue-600 hover:underline">
                          {person.name}
                        </div>
                      </TableCell>
                      <TableCell>{person.employees}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {person.industry}
                      </TableCell>
                      <TableCell>
                        {person.keywords && (
                          <span className="text-sm text-muted-foreground">{person.keywords}</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="border-t border-border p-4 bg-background">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm">
                  ← Previous
                </Button>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">2</Button>
                  <span className="text-sm text-muted-foreground">26 - 50 of 2.939M</span>
                </div>
                <Button variant="ghost" size="sm">
                  Next →
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
