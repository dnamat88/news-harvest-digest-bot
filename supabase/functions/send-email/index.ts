
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

interface Article {
  id: string;
  titolo: string;
  link: string;
  data_pubblicazione: string;
  fonte: string;
  sommario: string;
  matched_keywords: string[];
}

function generateEmailHTML(articles: Article[], settings: any): string {
  const date = new Date().toLocaleDateString('it-IT');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>RSS Banking News - ${date}</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .article { border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; margin-bottom: 20px; }
        .article-title { color: #2563eb; font-size: 18px; font-weight: bold; margin-bottom: 10px; }
        .article-meta { color: #6b7280; font-size: 14px; margin-bottom: 10px; }
        .article-summary { margin-bottom: 15px; }
        .keywords { margin-bottom: 10px; }
        .keyword-tag { background: #dbeafe; color: #1e40af; padding: 2px 8px; border-radius: 12px; font-size: 12px; margin-right: 5px; }
        .read-more { color: #2563eb; text-decoration: none; font-weight: bold; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6b7280; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🏦 RSS Banking News - ${date}</h1>
        <p>Il tuo riassunto giornaliero delle notizie bancarie e finanziarie</p>
        <p><strong>${articles.length}</strong> articoli trovati corrispondenti alle tue keywords</p>
      </div>
      
      ${articles.map(article => `
        <div class="article">
          <h2 class="article-title">${article.titolo}</h2>
          <div class="article-meta">
            📰 ${article.fonte} • 📅 ${new Date(article.data_pubblicazione).toLocaleDateString('it-IT')}
          </div>
          <div class="keywords">
            ${article.matched_keywords.map(keyword => 
              `<span class="keyword-tag">${keyword}</span>`
            ).join('')}
          </div>
          <div class="article-summary">
            ${article.sommario}
          </div>
          <a href="${article.link}" class="read-more" target="_blank">Leggi l'articolo completo →</a>
        </div>
      `).join('')}
      
      <div class="footer">
        <p>Questa email è stata generata automaticamente dal sistema RSS Banking News.</p>
        <p>Per modificare le tue preferenze, accedi al tuo dashboard.</p>
      </div>
    </body>
    </html>
  `;
}

function generateEmailText(articles: Article[], settings: any): string {
  const date = new Date().toLocaleDateString('it-IT');
  
  let text = `RSS Banking News - ${date}\n\n`;
  text += `Il tuo riassunto giornaliero delle notizie bancarie e finanziarie\n`;
  text += `${articles.length} articoli trovati corrispondenti alle tue keywords\n\n`;
  text += `${'='.repeat(60)}\n\n`;
  
  articles.forEach((article, index) => {
    text += `${index + 1}. ${article.titolo}\n`;
    text += `   Fonte: ${article.fonte}\n`;
    text += `   Data: ${new Date(article.data_pubblicazione).toLocaleDateString('it-IT')}\n`;
    text += `   Keywords: ${article.matched_keywords.join(', ')}\n`;
    text += `   ${article.sommario}\n`;
    text += `   Link: ${article.link}\n\n`;
    text += `${'-'.repeat(40)}\n\n`;
  });
  
  text += `Questa email è stata generata automaticamente dal sistema RSS Banking News.`;
  
  return text;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { userId, isTest = false } = body;

    console.log(`Starting email send process for user: ${userId}, test: ${isTest}`);

    // Ottieni impostazioni utente
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (settingsError) throw settingsError;
    if (!settings || !settings.email_enabled) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Email non abilitata per questo utente' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Email settings found for user: ${settings.email_address}`);

    // Ottieni articoli recenti (ultimi 7 giorni)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const { data: articles, error: articlesError } = await supabase
      .from('articoli')
      .select('*')
      .eq('user_id', userId)
      .gte('data_pubblicazione', weekAgo.toISOString())
      .order('data_pubblicazione', { ascending: false })
      .limit(settings.max_articles_per_email);

    if (articlesError) throw articlesError;

    console.log(`Found ${articles?.length || 0} articles to include in email`);

    if (!articles || articles.length === 0) {
      console.log('No articles found, skipping email send');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'Nessun articolo trovato per l\'invio email',
        articlesCount: 0 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Genera contenuto email
    const subject = settings.email_subject_template
      .replace('{date}', new Date().toLocaleDateString('it-IT'))
      .replace('{count}', articles.length.toString());

    const emailContent = settings.email_format === 'html' 
      ? generateEmailHTML(articles, settings)
      : generateEmailText(articles, settings);

    // Invia email
    const emailData: any = {
      from: 'RSS Banking News <noreply@lovable.app>',
      to: [settings.email_address],
      subject: isTest ? `[TEST] ${subject}` : subject,
    };

    if (settings.email_format === 'html') {
      emailData.html = emailContent;
    } else {
      emailData.text = emailContent;
    }

    console.log('Sending email via Resend...');
    const emailResponse = await resend.emails.send(emailData);

    if (emailResponse.error) {
      throw new Error(`Resend error: ${emailResponse.error.message}`);
    }

    console.log('Email sent successfully:', emailResponse.data?.id);

    // Salva nella cronologia email
    const { error: historyError } = await supabase
      .from('email_history')
      .insert([{
        recipient_email: settings.email_address,
        subject: emailData.subject,
        articles_count: articles.length,
        status: 'sent'
      }]);

    if (historyError) {
      console.error('Error saving email history:', historyError);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Email inviata con successo a ${settings.email_address}`,
      articlesCount: articles.length,
      emailId: emailResponse.data?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-email function:', error);
    
    // Salva errore nella cronologia se possibile
    try {
      const body = await req.clone().json();
      if (body.userId) {
        const { data: settings } = await supabase
          .from('user_settings')
          .select('email_address')
          .eq('user_id', body.userId)
          .maybeSingle();

        if (settings) {
          await supabase
            .from('email_history')
            .insert([{
              recipient_email: settings.email_address,
              subject: 'Email Failed',
              articles_count: 0,
              status: 'failed',
              error_message: error.message
            }]);
        }
      }
    } catch (historyError) {
      console.error('Error saving failed email to history:', historyError);
    }

    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
};

serve(handler);
