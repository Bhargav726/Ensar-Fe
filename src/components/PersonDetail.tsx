
import { ArrowLeft, Star, Mail, Phone, MapPin, ExternalLink, User, Building2, Calendar, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface PersonDetailProps {
  person: Business
  onBack: () => void
}

export function PersonDetail({ person, onBack }: PersonDetailProps) {
  return (
    <div className="h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back to Businesses
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold">
                {person.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold mb-1">{person.name}</h1>
              <p className="text-muted-foreground">
                {person.type} • {person.address}
              </p>
              <div className="flex items-center gap-2 mt-2">
                {person.rating && (
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{person.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground">({person.reviewCount} reviews)</span>
                  </div>
                )}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  person.status === 'Open' ? 'bg-green-100 text-green-800' :
                  person.status === 'Closed' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {person.status}
                </span>
              </div>
            </div>
          </div>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
            <Phone className="w-4 h-4 mr-1" />
            Contact Business
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Contact Information */}
          <div className="bg-card border rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Contact information</h2>
            </div>

            <div className="space-y-4">
              {person.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <div className="font-medium">{person.phone}</div>
                    <div className="text-sm text-muted-foreground">Business phone</div>
                  </div>
                </div>
              )}

              {person.website && (
                <div className="flex items-center gap-3">
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                  <div>
                    <div className="font-medium text-blue-600 hover:underline cursor-pointer">{person.website}</div>
                    <div className="text-sm text-muted-foreground">Website</div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-red-600" />
                <div>
                  <div className="font-medium">{person.address}</div>
                  <div className="text-sm text-muted-foreground">Business address</div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Details */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Business details</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {person.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{person.name}</div>
                  <div className="text-muted-foreground">{person.type}</div>
                  <div className="text-sm text-muted-foreground">Status: {person.status}</div>
                  {person.rating && (
                    <div className="text-sm text-muted-foreground">
                      Rating: {person.rating.toFixed(1)}/5 ({person.reviewCount} reviews)
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-border bg-muted/10">
          <div className="p-6">
            {/* Business Insights */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Business insights</h3>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2 mb-4 text-sm">
                <Button variant="outline" size="sm">Details</Button>
                <Button variant="ghost" size="sm">Reviews</Button>
                <Button variant="ghost" size="sm">Location</Button>
                <Button variant="ghost" size="sm">Hours</Button>
              </div>

              <div className="bg-card border rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-2">Business Information</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  View detailed information about this business including contact details, 
                  operating hours, and customer reviews.
                </p>
                <Button variant="outline" size="sm">View More Details</Button>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    {person.name.charAt(0)}
                  </div>
                  <span className="font-medium">{person.name}</span>
                  <span className="text-xs bg-muted px-1 rounded">{person.status}</span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <h5 className="font-medium mb-2">About</h5>
                  <p className="text-sm text-muted-foreground">
                    {person.name} is a {person.type.toLowerCase()} business located at {person.address}. 
                    {person.rating && ` This business has a ${person.rating.toFixed(1)}-star rating based on ${person.reviewCount} customer reviews.`}
                    {person.phone && ` You can contact them at ${person.phone}.`}
                    {person.website && ` Visit their website for more information.`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
