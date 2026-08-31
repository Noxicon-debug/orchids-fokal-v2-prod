import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { XeroClient } from 'npm:xero-node';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const xero = new XeroClient({
      clientId: Deno.env.get('XERO_CLIENT_ID'),
      clientSecret: Deno.env.get('XERO_CLIENT_SECRET'),
      redirectUris: [Deno.env.get('XERO_REDIRECT_URI')],
      scopes: 'accounting.transactions accounting.settings',
    });

    const { service, requirements, duration, budget, startDate } = await req.json();

    // Create quote in Xero
    const quote = await xero.accountingApi.createQuote({
      Name: `Quote for ${service}`,
      Description: requirements,
      ValidTo: new Date(startDate),
      Status: 'DRAFT',
      LineItems: [
        {
          Description: `${service} Service - ${duration}`,
          Quantity: 1,
          UnitAmount: parseFloat(budget.split('-')[0]),
          AccountCode: '200',
        },
      ],
    });

    return new Response(
      JSON.stringify({
        success: true,
        quote: quote,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});