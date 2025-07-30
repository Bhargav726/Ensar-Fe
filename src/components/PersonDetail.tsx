
import { ArrowLeft, Star, Mail, Phone, MapPin, ExternalLink, User, Building2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Person {
  id: string
  name: string
  company: string
  employees: string
  industry: string
  keywords: string
}

interface PersonDetailProps {
  person: Person
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
            Back to People
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <span className="text-xl font-semibold">
                {person.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-semibold mb-1">{person.name}</h1>
              <p className="text-muted-foreground">
                Corporate HR Manager at <span className="text-blue-600">Optiemus Electronics Limited</span> • Noida, India
              </p>
            </div>
          </div>
          <Button className="bg-yellow-400 hover:bg-yellow-500 text-black">
            <Mail className="w-4 h-4 mr-1" />
            Access email
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
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-green-600" />
                <div>
                  <div className="font-medium">****@****.com</div>
                  <Button variant="outline" size="sm" className="mt-1">
                    Access email
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <div>
                  <div className="text-muted-foreground">(***) ***-****</div>
                  <div className="text-sm text-muted-foreground">Mobile • credits</div>
                  <Button variant="outline" size="sm" className="mt-1">
                    <Phone className="w-4 h-4 mr-1" />
                    Access mobile
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building2 className="w-5 h-5" />
                <div>
                  <div className="font-medium">No phone number available</div>
                  <div className="text-sm text-muted-foreground">Business</div>
                </div>
              </div>
            </div>
          </div>

          {/* Work History */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Work history</h2>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                  O
                </div>
                <div className="flex-1">
                  <div className="font-medium">Optiemus Electronics Limited</div>
                  <div className="text-muted-foreground">Corporate HR Manager</div>
                  <div className="text-sm text-muted-foreground">Current • 2 years</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                  T
                </div>
                <div className="flex-1">
                  <div className="font-medium">Testify</div>
                  <div className="text-muted-foreground">Brand Ambassador</div>
                  <div className="text-sm text-muted-foreground">2022 - 2023</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-border bg-muted/10">
          <div className="p-6">
            {/* Company Insights */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Company insights</h3>
                <Button variant="ghost" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2 mb-4 text-sm">
                <Button variant="outline" size="sm">Score</Button>
                <Button variant="ghost" size="sm">News</Button>
                <Button variant="ghost" size="sm">Technologies <span className="ml-1">15</span></Button>
                <Button variant="ghost" size="sm">Funding</Button>
              </div>

              <div className="bg-card border rounded-lg p-4 mb-4">
                <h4 className="font-medium mb-2">Create a score for insights</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Create a new score or adjust existing scores to get insights for more people and companies.
                </p>
                <Button variant="outline" size="sm">Manage Scores</Button>
              </div>

              <div className="bg-card border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                    O
                  </div>
                  <span className="font-medium">Optiemus Electronics Limited</span>
                  <span className="text-xs bg-muted px-1 rounded">N/A</span>
                  <span className="text-xs">0</span>
                </div>

                <div className="border-t pt-3 mt-3">
                  <h5 className="font-medium mb-2">About</h5>
                  <p className="text-sm text-muted-foreground">
                    Optiemus Electronics Limited (OEL) is an Indian company based in New Delhi, specializing in end-to-end 
                    Electronics Manufacturing Services (EMS). Established in 2016, OEL is part of the Optiemus Group and 
                    employs over 2,300 skilled professionals, including more than 300 engineers. The company offers 
                    comprehensive manufacturing solutions for a variety of electronic products, including telecom equipment, 
                    compute hardware, mobile devices, and wearable technology.
                  </p>
                  <Button variant="link" className="p-0 text-sm">
                    OEL partners with leading ... Show More
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
