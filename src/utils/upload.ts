import { createClient } from '@/utils/supabase/client';

export async function uploadAvatar(file: File, path: string) {
  const supabase = createClient();
  
  const { data, error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true });

  if (error) throw error;

  // Получаем публичную ссылку
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(path);

  return publicUrl;
}

export async function uploadResume(file: File, userId: string) {
  const supabase = createClient();
  const path = `${userId}/${Date.now()}_${file.name}`;

  const { data, error } = await supabase.storage
    .from('resumes')
    .upload(path, file);

  if (error) throw error;

  // Резюме приватные, поэтому возвращаем путь, а не URL.
  // URL будем генерировать временный (signedUrl) при просмотре.
  return path;
}
