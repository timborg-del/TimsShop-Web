import { useState, useEffect } from 'react';

const useFetchData = <T,>(url: string) => {
    const [data, setData] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Failed to fetch data: ${errorText}`);
                }
                const result: T = await response.json();
                console.log('Fetched data:', result); // Log the fetched data
                setData(result);
            } catch (error) {
                console.error('Error fetching data:', error); // Log detailed error
                setError(error as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [url]);

    return { data, isLoading, error };
};

export default useFetchData;









