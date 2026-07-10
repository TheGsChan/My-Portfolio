export default async function handler(req, res) {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: 'Missing env vars', url: !!SUPABASE_URL, key: !!SUPABASE_KEY });
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Test: list buckets
    const { data: buckets, error: bucketsErr } = await supabase.storage.listBuckets();
    if (bucketsErr) return res.json({ step: 'listBuckets', error: bucketsErr.message, status: bucketsErr.status });

    // Test: list root of 'motion projects' bucket
    const { data: rootList, error: rootErr } = await supabase.storage.from('motion projects').list('');
    if (rootErr) return res.json({ step: 'listRoot', error: rootErr.message, buckets: buckets?.map(b => b.name) });

    // Test: list 'motion ui' folder
    const { data: folderList, error: folderErr } = await supabase.storage.from('motion projects').list('motion ui');
    if (folderErr) return res.json({ step: 'listFolder', error: folderErr.message, rootItems: rootList?.map(i => i.name) });

    return res.json({
      ok: true,
      buckets: buckets?.map(b => b.name),
      rootItems: rootList?.map(i => i.name),
      motionUiFiles: folderList?.map(i => i.name),
    });
  } catch (e) {
    return res.status(500).json({ step: 'exception', error: e.message });
  }
}
