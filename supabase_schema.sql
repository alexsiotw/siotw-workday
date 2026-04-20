-- Create users table (extending Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create courses table (Now using TEXT for ID to support custom course codes)
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL DEFAULT 3,
    max_capacity INTEGER NOT NULL DEFAULT 30,
    current_enrollment INTEGER NOT NULL DEFAULT 0,
    instructor TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Create enrollments table
CREATE TABLE IF NOT EXISTS public.enrollments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE NOT NULL,
    status TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'dropped', 'completed')),
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(student_id, course_id)
);

-- Enable RLS on enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Everyone can view courses" ON public.courses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage courses" ON public.courses FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));
CREATE POLICY "Students can view their own enrollments" ON public.enrollments FOR SELECT TO authenticated USING (auth.uid() = student_id);
CREATE POLICY "Students can enroll in courses" ON public.enrollments FOR INSERT TO authenticated WITH CHECK (auth.uid() = student_id);
CREATE POLICY "Admins can view all enrollments" ON public.enrollments FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin'));

-- Function to handle atomic enrollment and capacity check
CREATE OR REPLACE FUNCTION public.enroll_student(p_student_id UUID, p_course_id TEXT)
RETURNS VOID AS $$
DECLARE
    v_current INTEGER;
    v_max INTEGER;
BEGIN
    IF EXISTS (SELECT 1 FROM public.enrollments WHERE student_id = p_student_id AND course_id = p_course_id AND status = 'enrolled') THEN
        RAISE EXCEPTION 'Already enrolled in this course';
    END IF;

    SELECT current_enrollment, max_capacity INTO v_current, v_max
    FROM public.courses
    WHERE id = p_course_id
    FOR UPDATE;

    IF v_max IS NULL THEN RAISE EXCEPTION 'Course not found'; END IF;
    IF v_current >= v_max THEN RAISE EXCEPTION 'Course is full'; END IF;

    INSERT INTO public.enrollments (student_id, course_id, status) VALUES (p_student_id, p_course_id, 'enrolled');
    UPDATE public.courses SET current_enrollment = current_enrollment + 1 WHERE id = p_course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
