
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Calendar, Clock, Play, Zap, AlertCircle } from "lucide-react";
import { useExecutionLogs } from "@/hooks/useExecutionLogs";
import { useFeeds } from "@/hooks/useFeeds";
import { useKeywords } from "@/hooks/useKeywords";
import { useArticles } from "@/hooks/useArticles";

export const SystemStats = () => {
  const { logs, loading: logsLoading } = useExecutionLogs();
  const { feeds, loading: feedsLoading } = useFeeds();
  const { keywords, loading: keywordsLoading } = useKeywords();
  const { articles, loading: articlesLoading } = useArticles();

  const lastExecution = logs?.[0];
  const activeFeeds = feeds.filter(feed => feed.attivo);
  const activeKeywords = keywords.filter(keyword => keyword.attiva);
  
  // Calcola articoli di oggi
  const today = new Date().toISOString().split('T')[0];
  const todayArticles = articles.filter(article => 
    article.data_pubblicazione?.startsWith(today)
  );

  const triggerExecution = () => {
    // TODO: Implementare trigger manuale dell'esecuzione
    console.log('Triggering manual execution...');
  };

  const isLoading = logsLoading || feedsLoading || keywordsLoading || articlesLoading;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Caricamento statistiche sistema...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistiche generali */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Feed Attivi</p>
                <p className="text-2xl font-bold">{activeFeeds.length}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Keywords Attive</p>
                <p className="text-2xl font-bold">{activeKeywords.length}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Articoli Oggi</p>
                <p className="text-2xl font-bold">{todayArticles.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Totale Articoli</p>
                <p className="text-2xl font-bold">{articles.length}</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stato ultima esecuzione */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Stato Sistema
              </CardTitle>
              <CardDescription>
                Monitoraggio dell'ultima esecuzione del workflow di raccolta notizie
              </CardDescription>
            </div>
            <Button onClick={triggerExecution} size="sm">
              <Play className="h-4 w-4 mr-2" />
              Esegui Ora
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!lastExecution ? (
            <div className="text-center py-8">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nessuna esecuzione registrata. Il sistema è in attesa della prima esecuzione.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Ultima Esecuzione</h4>
                  <p className="text-sm text-muted-foreground">
                    Iniziata: {new Date(lastExecution.started_at).toLocaleString('it-IT')}
                  </p>
                  {lastExecution.completed_at && (
                    <p className="text-sm text-muted-foreground">
                      Completata: {new Date(lastExecution.completed_at).toLocaleString('it-IT')}
                    </p>
                  )}
                </div>
                <Badge 
                  variant={
                    lastExecution.status === 'completed' ? 'default' : 
                    lastExecution.status === 'running' ? 'secondary' : 
                    'destructive'
                  }
                >
                  {lastExecution.status === 'completed' ? 'Completata' :
                   lastExecution.status === 'running' ? 'In Esecuzione' :
                   'Errore'}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                  <p className="text-2xl font-bold text-green-600">{lastExecution.articles_found}</p>
                  <p className="text-sm text-green-600">Articoli Trovati</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-2xl font-bold text-blue-600">{lastExecution.articles_filtered}</p>
                  <p className="text-sm text-blue-600">Articoli Filtrati</p>
                </div>
              </div>

              {lastExecution.error_message && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 font-medium">Errore:</p>
                  <p className="text-sm text-red-600">{lastExecution.error_message}</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prossima esecuzione pianificata */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Pianificazione
          </CardTitle>
          <CardDescription>
            Sistema di esecuzione automatica
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Esecuzione Automatica</p>
                <p className="text-sm text-muted-foreground">
                  Il sistema viene eseguito automaticamente ogni giorno alle 18:00
                </p>
              </div>
              <Badge variant="default">Attiva</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Prossima Esecuzione</p>
                <p className="text-sm text-muted-foreground">
                  {new Date().getHours() >= 18 ? 'Domani' : 'Oggi'} alle 18:00
                </p>
              </div>
              <Clock className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
