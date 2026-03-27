const http = require('http');

const TOKEN = 'e73f6e9b537d65bd33abd231b0d4bd039e7ea5ffd1853ae8169175c118c3e5c9';
const BASE = 'localhost';
const PORT = 5000;

let createdWorkspaceId = null;

function request(method, path, body) {
    return new Promise((resolve) => {
        const data = body ? JSON.stringify(body) : null;
        const options = {
            hostname: BASE,
            port: PORT,
            path,
            method,
            headers: {
                'Authorization': `Bearer ${TOKEN}`,
                'Content-Type': 'application/json',
                ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
            }
        };
        const req = http.request(options, (res) => {
            let raw = '';
            res.on('data', chunk => raw += chunk);
            res.on('end', () => {
                try { resolve({ status: res.statusCode, body: JSON.parse(raw) }); }
                catch { resolve({ status: res.statusCode, body: raw }); }
            });
        });
        req.on('error', e => resolve({ status: 'ERROR', body: e.message }));
        if (data) req.write(data);
        req.end();
    });
}

function print(label, res) {
    const icon = res.status >= 200 && res.status < 300 ? '✅' : '❌';
    console.log(`\n${icon} ${label}`);
    console.log(`   Status : ${res.status}`);
    console.log(`   Body   : ${JSON.stringify(res.body, null, 2).split('\n').join('\n             ')}`);
}

async function run() {
    console.log('='.repeat(60));
    console.log('   WORKSPACE API TEST SUITE');
    console.log('='.repeat(60));

    // 1. GET all workspaces
    const r1 = await request('GET', '/api/workspaces');
    print('1. GET /api/workspaces  (Read All)', r1);

    // 2. POST create workspace
    const uniqueName = `Test Workspace ${Date.now()}`;
    const r2 = await request('POST', '/api/workspaces', { name: uniqueName, description: 'Created by API test' });
    print('2. POST /api/workspaces  (Create)', r2);
    createdWorkspaceId = r2.body?.data?.id;
    console.log(`   → Workspace ID: ${createdWorkspaceId}`);

    if (!createdWorkspaceId) {
        console.log('\n⛔ Cannot continue without a workspace ID. Stopping.\n');
        process.exit(1);
    }

    // 3. GET single workspace
    const r3 = await request('GET', `/api/workspaces/${createdWorkspaceId}`);
    print('3. GET /api/workspaces/:id  (Read One)', r3);

    // 4. PUT update workspace
    const r4 = await request('PUT', `/api/workspaces/${createdWorkspaceId}`, { name: `Updated ${Date.now()}`, description: 'Updated description' });
    print('4. PUT /api/workspaces/:id  (Update)', r4);

    // 5. POST add member (use ownerId itself for a no-op add)
    const ownerId = r3.body?.data?.owner;
    const r5 = await request('POST', `/api/workspaces/${createdWorkspaceId}/members`, { members: [ownerId] });
    print('5. POST /api/workspaces/:id/members  (Add Member)', r5);

    // 6. DELETE remove member
    const r6 = await request('DELETE', `/api/workspaces/${createdWorkspaceId}/members`, { members: [ownerId] });
    print('6. DELETE /api/workspaces/:id/members  (Remove Member)', r6);

    // 7. DELETE workspace
    const r7 = await request('DELETE', `/api/workspaces/${createdWorkspaceId}`);
    print('7. DELETE /api/workspaces/:id  (Delete)', r7);

    console.log('\n' + '='.repeat(60));
    console.log('   TEST SUITE COMPLETE');
    console.log('='.repeat(60) + '\n');
}

run();
