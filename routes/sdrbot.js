const puppeteer = require('puppeteer');
const axios = require('axios');
const cheerio = require('cheerio')

async function getDomainCNPJ (domain) {
    const browser = await puppeteer.launch({ headless : true });
    const page = await browser.newPage();

    await page.goto('https://registro.br/2/whois');
    await page.waitForSelector('#whois');

    await page.type('#whois', domain);

    const button = await page.$('#captchaBtn');
    button.click();

    await page.waitForSelector('#whois-output-new');

    const cnpj = await page.evaluate(() => document.querySelector('a[href^="/2/whois"]').innerText);

    await browser.close()

    return cnpj.replace(/\D/g, '')
}

async function getCompanyData (cnpj) {
    const { data } = await axios.get(`http://receitaws.com.br/v1/cnpj/${cnpj}`)
    const promises = data.qsa.map(async obj => {
        const countCNPJ = await getPartnerCNPJCount(obj.nome)
        return {
            ...obj,
            count_cnpj: countCNPJ
        }
    })

    return {
        name: data.nome,
        main_activity: data.atividade_principal[0].text,
        code_activity: data.atividade_principal[0].code,
        cnpj: data.cnpj,
        social_capital: data.capital_social,
        phone: data.telefone,
        email: data.email,
        qsa: await Promise.all(promises)
    }
}

async function getPartnerCNPJCount (name) {
    const { data } = await axios.get(`https://brasil.io/dataset/socios-brasil/socios`, {
        params: { search: name }
    })
    const $ = cheerio.load(data)
    return $('#socios-brasil tbody tr').length
}

async function main ({ domain }) {
    const cnpj = await getDomainCNPJ(domain)
    return getCompanyData(cnpj)
};

module.exports = main
