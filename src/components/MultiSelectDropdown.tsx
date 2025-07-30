
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronDown, X, Search } from "lucide-react"

interface Option {
  value: string
  label: string
}

interface MultiSelectDropdownProps {
  label: string
  options: Option[]
  selectedValues: string[]
  onSelectionChange: (values: string[]) => void
  placeholder?: string
}

export function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onSelectionChange,
  placeholder = "Search..."
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleToggleOption = (value: string) => {
    if (selectedValues.includes(value)) {
      onSelectionChange(selectedValues.filter(v => v !== value))
    } else {
      onSelectionChange([...selectedValues, value])
    }
  }

  const handleRemoveOption = (value: string, e?: React.MouseEvent) => {
    e?.stopPropagation()
    onSelectionChange(selectedValues.filter(v => v !== value))
  }

  const handleClearAll = () => {
    onSelectionChange([])
    setSearchTerm("")
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const getSelectedLabels = () => {
    return selectedValues.map(value => 
      options.find(option => option.value === value)?.label || value
    )
  }

  return (
      <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        {label}
        {selectedValues.length > 0 && (
          <>
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-0.5 rounded-full">
              {selectedValues.length}
            </span>
          </>
        )}
      </label>
      
      <Button
        variant="outline"
        className="w-full justify-between h-auto min-h-[40px] p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex flex-wrap gap-1 flex-1 text-left">
          {selectedValues.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            getSelectedLabels().map((label, index) => (
              <span
                key={selectedValues[index]}
                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md flex items-center gap-1"
              >
                {label}
                <button
                  onClick={(e) => handleRemoveOption(selectedValues[index], e)}
                  className="hover:bg-blue-200 rounded-full p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50">
          <div className="p-2 border-b">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-2 top-2.5 text-muted-foreground" />
              <Input
                placeholder={`Search ${label.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 h-9"
              />
            </div>
            {selectedValues.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-muted-foreground hover:text-foreground"
                onClick={handleClearAll}
              >
                Clear all
              </Button>
            )}
          </div>
          
          <ScrollArea className="max-h-48">
            <div className="p-1">
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center gap-2 p-2 cursor-pointer hover:bg-muted rounded-sm ${
                    selectedValues.includes(option.value) ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleToggleOption(option.value)}
                >
                  <div className={`w-4 h-4 border rounded flex items-center justify-center ${
                    selectedValues.includes(option.value) 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-muted-foreground'
                  }`}>
                    {selectedValues.includes(option.value) && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm">{option.label}</span>
                </div>
              ))}
              
              {filteredOptions.length === 0 && (
                <div className="p-2 text-sm text-muted-foreground text-center">
                  No options found
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  )
}
