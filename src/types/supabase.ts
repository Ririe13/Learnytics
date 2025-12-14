export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: number
                    display_name: string | null
                    name: string | null
                    email: string
                    created_at: string
                    deleted_at: string | null
                }
                Insert: {
                    id?: number
                    display_name?: string | null
                    name?: string | null
                    email: string
                    created_at?: string
                    deleted_at?: string | null
                }
                Update: {
                    id?: number
                    display_name?: string | null
                    name?: string | null
                    email?: string
                    created_at?: string
                    deleted_at?: string | null
                }
            }
            developer_journey_submissions: {
                Row: {
                    id: number
                    submitter_id: number
                    journey_id: number
                    quiz_id: number | null
                    rating: number | null
                    status: number | null
                    submission_duration: number | null
                    created_at: string
                }
                Insert: {
                    id?: number
                    submitter_id: number
                    journey_id: number
                    quiz_id?: number | null
                    rating?: number | null
                    status?: number | null
                    submission_duration?: number | null
                    created_at?: string
                }
                Update: {
                    id?: number
                    submitter_id?: number
                    journey_id?: number
                    quiz_id?: number | null
                    rating?: number | null
                    status?: number | null
                    submission_duration?: number | null
                    created_at?: string
                }
            }
            developer_journeys: {
                Row: {
                    id: number
                    name: string
                    created_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    created_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    created_at?: string
                }
            }
            developer_journey_tutorials: {
                Row: {
                    id: number
                    title: string
                    journey_id: number
                    created_at: string
                }
                Insert: {
                    id?: number
                    title: string
                    journey_id: number
                    created_at?: string
                }
                Update: {
                    id?: number
                    title?: string
                    journey_id?: number
                    created_at?: string
                }
            }
            developer_journey_completions: {
                Row: {
                    id: number
                    user_id: number
                    journey_id: number
                    created_at: string
                }
                Insert: {
                    id?: number
                    user_id: number
                    journey_id: number
                    created_at?: string
                }
                Update: {
                    id?: number
                    user_id?: number
                    journey_id?: number
                    created_at?: string
                }
            }
        }
        Views: {
            student_learning_records: {
                Row: {
                    student_id: string
                    student_name: string
                    cohort: string
                    module: string
                    date: string
                    score: number
                    duration_minutes: number
                    completed: boolean
                }
            }
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
