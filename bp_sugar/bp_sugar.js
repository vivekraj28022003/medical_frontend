


const ctx = document.getElementById('health-chart').getContext('2d');
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Blood Pressure (Systolic)',
            data: [],
            borderColor: '#e74c3c',
            tension: 0.1
        },
        {
            label: 'Blood Sugar',
            data: [],
            borderColor: '#3498db',
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

document.getElementById('healthForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const systolic = parseInt(document.getElementById('systolic').value);
    const diastolic = parseInt(document.getElementById('diastolic').value);
    const sugar = parseInt(document.getElementById('sugar').value);
    sessionStorage.setItem("systolic", systolic)
    sessionStorage.setItem("diastolic", diastolic)
    sessionStorage.setItem("sugar", sugar)


   


    updateReadings(systolic, diastolic, sugar);
    updateChart(systolic, sugar);
    updateHealthSummary(systolic, diastolic, sugar);
});

function updateReadings(systolic, diastolic, sugar) {
    document.getElementById('bp-value').textContent = `${systolic}/${diastolic}`;
    document.getElementById('sugar-value').textContent = sugar;
    updateBPStatus(systolic, diastolic);
    updateSugarStatus(sugar);
} sessionStorage.setItem("sugar", sugar)

function updateBPStatus(systolic, diastolic) {
    const statusDot = document.getElementById('bp-status');
    const statusText = document.getElementById('bp-status-text');

    if (systolic >= 140 || diastolic >= 90) {
        statusDot.className = 'status-dot danger';
        statusText.textContent = 'High - Consult Doctor';
    } else if (systolic >= 130 || diastolic >= 80) {
        statusDot.className = 'status-dot warning';
        statusText.textContent = 'Elevated';
    } else {
        statusDot.className = 'status-dot normal';
        statusText.textContent = 'Normal';
    }
}

function updateSugarStatus(sugar) {
    const statusDot = document.getElementById('sugar-status');
    const statusText = document.getElementById('sugar-status-text');

    if (sugar >= 126) {
        statusDot.className = 'status-dot danger';
        statusText.textContent = 'High - Consult Doctor';
    } else if (sugar >= 100) {
        statusDot.className = 'status-dot warning';
        statusText.textContent = 'Borderline';
    } else {
        statusDot.className = 'status-dot normal';
        statusText.textContent = 'Normal';
    }
}

function updateChart(systolic, sugar) {
    const time = new Date().toLocaleTimeString();

    if (chart.data.datasets[0].data.length >= 10) {
        chart.data.labels.shift();
        chart.data.datasets.forEach(dataset => dataset.data.shift());
    }

    chart.data.labels.push(time);
    chart.data.datasets[0].data.push(systolic);
    chart.data.datasets[1].data.push(sugar);
    chart.update();
}

function updateHealthSummary(systolic, diastolic, sugar) {
    const summaryElement = document.getElementById('healthSummary');
    const bpStatus = getBPStatus(systolic, diastolic);
    const sugarStatus = getSugarStatus(sugar);

    let message = '';
    let statusClass = 'good';

    if (bpStatus === 'danger' || sugarStatus === 'danger') {
        statusClass = 'danger-summary';
        message = '⚠️ Critical levels detected! Please consult a doctor immediately.';
    } else if (bpStatus === 'warning' || sugarStatus === 'warning') {
        statusClass = 'warning-summary';
        message = '⚠️ Elevated levels detected. Monitor closely and consider consulting a healthcare professional.';
    } else {
        message = '✅ Your health levels are within normal range. Keep maintaining healthy habits!';
    }

    summaryElement.className = `health-summary ${statusClass}`;
    summaryElement.textContent = message;
}

function getBPStatus(systolic, diastolic) {
    if (systolic >= 140 || diastolic >= 90) return 'danger';
    if (systolic >= 130 || diastolic >= 80) return 'warning';
    return 'normal';
}

function getSugarStatus(sugar) {
    if (sugar >= 126) return 'danger';
    if (sugar >= 100) return 'warning';
    return 'normal';
}
