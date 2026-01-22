
import { supabase } from './src/supabaseClient.js';

async function verifyHeroLogic() {
    console.log('Fetching cars...');
    const { data, error } = await supabase
        .from('cars')
        .select('*');

    if (error) {
        console.error('Error fetching cars:', error);
        return;
    }

    if (data && data.length > 0) {
        console.log(`Fetched ${data.length} cars.`);

        // Shuffle array and pick 3
        const shuffled = data.sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 3);

        console.log('Selected 3 random cars:');
        selected.forEach(car => {
            console.log(`- ${car.CarName} (${car.Millage} km) - ${car.Price}`);
        });

        // Verify mapping logic
        const formattedSlides = selected.map(car => ({
            image: car.CPic || "fallback",
            title: car.CarName || "Unknown Car",
            description: car.Description ? (car.Description.length > 20 ? car.Description.substring(0, 20) + "..." : car.Description) : "No desc",
            mileage: car.Millage ? `${car.Millage} km` : "N/A",
            transmission: "Automatic",
            price: car.Price ? `Ksh.${car.Price.toLocaleString()}` : "Price On Request"
        }));

        console.log('Formatted Slides:', JSON.stringify(formattedSlides, null, 2));

    } else {
        console.log('No cars found in database.');
    }
}

verifyHeroLogic();
