import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import OceanData from "@/pages/ocean-data";
import FisheriesData from "@/pages/fisheries-data";
import MolecularData from "@/pages/molecular-data";
import AIPredictions from "@/pages/ai-predictions";
import About from "@/pages/about";
import Auth from "@/pages/auth";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/ocean-data" component={OceanData} />
          <Route path="/fisheries-data" component={FisheriesData} />
          <Route path="/molecular-data" component={MolecularData} />
          <Route path="/ai-predictions" component={AIPredictions} />
          <Route path="/about" component={About} />
          <Route path="/auth" component={Auth} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
