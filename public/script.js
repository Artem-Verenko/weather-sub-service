document.addEventListener("DOMContentLoaded", () => {
  const subscriptionForm = document.getElementById("subscriptionForm");
  const formMessage = document.getElementById("formMessage");
  const weatherForm = document.getElementById("weatherForm");
  const weatherResult = document.getElementById("weatherResult");

  const displayMessage = (element, message, type) => {
    element.textContent = message;
    element.className = `message ${type}`; // type should be 'success' or 'error'
    element.style.display = "block";
  };

  if (subscriptionForm) {
    subscriptionForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      formMessage.style.display = "none";

      const params = new URLSearchParams(new FormData(subscriptionForm));

      try {
        const response = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params,
        });
        const data = await response.json();

        if (response.ok) {
          displayMessage(
            formMessage,
            data.message || "Subscription successful! Check your email.",
            "success"
          );
          subscriptionForm.reset();
        } else {
          let errorMessage = data.message || `Error: ${response.statusText}`;
          if (data.details) errorMessage += ` Details: ${data.details}`;
          displayMessage(formMessage, errorMessage, "error");
        }
      } catch (error) {
        console.error("Subscription error:", error);
        displayMessage(
          formMessage,
          "An unexpected error occurred. Please try again.",
          "error"
        );
      }
    });
  }

  if (weatherForm) {
    weatherForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      weatherResult.style.display = "none";

      const city = document.getElementById("weatherCity").value;
      if (!city) {
        displayMessage(weatherResult, "Please enter a city name.", "error");
        return;
      }

      try {
        const response = await fetch(
          `/api/weather?city=${encodeURIComponent(city)}`
        );
        const data = await response.json();

        if (response.ok) {
          weatherResult.innerHTML = `
                        <strong>${
                          city.charAt(0).toUpperCase() + city.slice(1)
                        } Weather:</strong><br>
                        Temperature: ${data.temperature}°C<br>
                        Humidity: ${data.humidity}%<br>
                        Description: ${data.description}
                    `;
          weatherResult.className = "message success"; // Using success for good result
          weatherResult.style.display = "block";
        } else {
          let errorMessage = data.message || `Error: ${response.statusText}`;
          if (data.details) errorMessage += ` Details: ${data.details}`;
          displayMessage(weatherResult, errorMessage, "error");
        }
      } catch (error) {
        console.error("Get weather error:", error);
        displayMessage(
          weatherResult,
          "An unexpected error occurred while fetching weather.",
          "error"
        );
      }
    });
  }
});
