
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { PDFLoader } from "https://esm.sh/langchain/document_loaders/fs/pdf";
import { DocxLoader } from "https://esm.sh/langchain/document_loaders/fs/docx";
import { Document } from "https://esm.sh/langchain/document";
import { RecursiveCharacterTextSplitter } from "https://esm.sh/langchain/text_splitter";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;

    if (!file) {
      throw new Error('No file uploaded');
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Upload file to storage
    const fileBuffer = await file.arrayBuffer();
    const fileName = `${crypto.randomUUID()}-${file.name}`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('training_docs')
      .upload(fileName, file);

    if (uploadError) {
      throw new Error(`Failed to upload file: ${uploadError.message}`);
    }

    // Load and process document
    let text = '';
    if (file.name.toLowerCase().endsWith('.pdf')) {
      const loader = new PDFLoader(new Blob([fileBuffer]));
      const docs = await loader.load();
      text = docs.map(doc => doc.pageContent).join('\n');
    } else if (file.name.toLowerCase().endsWith('.docx')) {
      const loader = new DocxLoader(new Blob([fileBuffer]));
      const docs = await loader.load();
      text = docs.map(doc => doc.pageContent).join('\n');
    } else {
      throw new Error('Unsupported file type');
    }

    // Split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.createDocuments([text]);

    // Generate embeddings for each chunk
    for (const chunk of chunks) {
      const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'text-embedding-3-small',
          input: chunk.pageContent,
        }),
      });

      const embeddingData = await embeddingResponse.json();
      const embedding = embeddingData.data[0].embedding;

      // Store in database
      const { error: insertError } = await supabaseAdmin
        .from('embeddings')
        .insert({
          content: chunk.pageContent,
          embedding,
          category,
          metadata: {
            filename: file.name,
            chunk_size: chunk.pageContent.length,
          },
        });

      if (insertError) {
        throw new Error(`Failed to store embedding: ${insertError.message}`);
      }
    }

    return new Response(
      JSON.stringify({ message: 'Document processed successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing document:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
