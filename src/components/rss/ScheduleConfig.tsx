
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Clock, Calendar, Play, Pause, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const ScheduleConfig = () => {
  const { toast } = useToast();
  const [scheduleEnabled, setScheduleEnabled] = useState(true);
  const [executionTime, setExecutionTime] = useState('18:00');
  const [timezone, setTimezone] = useState('Europe/Rome');
  const [weekdaysOnly, setWeekdaysOnly] = useState(true);

  const saveSchedule = () => {
    toast({
      title: "Pianificazione salvata",
      description: "Le impostazioni di pianificazione sono state aggiornate"
    });
  };

  const runNow = () => {
    toast({
      title: "Esecuzione avviata",
      description: "Il workflow è stato avviato manualmente"
    });
  };

  const nextExecutions = [
    '16/06/2025 18:00',
    '17/06/2025 18:00', 
    '18/06/2025 18:00',
    '19/06/2025 18:00',
    '20/06/2025 18:00'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Configurazione Pianificazione
          </CardTitle>
          <CardDescription>
            Configura quando e come spesso eseguire la raccolta RSS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Abilita pianificazione automatica</Label>
              <p className="text-sm text-muted-foreground">
                Esegui automaticamente il workflow ogni giorno
              </p>
            </div>
            <Switch
              checked={scheduleEnabled}
              onCheckedChange={setScheduleEnabled}
            />
          </div>

          {scheduleEnabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="executionTime">Orario di Esecuzione</Label>
                  <Input
                    id="executionTime"
                    type="time"
                    value={executionTime}
                    onChange={(e) => setExecutionTime(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Orario</Label>
                  <select
                    id="timezone"
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  >
                    <option value="Europe/Rome">Europe/Rome (CET/CEST)</option>
                    <option value="UTC">UTC</option>
                    <option value="Europe/London">Europe/London (GMT/BST)</option>
                    <option value="America/New_York">America/New_York (EST/EDT)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-base">Solo giorni feriali</Label>
                  <p className="text-sm text-muted-foreground">
                    Esegui solo dal lunedì al venerdì
                  </p>
                </div>
                <Switch
                  checked={weekdaysOnly}
                  onCheckedChange={setWeekdaysOnly}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={saveSchedule}>
                  <Settings className="h-4 w-4 mr-2" />
                  Salva Pianificazione
                </Button>
                <Button variant="outline" onClick={runNow}>
                  <Play className="h-4 w-4 mr-2" />
                  Esegui Ora
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Stato Esecuzioni
          </CardTitle>
          <CardDescription>
            Monitora lo stato delle esecuzioni programmate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-green-600">98%</div>
              <div className="text-sm text-muted-foreground">Successo</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold">47</div>
              <div className="text-sm text-muted-foreground">Esecuzioni Totali</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">1</div>
              <div className="text-sm text-muted-foreground">Fallimenti</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium">Prossime Esecuzioni</h4>
            {nextExecutions.map((execution, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <span className="font-medium">{execution}</span>
                <Badge variant="outline">Programmata</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurazione n8n</CardTitle>
          <CardDescription>
            Istruzioni per configurare la pianificazione in n8n
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="bg-muted p-4 rounded-lg">
            <h5 className="font-medium mb-2">Cron Expression:</h5>
            <code className="text-sm bg-background px-2 py-1 rounded">
              0 18 * * {weekdaysOnly ? '1-5' : '*'}
            </code>
            <p className="text-xs text-muted-foreground mt-1">
              Esegui alle {executionTime} {weekdaysOnly ? 'dal lunedì al venerdì' : 'ogni giorno'}
            </p>
          </div>
          
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Aggiungi un nodo "Cron" all'inizio del tuo workflow n8n</p>
            <p>• Inserisci l'espressione cron mostrata sopra</p>
            <p>• Configura il fuso orario su {timezone}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
