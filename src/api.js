


const baseUrl = 'http://xs.jldg.com:8002/api/v1';


async function getMaterial(batchNumber) {
    const url = `${baseUrl}/materials/${batchNumber}`;
    const resp = await fetch(url);
    if (resp.ok) {
        return resp.json();
    }
    return null;
}


async function createScanRecord(scanRecords) {
    console.log(scanRecords)
    const url = `${baseUrl}/scan-records`;
    const resp = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(scanRecords)
    });
    if (resp.status === 200) {
        return resp.json();
    }
    return null;
}


export const api = {
    getMaterial,
    createScanRecord
}