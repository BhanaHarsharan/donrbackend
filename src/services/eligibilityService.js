// High‑risk question IDs – if any of these is answered 'yes', donor is deferred
const riskQuestions = [
  'q17', // heart/lung/circulatory
  'q18', // convulsions/epilepsy
  'q19', // cancer
  'q23', // hepatitis
  'q24', // contact with hepatitis
  'q32', // HIV positive
  'q33', // syphilis
  'q34', // tattoo/piercing (last 3 months)
  'q35', // ritual scarring/blood sharing
  'q36', // needlestick injury
  'q37', // blood transfusion (self/partner)
  'q38', // recreational drugs
  'q39', // injected drugs
  'q40', // ARV use
  'q41', // STD
  'q45', // sexual contact with HIV+ person
  'q46', // contact with sex worker
  'q47', // sex work
  'q48', // sexual assault
];

function evaluateEligibility(answers) {
  // Basic safety: age/weight (q1, q2) – if no, defer
  if (answers.q1 === 'no' || answers.q2 === 'no') {
    return false;
  }

  // Check any risk question answered 'yes'
  for (const qid of riskQuestions) {
    if (answers[qid] === 'yes') {
      return false;
    }
  }

  // All clear
  return true;
}

module.exports = { evaluateEligibility };