// Httpリクエストを送信する。
exports.sendHttpRequest = async(url, method, headers, bodyData) => {
    console.log('sendHttpRequest');
    console.log('url:' + url);
    console.log('method:' + method);
    console.log('headers:' + JSON.stringify(headers));
    console.log('body:' + bodyData);
    const https = require('https');
    const options = {
        method: method,
        headers: headers
    };
    
    return new Promise((resolve, reject) => {
        let req = https.request(url, options, (res) => {
            console.log('responseStatusCode:' + res.statusCode);
            console.log('responseHeaders:' + JSON.stringify(res.headers));
            res.setEncoding('utf8');
            let body = '';
            res.on('data', (chunk) => {
                body += chunk;
                console.log('responseBody:' + chunk);
            });
            res.on('end', () => {
                console.log('No more data in response.');
                resolve(body);
            });
        }).on('error', (e) => {
            console.log('problem with request:' + e.message);
            reject(e);
        });

        if (bodyData && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
            if (typeof bodyData === 'object') {
                bodyData = JSON.stringify(bodyData);
                req.write(bodyData);
            }
        }
        req.end();
    });
}