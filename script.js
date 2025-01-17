const descriptions = {
    modernIncompatibility: [
        "State-of-the-Art",
        "Slightly Incompatible",
        "Moderately Incompatible",
        "Substantially Incompatible",
        "Highly Incompatible"
    ],
    technologyObsolescence: [
        "Cutting-Edge",
        "Slightly Outdated",
        "Outdated",
        "Severely Outdated",
        "Legacy-Only"
    ],
    skillShortage: [
        "Widely Available",
        "Somewhat Available",
        "Specialized",
        "Niche",
        "Obsolete"
    ],
    legacyVendorDependence: [
        "No Dependency",
        "Minimal Dependency",
        "Moderate Dependency",
        "Heavy Dependency",
        "Full Dependency"
    ],
    maintenanceEffort: [
        "Minimal Effort & Cost",
        "Low Effort & Cost",
        "Moderate Effort & Cost",
        "High Effort & Cost",
        "Extremely High Effort & Cost"
    ],
    securityVulnerabilities: [
        "Highly Secure",
        "Secure",
        "Moderately Vulnerable",
        "Vulnerable",
        "Highly Vulnerable"
    ],
    scalabilityLimitations: [
        "Excellent",
        "Good",
        "Moderate",
        "Limited",
        "Severely Limited"
    ]
};

const weights = {
    modernIncompatibility: 0.15,
    technologyObsolescence: 0.15,
    skillShortage: 0.15,
    legacyVendorDependence: 0.15,
    maintenanceEffort: 0.15,
    securityVulnerabilities: 0.15,
    scalabilityLimitations: 0.10
};

let chart;
const scores = {
    modernIncompatibility: 3,
    technologyObsolescence: 3,
    skillShortage: 3,
    legacyVendorDependence: 3,
    maintenanceEffort: 3,
    securityVulnerabilities: 3,
    scalabilityLimitations: 3
};

function calculateScore() {
    const rawScore = Object.entries(scores).reduce((acc, [key, value]) => {
        return acc + value * weights[key];
    }, 0);
    return (rawScore - 1) * 25;
}

function getScoreColor(score) {
    if (score >= 80) return '#dc2626';
    if (score >= 60) return '#eab308';
    return '#059669';
}

function getStatusDescription(score) {
    if (score >= 80) return 'Critical Legacy System - Requires immediate modernization';
    if (score >= 60) return 'Significant Technical Debt - Strategic improvements needed';
    if (score >= 40) return 'Moderate Complexity - Regular maintenance required';
    return 'Healthy System - Well maintained and documented';
}

function updateChart() {
    const score = calculateScore();
    const color = getScoreColor(score);
    
    document.querySelector('.score-value').textContent = `${Math.round(score)}%`;
    document.querySelector('.score-value').style.color = color;
    document.getElementById('statusDescription').textContent = getStatusDescription(score);
    
    chart.data.datasets[0].data = [score, 100 - score];
    chart.data.datasets[0].backgroundColor = [color, '#e5e7eb'];
    chart.update();
}

function initializeChart() {
    const ctx = document.getElementById('scoreChart').getContext('2d');
    chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [75, 25],
                backgroundColor: ['#eab308', '#e5e7eb'],
                borderWidth: 0,
                circumference: 180,
                rotation: 270,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            cutout: '75%'
        }
    });
}

function initializeSliders() {
    const sliders = document.querySelectorAll('input[type="range"]');
    sliders.forEach(slider => {
        const key = slider.dataset.key;
        const descriptionEl = slider.closest('.score-input').querySelector('.state-description');
        
        descriptionEl.textContent = descriptions[key][slider.value - 1];
        
        slider.addEventListener('input', (e) => {
            scores[key] = parseInt(e.target.value);
            descriptionEl.textContent = descriptions[key][e.target.value - 1];
            updateChart();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initializeChart();
    initializeSliders();
    updateChart();
});