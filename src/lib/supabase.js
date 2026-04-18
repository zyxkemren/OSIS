import { createClient } from '@supabase/supabase-js';

// Masukkan URL dan Key kamu di sini
const supabaseUrl = "https://lbldvehebgtdpggepnvs.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxibGR2ZWhlYmd0ZHBnZ2VwbnZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0NTY0MjAsImV4cCI6MjA4OTAzMjQyMH0.xyhMnKSXguVODzwFq8yIKl73ofNhjMd-RvyhAaercMY";

// Inisialisasi Supabase (pengganti app Firebase)
export const supabase = createClient(supabaseUrl, supabaseKey);

// --- PENGGANTI FIRESTORE ---

// Update data (Menggunakan upsert agar strukturnya masuk ke tabel SQL kita)
export const addData = async (col, payload) => {
    try {
        const { error } = await supabase
            .from('app_data')
            .upsert({ collection_name: col, data: payload }); // upsert = update if exists, insert if not

        if (error) throw error;
        return { success: true };
    } catch (e) {
        console.error("Error saving document: ", e);
        return { success: false, error: e };
    }
};

// Read data (Mengambil data JSON dari tabel app_data)
export const getData = async (col) => {
    try {
        const { data, error } = await supabase
            .from('app_data')
            .select('data')
            .eq('collection_name', col)
            .single(); // Ambil 1 baris saja

        if (error) {
            // Jika data belum ada di database, kembalikan format default agar map() di UI tidak error
            return col === 'cabinet' || col === 'prokers' ? { items: [] } : {};
        }

        return data.data; // Mengembalikan object JSON aslinya
    } catch (e) {
        console.error("Error fetching: ", e);
        return col === 'cabinet' || col === 'prokers' ? { items: [] } : {};
    }
};