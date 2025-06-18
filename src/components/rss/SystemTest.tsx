
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Mail, Rss, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/lib/supabase";

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

export const SystemTest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const updateTestResult = (name: string, status: TestResult['status'], message: string, details?: any) => {
    setTestResults(prev => {
      const existing = prev.find(r => r.name === name);
      const newResult = { name, status, message, details };
      
      if (existing) {
        return prev.map(r => r.name === name ? newResult : r);
      } else {
        return [...prev, newResult];
      }
    });
  };

  const runSystemTest = async () => {
    if (!user) {
      toast({
        title: 'Errore',
        description: 'Utente non autenticato',
        variant: 'destructive'
      });
      return;
    }

    setIsRunning(true);
    setTestResults([]);

    try {
      // Test 1: Verifica connessione database
      updateTestResult('Database', 'pending', 'Verifica connessione...');
      try {
        const { data: feeds } = await supabase.from('feeds').select('count').single();
        updateTestResult('Database', 'success', 'Connessione database OK');
      } catch (error) {
        updateTestResult('Database', 'error', 'Errore connessione database', error);
      }

      // Test 2: Verifica feed configurati
      updateTestResult('Feeds', 'pending', 'Verifica feed RSS...');
      try {
        const { data: feeds } = await supabase.from('feeds').select('*').eq('attivo', true);
        if (!feeds || feeds.length === 0) {
          updateTestResult('Feeds', 'warning', 'Nessun feed RSS attivo configurato');
        } else {
          updateTestResult('Feeds', 'success', `${feeds.length} feed RSS attivi trovati`, feeds);
        }
      } catch (error) {
        updateTestResult('Feeds', 'error', 'Errore verifica feed', error);
      }

      // Test 3: Verifica keywords
      updateTestResult('Keywords', 'pending', 'Verifica keywords...');
      try {
        const { data: keywords } = await supabase.from('keywords').select('*').eq('attiva', true);
        if (!keywords || keywords.length === 0) {
          updateTestResult('Keywords', 'warning', 'Nessuna keyword attiva configurata');
        } else {
          updateTestResult('Keywords', 'success', `${keywords.length} keywords attive trovate`, keywords);
        }
      } catch (error) {
        updateTestResult('Keywords', 'error', 'Errore verifica keywords', error);
      }

      // Test 4: Test elaborazione RSS
      updateTestResult('RSS Processing', 'pending', 'Test elaborazione RSS...');
      try {
        const { data, error } = await supabase.functions.invoke('process-rss');
        if (error) throw error;
        
        updateTestResult('RSS Processing', 'success', 
          `RSS elaborato: ${data.articlesFound} trovati, ${data.articlesFiltered} filtrati`, data);
      } catch (error: any) {
        updateTestResult('RSS Processing', 'error', 'Errore elaborazione RSS: ' + error.message, error);
      }

      // Test 5: Verifica impostazioni email
      updateTestResult('Email Settings', 'pending', 'Verifica impostazioni email...');
      try {
        const { data: settings } = await supabase
          .from('user_settings')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();
        
        if (!settings) {
          updateTestResult('Email Settings', 'warning', 'Impostazioni email non configurate');
        } else if (!settings.email_enabled) {
          updateTestResult('Email Settings', 'warning', 'Email disabilitate nelle impostazioni');
        } else {
          updateTestResult('Email Settings', 'success', `Email abilitate per ${settings.email_address}`, settings);
        }
      } catch (error) {
        updateTestResult('Email Settings', 'error', 'Errore verifica impostazioni email', error);
      }

      // Test 6: Test invio email
      updateTestResult('Email Test', 'pending', 'Test invio email...');
      try {
        const { data, error } = await supabase.functions.invoke('test-email', {
          body: { userId: user.id }
        });
        if (error) throw error;
        
        updateTestResult('Email Test', 'success', 'Email di test inviata con successo', data);
      } catch (error: any) {
        updateTestResult('Email Test', 'error', 'Errore invio email: ' + error.message, error);
      }

      toast({
        title: 'Test completato',
        description: 'Test del sistema completato. Controlla i risultati per dettagli.',
      });

    } catch (error: any) {
      console.error('Errore durante i test:', error);
      toast({
        title: 'Errore test',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'pending':
        return <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>;
      default:
        return null;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      case 'warning':
        return 'secondary';
      case 'pending':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Play className="h-5 w-5" />
          Test Sistema Completo
        </CardTitle>
        <CardDescription>
          Esegui un test completo del sistema RSS per verificare che tutto funzioni correttamente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-3">
          <Button 
            onClick={runSystemTest}
            disabled={isRunning}
            className="flex items-center gap-2"
          >
            {isRunning ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
            ) : (
              <Play className="h-4 w-4" />
            )}
            {isRunning ? 'Test in corso...' : 'Avvia Test Completo'}
          </Button>
        </div>

        {testResults.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-medium">Risultati Test:</h3>
            <div className="space-y-2">
              {testResults.map((result) => (
                <div key={result.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <p className="font-medium">{result.name}</p>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                      {result.details && (
                        <details className="text-xs text-muted-foreground mt-1">
                          <summary className="cursor-pointer">Dettagli</summary>
                          <pre className="mt-1 p-2 bg-muted rounded text-xs overflow-auto">
                            {JSON.stringify(result.details, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                  <Badge variant={getStatusColor(result.status)}>
                    {result.status.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium mb-2">Note per il Test:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Assicurati di aver configurato almeno un feed RSS attivo</li>
            <li>• Aggiungi alcune keywords per il filtering degli articoli</li>
            <li>• Configura le impostazioni email prima di testare l'invio</li>
            <li>• Il test RSS cercherà nuovi articoli e li filtrerà con le tue keywords</li>
            <li>• L'email di test includerà gli articoli trovati di recente</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
