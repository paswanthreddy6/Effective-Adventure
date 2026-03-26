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
  CheckCircle,
  Calendar,
  ArrowRight,
} from "lucide-react";

export default function SearchDiseasePage() {
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Search Disease</h1>
        <p className="text-muted-foreground mt-1">
          Search for diseases, symptoms, and find the right specialist
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
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-secondary" />
                        <span>Recommended specialist: <strong className="text-foreground">{disease.suggestedDoctorType}</strong></span>
                      </div>
                      <Link
                        href={`/dashboard/book?disease=${encodeURIComponent(disease.name)}&doctorType=${encodeURIComponent(disease.suggestedDoctorType)}`}
                      >
                        <Button className="gap-2">
                          <Calendar className="w-4 h-4" />
                          Book Appointment
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
    </div>
  );
}
