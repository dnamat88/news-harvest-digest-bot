import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Send, Loader2, Mail, Calendar, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useArticles } from "@/hooks/useArticles";
import { useKeywords } from "@/hooks/useKeywords";

interface PreviewData {
  keywordArticles: any[];
  otherArticles: any[];
  totalArticles: number;
}

export const EmailPreview = () => {
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();
  const { articles } = useArticles();
  const { keywords } = useKeywords();

  const generatePreview = async () => {
    setLoading(true);
    try {
      // Get recent articles (last 24 hours)
      const recentArticles = articles.filter(article => {
        const articleDate = new Date(article.data_pubblicazione);
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return articleDate >= yesterday;
      });

      // Categorize articles
      const keywordArticles = [];
      const otherArticles = [];

      for (const article of recentArticles) {
        const matchedKeywords = [];
        const articleText = `${article.titolo} ${article.sommario}`.toLowerCase();

        for (const keyword of keywords.filter(k => k.attiva)) {
          if (articleText.includes(keyword.parola.toLowerCase())) {
            matchedKeywords.push(keyword.parola);
          }
        }

        if (matchedKeywords.length > 0) {
          keywordArticles.push({ ...article, matched_keywords: matchedKeywords });
        } else {
          otherArticles.push({ ...article, matched_keywords: [] });
        }
      }

      setPreview({
        keywordArticles,
        otherArticles,
        totalArticles: recentArticles.length
      });

    } catch (error) {
      console.error('Errore durante la generazione del preview:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante la generazione del preview',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const sendTestEmail = async () => {
    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utente non autenticato');

      const { data, error } = await supabase.functions.invoke('send-email', {
        body: { userId: user.id, isTest: true }
      });

      if (error) throw error;

      toast({
        title: 'Email di test inviata',
        description: 'L\'email di test è stata inviata con successo',
      });

    } catch (error: any) {
      console.error('Errore durante l\'invio dell\'email di test:', error);
      toast({
        title: 'Errore',
        description: error.message || 'Si è verificato un errore durante l\'invio',
        variant: 'destructive'
      });
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    if (articles.length > 0 && keywords.length > 0) {
      generatePreview();
    }
  }, [articles, keywords]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          Preview Email
        </CardTitle>
        <CardDescription>
          Anteprima dell'email che verrà inviata con gli articoli delle ultime 24 ore
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            onClick={generatePreview}
            disabled={loading}
            variant="outline"
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {loading ? 'Generazione...' : 'Genera Preview'}
          </Button>
          
          <Button 
            onClick={sendTestEmail}
            disabled={sending || !preview}
            className="flex items-center gap-2"
          >
            {sending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {sending ? 'Invio...' : 'Invia Email Test'}
          </Button>
        </div>

        {preview && (
          <div className="space-y-6">
            {/* Email Header */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-lg">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
                <h2 className="text-xl font-bold text-blue-900 dark:text-blue-100">
                  FlashBrief Daily Digest
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                <Calendar className="h-4 w-4" />
                {new Date().toLocaleDateString('it-IT')}
                <span className="mx-2">•</span>
                <span>{preview.totalArticles} articoli totali</span>
              </div>
            </div>

            {/* Keyword Articles Section */}
            {preview.keywordArticles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-600 flex items-center gap-2">
                  📌 Articoli con Keywords ({preview.keywordArticles.length})
                </h3>
                <div className="space-y-3">
                  {preview.keywordArticles.slice(0, 3).map((article, index) => (
                    <div key={index} className="border rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
                      <h4 className="font-medium mb-2 flex items-start justify-between gap-2">
                        <span className="text-blue-900 dark:text-blue-100">{article.titolo}</span>
                        {article.link && (
                          <ExternalLink className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                        {article.sommario}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>📍 {article.fonte}</span>
                        <span>📅 {new Date(article.data_pubblicazione).toLocaleDateString('it-IT')}</span>
                      </div>
                      {article.matched_keywords && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {article.matched_keywords.map((keyword: string, i: number) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  {preview.keywordArticles.length > 3 && (
                    <div className="text-center text-sm text-gray-500 p-2">
                      ...e altri {preview.keywordArticles.length - 3} articoli con keywords
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other Articles Section */}
            {preview.otherArticles.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-green-600 flex items-center gap-2">
                  📰 Altri Articoli ({preview.otherArticles.length})
                </h3>
                <div className="space-y-3">
                  {preview.otherArticles.slice(0, 3).map((article, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2 flex items-start justify-between gap-2">
                        <span className="text-green-900 dark:text-green-100">{article.titolo}</span>
                        {article.link && (
                          <ExternalLink className="h-4 w-4 text-green-600 flex-shrink-0" />
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                        {article.sommario}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>📍 {article.fonte}</span>
                        <span>📅 {new Date(article.data_pubblicazione).toLocaleDateString('it-IT')}</span>
                      </div>
                    </div>
                  ))}
                  {preview.otherArticles.length > 3 && (
                    <div className="text-center text-sm text-gray-500 p-2">
                      ...e altri {preview.otherArticles.length - 3} articoli
                    </div>
                  )}
                </div>
              </div>
            )}

            {preview.totalArticles === 0 && (
              <div className="text-center py-8">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  Nessun nuovo articolo nelle ultime 24 ore
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
