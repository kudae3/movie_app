import { useCallback, useEffect, useState } from "react";

export const useFetch = <T>(fetchFunction: () => Promise<T>, autoFetch = true) => {
    
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    
    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const result = await fetchFunction();
            setData(result);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An Error Occoured'));
        } finally {
            setLoading(false);
        }
    }, [fetchFunction]);
    
    const reset = () => {
        setData(null)
        setLoading(false)
        setError(null)
    }

    useEffect(()=> {
        if(autoFetch){
            fetchData();
        }
    }, [autoFetch, fetchData])

    return { data, loading, error, fetchData, reset };
    
}

// Without useCallback
// fetchData function is created at momory 001
// Since this is first render, useEffect runs
// state changes , loading -> true
// Re-render occurs
// fetchData function is created at memory 002
// useEffect dependency array sees fetchData as changed (001 != 002)
// useEffect runs again
// Infinite loop occurs

// with useCallback
// fetchData function is created at memory 001
// Since this is first render, useEffect runs
// state changes , loading -> true
// Re-render occurs
// fetchData function is still at memory 001
// useEffect dependency array sees fetchData as unchanged (001 == 001)
// useEffect does not run again