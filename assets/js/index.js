let input = document.querySelector('input');
let value_money = document.getElementById('value_money');
let select = document.querySelector('select');
let div_graph = document.getElementById('div_graph');

let list_money = [["uf"],["dolar"],["euro"],["utm"],["bitcoin"]];

async function getMoneyChanges() {
    try {
        const res = await fetch("https://mindicador.cl/api");
        const data = await res.json();
        list_money[0].push(Number(data.uf.valor));
        list_money[1].push(Number(data.dolar.valor));
        list_money[2].push(Number(data.euro.valor));
        list_money[3].push(Number(data.utm.valor));
        list_money[4].push(Number(data.bitcoin.valor));
    } catch(e) {
        alert(e.message);
    }
    
}

getMoneyChanges();

let text = `<option value = "Seleccione moneda" class="text-center">Seleccione moneda</option>`;

for (i=1; i<=5; i++) {
    text += `<option value = ${i-1} class="text-center">${list_money[i-1]}</option>`;
}

select.innerHTML = text;

function moneyConvert() {
    if (select.value == "Seleccione moneda") {
        value_money.innerHTML = "...";
    } else {
        value_money.innerHTML = Number(input.value/list_money[select.value][1]).toFixed(2) + " " + list_money[select.value][0];
    }
    div_graph.innerHTML = `<canvas id="myChart"></canvas>`;
    getMoneyDays();    
}

let data2_ten = [];
let data2_days = [];

async function getMoneyDays() {
    try {
        const res2 = await fetch("https://mindicador.cl/api/"+list_money[select.value][0]);
        const data2 = await res2.json();
    
        for (i=1 ; i<=10; i++) {
            data2_ten.push(Number(data2.serie[i-1].valor));
            data2_days.push(data2.serie[i-1].fecha.split("T")[0].replace("2022-",""));
        }
    
        renderGraph();
    } catch(e) {
        alert(e.message);
    }    
}

function renderGraph() {
    const myChart = document.getElementById('myChart');
    new Chart(myChart, {
        type: 'line',
        data: {
            labels: data2_days.reverse(),
            datasets: [{
                label: 'Historial últimos 10 días',
                data: data2_ten.reverse(),
                borderWidth: 2
                }]
            },
        options: {
            scales: {
                y: {
                beginAtZero: false
                }
                }
            }
        })
    data2_ten = [];
    data2_days = [];
}