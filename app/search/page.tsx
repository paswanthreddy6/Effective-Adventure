"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { searchDiseases, diseases, type Disease } from "@/lib/diseases-data";
import {
  Search,
  Stethoscope,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

export default function PublicSearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Disease[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = () => {
    if (query.trim()) {
      setResults(searchDiseases(query));
      setHasSearched(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "success";
      case "moderate":
        return "warning";
      case "severe":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">TeleMed</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Search Disease</h1>
            <p className="text-muted-foreground mt-1">
              Learn about conditions, symptoms, and find the right specialist
            </p>
          </div>

          {/* Search Bar */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter disease name or symptom (e.g., fever, diabetes, headache)"
                    className="pl-10 h-12"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <Button onClick={handleSearch} size="lg" className="h-12">
                  Search
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                {results.length > 0
                  ? `Found ${results.length} result${results.length > 1 ? "s" : ""} for "${query}"`
                  : `No results found for "${query}"`}
              </p>

              {results.length > 0 ? (
                <div className="grid gap-4">
                  {results.map((disease) => (
                    <Card key={disease.id} className="overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Stethoscope className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{disease.name}</CardTitle>
                              <CardDescription>
                                Suggested: {disease.suggestedDoctorType}
                              </CardDescription>
                            </div>
                          </div>
                          <Badge variant={getSeverityColor(disease.severity) as "success" | "warning" | "destructive" | "default"}>
                            {disease.severity.charAt(0).toUpperCase() + disease.severity.slice(1)} Severity
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-muted-foreground">{disease.description}</p>

                        <div>
                          <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-primary" />
                            Common Symptoms
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {disease.symptoms.map((symptom, index) => (
                              <Badge key={index} variant="outline">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-4 border-t">
                          <p className="text-sm text-muted-foreground">
                            Sign in to book an appointment with a {disease.suggestedDoctorType}
                          </p>
                          <Link href="/signup">
                            <Button className="gap-2">
                              Sign Up to Book
                              <ArrowRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">No diseases found</h3>
                    <p className="text-muted-foreground mb-4">
                      Try searching with different keywords or browse common conditions below
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}

          {/* Common Conditions */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Common Conditions</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {diseases.slice(0, 6).map((disease) => (
                <Card
                  key={disease.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => {
                    setQuery(disease.name);
                    setResults([disease]);
                    setHasSearched(true);
                  }}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
                        <Stethoscope className="w-5 h-5 text-accent-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground">{disease.name}</h3>
                        <p className="text-sm text-muted-foreground truncate">
                          {disease.suggestedDoctorType}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Card className="bg-primary text-primary-foreground border-0">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-bold mb-2">Ready to Book an Appointment?</h3>
              <p className="text-primary-foreground/80 mb-4">
                Create a free account to schedule consultations with our specialists
              </p>
              <Link href="/signup">
                <Button variant="secondary">
                  Create Account
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
