import { createClient } from '@supabase/supabase-js';

// Masukkan URL dan Key kamu di sini
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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