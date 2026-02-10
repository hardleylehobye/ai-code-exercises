// Original: direct calls to display methods - candidate for Observer pattern
import java.util.ArrayList;
import java.util.List;

public class WeatherStation {
    private float temperature;
    private float humidity;
    private float pressure;
    private List<String> displayUpdates;

    public WeatherStation() {
        this.temperature = 0.0f;
        this.humidity = 0.0f;
        this.pressure = 0.0f;
        this.displayUpdates = new ArrayList<>();
    }

    public void setMeasurements(float temperature, float humidity, float pressure) {
        this.temperature = temperature;
        this.humidity = humidity;
        this.pressure = pressure;

        updateCurrentConditionsDisplay();
        updateStatisticsDisplay();
        updateForecastDisplay();
        updateHeatIndexDisplay();

        for (String update : displayUpdates) {
            System.out.println(update);
        }
        displayUpdates.clear();
    }

    private void updateCurrentConditionsDisplay() {
        String update = String.format("Current conditions: %.1f°F, %.1f%% humidity",
                temperature, humidity);
        displayUpdates.add(update);
    }

    private void updateStatisticsDisplay() {
        String update = String.format("Weather statistics: Avg/Max/Min temperature = %.1f/%.1f/%.1f",
                temperature - 2, temperature + 2, temperature - 5);
        displayUpdates.add(update);
    }

    private void updateForecastDisplay() {
        String prediction = pressure < 29.92f ? "Watch out for cooler, rainy weather" :
                "Improving weather on the way!";
        displayUpdates.add("Forecast: " + prediction);
    }

    private void updateHeatIndexDisplay() {
        float heatIndex = (temperature + humidity) / 2;
        String update = String.format("Heat index: %.1f", heatIndex);
        displayUpdates.add(update);
    }

    public float getTemperature() { return temperature; }
    public float getHumidity() { return humidity; }
    public float getPressure() { return pressure; }
}
