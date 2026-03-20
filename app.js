const FIELDS = ['strength', 'walking', 'rise', 'stairs', 'falls'];

const RISK_LEVELS = [
  {
    min: 0,
    max: 0,
    label: 'Low',
    cssClass: 'low-risk',
    color: 'var(--primary-teal)',
    barColor: '#008080',
    message:
      'Your results suggest a low current risk for sarcopenia. ' +
      'Now is the perfect time to focus on strength training to maintain ' +
      'your bone density and joint health for the long term.',
  },
  {
    min: 1,
    max: 3,
    label: 'Moderate',
    cssClass: 'moderate-risk',
    color: 'var(--moderate-amber)',
    barColor: '#CC7722',
    message:
      'Your score indicates some early risk factors for sarcopenia. ' +
      'Incorporating consistent resistance training and adequate protein intake ' +
      'now can meaningfully slow muscle loss and protect your mobility.',
  },
  {
    min: 4,
    max: 10,
    label: 'High',
    cssClass: 'high-risk',
    color: 'var(--muted-red)',
    barColor: '#B22222',
    message:
      'A score of 4 or higher is a clinical indicator of sarcopenia risk. ' +
      'This suggests you may be losing muscle mass faster than is optimal for your age. ' +
      'Let\u2019s build a safe, science-based plan to reverse this decline.',
  },
];

function getRiskLevel(score) {
  return RISK_LEVELS.find(({ min, max }) => score >= min && score <= max);
}

function calculateRisk() {
  const score = FIELDS.reduce(
    (sum, id) => sum + parseInt(document.getElementById(id).value, 10),
    0
  );

  const risk = getRiskLevel(score);
  const resultArea = document.getElementById('result-area');
  const title = document.getElementById('result-title');
  const text = document.getElementById('result-text');
  const bar = document.getElementById('score-bar');

  resultArea.className = risk.cssClass;
  resultArea.style.display = 'block';

  title.textContent = `Risk Level: ${risk.label} \u2014 Score ${score} / 10`;
  title.style.color = risk.color;

  text.textContent = risk.message;

  bar.style.width = `${score * 10}%`;
  bar.style.backgroundColor = risk.barColor;

  resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetForm() {
  document.getElementById('sarc-form').reset();
  const resultArea = document.getElementById('result-area');
  resultArea.style.display = 'none';
  resultArea.className = '';
  document.getElementById('score-bar').style.width = '0%';
}

function openFeedbackModal() {
  document.getElementById('feedback-modal').style.display = 'flex';
  document.getElementById('feedback-text').focus();
}

function closeFeedbackModal() {
  document.getElementById('feedback-modal').style.display = 'none';
  document.getElementById('feedback-text').value = '';
  document.getElementById('feedback-thanks').style.display = 'none';
  document.getElementById('feedback-form-area').style.display = 'block';
}

function submitFeedback() {
  const text = document.getElementById('feedback-text').value.trim();
  if (!text) return;
  const subject = encodeURIComponent('Sarcopenia App Feedback');
  const body = encodeURIComponent(text);
  window.open('mailto:YOUR_EMAIL@example.com?subject=' + subject + '&body=' + body);
  document.getElementById('feedback-form-area').style.display = 'none';
  document.getElementById('feedback-thanks').style.display = 'block';
}

function init() {
  document.getElementById('calculate-btn').addEventListener('click', calculateRisk);
  document.getElementById('reset-btn').addEventListener('click', resetForm);
  document.getElementById('feedback-btn').addEventListener('click', openFeedbackModal);
  document.getElementById('close-feedback-btn').addEventListener('click', closeFeedbackModal);
  document.getElementById('submit-feedback-btn').addEventListener('click', submitFeedback);
}

if (typeof module === 'undefined') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  module.exports = {
    FIELDS,
    RISK_LEVELS,
    getRiskLevel,
    calculateRisk,
    resetForm,
    openFeedbackModal,
    closeFeedbackModal,
    submitFeedback,
    init,
  };
}
