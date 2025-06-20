
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { userId, isTest = false } = await req.json()
    console.log(`Starting email send process for user: ${userId}, test: ${isTest}`)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get user settings
    const { data: userSettings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (settingsError) {
      console.error('Error fetching user settings:', settingsError)
      throw settingsError
    }

    if (!userSettings || !userSettings.email_enabled) {
      throw new Error('Email not enabled for user')
    }

    console.log(`Email settings found for user: ${userSettings.email_address}`)

    let articles = []
    let keywords = []

    if (isTest) {
      console.log('Using test articles for email')
      // Generate test articles for test emails
      articles = [
        {
          id: 'test-1',
          titolo: 'Test Article 1: Fintech Innovation',
          descrizione: 'This is a test article about fintech innovations and banking technology.',
          url: 'https://example.com/article1',
          data_pubblicazione: new Date().toISOString(),
          fonte: 'Test Feed',
          match_keywords: ['fintech', 'banking']
        },
        {
          id: 'test-2',
          titolo: 'Test Article 2: Blockchain Technology',
          descrizione: 'This is a test article about blockchain and cryptocurrency developments.',
          url: 'https://example.com/article2',
          data_pubblicazione: new Date().toISOString(),
          fonte: 'Test Feed',
          match_keywords: ['blockchain']
        },
        {
          id: 'test-3',
          titolo: 'Test Article 3: General Tech News',
          descrizione: 'This is a general technology news article without specific keywords.',
          url: 'https://example.com/article3',
          data_pubblicazione: new Date().toISOString(),
          fonte: 'Test Feed',
          match_keywords: []
        }
      ]

      keywords = [
        { parola: 'fintech', attiva: true },
        { parola: 'banking', attiva: true },
        { parola: 'blockchain', attiva: true }
      ]
    } else {
      // Get recent articles for real emails
      const { data: articlesData, error: articlesError } = await supabase
        .from('articoli')
        .select('*')
        .eq('user_id', userId)
        .gte('data_pubblicazione', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
        .order('data_pubblicazione', { ascending: false })

      if (articlesError) {
        console.error('Error fetching articles:', articlesError)
        throw articlesError
      }

      articles = articlesData || []

      // Get active keywords
      const { data: keywordsData, error: keywordsError } = await supabase
        .from('keywords')
        .select('*')
        .eq('user_id', userId)
        .eq('attiva', true)

      if (keywordsError) {
        console.error('Error fetching keywords:', keywordsError)
        throw keywordsError
      }

      keywords = keywordsData || []
    }

    // Categorize articles
    const keywordArticles = []
    const otherArticles = []

    for (const article of articles) {
      const matchedKeywords = []
      const articleText = `${article.titolo} ${article.descrizione}`.toLowerCase()

      for (const keyword of keywords) {
        if (articleText.includes(keyword.parola.toLowerCase())) {
          matchedKeywords.push(keyword.parola)
        }
      }

      if (matchedKeywords.length > 0) {
        keywordArticles.push({ ...article, match_keywords: matchedKeywords })
      } else {
        otherArticles.push({ ...article, match_keywords: [] })
      }
    }

    // Generate email content
    const today = new Date().toLocaleDateString('it-IT')
    const subject = `${isTest ? '[TEST] ' : ''}FlashBrief Daily Digest - ${today}`

    let emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://your-domain.com/lovable-uploads/f30e033a-dcdc-467e-bee0-e5292115598d.png" alt="FlashBrief" style="height: 50px; margin-bottom: 10px;">
          <h1 style="color: #1e40af; margin: 0;">FlashBrief Daily Digest</h1>
          <p style="color: #6b7280; margin: 5px 0;">${today}</p>
        </div>
    `

    if (keywordArticles.length > 0) {
      emailContent += `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            📌 Articoli con Keywords (${keywordArticles.length})
          </h2>
      `

      for (const article of keywordArticles) {
        emailContent += `
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background-color: #f9fafb;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">
              <a href="${article.url}" style="color: #1e40af; text-decoration: none;">${article.titolo}</a>
            </h3>
            <p style="margin: 0 0 10px 0; color: #4b5563; line-height: 1.5;">${article.descrizione}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #6b7280;">
              <span>📍 ${article.fonte}</span>
              <span>📅 ${new Date(article.data_pubblicazione).toLocaleDateString('it-IT')}</span>
            </div>
            ${article.match_keywords && article.match_keywords.length > 0 ? `
              <div style="margin-top: 10px;">
                <strong style="font-size: 12px; color: #7c3aed;">Keywords:</strong>
                ${article.match_keywords.map(k => `<span style="background: #e0e7ff; color: #3730a3; padding: 2px 6px; border-radius: 12px; font-size: 11px; margin-left: 5px;">${k}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `
      }
      emailContent += `</div>`
    }

    if (otherArticles.length > 0) {
      emailContent += `
        <div style="margin-bottom: 30px;">
          <h2 style="color: #059669; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">
            📰 Altri Articoli (${otherArticles.length})
          </h2>
      `

      for (const article of otherArticles) {
        emailContent += `
          <div style="margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #1f2937;">
              <a href="${article.url}" style="color: #059669; text-decoration: none;">${article.titolo}</a>
            </h3>
            <p style="margin: 0 0 10px 0; color: #4b5563; line-height: 1.5;">${article.descrizione}</p>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 12px; color: #6b7280;">
              <span>📍 ${article.fonte}</span>
              <span>📅 ${new Date(article.data_pubblicazione).toLocaleDateString('it-IT')}</span>
            </div>
          </div>
        `
      }
      emailContent += `</div>`
    }

    if (keywordArticles.length === 0 && otherArticles.length === 0) {
      emailContent += `
        <div style="text-align: center; padding: 40px 20px; color: #6b7280;">
          <h3>Nessun nuovo articolo oggi</h3>
          <p>Il sistema FlashBrief non ha trovato nuovi articoli nelle ultime 24 ore.</p>
        </div>
      `
    }

    emailContent += `
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
          <p>Email generata automaticamente da FlashBrief</p>
          <p>Se non desideri più ricevere queste email, puoi disattivarle dalle impostazioni.</p>
        </div>
      </div>
    `

    // Send email using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured')
    }

    const emailData = {
      from: 'onboarding@resend.dev',
      to: [userSettings.email_address],
      subject: subject,
      html: emailContent
    }

    console.log('Sending email via Resend...', {
      to: emailData.to,
      subject: emailData.subject,
      contentLength: emailData.html.length
    })

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(emailData)
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json()
      console.error('Resend API error:', errorData)
      throw new Error(`Resend API error: ${errorData.message}`)
    }

    const resendResult = await resendResponse.json()
    console.log(`Email sent successfully: ${resendResult.id}`)

    // Save to email history
    if (!isTest) {
      await supabase.from('email_history').insert([{
        user_id: userId,
        email_address: userSettings.email_address,
        subject: subject,
        articles_count: articles.length,
        keyword_articles_count: keywordArticles.length,
        other_articles_count: otherArticles.length,
        sent_at: new Date().toISOString(),
        resend_id: resendResult.id
      }])
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully',
        emailId: resendResult.id,
        articlesCount: articles.length,
        keywordArticlesCount: keywordArticles.length,
        otherArticlesCount: otherArticles.length
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error in send-email function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
