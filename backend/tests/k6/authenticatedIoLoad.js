import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    stages: [
        { duration: '10s', target: 50 }, 
        { duration: '30s', target: 50 }, 
        { duration: '10s', target: 0 },  
    ],
};

// export function setup() {
//     // Requires a pre-existing user in your local database
//     const loginPayload = JSON.stringify({
//         email: 'testuser@financeclone.com', 
//         password: 'SecurePassword123!'
//     });
//     const params = { headers: { 'Content-Type': 'application/json' } };
//     const res = http.post('http://localhost:3002/api/auth/login', loginPayload, params);
    
//     return { token: res.status === 200 ? res.json('token') : '' }; 
// }

export function setup() {
    // Generate a unique user every time the test runs to avoid "User already exists" errors
    const uniqueId = Date.now();
    const payload = JSON.stringify({
        name: `IO Test User ${uniqueId}`, 
        email: `iotest${uniqueId}@financeclone.com`, 
        password: 'SecurePassword123!'
    });

    const params = { headers: { 'Content-Type': 'application/json' } };
    
    // Hit the SIGNUP route instead of login. 
    // Your authController returns the token immediately on signup!
    const res = http.post('http://localhost:3002/api/auth/signup', payload, params);
    
    if (res.status === 201 || res.status === 200) {
        return { token: res.json('token') };
    } else {
        console.error(`Setup failed! Status: ${res.status}. Body: ${res.body}`);
        return { token: '' };
    }
}

export default function (data) {
    if (!data.token) {
        console.error('No token received in setup');
        return;
    }

    const params = {
        headers: {
            'Authorization': `Bearer ${data.token}`,
            'Content-Type': 'application/json',
        },
    };

    // Hitting a fast I/O route to check pure server/database read speed
    const res = http.get('http://localhost:3002/api/auth/profile', params); 

    check(res, {
        'profile fetch successful (200)': (r) => r.status === 200,
        'response time < 100ms': (r) => r.timings.duration < 100, 
    });

    sleep(1);
}