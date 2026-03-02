-- Таблица для системы чатов
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Только участники отклика могут видеть и отправлять сообщения
CREATE POLICY "Users can view messages for their applications" ON public.messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.applications 
    WHERE id = messages.application_id 
    AND (worker_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.vacancies 
      WHERE id = applications.vacancy_id AND employer_id = auth.uid()
    ))
  )
);

CREATE POLICY "Users can send messages to their applications" ON public.messages
FOR INSERT WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.applications 
    WHERE id = application_id 
    AND (worker_id = auth.uid() OR EXISTS (
      SELECT 1 FROM public.vacancies 
      WHERE id = applications.vacancy_id AND employer_id = auth.uid()
    ))
  )
);
