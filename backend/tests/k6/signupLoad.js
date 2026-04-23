import http from 'k6/http';
import { check, sleep } from 'k6';
import exec from 'k6/execution';

export const options = {
    stages: [
        { duration: '5s', target: 50 },
        { duration: '20s', target: 50 },
        { duration: '5s', target: 0 },
    ],
};

export default function () {
    const uniqueId = `${exec.vu.idInTest}-${Date.now()}`;
    const payload = JSON.stringify({
        name: `testuser_${uniqueId}`,
        email: `test${uniqueId}@financeclone.com`,
        password: 'SecurePassword123!',
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post('http://localhost:3002/api/auth/signup', payload, params);

    check(res, {
        'signup successful (status 201 or 200)': (r) => r.status === 201 || r.status === 200,
        'response time < 500ms': (r) => r.timings.duration < 500,
    });

    sleep(1);
}