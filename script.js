const codonTable = {
  'AUG': 'Met', 'UUU': 'Phe', 'UUC': 'Phe', 'UUA': 'Leu', 'UUG': 'Leu',
  'UCU': 'Ser', 'UCC': 'Ser', 'UCA': 'Ser', 'UCG': 'Ser',
  'UAU': 'Tyr', 'UAC': 'Tyr', 'UGU': 'Cys', 'UGC': 'Cys',
  'UAA': 'STOP', 'UAG': 'STOP', 'UGA': 'STOP',
  'CUU': 'Leu', 'CUC': 'Leu', 'CUA': 'Leu', 'CUG': 'Leu',
  'CGU': 'Arg', 'CGC': 'Arg', 'CGA': 'Arg', 'CGG': 'Arg',
  'CCU': 'Pro', 'CCC': 'Pro', 'CCA': 'Pro', 'CCG': 'Pro',
  'AUU': 'Ile', 'AUC': 'Ile', 'AUA': 'Ile',
  'ACA': 'Thr', 'ACU': 'Thr', 'ACC': 'Thr', 'ACG': 'Thr',
  'AAA': 'Lys', 'AAG': 'Lys', 'AAU': 'Asn', 'AAC': 'Asn',
  'AGU': 'Ser', 'AGC': 'Ser', 'AGA': 'Arg', 'AGG': 'Arg',
  'GAU': 'Asp', 'GAC': 'Asp', 'GAA': 'Glu', 'GAG': 'Glu',
  'GCU': 'Ala', 'GCC': 'Ala', 'GCA': 'Ala', 'GCG': 'Ala',
  'GGU': 'Gly', 'GGC': 'Gly', 'GGA': 'Gly', 'GGG': 'Gly'
};

let originalProtein = [];

function translate(dna) {
  const rna = dna.replace(/T/g, 'U');
  const protein = [];

  for (let i = 0; i < rna.length; i += 3) {
    const codon = rna.slice(i, i + 3);
    const aa = codonTable[codon];
    if (!aa) continue;
    if (aa === 'STOP') break;
    protein.push(aa);
  }

  return { rna, protein };
}

function simulate(dnaStr = null) {
  const dna = dnaStr || document.getElementById("dnaInput").value.toUpperCase();
  const { rna, protein } = translate(dna);

  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = `
    <strong>DNA:</strong> ${dna}<br>
    <strong>mRNA:</strong> ${rna}<br>
    <strong>Protein:</strong> ${protein.join('-')}
  `;
  resultsDiv.style.display = "block";
  return protein;
}

document.getElementById("simulateBtn").addEventListener("click", () => {
  const dna = document.getElementById("dnaInput").value.toUpperCase();
  originalProtein = simulate(dna);
  const effectDiv = document.getElementById("mutationEffect");
  effectDiv.innerHTML = '';
  effectDiv.style.display = "none";
});

document.getElementById("mutateBtn").addEventListener("click", () => {
  let dna = document.getElementById("dnaInput").value.toUpperCase();
  const type = document.getElementById("mutationType").value;
  const pos = parseInt(document.getElementById("mutationPos").value) - 1;
  const newBase = document.getElementById("newBase").value.toUpperCase();

  if (type !== "delete" && !["A", "T", "G", "C"].includes(newBase)) {
    alert("Please enter a valid base (A, T, G, C)");
    return;
  }

  if (pos < 0 || pos > dna.length) {
    alert("Position out of bounds!");
    return;
  }

  if (type === "substitute") {
    dna = dna.slice(0, pos) + newBase + dna.slice(pos + 1);
  } else if (type === "insert") {
    dna = dna.slice(0, pos) + newBase + dna.slice(pos);
  } else if (type === "delete") {
    dna = dna.slice(0, pos) + dna.slice(pos + 1);
  }

  document.getElementById("dnaInput").value = dna;
  const newProtein = simulate(dna);

  let effect = '';
  if (newProtein.join('-') === originalProtein.join('-')) {
    effect = '🔵 Silent Mutation: Protein unchanged.';
  } else if (newProtein.length < originalProtein.length) {
    effect = '🛑 Nonsense Mutation: Early STOP codon introduced.';
  } else if (newProtein.length === originalProtein.length) {
    let diffCount = 0;
    for (let i = 0; i < newProtein.length; i++) {
      if (newProtein[i] !== originalProtein[i]) diffCount++;
    }
    if (diffCount === 1) {
      effect = '🟠 Missense Mutation: One amino acid changed.';
    } else {
      effect = '⚠️ Multiple changes in protein sequence.';
    }
  } else {
    effect = '⚠️ Frame shift or unknown mutation effect.';
  }

  const effectDiv = document.getElementById("mutationEffect");
  effectDiv.innerHTML = `<strong>Mutation Effect:</strong> ${effect}`;
  effectDiv.style.display = "block";
});
