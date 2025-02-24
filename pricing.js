function rangeSlider() {
    const slider = document.getElementById("range-slider");
  
    slider.addEventListener("input", () => {
      const value = slider.value;
      const min = slider.min;
      const max = slider.max;
      const percent = ((value - min) / (max - min)) * 100;
  
      slider.style.setProperty("--percent", `${percent}%`);
    });
  }
  
  function priceCalculator() {
    const wrapper = document.querySelector(".pricing_component");
    const radioButtons = wrapper.querySelectorAll(".form_radio-wrap");
    const slider = document.getElementById("range-slider");
    const sliderValue = wrapper.querySelector('[data-pricing="range-number"]');
    const result = wrapper.querySelector('[data-pricing="result"]');
    const difference = wrapper.querySelector('[data-pricing="difference"]');
  
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
      const formulaResult = 50 * radioNumber * sliderNumber - 1;
      result.textContent = formatNumber(formulaResult);
  
      const differenceValue = Math.round((formulaResult + 1) / 0.57);
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
      });
    });
  
    calculateResult();
  }
  
  rangeSlider();
  priceCalculator();  