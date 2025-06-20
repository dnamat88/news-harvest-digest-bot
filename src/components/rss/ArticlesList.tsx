
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, Search, FileText, Download } from "lucide-react";
import { useArticles } from "@/hooks/useArticles";
import { LazyArticlesList } from "@/components/common/LazyArticlesList";

export const ArticlesList = () => {
  const { articles, loading } = useArticles();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSource, setSelectedSource] = useState('all');

  const { filteredArticles, categories, sources } = useMemo(() => {
    const filtered = articles.filter(article => {
      const matchesSearch = article.titolo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.sommario?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || article.categoria === selectedCategory;
      const matchesSource = selectedSource === 'all' || article.fonte === selectedSource;
      return matchesSearch && matchesCategory && matchesSource;
    });

    const uniqueCategories = [...new Set(articles.map(a => a.categoria).filter(Boolean))];
    const uniqueSources = [...new Set(articles.map(a => a.fonte).filter(Boolean))];

    return {
      filteredArticles: filtered,
      categories: uniqueCategories,
      sources: uniqueSources
    };
  }, [articles, searchTerm, selectedCategory, selectedSource]);

  const exportToCSV = () => {
    const headers = ['Titolo', 'Fonte', 'Data', 'Categoria', 'Link', 'Keywords'];
    const csvContent = [
      headers.join(','),
      ...filteredArticles.map(article => [
        `"${article.titolo || ''}"`,
        `"${article.fonte || ''}"`,
        `"${article.data_pubblicazione || ''}"`,
        `"${article.categoria || ''}"`,
        `"${article.link || ''}"`,
        `"${(article.matched_keywords || []).join('; ')}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `articoli_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Caricamento articoli...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Articoli Raccolti ({filteredArticles.length} di {articles.length})
              </CardTitle>
              <CardDescription>
                Articoli filtrati dalle fonti RSS configurate
              </CardDescription>
            </div>
            <Button onClick={exportToCSV} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Esporta CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cerca negli articoli..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="all">Tutte le categorie</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="flex-1 px-3 py-2 border rounded-md text-sm bg-background"
              >
                <option value="all">Tutte le fonti</option>
                {sources.map(source => (
                  <option key={source} value={source}>{source}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredArticles.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              {articles.length === 0 
                ? "Nessun articolo disponibile. Gli articoli verranno mostrati qui quando il sistema RSS inizierà a raccogliere le notizie."
                : "Nessun articolo trovato con i filtri selezionati."
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <LazyArticlesList articles={filteredArticles} itemsPerPage={15} />
      )}
    </div>
  );
};
