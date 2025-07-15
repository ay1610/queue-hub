export interface RuntimeData {
  tconst: string;
  title_type: string | null;
  primary_title: string | null;
  runtime_minutes: number | null;
}

export interface RuntimeAPIResponse {
  data: RuntimeData;
  timestamp: string;
}

export interface RuntimeAPIErrorResponse {
  error: string;
  code: string;
  timestamp: string;
}
