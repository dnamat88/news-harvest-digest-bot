import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Play, RefreshCw, Settings } from "lucide-react";
import { RssConfig } from "@/components/rss/RssConfig";
import { KeywordManager } from "@/components/rss/KeywordManager";
import { ArticlesList } from "@/components/rss/ArticlesList";
import { SystemStats } from "@/components/rss/SystemStats";
import { EmailConfig } from "@/components/rss/EmailConfig";
import { ScheduleConfig } from "@/components/rss/ScheduleConfig";
import { SystemTest } from "@/components/rss/SystemTest";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { ConfigBackup } from "@/components/common/ConfigBackup";
import { EmailPreview } from "@/components/email/EmailPreview";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useIsMobile } from '@/hooks/use-mobile';

const Dashboard = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const isMobile = useIsMobile();

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

  const LogoImage = () => (
    <img 
      src="/lovable-uploads/f30e033a-dcdc-467e-bee0-e5292115598d.png" 
      alt="FlashBrief Logo" 
      className="h-12 w-12 sm:h-16 sm:w-16"
      onError={(e) => {
        e.currentTarget.style.display = 'none';
        e.currentTarget.nextElementSibling?.classList.remove('hidden');
      }}
    />
  )

  const LogoFallback = () => (
    <div className="h-12 w-12 sm:h-16 sm:w-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl hidden">
      F
    </div>
  )

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Header Section */}
          <div className="text-center space-y-3 sm:space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <div className="flex items-center gap-3">
                <LogoImage />
                <LogoFallback />
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  FlashBrief Dashboard
                </h1>
              </div>
              <div className="sm:ml-4">
                <ThemeToggle />
              </div>
            </div>
            <p className="text-muted-foreground text-base sm:text-lg px-2">
              Gestisci e monitora il sistema di raccolta notizie personalizzato
            </p>
            <div className="flex justify-center mt-3 sm:mt-4">
              <Button 
                onClick={handleManualExecution}
                disabled={isProcessing}
                className="flex items-center gap-2 text-sm sm:text-base px-4 py-2 sm:px-6 sm:py-3"
                size={isMobile ? "sm" : "default"}
              >
                {isProcessing ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                {isProcessing ? 'Elaborazione...' : 'Esegui ora'}
              </Button>
            </div>
          </div>

          {/* Mobile-optimized Tabs */}
          <Tabs defaultValue="monitor" className="w-full">
            <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 gap-1 h-auto p-1' : 'grid-cols-7'}`}>
              {isMobile ? (
                <>
                  <TabsTrigger value="monitor" className="text-xs py-2">Monitor</TabsTrigger>
                  <TabsTrigger value="feeds" className="text-xs py-2">Feed RSS</TabsTrigger>
                  <TabsTrigger value="keywords" className="text-xs py-2">Keywords</TabsTrigger>
                  <TabsTrigger value="schedule" className="text-xs py-2">Piano</TabsTrigger>
                  <TabsTrigger value="email" className="text-xs py-2">Email</TabsTrigger>
                  <TabsTrigger value="preview" className="text-xs py-2">Preview</TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs py-2">Impost.</TabsTrigger>
                </>
              ) : (
                <>
                  <TabsTrigger value="monitor">Monitoraggio</TabsTrigger>
                  <TabsTrigger value="feeds">Feed RSS</TabsTrigger>
                  <TabsTrigger value="keywords">Keywords</TabsTrigger>
                  <TabsTrigger value="schedule">Pianificazione</TabsTrigger>
                  <TabsTrigger value="email">Email</TabsTrigger>
                  <TabsTrigger value="preview">Preview</TabsTrigger>
                  <TabsTrigger value="settings">Impostazioni</TabsTrigger>
                </>
              )}
            </TabsList>

            <div className="mt-4 sm:mt-6">
              <TabsContent value="monitor" className="space-y-4 sm:space-y-6">
                <SystemStats />
                <ArticlesList />
              </TabsContent>

              <TabsContent value="feeds" className="space-y-4 sm:space-y-6">
                <RssConfig />
              </TabsContent>

              <TabsContent value="keywords" className="space-y-4 sm:space-y-6">
                <KeywordManager />
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4 sm:space-y-6">
                <ScheduleConfig />
              </TabsContent>

              <TabsContent value="email" className="space-y-4 sm:space-y-6">
                <EmailConfig />
              </TabsContent>

              <TabsContent value="preview" className="space-y-4 sm:space-y-6">
                <EmailPreview />
                <SystemTest />
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 sm:space-y-6">
                <ConfigBackup />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
