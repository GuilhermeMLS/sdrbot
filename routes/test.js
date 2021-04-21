const sdrbot = require('./sdrbot')

sdrbot({
    domain: 'stone.com.br'
})
    .then(function (data) {
        console.log(data)
    })