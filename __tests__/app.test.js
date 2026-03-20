'use strict';

const MINIMAL_HTML = `
<form id="sarc-form">
  <select id="strength"><option value="0" selected>None</option><option value="1">Some</option><option value="2">A lot</option></select>
  <select id="walking"><option value="0" selected>None</option><option value="1">Some</option><option value="2">A lot</option></select>
  <select id="rise"><option value="0" selected>None</option><option value="1">Some</option><option value="2">A lot</option></select>
  <select id="stairs"><option value="0" selected>None</option><option value="1">Some</option><option value="2">A lot</option></select>
  <select id="falls"><option value="0" selected>None</option><option value="1">1-3</option><option value="2">4+</option></select>
  <button type="button" id="calculate-btn">Calculate</button>
  <button type="button" id="reset-btn">Reset</button>
  <button type="button" id="feedback-btn">Give Feedback</button>
</form>
<div id="result-area" style="display:none">
  <h3 id="result-title"></h3>
  <div id="score-bar" style="width:0%"></div>
  <p id="result-text"></p>
</div>
<div id="feedback-modal" style="display:none">
  <div id="feedback-form-area" style="display:block">
    <label for="feedback-text">Feedback</label>
    <textarea id="feedback-text"></textarea>
    <button type="button" id="submit-feedback-btn">Send Feedback</button>
    <button type="button" id="close-feedback-btn">Cancel</button>
  </div>
  <div id="feedback-thanks" style="display:none"><p>Thank you!</p></div>
</div>
`;

let app;

beforeEach(() => {
  document.body.innerHTML = MINIMAL_HTML;
  Element.prototype.scrollIntoView = jest.fn();
  jest.resetModules();
  app = require('../app.js');
  app.init();
});

describe('getRiskLevel', () => {
  test('returns low risk for score 0', () => {
    expect(app.getRiskLevel(0).label).toBe('Low');
  });

  test('returns moderate risk for score 1', () => {
    expect(app.getRiskLevel(1).label).toBe('Moderate');
  });

  test('returns moderate risk for score 3', () => {
    expect(app.getRiskLevel(3).label).toBe('Moderate');
  });

  test('returns high risk for score 4', () => {
    expect(app.getRiskLevel(4).label).toBe('High');
  });

  test('returns high risk for score 10', () => {
    expect(app.getRiskLevel(10).label).toBe('High');
  });
});

describe('calculateRisk', () => {
  test('shows result area after calculation', () => {
    app.calculateRisk();
    expect(document.getElementById('result-area').style.display).toBe('block');
  });

  test('shows low risk when all selects are 0', () => {
    app.calculateRisk();
    expect(document.getElementById('result-title').textContent).toContain('Low');
  });

  test('shows high risk and full bar when all selects are 2', () => {
    ['strength', 'walking', 'rise', 'stairs', 'falls'].forEach(id => {
      document.getElementById(id).value = '2';
    });
    app.calculateRisk();
    expect(document.getElementById('result-title').textContent).toContain('High');
    expect(document.getElementById('score-bar').style.width).toBe('100%');
  });

  test('applies the correct CSS class to result area', () => {
    app.calculateRisk();
    expect(document.getElementById('result-area').className).toBe('low-risk');
  });
});

describe('resetForm', () => {
  test('hides result area', () => {
    app.calculateRisk();
    app.resetForm();
    expect(document.getElementById('result-area').style.display).toBe('none');
  });

  test('clears result area class', () => {
    app.calculateRisk();
    app.resetForm();
    expect(document.getElementById('result-area').className).toBe('');
  });

  test('resets score bar width to 0%', () => {
    ['strength', 'walking', 'rise', 'stairs', 'falls'].forEach(id => {
      document.getElementById(id).value = '2';
    });
    app.calculateRisk();
    app.resetForm();
    expect(document.getElementById('score-bar').style.width).toBe('0%');
  });
});

describe('feedback modal', () => {
  test('openFeedbackModal shows the modal', () => {
    app.openFeedbackModal();
    expect(document.getElementById('feedback-modal').style.display).toBe('flex');
  });

  test('closeFeedbackModal hides the modal', () => {
    app.openFeedbackModal();
    app.closeFeedbackModal();
    expect(document.getElementById('feedback-modal').style.display).toBe('none');
  });

  test('closeFeedbackModal clears textarea content', () => {
    document.getElementById('feedback-text').value = 'some feedback';
    app.closeFeedbackModal();
    expect(document.getElementById('feedback-text').value).toBe('');
  });

  test('closeFeedbackModal restores form area and hides thanks', () => {
    document.getElementById('feedback-form-area').style.display = 'none';
    document.getElementById('feedback-thanks').style.display = 'block';
    app.closeFeedbackModal();
    expect(document.getElementById('feedback-form-area').style.display).toBe('block');
    expect(document.getElementById('feedback-thanks').style.display).toBe('none');
  });

  test('submitFeedback shows thank-you and hides form when text is provided', () => {
    window.open = jest.fn();
    document.getElementById('feedback-text').value = 'Great tool!';
    app.submitFeedback();
    expect(document.getElementById('feedback-thanks').style.display).toBe('block');
    expect(document.getElementById('feedback-form-area').style.display).toBe('none');
  });

  test('submitFeedback opens mailto with encoded feedback text', () => {
    window.open = jest.fn();
    document.getElementById('feedback-text').value = 'Great tool!';
    app.submitFeedback();
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining('mailto:')
    );
    expect(window.open).toHaveBeenCalledWith(
      expect.stringContaining(encodeURIComponent('Great tool!'))
    );
  });

  test('submitFeedback does nothing when feedback text is blank', () => {
    window.open = jest.fn();
    document.getElementById('feedback-text').value = '   ';
    app.submitFeedback();
    expect(window.open).not.toHaveBeenCalled();
    expect(document.getElementById('feedback-thanks').style.display).toBe('none');
  });

  test('feedback button click opens modal', () => {
    document.getElementById('feedback-btn').click();
    expect(document.getElementById('feedback-modal').style.display).toBe('flex');
  });

  test('cancel button click closes modal', () => {
    app.openFeedbackModal();
    document.getElementById('close-feedback-btn').click();
    expect(document.getElementById('feedback-modal').style.display).toBe('none');
  });
});
