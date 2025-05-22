
-- Create a function to add group members directly, bypassing RLS policies
CREATE OR REPLACE FUNCTION public.add_group_member(
  p_group_id UUID,
  p_user_id UUID,
  p_role TEXT DEFAULT 'member',
  p_status TEXT DEFAULT 'active'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.group_members (group_id, user_id, role, status)
  VALUES (p_group_id, p_user_id, p_role::group_member_role, p_status::group_member_status);
EXCEPTION 
  WHEN unique_violation THEN
    -- If the record already exists, just continue
    RAISE NOTICE 'Member already exists in group';
  WHEN others THEN
    -- Re-raise any other errors
    RAISE;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.add_group_member TO authenticated;
