
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Mail, Send, Settings, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const EmailConfig = () => {
  const { toast } = useToast();
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [emailAddress, setEmailAddress] = useState('user@example.com');
  const [maxArticles, setMaxArticles] = useState(10);
  const [emailFormat, setEmailFormat] = useState('html');
  const [customSubject, setCustomSubject] = useState('RSS News Daily Digest - {date}');

  const saveConfig = () => {
    toast({
      title: "Configurazione salvata",
      description: "Le impostazioni email sono state aggiornate con successo"
    });
  };

  const sendTestEmail = () => {
    toast({
      title: "Email di test inviata",
      description: `Email di test inviata a ${emailAddress}`
    });
  };

  const previewEmail = () => {
    toast({
      title: "Anteprima generata",
      description: "Anteprima dell'email mostrata di seguito"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurazione Email
          </CardTitle>
          <CardDescription>
            Configura le impostazioni per l'invio automatico delle email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Abilita invio email</Label>
              <p className="text-sm text-muted-foreground">
                Ricevi un riassunto giornaliero via email
              </p>
            </div>
            <Switch
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
            />
          </div>

          {emailEnabled && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailAddress">Indirizzo Email</Label>
                  <Input
                    id="emailAddress"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="tuo@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxArticles">Max Articoli nell'Email</Label>
                  <Input
                    id="maxArticles"
                    type="number"
                    min="1"
                    max="50"
                    value={maxArticles}
                    onChange={(e) => setMaxArticles(parseInt(e.target.value))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customSubject">Oggetto Email</Label>
                <Input
                  id="customSubject"
                  value={customSubject}
                  onChange={(e) => setCustomSubject(e.target.value)}
                  placeholder="Usa {date} per la data corrente"
                />
                <p className="text-xs text-muted-foreground">
                  Variabili disponibili: {'{date}'} per la data, {'{count}'} per il numero di articoli
                </p>
              </div>

              <div className="space-y-2">
                <Label>Formato Email</Label>
                <div className="flex gap-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="html"
                      checked={emailFormat === 'html'}
                      onChange={(e) => setEmailFormat(e.target.value)}
                    />
                    <span>HTML</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="text"
                      checked={emailFormat === 'text'}
                      onChange={(e) => setEmailFormat(e.target.value)}
                    />
                    <span>Testo</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={saveConfig}>
                  <Settings className="h-4 w-4 mr-2" />
                  Salva Configurazione
                </Button>
                <Button variant="outline" onClick={sendTestEmail}>
                  <Send className="h-4 w-4 mr-2" />
                  Invia Test
                </Button>
                <Button variant="outline" onClick={previewEmail}>
                  <Eye className="h-4 w-4 mr-2" />
                  Anteprima
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Storico Email
          </CardTitle>
          <CardDescription>
            Ultime email inviate dal sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { date: '15/06/2025 18:00', articoli: 8, status: 'inviata' },
              { date: '14/06/2025 18:00', articoli: 12, status: 'inviata' },
              { date: '13/06/2025 18:00', articoli: 6, status: 'inviata' },
              { date: '12/06/2025 18:00', articoli: 9, status: 'fallita' },
              { date: '11/06/2025 18:00', articoli: 15, status: 'inviata' }
            ].map((email, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <p className="font-medium">{email.date}</p>
                  <p className="text-sm text-muted-foreground">
                    {email.articoli} articoli inclusi
                  </p>
                </div>
                <Badge 
                  variant={email.status === 'inviata' ? 'default' : 'destructive'}
                >
                  {email.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
