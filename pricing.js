function rangeSlider() {
  const slider = document.getElementById("range-slider");

  slider.addEventListener("input", () => {
    const value = slider.value;
    const min = slider.min;
    const max = slider.max;
    const percent = ((value - min) / (max - min)) * 100;

    slider.style.setProperty("--percent", `${percent}%`);

    // Push event to GTM when user interacts with the slider
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "pricing_calculator_interaction",
    });
  });
}

function priceCalculator() {
  const wrapper = document.querySelector(".pricing_component");
  const radioButtons = wrapper.querySelectorAll(".form_radio-wrap");
  const slider = document.getElementById("range-slider");
  const sliderValue = wrapper.querySelector('[data-pricing="range-number"]');
  const result = wrapper.querySelector('[data-pricing="result"]');
  const difference = wrapper.querySelector('[data-pricing="difference"]');

  const percent = parseFloat(wrapper.getAttribute("data-percent")) || 0;
  const rate = parseFloat(wrapper.getAttribute("data-rate")) || 0;
  const hasDiscount = wrapper.getAttribute("data-discount") === "true"; // ✅ Boolean check
  const percentFinal = 1 - percent;

  let sliderNumber = parseInt(slider.value, 10);
  let radioNumber = parseInt(
    document.querySelector("input:checked")?.value || 0,
    10
  );

  sliderValue.textContent = sliderNumber;

  function formatNumber(num) {
    return num.toLocaleString(); // Adds thousand separators
  }

  function calculateResult() {
    let formulaResult = rate * radioNumber * sliderNumber;

    if (hasDiscount) {
      formulaResult -= 1; // ✅ Apply discount
    }

    result.textContent = formatNumber(formulaResult);

    const differenceValue = Math.round(formulaResult / percentFinal);
    difference.textContent = formatNumber(differenceValue);
  }

  slider.addEventListener("input", () => {
    sliderNumber = parseInt(slider.value, 10);
    sliderValue.textContent = sliderNumber;
    calculateResult();
  });

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", () => {
      radioNumber = parseInt(
        document.querySelector("input:checked")?.value || 0,
        10
      );
      calculateResult();

      // Push event to GTM when a radio button is selected
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "pricing_calculator_interaction",
      });
    });
  });

  calculateResult();
}

rangeSlider();
priceCalculator();