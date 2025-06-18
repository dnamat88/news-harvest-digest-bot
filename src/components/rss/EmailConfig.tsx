
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Mail, Send, Settings, Eye, Play } from "lucide-react";
import { useEmailSettings } from "@/hooks/useEmailSettings";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

export const EmailConfig = () => {
  const { settings, emailHistory, loading, saveSettings } = useEmailSettings();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [emailAddress, setEmailAddress] = useState('');
  const [maxArticles, setMaxArticles] = useState(10);
  const [emailFormat, setEmailFormat] = useState<'html' | 'text'>('html');
  const [customSubject, setCustomSubject] = useState('RSS News Daily Digest - {date}');
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [isProcessingRss, setIsProcessingRss] = useState(false);

  useEffect(() => {
    if (settings) {
      setEmailEnabled(settings.email_enabled);
      setEmailAddress(settings.email_address);
      setMaxArticles(settings.max_articles_per_email);
      setEmailFormat(settings.email_format);
      setCustomSubject(settings.email_subject_template);
    } else if (user) {
      setEmailAddress(user.email || '');
    }
  }, [settings, user]);

  const handleSaveConfig = async () => {
    const success = await saveSettings({
      email_enabled: emailEnabled,
      email_address: emailAddress,
      max_articles_per_email: maxArticles,
      email_format: emailFormat,
      email_subject_template: customSubject
    });
  };

  const sendTestEmail = async () => {
    if (!user) {
      toast({
        title: 'Errore',
        description: 'Utente non autenticato',
        variant: 'destructive'
      });
      return;
    }

    setIsTestingEmail(true);
    try {
      console.log('Invio email di test...');
      const { data, error } = await supabase.functions.invoke('test-email', {
        body: { userId: user.id }
      });

      if (error) throw error;

      toast({
        title: 'Email di test inviata',
        description: data.message || 'Email di test inviata con successo',
      });

    } catch (error: any) {
      console.error('Errore invio email di test:', error);
      toast({
        title: 'Errore invio email',
        description: error.message || 'Errore durante l\'invio dell\'email di test',
        variant: 'destructive'
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const processRssNow = async () => {
    setIsProcessingRss(true);
    try {
      console.log('Avvio elaborazione RSS...');
      const { data, error } = await supabase.functions.invoke('process-rss');

      if (error) throw error;

      toast({
        title: 'RSS elaborato',
        description: `Trovati ${data.articlesFound} articoli, filtrati ${data.articlesFiltered}`,
      });

    } catch (error: any) {
      console.error('Errore elaborazione RSS:', error);
      toast({
        title: 'Errore elaborazione RSS',
        description: error.message || 'Errore durante l\'elaborazione RSS',
        variant: 'destructive'
      });
    } finally {
      setIsProcessingRss(false);
    }
  };

  const previewEmail = () => {
    toast({
      title: 'Anteprima Email',
      description: 'Funzione anteprima in sviluppo - per ora usa il test email',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground mt-2">Caricamento impostazioni email...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
                    onChange={(e) => setMaxArticles(parseInt(e.target.value) || 10)}
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
                      onChange={(e) => setEmailFormat(e.target.value as 'html' | 'text')}
                    />
                    <span>HTML</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      value="text"
                      checked={emailFormat === 'text'}
                      onChange={(e) => setEmailFormat(e.target.value as 'html' | 'text')}
                    />
                    <span>Testo</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4 flex-wrap">
                <Button onClick={handleSaveConfig}>
                  <Settings className="h-4 w-4 mr-2" />
                  Salva Configurazione
                </Button>
                <Button 
                  variant="outline" 
                  onClick={sendTestEmail}
                  disabled={isTestingEmail}
                >
                  {isTestingEmail ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  ) : (
                    <Send className="h-4 w-4 mr-2" />
                  )}
                  {isTestingEmail ? 'Invio...' : 'Invia Test'}
                </Button>
                <Button variant="outline" onClick={previewEmail}>
                  <Eye className="h-4 w-4 mr-2" />
                  Anteprima
                </Button>
                <Button 
                  variant="outline" 
                  onClick={processRssNow}
                  disabled={isProcessingRss}
                >
                  {isProcessingRss ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                  ) : (
                    <Play className="h-4 w-4 mr-2" />
                  )}
                  {isProcessingRss ? 'Elaborazione...' : 'Elabora RSS Ora'}
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
            Storico Email ({emailHistory.length})
          </CardTitle>
          <CardDescription>
            Ultime email inviate dal sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailHistory.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Nessuna email inviata ancora. Lo storico apparirà qui quando il sistema inizierà a inviare le email.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {emailHistory.map((email) => (
                <div key={email.id} className="flex justify-between items-center p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      {new Date(email.sent_at).toLocaleString('it-IT')}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {email.articles_count} articoli inclusi • {email.recipient_email}
                    </p>
                    {email.error_message && (
                      <p className="text-xs text-destructive">{email.error_message}</p>
                    )}
                  </div>
                  <Badge 
                    variant={email.status === 'sent' ? 'default' : 'destructive'}
                  >
                    {email.status === 'sent' ? 'Inviata' : 'Fallita'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
