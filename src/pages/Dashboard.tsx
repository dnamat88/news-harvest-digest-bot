
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw } from "lucide-react";
import { RssConfig } from "@/components/rss/RssConfig";
import { KeywordManager } from "@/components/rss/KeywordManager";
import { ArticlesList } from "@/components/rss/ArticlesList";
import { SystemStats } from "@/components/rss/SystemStats";
import { EmailConfig } from "@/components/rss/EmailConfig";
import { ScheduleConfig } from "@/components/rss/ScheduleConfig";
import { SystemTest } from "@/components/rss/SystemTest";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleManualExecution = async () => {
    setIsProcessing(true);
    try {
      console.log('Triggering manual execution...');
      const { data, error } = await supabase.functions.invoke('process-rss');
      
      if (error) throw error;
      
      toast({
        title: 'Esecuzione completata',
        description: `RSS elaborato: ${data.articlesFound || 0} articoli trovati, ${data.articlesFiltered || 0} salvati`,
      });
    } catch (error: any) {
      console.error('Errore durante l\'esecuzione manuale:', error);
      toast({
        title: 'Errore',
        description: error.message || 'Errore durante l\'elaborazione RSS',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="/lovable-uploads/f30e033a-dcdc-467e-bee0-e5292115598d.png" 
              alt="FlashBrief Logo" 
              className="h-16 w-16"
            />
            <h1 className="text-4xl font-bold">FlashBrief Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Gestisci e monitora il sistema di raccolta notizie personalizzato
          </p>
          <div className="flex justify-center mt-4">
            <Button 
              onClick={handleManualExecution}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              {isProcessing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Play className="h-4 w-4" />
              )}
              {isProcessing ? 'Elaborazione in corso...' : 'Esegui ora'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="monitor" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="monitor">Monitoraggio</TabsTrigger>
            <TabsTrigger value="feeds">Feed RSS</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="schedule">Pianificazione</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="test">Test Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value="monitor" className="space-y-6">
            <SystemStats />
            <ArticlesList />
          </TabsContent>

          <TabsContent value="feeds" className="space-y-6">
            <RssConfig />
          </TabsContent>

          <TabsContent value="keywords" className="space-y-6">
            <KeywordManager />
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <ScheduleConfig />
          </TabsContent>

          <TabsContent value="email" className="space-y-6">
            <EmailConfig />
          </TabsContent>

          <TabsContent value="test" className="space-y-6">
            <SystemTest />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
