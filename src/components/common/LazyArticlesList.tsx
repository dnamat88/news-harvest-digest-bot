
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Calendar, Loader2 } from "lucide-react";
import { Articolo } from "@/lib/supabase";

interface LazyArticlesListProps {
  articles: Articolo[];
  itemsPerPage?: number;
}

export const LazyArticlesList: React.FC<LazyArticlesListProps> = ({ 
  articles, 
  itemsPerPage = 10 
}) => {
  const [visibleCount, setVisibleCount] = useState(itemsPerPage);
  const [loading, setLoading] = useState(false);

  const visibleArticles = useMemo(() => 
    articles.slice(0, visibleCount), 
    [articles, visibleCount]
  );

  const hasMore = visibleCount < articles.length;

  const loadMore = useCallback(async () => {
    setLoading(true);
    // Simula un piccolo delay per il caricamento
    await new Promise(resolve => setTimeout(resolve, 200));
    setVisibleCount(prev => Math.min(prev + itemsPerPage, articles.length));
    setLoading(false);
  }, [itemsPerPage, articles.length]);

  useEffect(() => {
    setVisibleCount(itemsPerPage);
  }, [articles, itemsPerPage]);

  return (
    <div className="space-y-4">
      {visibleArticles.map((article) => (
        <Card key={article.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-4">
                <h3 className="font-semibold text-lg leading-tight">
                  {article.titolo || 'Titolo non disponibile'}
                </h3>
                {article.link && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(article.link, '_blank')}
                    className="flex-shrink-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              {article.sommario && (
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                  {article.sommario}
                </p>
              )}
              
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                {article.data_pubblicazione && (
                  <>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(article.data_pubblicazione).toLocaleString('it-IT')}
                    </div>
                    <span>•</span>
                  </>
                )}
                {article.fonte && (
                  <>
                    <span>{article.fonte}</span>
                    <span>•</span>
                  </>
                )}
                <Badge variant="outline" className="text-xs">
                  {article.categoria || 'Senza categoria'}
                </Badge>
              </div>
              
              {article.matched_keywords && article.matched_keywords.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  <span className="text-xs text-muted-foreground mr-2">Keywords:</span>
                  {article.matched_keywords.map((keyword, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {keyword}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button 
            onClick={loadMore}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Caricamento...
              </>
            ) : (
              `Carica altri ${Math.min(itemsPerPage, articles.length - visibleCount)} articoli`
            )}
          </Button>
        </div>
      )}
      
      <div className="text-center text-sm text-muted-foreground">
        Mostrati {visibleCount} di {articles.length} articoli
      </div>
    </div>
  );
};
