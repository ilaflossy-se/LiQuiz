const correct = localStorage.getItem("correct") || 0;
const wrong = localStorage.getItem("wrong") || 0;
const total = localStorage.getItem("total") || 0;

document.querySelector("#correct").textContent = correct;
document.querySelector("#wrong").textContent = wrong;
document.querySelector("#total").textContent = total;