'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function CallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const session_state = urlParams.get('session_state');

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
    }, []);

    return <div>Loading...</div>;
}