
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Download, Upload, Save, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFeeds } from "@/hooks/useFeeds";
import { useKeywords } from "@/hooks/useKeywords";
import { supabase } from "@/lib/supabase";

interface BackupData {
  feeds: any[];
  keywords: any[];
  settings: any;
  timestamp: string;
  version: string;
}

export const ConfigBackup = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  const { feeds } = useFeeds();
  const { keywords } = useKeywords();

  const exportConfig = async () => {
    setIsExporting(true);
    try {
      // Get user settings
      const { data: settings } = await supabase
        .from('user_settings')
        .select('*')
        .maybeSingle();

      const backupData: BackupData = {
        feeds: feeds.map(f => ({ ...f, id: undefined })),
        keywords: keywords.map(k => ({ ...k, id: undefined })),
        settings: settings || {},
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      const blob = new Blob([JSON.stringify(backupData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `flashbrief-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);

      toast({
        title: 'Backup completato',
        description: 'La configurazione è stata esportata con successo',
      });
    } catch (error) {
      console.error('Errore durante l\'export:', error);
      toast({
        title: 'Errore',
        description: 'Si è verificato un errore durante l\'esportazione',
        variant: 'destructive'
      });
    } finally {
      setIsExporting(false);
    }
  };

  const importConfig = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await file.text();
      const backupData: BackupData = JSON.parse(text);

      // Validate backup structure
      if (!backupData.feeds || !backupData.keywords || !backupData.version) {
        throw new Error('Formato file non valido');
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Utente non autenticato');

      // Import feeds
      if (backupData.feeds.length > 0) {
        const feedsToImport = backupData.feeds.map(feed => ({
          ...feed,
          user_id: user.id,
          id: undefined
        }));
        
        await supabase.from('feeds').insert(feedsToImport);
      }

      // Import keywords
      if (backupData.keywords.length > 0) {
        const keywordsToImport = backupData.keywords.map(keyword => ({
          ...keyword,
          user_id: user.id,
          id: undefined
        }));
        
        await supabase.from('keywords').insert(keywordsToImport);
      }

      // Import settings
      if (backupData.settings && Object.keys(backupData.settings).length > 0) {
        const { error } = await supabase
          .from('user_settings')
          .upsert({
            ...backupData.settings,
            user_id: user.id,
            updated_at: new Date().toISOString()
          });
        
        if (error) throw error;
      }

      toast({
        title: 'Import completato',
        description: `Importati ${backupData.feeds.length} feed e ${backupData.keywords.length} keywords`,
      });

      // Refresh page to reload data
      setTimeout(() => window.location.reload(), 1000);

    } catch (error: any) {
      console.error('Errore durante l\'import:', error);
      toast({
        title: 'Errore',
        description: error.message || 'Si è verificato un errore durante l\'importazione',
        variant: 'destructive'
      });
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          Backup Configurazione
        </CardTitle>
        <CardDescription>
          Esporta o importa la configurazione completa di feed RSS, keywords e impostazioni
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Button 
            onClick={exportConfig}
            disabled={isExporting}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? 'Esportazione...' : 'Esporta Configurazione'}
          </Button>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="import-file" className="cursor-pointer">
              <Button 
                disabled={isImporting}
                className="flex items-center gap-2"
                asChild
              >
                <span>
                  <Upload className="h-4 w-4" />
                  {isImporting ? 'Importazione...' : 'Importa Configurazione'}
                </span>
              </Button>
            </Label>
            <Input
              id="import-file"
              type="file"
              accept=".json"
              onChange={importConfig}
              className="hidden"
            />
          </div>
        </div>
        
        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Nota:</strong> L'importazione aggiungerà i nuovi elementi senza rimuovere quelli esistenti. 
            Assicurati di avere un backup prima di importare configurazioni.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
