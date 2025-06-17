
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ExternalLink, Rss } from "lucide-react";
import { useFeeds } from "@/hooks/useFeeds";

export const RssConfig = () => {
  const { feeds, loading, addFeed, removeFeed, toggleFeed } = useFeeds();
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [newFeedName, setNewFeedName] = useState('');

  const handleAddFeed = async () => {
    if (!newFeedUrl.trim()) return;
    
    const name = newFeedName.trim() || 'Nuovo Feed RSS';
    const success = await addFeed(newFeedUrl, name);
    
    if (success) {
      setNewFeedUrl('');
      setNewFeedName('');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Caricamento feed RSS...</p>
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
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Aggiungi Feed RSS
          </CardTitle>
          <CardDescription>
            Inserisci l'URL di un nuovo feed RSS da monitorare
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="feedName">Nome Feed</Label>
              <Input
                id="feedName"
                placeholder="Il Sole 24 Ore - Economia"
                value={newFeedName}
                onChange={(e) => setNewFeedName(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <Label htmlFor="feedUrl">URL Feed RSS</Label>
                <Input
                  id="feedUrl"
                  placeholder="https://example.com/rss.xml"
                  value={newFeedUrl}
                  onChange={(e) => setNewFeedUrl(e.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handleAddFeed} disabled={!newFeedUrl.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Aggiungi
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rss className="h-5 w-5" />
            Feed RSS Configurati ({feeds.length})
          </CardTitle>
          <CardDescription>
            Gestisci i feed RSS attualmente monitorati dal sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {feeds.length === 0 ? (
            <div className="text-center py-8">
              <Rss className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nessun feed RSS configurato. Aggiungi il primo feed per iniziare.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {feeds.map((feed) => (
                <div key={feed.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{feed.nome}</h4>
                      <Badge 
                        variant={feed.attivo ? 'default' : 'secondary'}
                        className="cursor-pointer"
                        onClick={() => toggleFeed(feed.id, !feed.attivo)}
                      >
                        {feed.attivo ? 'Attivo' : 'Inattivo'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{feed.url}</p>
                    <p className="text-xs text-muted-foreground">
                      Ultimo aggiornamento: {feed.ultimo_aggiornamento ? 
                        new Date(feed.ultimo_aggiornamento).toLocaleString('it-IT') : 
                        'Mai'
                      }
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(feed.url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeed(feed.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
