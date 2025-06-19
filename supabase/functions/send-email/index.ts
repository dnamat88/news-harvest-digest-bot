

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

interface EmailRequest {
  userId: string;
  isTest?: boolean;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, isTest = false }: EmailRequest = await req.json();
    console.log(`Starting email send process for user: ${userId}, test: ${isTest}`);

    // Ottieni impostazioni utente
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (settingsError) throw settingsError;
    if (!settings) {
      throw new Error('User settings not found');
    }

    console.log(`Email settings found for user: ${settings.email_address}`);

    let articles;
    
    if (isTest) {
      console.log('Using test articles for email');
      // Articoli di test per la demo
      articles = [
        {
          titolo: "Test Article 1 - Crypto News",
          link: "https://example.com/crypto-1",
          data_pubblicazione: new Date().toISOString(),
          fonte: "Test Feed",
          sommario: "This is a test article about cryptocurrency trends and market analysis.",
          matched_keywords: ["crypto", "bitcoin"]
        },
        {
          titolo: "Test Article 2 - Banking Innovation",
          link: "https://example.com/banking-1", 
          data_pubblicazione: new Date().toISOString(),
          fonte: "Test Feed",
          sommario: "This is a test article about new banking technologies and digital transformation.",
          matched_keywords: ["banking", "fintech"]
        },
        {
          titolo: "Test Article 3 - Market Update",
          link: "https://example.com/market-1",
          data_pubblicazione: new Date().toISOString(),
          fonte: "Test Feed", 
          sommario: "This is a test article with general market updates and economic news.",
          matched_keywords: []
        }
      ];
    } else {
      // Ottieni articoli recenti dell'utente
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { data: userArticles, error: articlesError } = await supabase
        .from('articoli')
        .select('*')
        .eq('user_id', userId)
        .gte('data_pubblicazione', yesterday.toISOString())
        .order('data_pubblicazione', { ascending: false })
        .limit(settings.max_articles_per_email);

      if (articlesError) throw articlesError;
      articles = userArticles || [];
    }

    if (articles.length === 0 && !isTest) {
      console.log('No new articles found for user');
      return new Response(JSON.stringify({ 
        success: true, 
        message: 'No new articles to send' 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Separa articoli per keywords e altri
    const articlesWithKeywords = articles.filter(article => 
      article.matched_keywords && article.matched_keywords.length > 0
    );
    const otherArticles = articles.filter(article => 
      !article.matched_keywords || article.matched_keywords.length === 0
    );

    // Genera subject
    const date = new Date().toLocaleDateString('it-IT');
    const subject = (isTest ? '[TEST] ' : '') + 
      settings.email_subject_template
        .replace('{date}', date)
        .replace('{count}', articles.length.toString());

    // Genera contenuto HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>RSS Feed Tailor Made - Daily Digest</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .section { margin-bottom: 30px; }
          .section-title { color: #495057; font-size: 20px; font-weight: bold; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #e9ecef; }
          .article { background: white; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .article-title { font-size: 18px; font-weight: bold; margin-bottom: 8px; }
          .article-title a { color: #495057; text-decoration: none; }
          .article-title a:hover { color: #667eea; }
          .article-meta { font-size: 14px; color: #6c757d; margin-bottom: 10px; }
          .article-summary { font-size: 16px; line-height: 1.5; }
          .keywords { margin-top: 10px; }
          .keyword { background: #667eea; color: white; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 5px; display: inline-block; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #6c757d; font-size: 14px; }
          .stats { background: #e3f2fd; padding: 15px; border-radius: 5px; margin-bottom: 20px; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🎯 RSS Feed Tailor Made</h1>
          <p>Il tuo digest personalizzato - ${date}</p>
        </div>
        
        <div class="content">
          <div class="stats">
            <strong>${articles.length} articoli trovati</strong> • 
            <strong>${articlesWithKeywords.length} con keywords</strong> • 
            <strong>${otherArticles.length} altri</strong>
          </div>

          ${articlesWithKeywords.length > 0 ? `
          <div class="section">
            <h2 class="section-title">🎯 Articoli con Keywords (${articlesWithKeywords.length})</h2>
            ${articlesWithKeywords.map(article => `
              <div class="article">
                <div class="article-title">
                  <a href="${article.link}" target="_blank">${article.titolo}</a>
                </div>
                <div class="article-meta">
                  📰 ${article.fonte} • 📅 ${new Date(article.data_pubblicazione).toLocaleDateString('it-IT')}
                </div>
                <div class="article-summary">${article.sommario}</div>
                <div class="keywords">
                  ${(article.matched_keywords || []).map(keyword => `<span class="keyword">${keyword}</span>`).join('')}
                </div>
              </div>
            `).join('')}
          </div>
          ` : ''}

          ${otherArticles.length > 0 ? `
          <div class="section">
            <h2 class="section-title">📰 Altri Articoli (${otherArticles.length})</h2>
            ${otherArticles.map(article => `
              <div class="article">
                <div class="article-title">
                  <a href="${article.link}" target="_blank">${article.titolo}</a>
                </div>
                <div class="article-meta">
                  📰 ${article.fonte} • 📅 ${new Date(article.data_pubblicazione).toLocaleDateString('it-IT')}
                </div>
                <div class="article-summary">${article.sommario}</div>
              </div>
            `).join('')}
          </div>
          ` : ''}
        </div>

        <div class="footer">
          <p>📧 Email generata automaticamente da RSS Feed Tailor Made</p>
          <p>Configurazione: ${settings.max_articles_per_email} articoli max • Formato: ${settings.email_format}</p>
        </div>
      </body>
      </html>
    `;

    console.log(`Sending email via Resend...`, {
      to: [settings.email_address],
      subject,
      contentLength: htmlContent.length
    });

    // Invia email
    const emailResult = await resend.emails.send({
      from: 'RSS Feed Tailor Made <onboarding@resend.dev>',
      to: [settings.email_address],
      subject: subject,
      html: htmlContent,
    });

    if (emailResult.error) {
      throw new Error(`Resend error: ${emailResult.error.message}`);
    }

    console.log(`Email sent successfully: ${emailResult.data?.id}`);

    // Salva nel log email
    const { error: logError } = await supabase
      .from('email_history')
      .insert([{
        recipient_email: settings.email_address,
        subject: subject,
        articles_count: articles.length,
        status: 'sent',
        sent_at: new Date().toISOString()
      }]);

    if (logError) {
      console.error('Error saving email log:', logError);
    }

    return new Response(JSON.stringify({
      success: true,
      message: `Email inviata con successo a ${settings.email_address}`,
      articlesCount: articles.length,
      emailId: emailResult.data?.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in send-email function:', error);
    
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

