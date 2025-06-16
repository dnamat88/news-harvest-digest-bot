
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rss, Filter, Mail, Calendar, TrendingUp } from "lucide-react";

export const SystemStats = () => {
  // Dati mock per la demo
  const stats = {
    articoliOggi: 23,
    articoliFiltrati: 8,
    feedAttivi: 5,
    ultimaEsecuzione: "18:00 - 15/06/2025",
    prossimaEsecuzione: "18:00 - 16/06/2025",
    emailInviate: 12
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Articoli Oggi</CardTitle>
          <Rss className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.articoliOggi}</div>
          <p className="text-xs text-muted-foreground">
            +12% rispetto a ieri
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Articoli Filtrati</CardTitle>
          <Filter className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.articoliFiltrati}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((stats.articoliFiltrati / stats.articoliOggi) * 100)}% del totale
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Feed Attivi</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.feedAttivi}</div>
          <p className="text-xs text-muted-foreground">
            Tutti funzionanti
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Email Inviate</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.emailInviate}</div>
          <p className="text-xs text-muted-foreground">
            Questo mese
          </p>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Stato Sistema
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm">Ultima esecuzione:</span>
            <Badge variant="secondary">{stats.ultimaEsecuzione}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Prossima esecuzione:</span>
            <Badge variant="outline">{stats.prossimaEsecuzione}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">Stato workflow n8n:</span>
            <Badge className="bg-green-500 hover:bg-green-600">Attivo</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
