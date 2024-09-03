'use client';

import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Callback() {
    const router = useRouter();

    useEffect(() => {
        const { code, session_state } = router.query;

        if (code) {
            fetch(`https://api.aperol.life/auth/callback?code=${code}&session_state=${session_state}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => response.json())
                .then(data => {
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('refresh_token', data.refresh_token);
                    router.push('/');
                })
                .catch(error => {
                    console.error('Error fetching tokens:', error);
                });
        }
    }, [router.query]);

    return <div>Loading...</div>;
}