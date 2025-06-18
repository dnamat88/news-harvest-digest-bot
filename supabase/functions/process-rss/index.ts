
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  content?: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function parseRSSFeed(url: string): Promise<RSSItem[]> {
  try {
    console.log(`Fetching RSS feed: ${url}`);
    const response = await fetch(url);
    const text = await response.text();
    
    // Parse XML usando DOMParser
    const parser = new DOMParser();
    const doc = parser.parseFromString(text, 'application/xml');
    
    const items = doc.querySelectorAll('item');
    const rssItems: RSSItem[] = [];
    
    items.forEach(item => {
      const title = item.querySelector('title')?.textContent || '';
      const link = item.querySelector('link')?.textContent || '';
      const pubDate = item.querySelector('pubDate')?.textContent || '';
      const description = item.querySelector('description')?.textContent || '';
      const content = item.querySelector('content\\:encoded')?.textContent || description;
      
      if (title && link) {
        rssItems.push({
          title: title.trim(),
          link: link.trim(),
          pubDate: pubDate.trim(),
          description: description.trim(),
          content: content.trim()
        });
      }
    });
    
    console.log(`Parsed ${rssItems.length} items from RSS feed`);
    return rssItems;
  } catch (error) {
    console.error(`Error parsing RSS feed ${url}:`, error);
    return [];
  }
}

function matchesKeywords(text: string, keywords: string[]): string[] {
  const matchedKeywords: string[] = [];
  const textLower = text.toLowerCase();
  
  keywords.forEach(keyword => {
    if (textLower.includes(keyword.toLowerCase())) {
      matchedKeywords.push(keyword);
    }
  });
  
  return matchedKeywords;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting RSS processing...');
    
    // Ottieni feed attivi
    const { data: feeds, error: feedsError } = await supabase
      .from('feeds')
      .select('*')
      .eq('attivo', true);

    if (feedsError) throw feedsError;
    console.log(`Found ${feeds?.length || 0} active feeds`);

    // Ottieni keywords attive
    const { data: keywords, error: keywordsError } = await supabase
      .from('keywords')
      .select('parola')
      .eq('attiva', true);

    if (keywordsError) throw keywordsError;
    const keywordList = keywords?.map(k => k.parola) || [];
    console.log(`Found ${keywordList.length} active keywords:`, keywordList);

    // Crea log di esecuzione
    const { data: executionLog, error: logError } = await supabase
      .from('execution_logs')
      .insert([{
        started_at: new Date().toISOString(),
        status: 'running',
        articles_found: 0,
        articles_filtered: 0
      }])
      .select()
      .single();

    if (logError) throw logError;
    console.log('Created execution log:', executionLog.id);

    let totalArticlesFound = 0;
    let totalArticlesFiltered = 0;

    // Processa ogni feed
    for (const feed of feeds || []) {
      try {
        console.log(`Processing feed: ${feed.nome} (${feed.url})`);
        const rssItems = await parseRSSFeed(feed.url);
        totalArticlesFound += rssItems.length;

        for (const item of rssItems) {
          // Controlla se l'articolo esiste già
          const { data: existingArticle } = await supabase
            .from('articoli')
            .select('id')
            .eq('link', item.link)
            .maybeSingle();

          if (existingArticle) {
            console.log(`Article already exists: ${item.title}`);
            continue;
          }

          // Controlla match con keywords
          const fullText = `${item.title} ${item.description} ${item.content || ''}`;
          const matchedKeywords = matchesKeywords(fullText, keywordList);

          if (matchedKeywords.length > 0) {
            console.log(`Article matches keywords:`, matchedKeywords);
            
            // Salva articolo
            const { error: articleError } = await supabase
              .from('articoli')
              .insert([{
                titolo: item.title,
                link: item.link,
                data_pubblicazione: item.pubDate || new Date().toISOString(),
                fonte: feed.nome,
                sommario: item.description.substring(0, 500),
                categoria: 'Banking News',
                matched_keywords: matchedKeywords,
                user_id: feed.user_id
              }]);

            if (articleError) {
              console.error('Error saving article:', articleError);
            } else {
              totalArticlesFiltered++;
              console.log(`Saved article: ${item.title}`);
            }
          }
        }

        // Aggiorna ultimo aggiornamento del feed
        await supabase
          .from('feeds')
          .update({ ultimo_aggiornamento: new Date().toISOString() })
          .eq('id', feed.id);

      } catch (error) {
        console.error(`Error processing feed ${feed.nome}:`, error);
      }
    }

    // Aggiorna log di esecuzione
    await supabase
      .from('execution_logs')
      .update({
        completed_at: new Date().toISOString(),
        status: 'completed',
        articles_found: totalArticlesFound,
        articles_filtered: totalArticlesFiltered
      })
      .eq('id', executionLog.id);

    console.log(`RSS processing completed. Found: ${totalArticlesFound}, Filtered: ${totalArticlesFiltered}`);

    return new Response(JSON.stringify({
      success: true,
      articlesFound: totalArticlesFound,
      articlesFiltered: totalArticlesFiltered,
      executionLogId: executionLog.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in process-rss function:', error);
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
