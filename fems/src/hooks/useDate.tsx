import { useEffect, useState } from 'react';

export const useDate = () => {
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(
            new Date().toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            })
        );
    }, []);

    return date;
};
