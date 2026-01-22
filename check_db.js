
import { supabase } from './src/supabaseClient.js';
import fs from 'fs';

async function checkTables() {
    const { data, error } = await supabase
        .from('cars')
        .select('*')
        .limit(1);

    if (error) {
        fs.writeFileSync('db_schema.json', JSON.stringify({ error: error.message }));
    } else {
        if (data.length > 0) {
            fs.writeFileSync('db_schema.json', JSON.stringify({
                columns: Object.keys(data[0]),
                sample: data[0]
            }, null, 2));
        } else {
            fs.writeFileSync('db_schema.json', JSON.stringify({ message: 'Table "cars" is empty.' }));
        }
    }
}

checkTables();
