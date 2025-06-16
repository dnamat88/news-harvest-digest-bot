
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, ExternalLink, Rss } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const RssConfig = () => {
  const { toast } = useToast();
  const [newFeedUrl, setNewFeedUrl] = useState('');
  const [feeds, setFeeds] = useState([
    {
      id: 1,
      url: 'https://news.google.com/rss/search?q=banca+prodotti',
      name: 'Google News - Banca Prodotti',
      status: 'attivo',
      lastUpdate: '2 ore fa'
    },
    {
      id: 2,
      url: 'https://www.ilsole24ore.com/rss/economia--marketing.xml',
      name: 'Il Sole 24 Ore - Economia Marketing',
      status: 'attivo',
      lastUpdate: '1 ora fa'
    },
    {
      id: 3,
      url: 'https://www.ilsole24ore.com/rss/finanza--fintech-e-startup.xml',
      name: 'Il Sole 24 Ore - Fintech Startup',
      status: 'attivo',
      lastUpdate: '1 ora fa'
    },
    {
      id: 4,
      url: 'https://www.ilsole24ore.com/rss/risparmio.xml',
      name: 'Il Sole 24 Ore - Risparmio',
      status: 'attivo',
      lastUpdate: '1 ora fa'
    },
    {
      id: 5,
      url: 'https://www.ilsole24ore.com/rss/finanza-personale.xml',
      name: 'Il Sole 24 Ore - Finanza Personale',
      status: 'attivo',
      lastUpdate: '1 ora fa'
    }
  ]);

  const addFeed = () => {
    if (!newFeedUrl.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci un URL valido",
        variant: "destructive"
      });
      return;
    }

    const newFeed = {
      id: Date.now(),
      url: newFeedUrl,
      name: 'Nuovo Feed RSS',
      status: 'in_test',
      lastUpdate: 'Mai'
    };

    setFeeds([...feeds, newFeed]);
    setNewFeedUrl('');
    
    toast({
      title: "Feed aggiunto",
      description: "Il nuovo feed RSS è stato aggiunto con successo"
    });
  };

  const removeFeed = (id: number) => {
    setFeeds(feeds.filter(feed => feed.id !== id));
    toast({
      title: "Feed rimosso",
      description: "Il feed RSS è stato rimosso"
    });
  };

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
              <Button onClick={addFeed}>
                <Plus className="h-4 w-4 mr-2" />
                Aggiungi
              </Button>
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
          <div className="space-y-4">
            {feeds.map((feed) => (
              <div key={feed.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium">{feed.name}</h4>
                    <Badge 
                      variant={feed.status === 'attivo' ? 'default' : 'secondary'}
                    >
                      {feed.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{feed.url}</p>
                  <p className="text-xs text-muted-foreground">
                    Ultimo aggiornamento: {feed.lastUpdate}
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
        </CardContent>
      </Card>
    </div>
  );
};
