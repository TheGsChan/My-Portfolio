import { createClient } from '@supabase/supabase-js';

const BUCKET_NAME = 'motion projects';

export default async function handler(req, res) {
  // Create client inside handler so env vars are guaranteed to be loaded
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('Missing Supabase env vars:', { SUPABASE_URL: !!SUPABASE_URL, SUPABASE_SERVICE_KEY: !!SUPABASE_SERVICE_KEY });
    return res.status(500).json({ error: 'Supabase env vars not configured' });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

  try {
    const folders = ['motion ui', 'GRAPHICS WORK', 'TYPOGRAPHY', 'hobbies'];
    const results = {};

    for (const folder of folders) {
      const { data, error } = await supabase.storage.from(BUCKET_NAME).list(folder);
      
      if (error) {
        console.error(`Error fetching from ${folder}:`, error.message);
        results[folder] = [];
        continue;
      }

      // We use createSignedUrl because the bucket might be set to Private.
      // This grants the frontend temporary (1 hour) access to view the files.
      const fileUrls = [];
      for (const file of data) {
        if (!file.name || file.name.startsWith('.emptyFolderPlaceholder')) continue;
        
        const filePath = `${folder}/${file.name}`;
        const { data: signedData, error: signError } = await supabase.storage
          .from(BUCKET_NAME)
          .createSignedUrl(filePath, 3600);
          
        if (signedData && !signError) {
          fileUrls.push(signedData.signedUrl);
        } else {
          // Fallback just in case
          const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(filePath);
          fileUrls.push(publicUrlData.publicUrl);
        }
      }

      results[folder] = fileUrls;
    }

    res.status(200).json(results);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
  }
}
