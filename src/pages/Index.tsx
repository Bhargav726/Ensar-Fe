
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background to-muted p-8">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight mb-6">
          Welcome to Business Manager
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Manage and explore your business database with powerful search and filtering capabilities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/find-people">
            <Button size="lg" className="min-w-[200px]">
              Find People
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link to="/find-companies">
            <Button variant="outline" size="lg" className="min-w-[200px]">
              Find Companies
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
