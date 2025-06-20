
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Search, Tag, Info } from "lucide-react";
import { useKeywords } from "@/hooks/useKeywords";

export const KeywordManager = () => {
  const { keywords, loading, addKeyword, removeKeyword, toggleKeyword } = useKeywords();
  const [newKeyword, setNewKeyword] = useState('');
  const [testText, setTestText] = useState('');

  const handleAddKeyword = async () => {
    if (!newKeyword.trim()) return;
    
    const success = await addKeyword(newKeyword.toLowerCase());
    if (success) {
      setNewKeyword('');
    }
  };

  const testKeywords = () => {
    if (!testText.trim()) return [];
    
    const text = testText.toLowerCase();
    return keywords
      .filter(keyword => keyword.attiva && text.includes(keyword.parola))
      .map(keyword => keyword.parola);
  };

  const matchedKeywords = testKeywords();

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Caricamento keywords...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Info sezione */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Tag className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-blue-800">
              <strong>Gestione Keywords:</strong> Le keywords servono per categorizzare gli articoli nella tua email. 
              Tutti gli articoli vengono sempre salvati, ma quelli che contengono le tue parole chiave verranno 
              evidenziati in una sezione dedicata "Articoli con Keywords", mentre gli altri compariranno in "Altri Articoli".
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Aggiungi Keyword
          </CardTitle>
          <CardDescription>
            Aggiungi parole chiave per categorizzare gli articoli nella tua email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="newKeyword">Nuova Keyword</Label>
              <Input
                id="newKeyword"
                placeholder="es. fintech, blockchain, banking"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddKeyword()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleAddKeyword} disabled={!newKeyword.trim()}>
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
            Gestisci le parole chiave per categorizzare gli articoli nell'email
          </CardDescription>
        </CardHeader>
        <CardContent>
          {keywords.length === 0 ? (
            <div className="text-center py-8">
              <Tag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nessuna keyword configurata. Aggiungi la prima keyword per iniziare a categorizzare gli articoli.
              </p>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <Badge 
                  key={keyword.id} 
                  variant={keyword.attiva ? "default" : "secondary"}
                  className="text-sm py-1 px-3 flex items-center gap-2 cursor-pointer"
                  onClick={() => toggleKeyword(keyword.id, !keyword.attiva)}
                >
                  {keyword.parola}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeKeyword(keyword.id);
                    }}
                    className="hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Test Categorizzazione
          </CardTitle>
          <CardDescription>
            Testa come un articolo verrà categorizzato con le keywords configurate
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
                <span className="text-sm font-medium">Categorizzazione:</span>
                <Badge variant={matchedKeywords.length > 0 ? "default" : "secondary"}>
                  {matchedKeywords.length > 0 ? "Articoli con Keywords" : "Altri Articoli"}
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
