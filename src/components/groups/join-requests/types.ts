
export interface JoinRequest {
  id: string;
  user_id: string;
  status: string;
  request_message?: string;
  created_at: string;
  profile?: {
    first_name: string;
    last_name: string;
    avatar_url?: string;
  }
}
