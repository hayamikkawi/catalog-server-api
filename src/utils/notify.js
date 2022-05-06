const request = require('request')

const notify = (id, changes) => {
    return new Promise((resolve, reject) => {
        const replicas = process.env.REP_IP.split(', ')
        replicas.forEach(ip => {
            const url = 'http://' + ip + ':3000/notify/books/' + id
            console.log(url)
            request({ url, json: true, method: "PATCH", body: changes }, (error, res) => {
                if (error) {
                    return reject(error)
                } if (res.statusCode == 404 || res.statusCode == 400) {
                    return reject(res.body)
                }
                return resolve(res.body)
            })
        });
    })
}
module.exports = notify
