
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Search, Tag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const KeywordManager = () => {
  const { toast } = useToast();
  const [newKeyword, setNewKeyword] = useState('');
  const [testText, setTestText] = useState('');
  const [keywords, setKeywords] = useState([
    'banca', 'credito', 'bce', 'fed', 'tasso', 'carte', 'mutuo', 
    'conti', 'risparmio', 'loyalty', 'fintech', 'startup', 'investimenti'
  ]);

  const addKeyword = () => {
    if (!newKeyword.trim()) {
      toast({
        title: "Errore",
        description: "Inserisci una keyword valida",
        variant: "destructive"
      });
      return;
    }

    if (keywords.includes(newKeyword.toLowerCase())) {
      toast({
        title: "Errore",
        description: "Questa keyword esiste già",
        variant: "destructive"
      });
      return;
    }

    setKeywords([...keywords, newKeyword.toLowerCase()]);
    setNewKeyword('');
    
    toast({
      title: "Keyword aggiunta",
      description: `"${newKeyword}" è stata aggiunta alla lista`
    });
  };

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword));
    toast({
      title: "Keyword rimossa",
      description: `"${keyword}" è stata rimossa dalla lista`
    });
  };

  const testKeywords = () => {
    if (!testText.trim()) return [];
    
    const text = testText.toLowerCase();
    return keywords.filter(keyword => text.includes(keyword));
  };

  const matchedKeywords = testKeywords();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Aggiungi Keyword
          </CardTitle>
          <CardDescription>
            Aggiungi nuove parole chiave per filtrare gli articoli
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="newKeyword">Nuova Keyword</Label>
              <Input
                id="newKeyword"
                placeholder="es. blockchain"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addKeyword}>
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
            <Tag className="h-5 w-5" />
            Keywords Configurate ({keywords.length})
          </CardTitle>
          <CardDescription>
            Gestisci le parole chiave utilizzate per filtrare gli articoli
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge 
                key={keyword} 
                variant="secondary" 
                className="text-sm py-1 px-3 flex items-center gap-2"
              >
                {keyword}
                <button
                  onClick={() => removeKeyword(keyword)}
                  className="hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Test Filtri
          </CardTitle>
          <CardDescription>
            Testa se un testo verrebbe filtrato dalle keywords configurate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="testText">Testo di Test</Label>
            <Input
              id="testText"
              placeholder="Inserisci il titolo o descrizione di un articolo..."
              value={testText}
              onChange={(e) => setTestText(e.target.value)}
            />
          </div>
          
          {testText && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Risultato:</span>
                <Badge variant={matchedKeywords.length > 0 ? "default" : "destructive"}>
                  {matchedKeywords.length > 0 ? "Articolo Incluso" : "Articolo Escluso"}
                </Badge>
              </div>
              
              {matchedKeywords.length > 0 && (
                <div className="space-y-1">
                  <span className="text-sm text-muted-foreground">
                    Keywords trovate:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {matchedKeywords.map((keyword) => (
                      <Badge key={keyword} className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
