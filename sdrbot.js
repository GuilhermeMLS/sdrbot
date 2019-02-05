const puppeteer = require('puppeteer');
const fs = require("fs");
const axios = require('axios');
var json2xls = require('json2xls');

exports.sdrmain = (async function main (callback) {
    try {
        const browser = await puppeteer.launch({ headless : true });
        const page = await browser.newPage();

        await page.goto('https://registro.br/2/whois');
        await page.waitForSelector('#whois');

        await page.type('#whois', process.argv[2]);

        const button = await page.$('#captchaBtn');
        button.click();

        await page.waitForSelector('#whois-output-new');

        const cnpj = await page.evaluate(() => document.querySelector('a[href^="/2/whois"]').innerText);
        
        var test = cnpj.match(/\d/g);
        test = test.join("");

        var info = axios.get('http://receitaws.com.br/v1/cnpj/'+test)
        .then(function (response) {

            var qsa = {
                'Quadro societáiro' : response.data.qsa
            }

            console.log('Nome da empresa: '+response.data.nome);
            console.log('Atividade principal: '+response.data.atividade_principal[0].text);
            console.log('Código da atividade: '+response.data.atividade_principal[0].code);
            console.log('CNPJ: '+response.data.cnpj);
            console.log('Capital Social: '+response.data.capital_social);
            console.log('Telefone: '+response.data.telefone);
            console.log('E-mail: '+response.data.email);

            response.data.qsa.forEach(function (item) {
                
                (async function main2() {
                    try {
                        const browser2 = await puppeteer.launch({ headless : true });
                        const page2 = await browser2.newPage();

                        await page2.goto('https://brasil.io/dataset/socios-brasil/socios?search='+item.nome);
                        await page2.waitForSelector('#socios-brasil');
                        
                        var odds = await page2.evaluate(() => document.querySelectorAll('.odd').length);
                        var evens = await page2.evaluate(() => document.querySelectorAll('.even').length);

                        var num_cnpjs = odds + evens;

                        console.log('---Sócio---');
                        console.log('Cargo: '+item.qual);
                        console.log('Nome: '+item.nome);
                        console.log('Número de CNPJs: '+num_cnpjs);
                        
                        await browser2.close();
                    } catch (e) {
                        console.log('Consulta brasil.io error : ', e);
                    }
                })();
            });
        })
        .catch(err=>console.log(err));
    await browser.close();
    } catch (e) {
        console.log('our error: ', e);
    }

    callback('Friedrich Nietzsche');
})();
