import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Resume PDF generation request received');
    
    const requestData = await req.json();
    console.log('Request data received:', JSON.stringify(requestData, null, 2));
    console.log('About to call external API...');

    // Forward the request to the external resume API
    const response = await fetch('https://resume-pdf-api.onrender.com/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData),
    });

    console.log('External API response status:', response.status);
    console.log('External API response ok:', response.ok);
    console.log('External API response headers:', Object.fromEntries(response.headers));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('External API error response:', errorText);
      throw new Error(`External API responded with ${response.status}: ${errorText || response.statusText}`);
    }

    // Get the PDF blob from the external API
    const pdfBlob = await response.blob();
    console.log('Successfully received PDF blob, size:', pdfBlob.size, 'type:', pdfBlob.type);

    // Convert blob to array buffer for proper handling
    const arrayBuffer = await pdfBlob.arrayBuffer();
    console.log('Converted to ArrayBuffer, size:', arrayBuffer.byteLength);
    
    // Return the PDF with proper headers
    return new Response(arrayBuffer, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename=resume.pdf',
      },
    });

  } catch (error) {
    console.error('Error in generate-resume-pdf function:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        details: 'Failed to generate resume PDF'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});