'use client'

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { mvgApi } from '../mvg-api';

export default function CallbackPage() {
    const router = useRouter();

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const session_state = urlParams.get('session_state');

        if (code && session_state) {
            mvgApi.processOauthCallback(session_state, code).then(({data}) => {
                localStorage.setItem('token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
                router.push('/');
            });
        }
    }, [router]);

    return <div>Loading...</div>;
}