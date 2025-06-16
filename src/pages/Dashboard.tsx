
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RssConfig } from "@/components/rss/RssConfig";
import { KeywordManager } from "@/components/rss/KeywordManager";
import { ArticlesList } from "@/components/rss/ArticlesList";
import { SystemStats } from "@/components/rss/SystemStats";
import { EmailConfig } from "@/components/rss/EmailConfig";
import { ScheduleConfig } from "@/components/rss/ScheduleConfig";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">RSS News Automation Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Gestisci e monitora il sistema di raccolta notizie automatizzato
          </p>
        </div>

        <Tabs defaultValue="monitor" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="monitor">Monitoraggio</TabsTrigger>
            <TabsTrigger value="feeds">Feed RSS</TabsTrigger>
            <TabsTrigger value="keywords">Keywords</TabsTrigger>
            <TabsTrigger value="schedule">Pianificazione</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
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
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
