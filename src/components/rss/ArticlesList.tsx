
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ExternalLink, Calendar, Filter, Search, FileText } from "lucide-react";

export const ArticlesList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Dati mock degli articoli
  const articles = [
    {
      id: 1,
      title: "BCE mantiene tassi stabili, focus su inflazione",
      link: "https://example.com/article1",
      source: "Il Sole 24 Ore",
      publishDate: "2025-06-15 17:30",
      category: "Da classificare",
      summary: "La Banca Centrale Europea ha deciso di mantenere i tassi di interesse invariati nella riunione di giugno...",
      keywords: ["bce", "tasso"]
    },
    {
      id: 2,
      title: "Nuove carte di credito digitali per millennials",
      link: "https://example.com/article2", 
      source: "Google News",
      publishDate: "2025-06-15 16:45",
      category: "Da classificare",
      summary: "Le banche italiane lanciano nuove soluzioni digitali per attrarre i giovani clienti...",
      keywords: ["carte", "banca"]
    },
    {
      id: 3,
      title: "Mutui casa: tassi in calo nel secondo trimestre",
      link: "https://example.com/article3",
      source: "Il Sole 24 Ore",
      publishDate: "2025-06-15 15:20",
      category: "Da classificare",
      summary: "Analisi del mercato immobiliare e delle condizioni creditizie per l'acquisto della prima casa...",
      keywords: ["mutuo", "tasso"]
    },
    {
      id: 4,
      title: "Programmi loyalty bancari: la guerra dei punti",
      link: "https://example.com/article4",
      source: "Il Sole 24 Ore",
      publishDate: "2025-06-15 14:15",
      category: "Da classificare", 
      summary: "Come le banche utilizzano i programmi di fidelizzazione per trattenere i clienti...",
      keywords: ["loyalty", "banca"]
    },
    {
      id: 5,
      title: "Conti deposito: rendimenti in aumento",
      link: "https://example.com/article5",
      source: "Google News",
      publishDate: "2025-06-15 13:30",
      category: "Da classificare",
      summary: "Le migliori offerte per i risparmiatori in un contesto di tassi crescenti...",
      keywords: ["conti", "risparmio"]
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Articoli Raccolti Oggi ({articles.length})
          </CardTitle>
          <CardDescription>
            Articoli filtrati dalle fonti RSS configurate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cerca negli articoli..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm"
              >
                <option value="all">Tutte le categorie</option>
                <option value="Da classificare">Da classificare</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {filteredArticles.map((article) => (
          <Card key={article.id}>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between items-start gap-4">
                  <h3 className="font-semibold text-lg leading-tight">
                    {article.title}
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(article.link, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {article.summary}
                </p>
                
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(article.publishDate).toLocaleString('it-IT')}
                  </div>
                  <span>•</span>
                  <span>{article.source}</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-xs">
                    {article.category}
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-muted-foreground mr-2">Keywords:</span>
                  {article.keywords.map((keyword) => (
                    <Badge key={keyword} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredArticles.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Nessun articolo trovato con i filtri selezionati.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
