-- We skip creating the bucket since you already created 'scalpel' manually.
-- Focusing only on permissions/policies now.

-- NOTE: If this script fails with permission errors, please use the Supabase Dashboard:
-- Go to Storage > Policies > 'scalpel' bucket > New Policy.

-- 1. Create policies for the 'scalpel' bucket
-- We generally cannot run ALTER TABLE on storage.objects without superuser, 
-- but we should be able to manage policies if we are the project owner.

DO $$
BEGIN
    -- Allow public read access (anyone can view images)
    DROP POLICY IF EXISTS "Public Access" ON storage.objects;
    CREATE POLICY "Public Access" 
    ON storage.objects FOR SELECT 
    USING ( bucket_id = 'scalpel' );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create Public Access policy: %', SQLERRM;
END $$;

DO $$
BEGIN
    -- Allow authenticated users (like admin) to upload files
    DROP POLICY IF EXISTS "Authenticated Insert" ON storage.objects;
    CREATE POLICY "Authenticated Insert" 
    ON storage.objects FOR INSERT 
    TO authenticated 
    WITH CHECK ( bucket_id = 'scalpel' );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create Authenticated Insert policy: %', SQLERRM;
END $$;

DO $$
BEGIN
    -- Allow authenticated users to update their files
    DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
    CREATE POLICY "Authenticated Update" 
    ON storage.objects FOR UPDATE 
    TO authenticated 
    USING ( bucket_id = 'scalpel' );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create Authenticated Update policy: %', SQLERRM;
END $$;

DO $$
BEGIN
    -- Allow authenticated users to delete their files
    DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
    CREATE POLICY "Authenticated Delete" 
    ON storage.objects FOR DELETE 
    TO authenticated 
    USING ( bucket_id = 'scalpel' );
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Could not create Authenticated Delete policy: %', SQLERRM;
END $$;

-- 4. Ensure Table Permissions (Just in case)
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Events" ON public.events;
DROP POLICY IF EXISTS "Public Read Blogs" ON public.blogs;
DROP POLICY IF EXISTS "Admin Full Access Events" ON public.events;
DROP POLICY IF EXISTS "Admin Full Access Blogs" ON public.blogs;

CREATE POLICY "Public Read Events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Public Read Blogs" ON public.blogs FOR SELECT USING (true);

-- Give full access to authenticated users for table rows
CREATE POLICY "Admin Full Access Events" ON public.events FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin Full Access Blogs" ON public.blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);
