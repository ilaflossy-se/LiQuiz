const buttons = document.querySelectorAll(".category");
const startBtn = document.querySelector("#start");
let selectedCategory = null;

// button on click active
buttons.forEach(btn => {
  btn.addEventListener("click", function () {
    buttons.forEach(b => b.classList.remove("active"));
    this.classList.add("active");
    selectedCategory = this.dataset.category;
  });
});

// start Quiz button
startBtn.addEventListener("click", function () {
  if (!selectedCategory) {
    alert("Выберите категорию!");
    return;
  }

  //save selectedCategory to localStorage
  localStorage.setItem("category", selectedCategory);
  window.location.href = "/quiz";
});